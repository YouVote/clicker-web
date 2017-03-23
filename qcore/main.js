define(["./studentview","./studentmodel","./sockethost","./questionhandler"],
function(studentview,studentmodel,sockethost,questionhandler){
	require.config({
		packages:[
			{"name":"ctype","location":config.ctypeBaseAddr},
		]
	})
	return function webCore(){
		this.studentViewEngine=studentview;
		this.studentModelEngine=studentmodel;
		this.socketHostEngine=sockethost;
		this.questionHandler=questionhandler;
	}
})

// PREVIOUS PATTERNS THAT FAILED
// need to reference file as package for these 
// relative references to work correctly
// however, submodule does not load as an object when 
// require.config is run first. 

// figure out how requirejs submodules work
// require.config(
// 	paths:{
// 		"studentview":"./studentview",
// 		"studentmodel":"./studentmodel",
// 		"sockethost":"./sockethost",
// 	}
// )

// try to use pattern in here
// http://jonathancreamer.com/require-js-packages-for-building-large-scale-angular-applications/
// this.studentViewEngine=require("./studentview")
// problem with this method is that files not loaded yet

// define([],function(){
// 	return function webCore(){
// 		//"./studentview","./studentmodel","./sockethost","./questionhandler"
// 		//studentview,studentmodel,sockethost,questionhandler
// 		this.studentViewEngine=require("./studentview")//;studentview;
// 		this.studentModelEngine=require("./studentmodel")//studentmodel;
// 		this.socketHostEngine=require("./sockethost")//sockethost;
// 		this.questionHandler=require("./questionhandler")//questionhandler;
// 	}
// })