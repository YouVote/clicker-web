define([],function(){ 
	var studRespEngine=function(lessonPlan){
		var studRespData=[];
		for(var qn in lessonPlan){ // initialize
			studRespData.push({});
		}
		this.get=function(qId){
			if(qId>=0 && qId<lessonPlan.length){
				return studRespData[qId];
			} else { // all other arguments returns all data
				return studRespData;
			}
		}
		this.set=function(qId,newResp){
			studRespData[qId]=newResp;
		}
		this.reset=function(qId){
			studRespData[qId]={}; 
		}
	}
	return function lessonModelEngine(lessonPlan,youVote){
		// navDotObj used in global namespace. 
		// refactor into lessonView then pass it in.
		var qnNo=-1;
		var studRespObj=new studRespEngine(lessonPlan);
		var currQnSpec;

		this.resetQn=function(){
			studRespObj.reset(qnNo)
			execQn();
		}
		this.playQnById=function(qId){
			if(qnNo>=0){ // not first question, save previous studRespData
				studRespObj.set(qnNo,youVote.getQnResp())
			}
			navDotObj.setDone(qnNo);
			navDotObj.setActive(qId);
			if(qId>=0 && qId<lessonPlan.length){
				qnNo=qId;
				execQn();
			}else{
				// any other qId value leads to end.
				// todo: refactor end() into its own function. 
				sessionStorage.setItem('studRespData', JSON.stringify(studRespObj.get()));
				sessionStorage.setItem('endErrMsg', "lesson ended");
				window.location="end.html";
			}
		}
		function execQn(){
			currQnSpec=lessonPlan[qnNo];
			youVote.execQn(currQnSpec.qnStem,currQnSpec.modName,
				currQnSpec.modParams,studRespObj.get(qnNo));
			lessonCtrlObj.update(qnNo,lessonPlan,studRespObj.get());

			// // code for incorporating layout settings. 
			// // Problem with passOpt$. kiv until app is written in ionic. 
			// if(currQnSpec.settings.layoutTemplate){
			// 	var layoutName=currQnSpec.settings.layoutTemplate
			// 	var baseProdUrl="http://gabrielwu84.dlinkddns.com/clicker-prod/layout"
				
			// 	var oldQnStemDom=document.getElementById("qnStem");
			// 	var oldQnOptsDom=document.getElementById("qnOpts");
			// 	var oldQnRespDom=document.getElementById("qnResp");
			// 	$("#lesson-main").load(baseProdUrl+"/"+layoutName+".html",function(){
			// 		$("#qnStem").replaceWith(oldQnStemDom);
			// 		$("#qnOpts").replaceWith(oldQnOptsDom);
			// 		$("#qnResp").replaceWith(oldQnRespDom);
			// 	})
			// }
			
		}
		this.currQnNo=function(){
			return qnNo;
		}
	}
})