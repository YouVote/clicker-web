define([],function(){
	return function studentModelEngine(
		addStudent,
		markConnected,
		markDisconnected
	){
		var studentList={};
		var socIdToUuid={};
		this.studentEnter=function(socketId,studentName,studentUuid){
			// could be joining or rejoining.
			socIdToUuid[socketId]=studentUuid;
			if(studentUuid in studentList){ // rejoining
				studentList[studentUuid].reconnectStudent(socketId);
				markConnected(studentUuid);
				return studentList[studentUuid];
			} else { // first joining
				var studentObj=new studentClass(socketId,studentName);
				studentList[studentUuid]=studentObj;
				addStudent(studentUuid);
				return studentObj;
			}
		}
		this.studentLeave=function(studentUuid){
			studentList[studentUuid].disconnectStudent();
			markDisconnected(studentUuid);
			delete(studentUuid);
		}
		this.getStudents=function(){
			return studentList;
		}
		this.socIdToUuid=function(socketId){
			// called by interface.studentLost and interface.studentResp 
			// used to convert socketId to uuid 
			return socIdToUuid[socketId];
		}

		function studentClass(initSocketId,initStudentName){
			var socketId=initSocketId;
			var studentName=initStudentName;
			this.disconnectStudent=function(){
				socketId=null;
			}
			this.reconnectStudent=function(newSocketId){
				socketId=newSocketId;
			}
			this.relay=function(data){
				// called by execQn to push question,
				// and in interface on first qn
				// possibly to send selected signal. 
				// ** May have problems if socketId is null 
				// if so, add socketId not null condution **
				socket.relay(socketId,data)
			}
		}
	}
})