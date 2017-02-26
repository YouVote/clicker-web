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
				console.log("MathJax: "+MathJax.version)
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
	$(document).ready(function(){
		paginator.addDom("page-connecting")
		paginator.addDom("page-lesson")		
		paginator.addDom("page-confirm-end")
		paginator.setDom("page-connecting");
	});
	require(['bootstrap'])
	require(['mathjax'])
})

require(["webcore","interface","lessonctrl","lessonmodel","config"],
function(webCore,interfaceHandler,lessonCtrlEngine,lessonModelEngine,config){
	var lessonPlan=sessionStorage.getItem('lessonPlan');
	lessonPlan=JSON.parse(lessonPlan);
	var socketURL=config.socketURL;
	interface=new interfaceHandler(
		paginator,
		document.getElementById("lessonId")
		);
	lessonCtrlObj=new lessonCtrlEngine(
		document.getElementById("prevBtn"),
		document.getElementById("resetBtn"),
		document.getElementById("nextBtn")
		);
	var webCoreObj=new webCore();
	studentViewObj=new webCoreObj.studentViewEngine(
		document.getElementById("studentBox")
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
		document.getElementById("qnOpts"),
		document.getElementById("qnResp")
		);
	lessonObj=new lessonModelEngine(
		document.getElementById("qnStem"),
		lessonPlan
		);
	lessonObj.playQnById(0);
})
