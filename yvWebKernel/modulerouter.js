define([],function(){
	// its singular job is to route to the appropriate module based on
	// module name and passing the params. 
	// interfaces questionhandler with the appropriate modules.
	return function modulerouter(modulePath,params,modObjReadyCallback){
		var modObj;
		require([modulePath],function(module){
			modObj=new module.webEngine(params,modObjReadyCallback);
		});
		
		this.responseInput=function(opt$,optFrameResize){
			return modObj.responseInput(opt$,optFrameResize);
		}
		this.responseDom=function(){
			return modObj.responseDom();
		}
		this.processResponse=function(studentUuid,studentAns){
			modObj.processResponse(studentUuid,studentAns);
		}
	}
})