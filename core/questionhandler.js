define(["./modulerouter","config"],function(modulerouter,config){
	var modBaseAddr=config.modBaseAdd;
	return function questionhandler(
			studentViewClearAnswered,
			studentViewMarkAnswered,
			getConnectedStudents
		){
		var qnCore;
		var currJsFile, currParams
		var currStudResp;
		var qnOptsDiv,qnRespDiv;
		this.passDivs=function(optsDiv,respDiv){
			qnOptsDiv=optsDiv;qnRespDiv=respDiv;
		}

		function pushQuestion(studentUuid){
			var studentList=getConnectedStudents();
			studentList[studentUuid].relay({
				"title":"execModule",
				"modPath":modBaseAddr+currJsFile+".js",
				"modParams":currParams,
				"currAns":currStudResp[studentUuid]
			})
		}
		this.execQn=function(jsFile,params,studResp){
			currJsFile=jsFile;
			currParams=params;
			currStudResp=studResp;
			var questionReadyCallback=function(){
				//$(qnOptsDiv).html("lala");
				$(qnOptsDiv).html(qnCore.optionsDom());
				$(qnRespDiv).html(qnCore.responseDom());
				var studentList=getConnectedStudents();
				for (var studentUuid in studentList){
					pushQuestion(studentUuid)
				}
				for (var studentUuid in currStudResp){
					qnCore.processResponse(studentUuid,currStudResp[studentUuid]);
				}
			}
			qnCore=new modulerouter(modBaseAddr+currJsFile+".js",currParams,questionReadyCallback);
			studentViewClearAnswered(currStudResp);
		}
		this.procAns=function(studentUuid,studentAns){
			if(!(studentUuid in currStudResp)){ // check that student has not answered
				currStudResp[studentUuid]=studentAns; 
				qnCore.processResponse(studentUuid,studentAns);
				studentViewMarkAnswered(studentUuid);
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
	}
})