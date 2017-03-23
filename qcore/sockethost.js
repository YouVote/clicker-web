define(["socketio-server"],function(io){
	return function socketHost(
		socketURL,
		connectErrCallback,
		receiveLessonIdCallback,
		studentEnter,
		studentLeave,
		studentResp
	){
		try{
			var socketCore=io.connect(socketURL);
		} catch(err){
			// various possibilities from network connection problem 
			// to server problem
			connectErrCallback("Could not connect to server: "+err)
		}

		socketCore.on('connectType?',function(){ 
			socketCore.emit('connectType=',{'app':'cl','type':'host'}); 
		}); 
		socketCore.on('newGameId=',function(lessonId){
			receiveLessonIdCallback(lessonId);
		});

		socketCore.on('playerJoin',function(socketId){
			socketCore.emit('relay',{'socketId':socketId,
				'msg':{'title':'studentParams?','baseUrl':config.baseProdUrl}});
		});
		socketCore.on('playerQuit',function(socketId){
			studentLeave(socketId);
		});
		socketCore.on('relay',function(pkt){
			// relay so far conveys two kinds of messages from app
			switch(pkt.msg.title){
				case 'studentParams=':
					studentEnter(pkt.socketId, pkt.msg)
					break;
				case 'ans':
					studentResp(pkt.socketId, pkt.msg)
					break;
			}
		});

		this.relay=function(socketId,msg){
			// called by studentio
			socketCore.emit('relay',{'socketId':socketId,'msg':msg});
		}

		socketCore.on('serverShutDown',function(msg){
			// inbuilt shutdown command issued by server. 
			// not used yet, built in case necessary in future.
			// could remove if deemed otherwise.
			connectErrCallback("Server shutdown signal: "+msg)
		});
		socketCore.on('disconnect',function(msg){
			// connection successful but somehow terminated.
			// possibly from disruption in internet connection
			// or problem with server
			connectErrCallback("Server disconnected: "+msg)
		});
		socketCore.on('ping',function(){
			// used to keep socket connection alive
			socketCore.emit('pong',{beat:1}); 
		});
	}
})