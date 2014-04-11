define (function (require, exports, module) {

    var util = require('./util');
    var gameObj = require('./gameObj');
    var canvas = require('./canvas');
    // var canvas = new Canvas();
    var spriteDefaultOptions = {
            x : 0,
            y : 0,
            width : 20, 
            height : 20,
            posY : 0,
            posX : 0,
            fps : 60,
            imageWidth : 0,
            curIndex : 0, 
            stop : false,
            startXIndex : 0
        };
        
    var sprite = function (param) {


        // 重置相关参数
        var options = util.extend(spriteDefaultOptions, param, true);

        // 继承自gameObj的相关属性
        gameObj.call(this, options.x, options.y, options.width, options.height);
        
        // 扩展sprite相关属性
        this.type = 'sprite';
        this.img = options.img || new Image();
        this.posY = options.posY;
        this.posX = options.posX;
        this.fps = options.fps;
        this.imageWidth = param.imageWidth || this.img.width;
        this.stop = options.stop;
        this.startXIndex = options.startXIndex;
        this.curIndex = options.curIndex;

        this.animations = {};
        this.animationId = 0;
        this.xIdex = 0;
        this.yIdex = 0;
        // this.maxXnumber = Math.floor(this.img.width / this.width);
        this.endXIndex = Math.floor(this.imageWidth / this.width);
    };

    // 设置继承链，表明gameObj为sprite的父元素
    sprite.prototype = new gameObj();
    sprite.prototype = {
        change : function () {
            
            this.curIndex = (this.curIndex >= this.endIndex) ? this.startIndex : this.curIndex;
            this.posX = (this.curIndex % this.endXIndex) * this.width;
            this.posY = Math.floor(this.curIndex / this.endXIndex) * this.height;
            this.curIndex += 1;

            this.draw();
        },

        draw : function () {
            var ctx = canvas.ctx;
            if (this.stop) {
                return;
            }
            else {
                ctx.save();
                // ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height, this.x, this.y, this.width, this.height);
                ctx.restore();
            }               
        },

        stop : function () {
            this.stop = true;
        },

        start : function () {
            this.stop = false;
            this.draw();
        },

        move : function (xDir, yDir, fps) {
            this.xDir = xDir;
            this.yDir = yDir;
            this.fps = fps;

            if (!this.stop) {
                this.x += this.xDir;
                this.y += this.yDir;
            }
            this.changeIndex();
        },
        addAnimation : function (param) {
            if (!param.id) {
                param.id = ++this.animationId; 
            }
            this.animations[param.id] = param;
        },
        play : function (id) {
            var animation = this.animations[id];
            this.startIndex = animation.startIndex;
            this.endIndex = animation.endIndex;
            this.curIndex = this.startIndex;
            // this.changeIndex();
            this.stop = false;
        }
    };

    return sprite;
});