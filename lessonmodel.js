define([],function(){
	return function lessonModelEngine(qnStemDiv,lessonPlan){
		var qnNo=-1;
		var qnObj={};
		var studResp=[];
		
		var currJsFile;
		var currParams;
		var currStem;

		for(var qn in lessonPlan){// setup studResp
			studResp.push({});
		}

		this.resetQn=function(){
			studResp[qnNo]={}; // reset responses
			execQn();
		}
		this.playQnById=function(qId){
			studResp[qnNo]=qnHandler.getStudResp(); // save previous studResp
			if(qId>=0 && qId<lessonPlan.length){
				qnNo=qId;
				execQn();
			}else{// any other qId value leads to end.
				// todo: refactor end() into its own function. 
				sessionStorage.setItem('studResp', studResp);
				sessionStorage.setItem('endErrMsg', "lesson ended");
				window.location="end.html";
			}
		}
		function execQn(){
			var qnSpec=lessonPlan[qnNo];
			// change protocol template
			currJsFile=qnSpec.modName;// modName
			currParams=qnSpec.modParams;// modParams
			currStem=qnSpec.qnStem;// qnStem
			qnStemDiv.innerHTML="<div class='ui-content'>"+currStem+"</div>";
			qnHandler.execQn(currJsFile,currParams,studResp[qnNo]);
			lessonCtrlObj.update(qnNo,lessonPlan,studResp);
		}
	}
})