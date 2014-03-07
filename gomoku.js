$(function) {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	function Game (w, h, size) {
		this.width = w;
		this.height = h;
		this.size = size;
		this.ob = new  Array(w * h);
		this.curPos = 0;
		this.color = 'black';		// black代表轮到黑色棋子先走，若为white则为白色先走
	};
	Game.prototype = {
		init : function () {
			// 画棋盘
			ctx.stokeStyle = '#000';
			ctx.lineWidht = '1';

			for (var i = 0; i < this.width; i++) {
				ctx.moveTo(i * this.size, 0);
				ctx.moveTo(i * this.size, canvas.height);
				ctx.stoke();
			}

			for (var j = 0; j < this.height; j++) {
				ctx.moveTo(0, j * this.size);
				ctx.moveTo(canvas.height, j * this.size);
				ctx.stoke();
			}

		},

		// 计算鼠标的位置，判断要棋子放在哪个点上
		roundPos : function (x, y) {
			return {
				x : Math.round(x % this.size),
				y : Math.round(Math.floor(y / this.size))
			};
		},

		// 改变颜色
		changeColor : function () {
			if (this.color == 'black') {
				this.color = 'white';
			}
			else {
				this.color = 'black';
			}
			return;
		}
		// 根据坐标 放置棋子
		putPiece : function (n, x, y) {
			// 表示当前坐标还没有放置棋子
			if (!this.ob[this.width * y + x]) {
				var img = new Image();
				img.src = images[n];
				img.onload = function () {
					// 居中放置
					ctx.drawImage(img, x - this.pieceSize / 2, y - this.pieceSize, this.pieceSize, this.pieceSize);
				}
				this.curPos = y * this.width + x;
				this.ob[curPos] = 2;		// 2表示当前节点是刚刚下完毕
				changeColor();				// 表示到另一种颜色棋子下了
				return curPos;
			}
			else {
				console.log('当前位置已经放置其他棋子，请重新！');
				return;
			}
			
		},

		//  将this.ob的索引转为对应的坐标
		turnPos : function (index) {
			return {
				x : index % this.width,
				y : Math.floor(index / this.width)
			};
		}
		// 绘制所有棋子
		drawAll : function () {
			this.init();
			var obj = this.ob;
			for (var i = 0; i < this.width * this.height; i++) {
				// 1表示之前已放置的黑色棋子，渲染所有的黑色棋子
				if (ob[i] == 1) {
					putPiece(n, turnPos(i).x, turnPos(i).y);
				}
				// 2表示之前已放置的白色棋子，渲染所有的白色棋子
				else if (ob[i] == 2) {
					putPiece(n, turnPos(i).x, turnPos(i).y);
				}
			}
		},

		//  判断是否胜利
		isWin : function () {
			// 判断横向上是否有连续5颗同颜色的棋子
			var len = this.width * this.height;
			for (var i = 0; i < len; i ++ ) {
				/*for (var j = 1; j < 6; j++) {
					if( ( exist(i, 'left', j) && exist(i, 'right', 5 - j) ) || ( exist(i, 'up', j) && exist(i, 'down', 5-j) ) ) {
						return this.ob[i];
					}
					
				}*/
				if (exist(i, 'left', 5) || exist(i, 'down', 5) || exist(i, 'oblique', 5)) 
					return this.ob[i];
			}
			return false;
		},

		// 判断当前位置是否存在5颗同颜色的棋子
		isExist : function (x, y) {
			var count = 0;
			// 横向方向上

		},
		/**
		 * @index : 代表在this.ob数组中索引的位置
		 * @direction :　代表方向
		 * @n   : 代表在该方向上是否存在n个相同颜色的方块

		*/
		exist : function (index, direction, n){
			var obj = this.ob;
			if (direction == 'left'){
				for (var i = 0; i < n - 1 ; i++) {
					// 该位置是否存在棋子，并且相邻的左棋子要在同一行上，以及颜色一致
					if (obj[index - i] && turnPos(index - i).x == turnPos(index - i - 1).x && obj[index - i ] == obj[index + i + 1]){
						return true;
					}
					else {
						return false;
					}
				}
			}
			// 右方向
			/*else if (direction == 'right'){
				for (var i = 0; i < n - 1 ; i++) {
					// 该位置是否存在棋子，并且相邻的左棋子要在同一行上
					if (obj[index + i] && turnPos(index + i).x == turnPos(index + i + 1).x && obj[index + i ] == obj[index + i + 1]){
						return true;
					}
					else {
						return false;
					}
				}
			}*/

			// 下方向
			else if (direction == 'down'){
				for (var i = 0; i < n - 1 ; i++) {
					// 该位置是否存在棋子,并且该长度是否超出了棋盘的范围
					if (obj[index + i * this.width] && obj[index + i * this.width] == obj[index + (i + 1) * this.width] && (index + n * this.width < this.width * this.height)){
						return true;
					}
					else {
						return false;
					}
				}
			}
			// 上方向
			/*else if (direction == 'up'){
				for (var i = 0; i < n - 1 ; i++) {
					// 该位置是否存在棋子，并且该长度是否超出了棋盘的范围
					if (obj[index - i * this.width]  && obj[index - i * this.width] == obj[index - (i + 1) * this.width] && (index - n * this.width > 0)){
						return true;
					}
					else {
						return false;
					}
				}
			}*/
			// 斜向方向
			else if (direction == 'oblique'){
				for (var i = 0; i < n - 1 ; i++) {
					// 该位置是否存在棋子,并且该长度是否超出了棋盘的范围
					if (obj[index + i * this.width] && obj[index + i * this.width] == obj[index + (i + 1) * this.width] && ){
						return true;
					}
					else {
						return false;
					}
				}
			}
		}
	}
}