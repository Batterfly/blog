(function (win, undefined) {

	var Game = {
		/**
		 * 生成命名空间，并执行相应的操作	
		**/
		register : function (nameSpace, func) {
			var nsArr = nameSpace.split('.');
			var parent = win;
			for (var i = 0, len = nsArr.length; i < len;i++){
				(typeof parent[nsArr[i]] == 'undefined') && (parent[nsArr[i]] = {});
				parent = parent[nsArr[i]];
			}

			if (func) {
				func.call(parent, this);
			}

			return this;
		},

		/**
		 * 初始化
		**/
		init : function (id, options) {
			options = options || {};
			this.canvas = this.core.$(id || "canvas");
			this.context = this.canvas.getContext('2d');
			this.width = options.width || 800;
			this.height = options.height || 600;
			this.title = this.core.$$('title')[0];

			canvasPos = this.core.getPos(this.canvas);
			this.x = canvasPos.left || 0;
			this.y = canvasPos.top || 0;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.canvas.style.left = this.x + 'px';
			this.canvas.style.top = this.y + 'px';
		},

		/**
		 * 获取canvas在页面上的位置
		**/
		/*getCanvasPos : function (canvas) {
			var left = 0, top = 0;
			while(canvas.offsetParent) {
				left += canvas.offsetLeft;
				top += canvas.offsetTop;
				canvas = canvas.offsetParent;
			}

			return {
				left : left, 
				top : top
			};
		},*/

	};

	

	Game.register('Game.core', function(param) {
		/**
		 * 通过id获取元素
		**/
		this.$ = function (id) {
			return document.getElementById(id);
		};

		/**
		 * 通过类名获取元素
		**/
		this.$$ = function (classname) {
			return document.querySelector('.'+ classname);
		};

		/**
		 *通过标签名获取元素
		**/
		this.$$$ = function (tagName, parent) {
			var parent = parent || document;
			return parent.getElmentByTagName(tagName);
		};

		/**
		 * 事件绑定
		**/
		this.bindHandler = (function () {
			if (window.addEventListener) {
				return function(elem, type, handler) {
					elem.addEventListener(type, handler, false);
				}
			}
			else if (window.attachEvent) {
				return function (elem, type, handler) {
					elem.attachEvent("on" + type, handler);
				}
			}
		})();

		/**
		 * 事件解除绑定
		**/
		this.unbindHandler = (function () {
			if (window.removeEventListener) {
				return function(elem, type, handler) {
					elem.removeEventListener(type, handler, false);
				}
			}
			else if (window.detachEvent) {
				return function (elem, type, handler) {
					elem.detachEvent("on" + type, null);
				}
			}
		})();

		/**
		 * 获取事件对象
		**/
		this.getEventObj = function (evt) {
			return evt || win.event;
		};

		/**
		 * 获取事件目标对象
		**/
		this.getEventTarget = function (evt) {
			var e = this.getEventObj(evt);
			return e.target || e.srcElement;
		};

		/**
		 * 获取元素在页面上的位置
		**/
		this.getPos = function (elem) {
			var left = 0, top = 0;
			while (elem.offsetParent) {
				left += elem.offsetLeft;
				top += elem.offsetTop;
				elem = elem.offsetParent;
			}
			return {
				left : left, 
				top : top
			};
		};

		/**
		 * 阻止默认事件
		**/
		this.preventDefault = function (evt) {
			if (evt.preventDefault) {
				evt.preventDefault();
			}else {
				evt.returnValue = false;
			}
		};

		/**
		 * 获取对象计算的样式
		**/
		this.getComputedStyle = (function () {
			var body = document.body;
			if(body.currentStyle) {
				return function (elem) {
					return elem.currentStyle;
				}
			}
			else if (document.defaultView.getComputedStyle) {
				return function (elem) {
					return document.defaultView.getComputedStyle(elem, null);
				}
			}
		})();

		/**
		 * 是否为undefined
		**/
		this.isUndefined = function (elem) {
			return typeof elem === 'undefined';
		};

		/**
		 * 是否为数组
		**/
		this.isArray = function (elem) {
			return Object.prototype.toString.call(elem) === "[object, Array]";
		};

		/**
		 * 是否为对象
		**/
		this.isObject = function (elem) {
			return elem === Object(elem);
		};

		/**
		 * 是否数字
		**/
		this.isNumber = function (elem) {
			return Object.prototype.toString.call(elem) === "[object, Number]";
		};
		/**
		 * 是否为字符串
		**/
		this.isString = function (elem) {
			return Object.prototype.toString.call(elem) === "[object, String]";
		};

		/**
		 * 复制对象属性
		**/
		this.extend = function (des, sour, isCover) {
			for (var key in sour) {
				if (des[key]) {
					/*if (isCover) {
						des[key] = sour[key];
					}
					else {
						continue;
					}*/
					isCover && (des[key] = sour[key]);
				}
				else {
					des[key] = sour[key];
				}

				// 另一种方案
				/*var isUndefined = this.isUndefined;
				(isUndefined(isCover)) && (isCover = true);
				for (var name in sour) {
					if (isCover || isUndefined(des[name])) {
						des[name] = sour[name];
					}
				}*/
			}
		};

		/**
		 * 原型继承对象
		**/
		this.inherit = function (child, parent) {
			var func = function () {};
			func.prototype = parent.prototype;
			child.prototype = new func();
			child.prototype.constructor = child;
			child.prototype.parent = parent;
		};
	});

	var gameObj = (function () {
		/* 玩家对象 */
		var player = function (options) {
			this.init(options);
			this.speedX = 0;
			this.moveDir;
			this.isJump = false;
		};
		Game.core.inherit(player, Game.Sprite);

		player.prototype = {
			initialize : function() {
				this.addAnimation(new Game.SpriteSheet('playerRight', src, {frameSize : [50, 60], loop : true, width : 150, height : 60}));
				this.addAnimation(new Game.SpriteSheet('playerLeft', src, {frameSize : [50, 60], loop : true, width : 150, height : 120, beginY : 60}));
			},

			moveRight : function () {
				if (Game.core.isUndefined(this.moveDir) || this.moveDir != 'right') {
					this.moveDir = 'right';
					this.speedX < 0 && (this.speedX == 0);
					this.setMovement({aX : 10, maxSpeedX : 15});
					this.setCurrentAnimation('playerRight');
				}
			},

			moveLeft : function () {
				if (Game.core.isUndefined(this.moveDir) || this.moveDir != 'left') {
					this.moveDir = 'left';
					this.speedX > 0 && (this.speedX == 0);
					this.setMovement({aX : -10, maxSpeedX : 15});
					this.setCurrentAnimation('playerLeft');
				}
			},

			stopMove : function () {
				if (this.speedX < 0) {
					this.setCurrentImage(src, 0, 60);
				}
				else if (this.speedX > 0) {
					this.setCurrentImage(src);
				}

				this.moveDir = undefined;
				this.resetMovement();
			},

			update : function () {
				player.prototype.parent.prototype.update.call(this);	// 调用父类update

				if (Game.input.isPressed('right')) {
					this.moveRight();
				}
				else if (Game.input.isPressed('left')) {
					this.moveLeft();
				}
				else {
					this.stopMove();
				}
			}
		};

		return {
			intialize : function () {
				Game.input.preventDefault(['left', 'right', 'up', 'down']);
				this.player = new player({
					src : src, width : 50, height
				});
			}
		}
	});
	/*canvas基本形状对象*/
	Game.register('Game.shape', function (game) {
		// 矩形对象
		var rect = function (options) {
			if (!(this instanceof argumments.callee)) {
				new argumments.callee(options);
			}
			this.init(options);
		};

		rect.prototype = {
			// 初始化
			init : function (options) {
				// 默认值
				var defaultObj = {
					x : 0,
					y : 0,
					width : 100,
					height : 100,
					style : '#ccc',
					isFill : true
				};

				options = options || {};
				options = game.core.extend(defaultObj, options);
				this.setOption(options);

				resetRightBottom(this);
				return this;
			},

			// 重置参数
			setOption : function (options) {
				this.x = options.x;
				this.y = options..y;
				this.width = options.width;
				this.height = options.height;
				this.style = options.style;
				this.isFill = options.isFill;

				return this;
			},

			// 绘制矩形
			draw : function () {
				var ctx = game.context;
				ctx.save();
				if (this.isFill) {
					ctx.fillStyle = this.style;
					context.fillRect(this.x, this.y, this.width, this.height);
				}
				else {
					ctx.strokeStyle = this.style;
					ctx.strokeRect(this.x, this.y , this.width, this.height);
				}
				ctx.restore();

				return this;
			},

			// 移动矩形
			moveBy : function (dx, dy) {
				dx = dx || 0;
				dy = dy || 0;
				this.x += dx;
				this.y += dy;
				this.draw();
			},

			// 移动矩形
			moveTo : function (x, y) {
				x = x || this.x;
				y = y || this.y;
				this.x = x;
				this.y = y;
				this.draw();
			},

			// 改变矩形大小
			resize : function (w, h) {
				w = w || this.width;
				h = h || this.height; 
				this.width = w;
				this.height = h;
				this.draw();
				return this;
			}
		};

		/*圆形对象*/
		var circle = function (options) {
			if (!(this instanceof argumments.callee)) {
				return new argumments.callee(options);
			}
			this.init(options);
		};
		circle.prototype = {

			// 初始化
			init : function(options) {

				// 默认对象
				var defaultObj = {
					x : 100,
					y : 100,
					r : 100,
					startAngle : 0,
					endAngle : Math.PI * 2,
					antiClock : false,
					isFill : true;
					style : true
				};

				options = options || {};
				options = game.extend(defaultObj, options);
				this.setOptions(options);
			},

			// 设置参数
			setOptions : function (options) {
				this.x = options.x;
				this.y = options.y;
				this.r = options.r;
				this.startAngle = options.startAngle;
				this.endAngle = options.endAngle;
				this.antiClock = option.antiClock;
				this.isFill = options.isFill;
				this.style = options.style;
			},

			// 绘制圆形
			draw : function () {
				var ctx = game.context;
				ctx.save();
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.r, this.startAngle, this.endAngle, false);
				ctx.closePath();

				if (this.isFill) {
					ctx.fillStyle = this.style;
					ctx.fill();
				}
				else {
					ctx.strokeStyle = this.style;
					ctx.stroke();
				}
				ctx.restore();
			},

			// 移动矩形
			moveTO : function () {

			},

			// 移动矩形
			moveBy : function () {

			},

			// 改变形状
			resize : function () {

			},
		};
	});
	
	/*文本*/
	var text = function(text, options) {

	};

	Game.register('Game', function(game) {

		/*图像加载完毕的处理程序*/
		var imgLoad = function (self) {
			return function () {
				slef.loadedCount += 1;
				self.loadedImgs[this.srcPath] = this;
				this.onLoad = null;
				self.loadedPercent = Math.floor(self.loadedCount / self.sum * 100);
				self.onLoad && self.onLoad(self.loadedPercent);

				if (self.loadedPercent == 100) {
					self.loadedCount = 0;
					self.loadedPercent = 0;
					loadingImgs = {};

					if (self.gameObj && self.gameObj.initialize) {
						self.gameObj.initialize();

						if(game.loop && !cg.loop.stop) {
							game.loop.end();
						}
						game.loop = new game.GameLoop(self.gameObj);
						game.loop.start();
					}
				}
			}
		};

		/*图像加载器*/
		var loader = {
			sum : 0,
			loaderCount : 0,
			loadingImgs : {},
			loadedImgs : 
		}
	});

	var gameObj = function (x, y, w, h) {
		this.x = x || 0;
		this.y = y || 0;
		this.width = w || 50;
		this.height = h || 50;
		this.type = 'obj';
	};

	gameObj.prototype.moveTo = function (x, y) {
		x = x || this.x;
		y = y || this.y;
		this.x = x;
		this.y = y;

		return this;
	};

	gameObj.prototype.moveBy = function (dx, dy) {
		dx = dx || 0;
		dy = dy || 0;

		this.x += dx;
		this.y += dy;

		return this;
	};

	gameObj.prototype.resize = function (w, h) {
		w = w || this.w;
		h = h || this.h;
	};

	gameObj.prototype.get = function (attr) {
		return this[attr];
	}

	gameObj.prototype.set = function (key, val) {
		if(this[key]){
			this[key] = val;
			return this;
		}
		else {
			return;
		}
	}

	/*碰撞检测*/
	gameObj.prototype.collide = function (obj, callback) {

	}

	/*util工具模块*/
	var Util = function () {
		var self = {};

		/*矩形碰撞检测*/
		self.RectAndRect = function (obj1, obj2, callback) {
			var cx1 =
		};

		/*判断两条线段是否相交*/
		self.LineAndLine = function (point1, point2, point3, point4) {
			var k = (point2.y - point1.y) / (point2.x - point1.x);

			return ! ( ( (k * (point3.x - point1.x) + point1.y) - point3.y) && ( (k * (point4.x - point1.x) + point1.y) - point4.y) );

			// 另一种方案
			
		};

		/*判断两个没有旋转的矩形是否相交*/
		self.rectCollide = function(obj1, obj2) {
			var cx1 = obj1.x + obj1.width / 2,
				cy1 = obj1.y + obj1.height / 2,
				cx2 = obj2.x + obj1.width / 2,
				cy2 = obj2.y + obj2.height / 2; 
			var collX = false, collY = false;
			(Math.abs(cx2 - cx1) < (obj1.width + obj2.width) / 2) && collX = true;
			(Math.abs(cy2 - cy1) < (obj1.height + obj2.height) / 2) && collY = true;

			return collX && collY;
		};

		/*判断两个原型之间的碰撞*/
		self.circleRectCollide = function (obj1, obj2) {
			var rect, cir;
			if (obj1.type == 'circle')  {
				cir = obj1;
				rect = obj2;
			}
			else {
				cir = obj2;
				rect = obj1;
			}

			var distance = Math.sqrt((cir.x - rect.x) * (cir.x * rect.x) + (cir.y - rect.y) * (cir.y - rect.y));

		};
		/*判断两个原型是否相交*/
		self.circleCollide = function (obj1, obj2) {
			var distance = (obj1.x - obj2.x) * (obj1.x - ob2.x) + (obj1.y - ob2.y) * (obj1.y -  obj2.y);
			return (obj1.rad + obj2.rad) * (obj1.rad + ob2.rad) > (obj1.x - obj2.x) * (obj1.x - ob2.x) + (obj1.y - ob2.y) * (obj1.y -  obj2.y);
		}
		// 计算碰撞函数，默认矩形碰撞
		function calculate (x1, y1, w1, h1, x2, y2, w2, h2) {
			var ax = x1 + w1 / 2,
				ay = y1 + h1 / 2,
				bx = x2 + w2 / 2,
				by = y2 + h2 / 2;
			var collX = false, collY = false;

			(Math.abs(bx - ax) < (w1 + w2) / 2) && (collX = true);
			(Math.abs(by - ay) < (h1 + h2) / 2) && (collY = true);

			return collX && collY;
		}
	}
	Game.register('Game.sprite', function (game) {
		var spriteDefaultOptions = {
			x : 0,
			y : 0,
			width : 20, 
			height : 20,
			img : new Image(), 
			posY : 0,
			fps : 60,
			imageWidth : 0,
			curIndex : 0, 
			stop : false,
			startXIndex : 0,
			endXIndex : 0
		};
		var Sprite = function (param) {

			// 重置相关参数
			var options = Game.util.extend(spriteDefaultOptions, param, true);

			// 继承自gameObj的相关属性
			gameObj.call(this, options.x, options.y, options.width, options.height);
			
			// 扩展sprite相关属性
			this.type = 'sprite';
			this.img = options.img;
			this.posY = options.posY;
			this.fps = options.fps;
			this.imageWidth = options.imageWidth;
			this.stop = options.stop;
			this.startXIndex = options.startXIndex;
			this.endXIndex = options.endXIndex || Math.floor(options.imageWidth / options.width);
		};

		// 设置继承链，表明gameObj为sprite的父元素
		sprite.prototype = new gameObj();
		sprite.prototype = {
			changeIndex : function () {
				var startX = this.startXIndex,
					endX = this.endXIndex;
				this.curIndex += 1;
				this.curIndex > endX ? startX : this.curIndex;
				this.draw();
			},

			draw : function () {
				var ctx = Game.canvas.ctx;
				if (this.stop) {
					return;
				}
				else {
					ctx.save();
					ctx.drawImage(this.img, this.width * this.curIndex, this.posY, this.width, this.height, this.x, this.y, this.width, this.height);
					ctx.restore();
				}				
			},

			stop : function () {
				this.stop = true;
			},

			start : function () {
				this.stop = false;
				this.draw();
			}
		};
	});
	
	var ShapeDefaultOption = {
		x : 0,
		y : 0,
		width : 100,
		height : 100,
		rad : 100,
		lineWidth : 5,
		style : '#000',
		isFill : true,
		isStoke : false
	};

	// 矩形
	var Rect = function (param) {

		// 重置相关参数
		var options = util.extend(ShapeDefaultOption, param, true);
		gameObj.call(this, options.x, options.y, options.width, options.height);
		this.type = 'rect';
	};

	Rect.prototype = new Object();

	Rect.prototype.draw = function () {
		var ctx = Canvas.ctx;
		ctx.save();
		/*if (this.isFill) {
			ctx.fillStyle = this.style;
			ctx.fillRect(this.x, this.y, this.width, this.height);

		}
		else {
			ctx.stokenStyle = this.style;
			ctx.lineWidth = this.lineWidth;
			ctx.rect(this.x, this.y, this.width, this.height);
		}*/
		this.fillStyle = this.stokeStyle = this.style;
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.closePath();
		this.isFill && ctx.fill();
		this.isStoke && ctx.stoke();

		ctx.restore();
		return this;
	};

	var rectimgObj = function (param) {
		var options = util.extend(ShapeDefaultOption, param, true);
		this.img = param.img || new Image();
		this.offsetX = param.offsetX || 0;
		this.offsetY = param.offsetY || 0;
	};
	rectimgObj.prototype = new Rect();

	rectimgObj.prototype.draw = function () {
		var ctx = Canvas.ctx;
		ctx.save();
		ctx.beginPath();
		ctx.drawImage(this.img, this.offsetX, this.offsetY, this.width, this.height, this.x, this.y, this.width, this.height);
	};

	var Circle = function (param) {
		var options = util.extend(ShapeDefaultOption, param, true);
		gameObj.call(this, options.x, options.y, options.width, options.height);

		this.startAngle = param.startAngle || 0;
		this.endAngle = param.endAngle || Math.PI * 2;
		this.type = 'circle';
	};

	Circle.prototype = new gameObj();
	Circle.prototype.draw = function () {
		var ctx = Canvas.ctx;
		ctx.save();
		ctx.beginPath();
		this.fillStyle = this.stokenStyle = this.style;
		ctx.arc(this.x, this.y, this.rad, this.startAngle, this.endAngle, false);
		ctx.closePath();

		this.isFill && ctx.fill();
		this.isStroke && ctx.stroke();

		ctx.restore();
		return this;
	};
	
	var cirimgObj = function (param) {
		var options = util.extend(ShapeDefaultOption, param, true);
		this.img = param.img || new Image();
		this.offsetX = param.offsetX || 0;
		this.offsetY = param.offsetY || 0;
	};
	cirimgObj.prototype = new Circle();
	cirimgObj.prototype.draw = function () {
		var ctx = Canvas.ctx;
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.rad, this.startAngle, this.endAngle, false);
		ctx.closePath();
		ctx.drawImage(this.img, this.offsetX, this.offsetY, this.width, this.height, this.x, this.y, this.width, this.height);
	};
    


});

var Game = function (width, height) {
	var util = require('./util');
	var preload = require('./preload');
	var shape = require('./shape');
	var gameObj = require('./gameObj');
	var sprite = require('./sprite');
	var canvas = require('./canvas');

	this.canvas = canvas;
	this.canvas.width = width;
	this.canvas.height = height;
	this.objList = [];
	this.preload = preload;
	this.util = util;
	this.shape = shape;
	this.sprite = sprite;
	this.gameObj = gameObj;

	util.bindHandler.call(this.canvas, event) {
		for (var i = this.objList.length -1; i > -1; i--) {
			var obj = this.objList[i];
			if (Math.abs(obj.x - event.pageX) < obj.width / 2 && Math.abs(obj.y - event.pageY) < obj.height / 2) {
				for (var j = 0, len = obj.eventlist.length; j++) {
					if (obj.eventList[j].eventType = event.Type) {
						obj.eventList[j].callback(obj);
					}
				}
			}
		}
	};

	return this;
};

Game.prototype.createObj = function (param) {
	var obj = this.gameObj(param);
	this.objList.push(obj);
	return obj;
};
Game.prototype.removeObj = function (obj) {
	/*if (this.objList.indexOf(obj) !== -1) {
		this.objList.splice(this.objList.indexOf(obj), 1);
	}*/
	this.objList.indexOf(obj) && this.objList.splice(this.objList.indexOf(obj), 1);
	return this;
};

