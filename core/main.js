// figure out how requirejs submodules work
// require.config(
// 	paths:{
// 		"studentview":"./studentview",
// 		"studentmodel":"./studentmodel",
// 		"sockethost":"./sockethost",
// 	}
// )

// need to reference file as package for these 
// relative references to work correctly
// however, submodule does not load as an object when 
// require.config is run first. 
define(["./studentview","./studentmodel","./sockethost","./questionhandler"],
function(studentview,studentmodel,sockethost,questionhandler){
	return function webCore(){
		this.studentViewEngine=studentview;
		this.studentModelEngine=studentmodel;
		this.socketHostEngine=sockethost;
		this.questionHandler=questionhandler;
	}
})