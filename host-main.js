require.config({ urlArgs: "v=" +  (new Date()).getTime() });

require.config({
	packages:[
		{"name":"webcore","location":"core"},
	],
	paths:{
		"jquery":"https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min",
		"bootstrap":"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min",
		"socketio-server":"https://avalon-gabrielwu84.rhcloud.com/socket.io/socket.io",
		
		"mathjax": "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax",
		"d3js":"https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.0/d3.min",
		
		"interface":"interface",
		"lessonctrl":"lessonctrl",
		"lessonmodel":"lessonmodel",
		"config":"config"
	},
	shim:{
		"mathjax":{
			exports:"MathJax",
			init:function(){
				MathJax.Hub.Config({
					HTML: ["input/TeX","output/HTML-CSS"],
					TeX: { extensions: ["AMSmath.js","AMSsymbols.js"],
						equationNumbers: { autoNumber: "AMS" } },
					extensions: ["tex2jax.js"],
					jax: ["input/TeX","output/HTML-CSS"],
					tex2jax: { inlineMath: [ ['$','$'], ["\\(","\\)"] ],
						displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
						processEscapes: true },
					"HTML-CSS": { availableFonts: ["TeX"],
						linebreaks: { automatic: true } }
				});
			}
		},
	}
});
var $;
var opt$;
function passOptsJquery(_$){
	opt$=_$;
}
var optFrameResize=function(){
	var obj=document.getElementById("qnOpts");
	var iframeOptDiv=obj.contentWindow.document.getElementById("opt");
	iframeOptDiv.style.height=iframeOptDiv.firstChild.offsetHeight+"px";
	obj.style.height = iframeOptDiv.firstChild.offsetHeight+"px";
}

// creating and instantiating object from anonymous class
var paginator=new (function(){
	var domArr={}
	this.addDom=function(domName){
		domArr[domName]={
			dom:document.getElementById(domName),
			orig:document.getElementById(domName).style.display
		};
	}
	this.setDom=function(setDomName){
		for(var domName in domArr){
			if(domName==setDomName){
				domArr[domName]["dom"].style.display=domArr[domName]["orig"];
			} else {
				domArr[domName]["dom"].style.display="none";
			}
		}
	}
})()

require(['jquery'],function(){
	$('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">');
	$('head').append('<link rel="stylesheet" type="text/css" href="host.css">');
	$('head').append('<link rel="stylesheet" type="text/css" href="studentview.css">');
	$(document).ready(function(){
		paginator.addDom("page-connecting")
		paginator.addDom("page-lesson")		
		paginator.addDom("page-confirm")
		paginator.setDom("page-connecting");
	});
	require(['bootstrap'])
	require(['mathjax'])
	//document.getElementById("qnOpts").contentWindow.testFunction();
})

require(["webcore","interface","lessonctrl","lessonmodel","config"],
function(webCore,interfaceHandler,lessonCtrlEngine,lessonModelEngine,config){
	var lessonPlan=sessionStorage.getItem('lessonPlan');
	lessonPlan=JSON.parse(lessonPlan);
	var socketURL=config.socketURL;
	interface=new interfaceHandler(
		paginator,
		document.getElementById("lesson-id")
		);
	lessonCtrlObj=new lessonCtrlEngine(
		document.getElementById("prevBtn"),
		document.getElementById("resetBtn"),
		document.getElementById("nextBtn")
		);
	var webCoreObj=new webCore();
	studentViewObj=new webCoreObj.studentViewEngine(
		document.getElementById("student-box")
		);
	studentModelObj=new webCoreObj.studentModelEngine(
		studentViewObj.addStudent,
		studentViewObj.markConnected,
		studentViewObj.markDisconnected
		);
	socket=new webCoreObj.socketHostEngine(
		socketURL,
		interface.socketError,
		interface.socketConnected,
		interface.studentEnter,
		interface.studentLeave,
		interface.studentResp
		);	
	qnHandler=new webCoreObj.questionHandler(
		studentViewObj.resetAnswered,
		studentViewObj.markAnswered,
		studentModelObj.getStudents
		);
	qnHandler.passDivs(
		//document.getElementById("testQnOpts"),
		document.getElementById("qnOpts").contentWindow.document.getElementById("opt"),
		document.getElementById("qnResp")
		);
	lessonObj=new lessonModelEngine(
		document.getElementById("qnStem"),
		lessonPlan
		);
	lessonObj.playQnById(0);
})
