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

	// integrate navdots with lessonCtrl
	navDotObj=new (function navDot(navDotDiv){
		var navDotArr=[]
		for(var i=0;i<lessonPlan.length;i++){
			var dot=document.createElement("li")
			navDotArr.push(dot);
			$(dot).data('play-qid',i);
			dot.onclick=function(){lessonObj.playQnById($(this).data('play-qid'));};
			navDotDiv.append(dot)
		}
		var dot=document.createElement("li")
		$(dot).data('play-qid',-1);
		dot.onclick=function(){lessonObj.playQnById($(this).data('play-qid'));};
		$(dot).addClass("end");
		navDotDiv.append(dot);

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

	lessonObj.playQnById(0);


})
