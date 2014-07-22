define(function (require, exports, module) {
	// var $ = require('./jquery');
	var currentIndx = 0;
	var audio = $('audio')[0];

	var pausedTime = $('.song-time .passed-time');
	var processBar = $('.song-time .process-bar');
	var totalTime = $('.song-time .total-time');

	var Event = {
		btn : function () {
			// 播放按钮事件
			$('.btn-play').on('click', function (e) {
				var el = $(this);
				if (audio.paused) {
					audio.play();
					el.addClass('playing');
				} else {
					audio.pause();
					el.removeClass('playing');
				}
				console.dir(audio);
				Event.changePassedTime();
			});

			// 
			$('.btn-pre').on('click', function (e) {
				var el = $(this);
				--currentIndx < 0 && (currentIndx = 0);
				audio.src = $('source', audio).eq(currentIndx).attr('src');
				audio.play();
			});
			
			$('.btn-next').on('click', function (e) {
				++currentIndx > $('source', audio).length - 1 && (currentIndx = 0);
				audio.src = $('source', audio).eq(currentIndx).attr('src');
				audio.play();
			});
		},

		changePassedTime : function () {
			var duration = audio.duration;
			var currentTime = audio.currentTime;
			currentTime = Event.changeTime(currentTime);
			duration = Event.changeTime(duration);
			processBar.css('width', audio.currentTime / audio.duration * 100 + '%');
			pausedTime.html(currentTime);
			totalTime.html(duration);
			console.log(audio.currentTime, currentTime, audio.currentTime / audio.duration);
			setTimeout(Event.changePassedTime, 1000);
		},
		// 转换时间函数
		changeTime : function (time) {
			var minute = 0,
				second = 0;
			minute = parseInt(time / 60);
			second = parseInt(time % 60);

			minute = minute < 10 ? '0' + minute : minute;
			second = second < 10 ? '0' + second : second;

			return minute + ':' + second;
		},

	}
	/*var Event = function () {
		
		

		// changePassedTime();

		function changePassedTime() {
			console.dir(audio.currentTime);
			setTimeout(changePassedTime, 1000);
		}
	};*/

	return Event;
})