require.config({ urlArgs: "v=" +  (new Date()).getTime() });

require.config({
	packages:[
		{"name":"webcore","location":"core"},
	],
	paths:{
		"jquery":"https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min",
		"jquery-mobile":"https://cdnjs.cloudflare.com/ajax/libs/jquery-mobile/1.4.5/jquery.mobile.min",
		"d3js":"https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.0/d3.min",
		// other external frameworks:
		// mathjax
		// used in hostsoc
		"socketio-server":"https://avalon-gabrielwu84.rhcloud.com/socket.io/socket.io",
		// when testing dev socketio-server locally
		//"socketio-server":"http://localhost:8080/socket.io/socket.io.js", 
		"interface":"interface",
		"lessonctrl":"lessonctrl",
		"lessonmodel":"lessonmodel",
		"config":"config"
	}
});


require(['jquery','jquery-mobile'],function(){
	$('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-mobile/1.4.5/jquery.mobile.min.css">');
	$('head').append('<link rel="stylesheet" type="text/css" href="studentview.css">');
});


require(["webcore","interface","lessonctrl","lessonmodel","config"],
function(webCore,interfaceHandler,lessonCtrlEngine,lessonModelEngine,config){
	var socketURL=config.socketURL;
	interface=new interfaceHandler(
		document.getElementById("hostTitle")
		);
	lessonCtrlObj=new lessonCtrlEngine(
		document.getElementById("prevBtn"),
		document.getElementById("resetBtn"),
		document.getElementById("nextBtn")
		);
	var webCoreObj=new webCore();
	studentViewObj=new webCoreObj.studentViewEngine(
		document.getElementById("studentView")
		);
	studentModelObj=new webCoreObj.studentModelEngine(
		studentViewObj.addStudent,
		studentViewObj.markConnected,
		studentViewObj.markDisconnected
		);
	socket=new webCoreObj.socketHostEngine(
		socketURL,
		interface.socketError,
		interface.updateLessonId,
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
		document.getElementById("modRep"),
		document.getElementById("studAns")
		);
	lessonObj=new lessonModelEngine(
		document.getElementById("qnStem"),
		lessonPlan
		);
	lessonObj.playQnById(0);
})

