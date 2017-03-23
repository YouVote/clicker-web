require.config({ urlArgs: "v=" +  (new Date()).getTime() });

require.config({
	paths:{
		"jquery":"https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min",
		"jquery-mobile":"https://cdnjs.cloudflare.com/ajax/libs/jquery-mobile/1.4.5/jquery.mobile.min"
	}
});

require(['jquery','jquery-mobile'],function(){
	passOpt$($)
});
