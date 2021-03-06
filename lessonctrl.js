define([],function(){
	return function lessonCtrlEngine(prevBtn,resetBtn,nextBtn){
		(function init(){
			prevBtn.onclick=function(){lessonObj.playQnById($(prevBtn).data('play-qid'));};
			nextBtn.onclick=function(){lessonObj.playQnById($(nextBtn).data('play-qid'));};
			resetBtn.onclick=function(){lessonObj.resetQn();};
		})();
		this.update=function(qId,lessonPlan,studResp){
			if(qId==0){
				$(prevBtn).data('play-qid',qId-1);
				lessonCtrlObj.hidePrevBtn();
			}else{
				$(prevBtn).data('play-qid',qId-1);
				lessonCtrlObj.showPrevBtn();
			}
			if(qId==lessonPlan.length-1){
				$(nextBtn).data('play-qid',-1);
				lessonCtrlObj.showEndBtn();
			}else{
				$(nextBtn).data('play-qid',qId+1);
				lessonCtrlObj.showNextBtn();
			}
		}
		this.showEndBtn=function(){
			$(nextBtn).html("end <span class='glyphicon glyphicon-menu-right'></span>");
		}
		this.hidePrevBtn=function(){
			prevBtn.style="visibility:hidden;"
		}
		this.showNextBtn=function(){
			$(nextBtn).html("next <span class='glyphicon glyphicon-menu-right'></span>");
		}
		this.showPrevBtn=function(){
			prevBtn.style="visibility:visible;"
		}
	}
})