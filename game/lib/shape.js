define(function (require, exports, module){

    var util = require('./util');
    var gameObj = require('./gameObj');
    var canvas = require('./canvas');
    // var canvas = Canvas();
   
    var defaultOption = {
        x : 0,
        y : 0,
        width : 100,
        height : 100,
        rad : 100,
        lineWidth : 5,
        style : '#000',
        isFill : true,
        isStroke : false,
        angle : 0
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
        this.angle = param.angle;

        return this;
    };

    Rect.prototype = new gameObj();

    Rect.prototype.draw = function () {
        var ctx = canvas.ctx;
        ctx.save();
        
        ctx.fillStyle = ctx.stokeStyle = this.style;
        ctx.beginPath();
        if (this.angle == '0') {
            ctx.rect(this.x, this.y, this.width, this.height);
        } else {
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.angle / 180 * Math.PI);
            ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        }
        ctx.closePath();
        this.isFill && ctx.fill();
        this.isStroke && ctx.stroke();

        ctx.restore();
        return this;
    };

     var rectimgObj = function (param) {
        var options = util.extend(defaultOption, param, true);
        Rect.call(this, options);
        this.img = param.img || new Image();
        this.offsetX = param.offsetX || 0;
        this.offsetY = param.offsetY || 0;
    };

    rectimgObj.prototype = new Rect();

    rectimgObj.prototype.draw = function () {
        var ctx = canvas.ctx;
        ctx.save();
        ctx.beginPath();
        if (this.angle == '0') {
            ctx.drawImage(this.img, this.offsetX, this.offsetY, this.width, this.height, this.x, this.y, this.width, this.height);
        } else {
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.angle / 180 * Math.PI);
            ctx.drawImage(this.img, this.offsetX, this.offsetY, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        }
        ctx.closePath();
        ctx.restore();
        return this;
    };

    

    var Circle = function (param) {
        var param = param || {};
        var options = util.extend(defaultOption, param, true);
        gameObj.call(this, options.x, options.y, options.width, options.height);
        this.width = options.width;
        this.height = options.height;
        this.rad = options.rad;
        this.x = options.x;
        this.y = options.y;
        this.style = options.style;
        this.startAngle = options.startAngle || 0;
        this.endAngle = options.endAngle || Math.PI * 2;
        this.type = 'circle';
        this.isFill = options.isFill;
        this.isStroke = options.isStroke;

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
        Circle.call(this, options);
        this.img = param.img || new Image();
        this.offsetX = param.offsetX || 0;
        this.offsetY = param.offsetY || 0;

        return this;
    };

    cirimgObj.prototype = new Circle();
    cirimgObj.prototype.draw = function () {
        var ctx = canvas.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, this.startAngle, this.endAngle, false);
        ctx.clip();
        ctx.closePath();
        ctx.drawImage(this.img, this.offsetX, this.offsetY, this.width, this.height, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    };

    var shape = {
        rect : Rect, 
        rectImg : rectimgObj,
        circle : Circle, 
        cirImg : cirimgObj
    };
    return shape;
});