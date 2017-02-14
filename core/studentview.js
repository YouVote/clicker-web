define([],function(){
	return function studentViewEngine(studentListDiv){
		var studentIcons={};
		// called by studentModel
		this.addStudent=function(uuid){
			var studentIcon=new studentIconClass();
			studentListDiv.appendChild(studentIcon);
			studentIcons[uuid]=studentIcon;
		}
		function studentIconClass(){
			var sDiv=document.createElement('div');
			$(sDiv).addClass("studentIcon");
			$(sDiv).addClass("unanswered");
			return sDiv;
		}
		// called directly by lessonModel, see if necessary to change
		// to studentModel
		this.markAnswered=function(uuid){
			$(studentIcons[uuid]).removeClass("unanswered");
		}
		// called directly by lessonModel
		this.resetAnswered=function(currResp){
			for(var uuid in studentIcons){
				$(studentIcons[uuid]).addClass("unanswered");
			}
			for(var studentUuid in currResp){
				$(studentIcons[uuid]).removeClass("unanswered");
			}
		}
		// called by studentModel
		this.markDisconnected=function(uuid){
			$(studentIcons[uuid]).addClass("disconnected");
		}
		// called by studentModel
		this.markConnected=function(uuid){
			$(studentIcons[uuid]).removeClass("disconnected");
		}
	}

})