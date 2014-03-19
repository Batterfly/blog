$(function () {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	// 确定绘制对象
	var shape1 = [[0, 0, 1, 0, 1, 1, 1, 2], [1, 0, 1, 1, 1, 2, 0, 1], [0, 0, 0, 1, 0, 2, 1, 2], [0, 0, 1, 0, 2, 0, 0, 1]];

	// 格子的相关信息
	/*var grid = {
		size : 20
	};*/
	// 游戏的相关信息
	var game = {
		width: 20,		// 游戏画面的宽度，单位为格子，即表示有20个格子的宽度
		heigth : 20,
		size : 20		// 格子的像素宽度
	}
	var movingShape;		// 正在移动的方块
	var gameObj = new Array(game.width * game.heigth -1);		// 保存所有的方块
	movingShape = function (/*x, y, type*/) {
		// x, y分别为方块的初始位置
		this.posX = 0;
		this.posY = 0;
		this.canMove = true;		// 方块是否可以移动
		this.grids = shapes[type];		// 为shapes数组
		this.grid = this.grids[0];		// 为shapes数组中的子数组的第一个数组
		return this;
	};

	movingShape.prototype = {

		// 初始化程序
		init : function () {
			var random = Math.random() * shapes.length;
			this.grids = shapes[random];
			this.grid = shapes[random][(Math.random() * this.grids.length)];
			this.posX = Math.random() * (game.width - 4);
			
		},
		// 方块向下移动
		downMoving : function () {
			if (this.canMove) {
				// 判断方块是否碰底
				var arr = this.maxPos();
				if (this.y + arr.maxY > game.heigth){
					canMove = false;
				}
				else {
					this.y += 1;
				}
			}
			return this;
			
		},

		leftMoving :function () {
			if (this.canMove) {
				if (this.x < 1){
					canMove = false;
				}
				else {
					this.x -= 1;
				}
			}
			return this;
		},

		rightMovin : function () {
			if (this.canMove) {
				var arr = this.maxPos();
				if (this.x + arr.maxX < game.width){
					canMove = false;
				}
				else {
					this.x -= 1;
				}
			}
			return this;
		},

		// 方块变形
		transform : function (n) {
			this.grid = this.grids[n];
		},

		// 获取当前方块位置中的最大x值,最小x值，最大y值，最小y值
		maxPos : function () {
			var arr = this.grid;
			var arrx = arr.filter(function (value, index) {
				return !(index % 2);
			});
			var arry = arr.filter(function (value, index) {
				return (index % 2);
			});
			var result = {};
			result.maxX = Math.max.apply(null, arrx);
			result.minX = Math.min.apply(null, arrx);
			result.maxY = Math.max.apply(null, arry);
			result.minY = Math.min.apply(null, arry);

			return result;
		},

		// 将元素添加到已完成的列表中
		addToGameObj : function () {
			if (!canMove) {
				var grid = this.grid;
				// 在对应的坐标上，将对应位置的方块进行标记
				gameObj[(this.posY + grid[1]) * game.width + (this.posX + grid[0])] = 1;
				gameObj[(this.posY + grid[3]) * game.width + (this.posX + grid[2])] = 1;
				gameObj[(this.posY + grid[5]) * game.width + (this.posX + grid[4])] = 1;
				gameObj[(this.posY + grid[7]) * game.width + (this.posX + grid[6])] = 1;
			}
			return this;
		},
		updatePos : function () {
			this.tmpSharpe = [];
			var tmpArr = [];
			for (var i = 0; i < this.grid.length / 2; i++) {
				tmpArr = [this.posX + this.grid[i * 2], this.posY + this.grid[i * 2 + 1]];
				this.tmpSharpe.push(tmpArr);
			}
		}

		// 判断移动中的方块是否与已存在的方块碰撞
		collision : function () {
				var obj, index;
				for (var j = 0; j < this.grids.length - 2; j += 2) {
					index = this.grids[i] * this.width + this.grids[i + 1];
					if (gameObj[index] == 1)
						return index;
				}
				return ;
			}
		}
	};
	function init() {
		var i, len = gameObj.length;
		// 绘制gameObj
		for (i = 0; i < len; i++) {
			var obj = gameObj[i];
			if (obj === 1) {
				// 在对应的位置画上相应的矩形
				ctx.fillRect((i % game.width), Math.floor(i / game.width), game.size, game.size);
			}
		}
		// 绘制正在移动的方块
		for (var j = 0; j < tmpSharpe.length; i++) {
			ctx.fillRect(tmpSharpe[i][0], tmpSharpe[i][1], game.size, game.size);
		}
	}

	// 判断是否得分
	function getscore() {
		var n = []，count = 0;
		// 将每一行都设置为1
		for (var k = 0; k < game.heigth; k++) {
			n[k] = 1;
		}
		var scores = [0, 10, 20, 50, 80];
		// 若不满足得分条件则设置为0
		for(var i = (game.heigth - 1) * game.width; i >= 0; i -= game.width) {
			for(var j = 0; j < game.width; j++) {
				if(gameObj[i * game.width + j] !== 1) {
					n[i] = 0;
				}
			}
		}
		for (var m = 0; m < game.heigth; m++){
			if (n[m] == 1) {
				count += 1；
			}
		}
		return scores[count];
	}

	// 删除得分行
	function disapper (arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == 1) {
				deleteALine(i);
			}
		}
	}

	// 把一行方块消失掉
	function deleteALine (n) {
		//  判断n是否大于0；
		for (var i = n * game.width; i > game.width; i--){
			gameObj[i] = gameObj[i - game.width];
		}
	}

})