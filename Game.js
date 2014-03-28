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

	


	/*var gameObj = (function () {
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
	});*/
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
		}

		/*判断两条线段是否相交*/
		self.LineAndLine = function (point1, point2, point3, point4) {
			var k = (point2.y - point1.y) / (point2.x - point1.x);

			return ! ( ( (k * (point3.x - point1.x) + point1.y) - point3.y) && ( (k * (point4.x - point1.x) + point1.y) - point4.y) );

			// 另一种方案

		};
	}
	/*Game.register('Game.sprite', function (game) {
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
	});*/
	
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