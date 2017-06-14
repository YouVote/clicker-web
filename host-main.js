require.config({ urlArgs: "v=" +  (new Date()).getTime() });

require.config({
	packages:[
		{"name":"webKernel","location":"yvWebKernel"},
		{"name":"ctype","location":config.baseProdUrl+"ctype/"},
	],
	paths:{
		"jquery":"https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min",
		"bootstrap":"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min",
		"socketio-server":"https://avalon-gabrielwu84.rhcloud.com/socket.io/socket.io",
		"d3js":"https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.0/d3.min",
		// "interface":"interface",
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
	var socketURL=config.socketURL;

	// integrate navdots with lessonCtrl
	navDotObj=new (function navDot(navDotDiv){
		var stylesheet=$('link[href="navdots.css"]')[0].sheet;
		var navDivWidth=230;
		var navDotWidth=20;
		var nDots=lessonPlan.length+1;
		var dotSpace=Math.floor((navDivWidth-nDots*navDotWidth)/(nDots-1))
		stylesheet.insertRule("#nav-dots {margin-left:-"+dotSpace+"px;}",9)
		stylesheet.insertRule("#nav-dots > li{margin-left:"+dotSpace+"px;}",9)
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

	youVote=new webKernel(
		document.getElementById("qnStem"),
		document.getElementById("qnOpts"),
		document.getElementById("qnResp")
	);
	youVote.setKernelParam(
		"onConnectPass",
		function(lessonId){
			lessonIdDom=document.getElementById("lesson-id");
			lessonIdDom.innerHTML=lessonId;
			paginator.setDom("page-lesson");

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
	youVote.setKernelParam("yvWebKernelBaseAddr","yvWebKernel/");
	youVote.setKernelParam("viewAddStudent",studentViewObj.addStudent);
	youVote.setKernelParam("viewMarkReconnected",studentViewObj.markReconnected);
	youVote.setKernelParam("viewMarkDisconnected",studentViewObj.markDisconnected);
	youVote.setKernelParam("viewMarkAnswered",studentViewObj.markAnswered);
	youVote.setKernelParam("viewRestorePrevAnswered",studentViewObj.resetAnswered);

	// lessonEngine still accesses youVote from global namespace.
	// todo: iron this out.
	lessonObj=new lessonModelEngine(lessonPlan);
	lessonObj.playQnById(0);
})
