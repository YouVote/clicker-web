define(["ctype"],function(ctype){ // remove ctype
	// var studRespEngine=function(lessonPlan){
	// 	var studRespData=[];
	// 	for(var qn in lessonPlan){// initialize
	// 		studRespData.push({});
	// 	}
	//this.get=function(qId){}
	//this.set=function(qId,newResp){}
	//this.reset=function(qId){}
	// }
	return function lessonModelEngine(lessonPlan){
		// pass youvote obj in here. (lessonPlan, youVote)
		var qnNo=-1;
		// qnObj not used. remove. Prob used in place of currQnSpec.
		var qnObj={};
		// put student response into an object: studRespObj.
		// var studRespObj=new studRespEngine(lessonPlan);
		var studRespData=[];
		
		//use currQnSpec instead. 
		var currJsFile;
		var currParams;
		var currStem;
		
		// this would be studRespObj.init()
		for(var qn in lessonPlan){
			studRespData.push({});
		}

		this.resetQn=function(){
			// studRespObj.reset(qnNo)
			studRespData[qnNo]={}; // reset responses
			execQn();
		}
		this.playQnById=function(qId){
			if(qnNo>=0){ // not first question, save previous studRespData
				// studRespObj.set(qnNo,resp)
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
				// studRespObj.get() [empty argument returns all data]
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
			// studRespObj.get(qnNo)
			youVote.execQn(currStem,currJsFile,currParams,studRespData[qnNo]);
			lessonCtrlObj.update(qnNo,lessonPlan,studRespData);
			// also execQnSettings here. 
		}
		this.currQnNo=function(){
			return qnNo;
		}
	}
})