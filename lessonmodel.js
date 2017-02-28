define([],function(){
	return function lessonModelEngine(qnStemDiv,lessonPlan){
		var qnNo=-1;
		var qnObj={};
		var studRespData=[];
		
		var currJsFile;
		var currParams;
		var currStem;

		for(var qn in lessonPlan){// setup studRespData
			studRespData.push({});
		}

		this.resetQn=function(){
			studRespData[qnNo]={}; // reset responses
			execQn();
		}
		this.playQnById=function(qId){
			studRespData[qnNo]=qnHandler.getStudResp(); // save previous studRespData
			if(qId>=0 && qId<lessonPlan.length){
				qnNo=qId;
				execQn();
			}else{// any other qId value leads to end.
				// todo: refactor end() into its own function. 
				sessionStorage.setItem('studRespData', JSON.stringify(studRespData));
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
			MathJax.Hub.Typeset(qnStemDiv)
			qnHandler.execQn(currJsFile,currParams,studRespData[qnNo]);
			lessonCtrlObj.update(qnNo,lessonPlan,studRespData);
		}
	}
})