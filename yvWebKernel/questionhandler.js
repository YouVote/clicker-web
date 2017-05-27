define(["./modulerouter","jquery"],function(modulerouter){
	return function questionhandler(qnOptsDiv,qnRespDiv,kernelParams,interactManager){
		// a very tightly intertwined module,
		// interfacing with many components.
		// 1. with the calling controller
		// 2. with modulerouter
		// 3. with optIframe

		var qnCore;
		var currModName, currParams
		var currStudResp;
		var qnOptsDiv,qnRespDiv;

		// tidy/refactor this up
		// think of more descriptive names
		// put opt stuff into an object and hide the 
		// internal variables
		var execQnWaiting=false;
		var opt$=null;

		var modBaseAddr=kernelParams.yvProdBaseAddr+"mods/";

		optFrame=document.createElement("iframe");
		optFrame.style.border="none";
		optFrame.style.width="100%";
		optFrame.style.overflow="hidden";
		optFrame.src=kernelParams.yvWebKernelBaseAddr+"qnopts.html"
		
		$(optFrame).load(function(){
			qnOptsDiv=optFrame.contentWindow.document.getElementById("opt")
			optFrame.contentWindow.passOptFunc(passOptsJquery);
		})
		$(qnOptsDiv).html(optFrame);

		optFrameResize=function(fitDom){
			var obj=optFrame;
			var iframeOptDiv=obj.contentWindow.document.getElementById("opt");
			iframeOptDiv.style.height = fitDom.offsetHeight+"px";
			obj.style.height = fitDom.offsetHeight+"px";

			// listens for change to fitDom and 
			// updates iframe to fitDom height
			var obs=new MutationObserver(function(mutations){
				iframeOptDiv.style.height = fitDom.offsetHeight+"px";
				obj.style.height = fitDom.offsetHeight+"px";
			})
			var obsConfig={attributes:true,childList:true,subtree:true,characterData:true};
			obs.observe(fitDom, obsConfig);
		}

		function pushQuestion(studentUuid){
			var studentList=interactManager.getConnectedStudents();
			studentList[studentUuid].relay({
				"title":"execModule",
				"modName":currModName,
				"modParams":currParams,
				"currAns":currStudResp[studentUuid]
			})
		}
		this.execQn=function(modName,params,studResp){
			currModName=modName;
			currParams=params;
			currStudResp=studResp;
			var questionReadyCallback=function(){
				$(qnOptsDiv).html(qnCore.responseInput(opt$,optFrameResize));
				$(qnRespDiv).html(qnCore.responseDom());
				var studentList=interactManager.getConnectedStudents();
				for (var studentUuid in studentList){
					pushQuestion(studentUuid)
				}
				for (var studentUuid in currStudResp){
					qnCore.processResponse(studentUuid,currStudResp[studentUuid]);
				}
			}
			// wait until opt$ is a function
			if(opt$!=null){
				modulePath=kernelParams.yvProdBaseAddr+"mods/"+currModName+".js";
				qnCore=new modulerouter(modulePath,currParams,questionReadyCallback);
				interactManager.restorePrevAnswered(currStudResp);
			}else{
				execQnWaiting=true;
			}
		}
		this.procAns=function(studentUuid,studentAns){
			if(!(studentUuid in currStudResp)){ // check that student has not answered
				currStudResp[studentUuid]=studentAns; 
				qnCore.processResponse(studentUuid,studentAns);
				interactManager.markAnswered(studentUuid);
			} else {
				console.log(studentUuid+" has already answered");
			}
		}
		this.initConnectedStudent=function(studentUuid){
			pushQuestion(studentUuid);
		}
		this.getStudResp=function(){
			return currStudResp;
		}

		var execQnConnect=this.execQn;
		function passOptsJquery(_$){
			opt$=_$;
			if(execQnWaiting){
				execQnConnect(currModName,currParams,currStudResp);
			}
		}
	}
})