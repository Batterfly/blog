define(function (require, exports, module) {

	var Music = require('./music');
	// var $ = require('./jquery');

	var Event = require('./event');

	var player = function (opts) {
		this.playing = false;

		for (var i in opts) {
			this[i] = opts[i];
		}

		this.el = $(this.audioId) || $('audio');
		this.tabDetail = $(this.tabDetail) || $('.tab-detail');
		// 总列表
		this.list = {};
		this.currentList = [];
		Event.btn();
		// $(document.body).append(this.el);
	}

	player.prototype = {
		add : function (name, opt) {

			// 若该列表不存在，则创建一个数组
			if (!this.list[name]) {
				this.list[name] = [];
			}
			var music = new Music(opt);
			this.list[name].push(music);

			return this;
		},
		remove : function (name, id) {
			if (!this.list[name]) {
				return false;
			}
			var res = -1;
			for (var i = 0, len = this.list[name]; i < len; i++) {
				var item = this.list[name][i];
				if (item.id == id) {
					res = i;
					this.list[name].splice(i, 1);
					return res;
				}
			}
			return res;
		},

		// 切换列表
		forwardList : function (name) {
			if (this.list[name]) {
				this.currentList = this.list[name];
			}
			this.makeList(this.currentList);
			this.ulHtml(name);
		},

		// 生成播放列表
		makeList : function (arr) {
			var list = this.el;
			var htmlStr = '';
			for (var i = 0, len = arr.length; i < len; i++) {
				var item = arr[i];
				htmlStr += this.audiohtml(item);
			}
			this.el.html(htmlStr);
		},
		
		audiohtml : function (item) {
			var html = '<source title="'+ item.title +'" src="'+ item.src +'"></source>';
			return html;
		},

		// 生成li列表的代码
		ulHtml : function (name) {
			var list = this.currentList
			var ulStr = '<div class="detail-item '+ name +'"><ul class="list">';
			var str = '', self = this;;
			for (var i = 0, len = list.length; i < len; i++) {
				var item = list[i], 
					number = 0, 
					totalTime = 0, 
					minute = 0, 
					second = 0;

				// 获取顺序次序
				number = i + 1;
				if (number < 10) {
					number = '0' + number;
				}
				item.number = number;

				// 计算总时间
				totalTime = parseInt(item.totalTime);
				minute = parseInt(totalTime / 60);
				second = parseInt(totalTime % 60);

				minute = minute < 10 ? '0' + minute : minute;
				second = second < 10 ? '0' + second : second;
				item.totalTime = minute + ':' + second; 

				str += self.liHtml(item);
			}
			ulStr += str;
			ulStr += '</ul></div>';
			this.tabDetail.html(ulStr);
		},
		liHtml : function (item) {
			var html = '<li class="item">\
							<p class="lite clearfix">\
								<span class="order">'+ item.number +'</span>\
								<span class="info">\
									<span class="singer">'+ item.singer +' </span>-\
									<span class="title">'+ item.title +'</span>\
								</span>\
								<span class="size">'+ item.size +'M</span>\
							</p>\
							<div class="detail-info clearfix">\
								<img src="'+ item.imgsrc +'" alt="头像">\
								<div class="top">\
									<span class="singer">'+ item.singer +'</span> -\
									<span class="title">'+ item.title +'</span>\
									<a class="microphone">\
										<i class="icon-trash"></i>\
									</a>\
									<a class="btn-delete">\
										<i class="icon-mic"></i>\
									</a>\
								</div>\
								<div class="bottom">\
									<span class="passed-time">02:21</span>/\
									<span class="total-time">'+item.totalTime+'</span>\
									<p class="btn-list">\
										<a class="open-btn">\
											<i class="icon-folder-open-empty"></i>\
										</a>\
										<a class="temp-btn">\
											<i class="icon-mail"></i>\
										</a>\
										<a class="add-btn">\
											<i class="icon-plus"></i>\
										</a>\
										<a class="share-btn">\
											<i class="icon-location"></i>\
										</a>\
									</p>\
								</div>\
							</div>\
						</li>';
			return html
		}
	};

	return player;
})