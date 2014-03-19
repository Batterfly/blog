define(function (require, exports, module){

    var util = require('./util');
    var gameObj = require('./gameObj');
    var Canvas = require('./canvas');
    canvas = Canvas();

    var defaultOption = {
        x : 0,
        y : 0,
        width : 100,
        height : 100,
        rad : 100,
        lineWidth : 5,
        style : '#000',
        isFill : true,
        isStroke : false
    };

    // 矩形
    var Rect = function (param) {

        // 重置相关参数
        var param = param || {};
        var options = util.extend(defaultOption, param, true);
        gameObj.call(this, options.x, options.y, options.width, options.height);
        this.type = 'rect';
        this.lineWidth = options.lineWidth;
        this.style = options.style;
        this.isFill = options.isFill;
        this.isStroke = options.isStroke;
        console.dir(this);
        return this;
    };

    Rect.prototype = new gameObj();

    Rect.prototype.draw = function () {
        var ctx = canvas.ctx;
        ctx.save();
        
        ctx.fillStyle = ctx.stokeStyle = this.style;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.closePath();
        this.isFill && ctx.fill();
        this.isStroke && ctx.stroke();

        ctx.restore();
        return this;
    };

     var rectimgObj = function (param) {
        var options = util.extend(defaultOption, param, true);
        this.img = param.img || new Image();
        this.offsetX = param.offsetX || 0;
        this.offsetY = param.offsetY || 0;
    };

    rectimgObj.prototype = new Rect();

    rectimgObj.prototype.draw = function () {
        var ctx = canvas.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.drawImage(this.img, this.offsetX, this.offsetY, this.width, this.height, this.x, this.y, this.width, this.height);
        return this;
    };

    

    var Circle = function (param) {
        var param = param || {};
        var options = util.extend(defaultOption, param, true);
        gameObj.call(this, options.x, options.y, options.width, options.height);

        this.startAngle = param.startAngle || 0;
        this.endAngle = param.endAngle || Math.PI * 2;
        this.type = 'circle';
        return this;
    };

    Circle.prototype = new gameObj();
    Circle.prototype.draw = function () {
        var ctx = canvas.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = ctx.stokenStyle = this.style;
        ctx.arc(this.x, this.y, this.rad, this.startAngle, this.endAngle, false);
        ctx.closePath();

        this.isFill && ctx.fill();
        this.isStroke && ctx.stroke();

        ctx.restore();
        return this;
    };
    
    var cirimgObj = function (param) {
        var options = util.extend(defaultOption, param, true);
        this.img = param.img || new Image();
        this.offsetX = param.offsetX || 0;
        this.offsetY = param.offsetY || 0;
    };
    cirimgObj.prototype = new Circle();
    cirimgObj.prototype.draw = function () {
        var ctx = canvas.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, this.startAngle, this.endAngle, false);
        ctx.clip();
        ctx.closePath();
        ctx.drawImage(this.img, this.offsetX, this.offsetY, this.width, this.height, this.x, this.y, this.width, this.height);
    };

    var shape = {
        rect : Rect, 
        rectImg : rectimgObj,
        circle : Circle, 
        cirImg : cirimgObj
    };
    return shape;
});