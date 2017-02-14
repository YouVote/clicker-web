define([],function(){
	return function modulerouter(modulePath,params,modObjReadyCallback){
		var modObj;
		require([modulePath],function(module){
			modObj=new module.webEngine(params,modObjReadyCallback);
		});
		
		this.optionsDom=function(){
			return modObj.responseInput();
		}
		this.responseDom=function(){
			return modObj.responseDom();
		}
		this.processResponse=function(studentUuid,studentAns){
			modObj.processResponse(studentUuid,studentAns);
		}
	}
})