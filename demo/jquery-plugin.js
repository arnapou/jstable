var examples = [{
		title: 'Simple',
		code: function() {
			console.log($('#example1').jsTable({
				data: data
			}));
		},
		html: '<div id="example1"></div>'
	}, {
		title: 'zzz',
		code: function() {
			//TODO
		},
		html: 'yyy'
	}];


$(function(){
	for(var i in examples){
		if(examples[i].code){
			examples[i].code();
		}
	}
});