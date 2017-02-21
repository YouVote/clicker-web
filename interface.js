define([],function(){
	return function interfaceHandler(titleDiv){
		this.socketError=function(errMsg){
			// try to unify with end clicked in hostlesson 
			if(typeof(studResp)=='undefined'){studResp=null;}
			sessionStorage.setItem('studResp', JSON.stringify(studResp));
			sessionStorage.setItem('endErrMsg', errMsg);
			window.location="end.html";
		}
		this.updateLessonId=function(lessonId){
			titleDiv.innerHTML="Lesson <font class='gameId'>"+lessonId+"</font>";
			window.location="#host";
		}
		
		this.studentEnter=function(socketId,data){
			var student=studentModelObj.studentEnter(socketId,data.studentName,data.uuid);
			qnHandler.initConnectedStudent(data.uuid);
		}
		this.studentLeave=function(socketId){
			var studentUuid=studentModelObj.socIdToUuid(socketId);
			studentModelObj.studentLeave(studentUuid);
		}
		this.studentResp=function(socketId,data){
			var studentUuid=studentModelObj.socIdToUuid(socketId);
			qnHandler.procAns(studentUuid,data.data);
		}
	}
});