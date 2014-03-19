define (function (require, exports, module) {

    var util = require('./util');
    var gameObj = require('/gameObj');
    var canvas = require('./canvas');

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
        var options = util.extend(spriteDefaultOptions, param, true);

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
            var ctx = canvas.ctx;
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

    return Sprite;
});