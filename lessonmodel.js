define(["ctype"],function(ctype){
	return function lessonModelEngine(lessonPlan){
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
			if(qnNo>=0){ // not first question, save previous studRespData
				studRespData[qnNo]=youVote.getQnResp(); 
			}
			navDotObj.setDone(qnNo);
			navDotObj.setActive(qId);
			if(qId>=0 && qId<lessonPlan.length){
				qnNo=qId;
				execQn();
			}else{
				// any other qId value leads to end.
				// todo: refactor end() into its own function. 
				sessionStorage.setItem('studRespData', JSON.stringify(studRespData));
				sessionStorage.setItem('endErrMsg', "lesson ended");
				window.location="end.html";
			}
		}
		function execQn(){
			var qnSpec=lessonPlan[qnNo];
			currJsFile=qnSpec.modName;
			currParams=qnSpec.modParams;
			currStem=qnSpec.qnStem;
			// var stemContent=new ctype(currStem);
			// stemContent.putInto(qnStemDiv);
			youVote.execQn(currStem,currJsFile,currParams,studRespData[qnNo]);
			lessonCtrlObj.update(qnNo,lessonPlan,studRespData);
		}
		this.currQnNo=function(){
			return qnNo;
		}
	}
})