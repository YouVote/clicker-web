require.config({ urlArgs: "v=" +  (new Date()).getTime() });

require.config({
	packages:[
		{"name":"webKernel","location":"../yvWebKernel"},
		{"name":"ctype","location":config.baseProdUrl+"ctype/"},
		{"name":"async","location":config.baseProdUrl+"async/"},
	],
	paths:{
		"socket-router":"https://youvote.github.io/socket-router/main",
		"jquery":"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min",
		"bootstrap":"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min",
		"d3js":"https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.0/d3.min",
		"vue":"https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.3/vue",
		"lessonctrl":"lessonctrl",
		"studentview":"studentview",
		"lessonmodel":"lessonmodel"
	},
});
var $;

require(['jquery'],function(){
	require(['bootstrap'])
	$('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">');
	$('head').append('<link rel="stylesheet" type="text/css" href="host.css">');
	$('head').append('<link rel="stylesheet" type="text/css" href="navdots.css">');
})

require(["webKernel","lessonctrl","studentview","lessonmodel"],
function(webKernel,lessonCtrlEngine,studentViewEngine,lessonModelEngine){
	var lessonPlan=sessionStorage.getItem('lessonPlan');
	lessonPlan=JSON.parse(lessonPlan);
	// looks like there's no need for socketURL to be defined here
	// var socketURL=config.socketURL;

	// integrate navdots with lessonCtrl
	navDotObj=new (function navDot(navDotDiv){
		// possibly write this up in vue.
		// some problem with loading? randomly fails.
		// var stylesheet=$('link[href="navdots.css"]')[0].sheet;
		// var stylesheet=$('link[href="navdots.css"]')
		// console.log(stylesheet)
		// stylesheet=stylesheet[0];
		// console.log(stylesheet)
		// stylesheet=stylesheet.sheet;
		// console.log(stylesheet)
		var navDivWidth=230;
		var navDotWidth=20;
		var nDots=lessonPlan.length+1;
		var dotSpace=Math.floor((navDivWidth-nDots*navDotWidth)/(nDots-1))
		// stylesheet.insertRule("#nav-dots {margin-left:-"+dotSpace+"px;}",9)
		// stylesheet.insertRule("#nav-dots > li{margin-left:"+dotSpace+"px;}",9)
		var navDotArr=[]
		for(var i=0;i<lessonPlan.length;i++){
			var dot=document.createElement("li")
			navDotArr.push(dot);
			$(dot).data('play-qid',i);
			dot.onclick=function(){lessonObj.playQnById($(this).data('play-qid'));};
			navDotDiv.appendChild(dot)
		}
		var dot=document.createElement("li")
		$(dot).data('play-qid',-1);
		dot.onclick=function(){lessonObj.playQnById($(this).data('play-qid'));};
		$(dot).addClass("end");
		navDotDiv.appendChild(dot);

		this.setDone=function(id){
			$(navDotArr[id]).removeClass().addClass("done");
		}
		this.setActive=function(id){
			$(navDotArr[id]).removeClass().addClass("active");	
		}
	})(document.getElementById("nav-dots"))

	lessonCtrlObj=new lessonCtrlEngine(
		document.getElementById("prevBtn"),
		document.getElementById("resetBtn"),
		document.getElementById("nextBtn")
	);

	studentViewObj=new studentViewEngine(
		document.getElementById("student-box")
	);
	
	youVote=new webKernel("#qnStem","#qnOpts","#respDiv","#respGhost","head");
	youVote.setKernelParam(
		"onConnectPass",
		function(lessonId){
			lessonIdDom=document.getElementById("lesson-id");
			lessonIdDom.innerHTML=lessonId;
			paginator.setDom("page-lesson");
			lessonObj=new lessonModelEngine(lessonPlan,youVote);
			lessonObj.playQnById(0);
		}
	);
	youVote.setKernelParam(
		"onConnectFail",
		function(errMsg){
			// try to unify with end clicked in hostlesson 
			if(typeof(studResp)=='undefined'){studResp=null;}
			sessionStorage.setItem('studResp', JSON.stringify(studResp));
			sessionStorage.setItem('endErrMsg', errMsg);
			window.location="end.html";
		}
	);
	// to change socketio-server address, do it through
	// depricated further - done through socketio-router path in require, but can be overriden here further.
	// youVote.setKernelParam("socketServerURL"," https://avalon-gabrielwu84.rhcloud.com/socket.io/socket.io ");
	// youVote.setKernelParam("yvWebKernelBaseAddr","yvWebKernel/"); // kiv - may be depricated or may not. if no problem after a while, safe to delete.  
	youVote.setKernelParam("viewAddStudent",studentViewObj.addStudent);
	youVote.setKernelParam("viewMarkReconnected",studentViewObj.markReconnected);
	youVote.setKernelParam("viewMarkDisconnected",studentViewObj.markDisconnected);
	youVote.setKernelParam("viewMarkAnswered",studentViewObj.markAnswered);
	youVote.setKernelParam("viewRestorePrevAnswered",studentViewObj.resetAnswered);
	youVote.setKernelParam("yvProdBaseAddr",config.baseProdUrl);
	youVote.connect();
})
