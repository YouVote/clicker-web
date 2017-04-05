require.config({ urlArgs: "v=" +  (new Date()).getTime() });

require.config({
	packages:[
		{"name":"webcore","location":config.webCoreBaseAddr},
		{"name":"ctype","location":config.baseProdUrl+"ctype/"},
	],
	paths:{
		"jquery":"https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min",
		"bootstrap":"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min",
		"socketio-server":"https://avalon-gabrielwu84.rhcloud.com/socket.io/socket.io",
		"d3js":"https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.0/d3.min",
		"interface":"interface",
		"lessonctrl":"lessonctrl",
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

require(["webcore","interface","lessonctrl","lessonmodel"],
function(webCore,interfaceHandler,lessonCtrlEngine,lessonModelEngine){
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
		document.getElementById("qnOpts"),
		document.getElementById("qnResp")
		);
	lessonObj=new lessonModelEngine(
		document.getElementById("qnStem"),
		lessonPlan
		);

	// get no of qns,
	// put a li for each qn, and attach run qnId to each
	// attach curr qn. 
	lessonObj.playQnById(0);
	var navDotDiv=document.getElementById("nav-dots");

	for(var i=0;i<=lessonPlan.length;i++){
		var dot=document.createElement("li")
		$(dot).data('play-qid',i);
		dot.onclick=function(){lessonObj.playQnById($(this).data('play-qid'));};
		if(i==lessonObj.currQnNo()){
			$(dot).removeClass().addClass("active");
		} else if(i==lessonPlan.length){
			$(dot).removeClass().addClass("end");
		}
		navDotDiv.append(dot)
	}
	
})
