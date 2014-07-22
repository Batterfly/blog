define(function (require, exports, module) {

	// 音乐opt
	/*var opt = {
		id : 'tabuaiwo',
		title : '他不爱我', 
		src : 'tabuaiwo.mp3', 
		total : '148'
	}*/

	var music = function (opts) {

		for (var i in opts) {
			this[i] = opts[i];
		}

		return this;
	}

	return music;
})