define(function (require, exports, module) {

	var Player  = require('./player');

	var player = new Player({
		audioId : '#myaudio', 
		tabDetail : '.tab-detail', 
		tabMenu : '.tab-menu'
	});

	var opt = {
		id : 'tabuaiwo',
		title : '他不爱我', 
		singer : '莫文蔚',
		src : 'tabuaiwo.mp3', 
		totalTime : '148',
		size : '2.58',
		imgsrc : '3.jpg'
	};

	for (var i = 0; i < 10; i++) {
		opt.id = opt.id + i;
		player.add('love', opt);
	}
	player.forwardList('love');
})