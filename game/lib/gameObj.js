define (function (require, exports, module) {
    var gameObj = function (x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 50;
        this.height = h || 50;
        this.type = 'obj';
        this.eventlist = [];        // 事件侦听列表

        return this;
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
    };

    gameObj.prototype.set = function (key, val) {
        if(this[key]){
            this[key] = val;
            return this;
        }
        else {
            return;
        }
    };

    function Event (event, callback) {
        this.eventType = event.type;
        this.callback = callback;
    };
    /*碰撞检测*/
    gameObj.prototype.collide = function (obj, callback) {

    };

    /*添加事件侦听函数*/
    gameObj.prototype.addEventListener = function (event, callback) {
        var event = new Event(event, callback);
        this.eventlist.push(event);
    };

    /**/
    gameObj.prototype.removeEventListener = function (event, callback) {
        var event = new Event(event, callback);
        if (this.eventlist.indexOf(event) !== -1) {
            this.eventlist.splice(event, 1);
        }
    };

    /**/
    gameObj.prototype.isEvent = function (e, event) {

    };
    /*判断函数*/
    return gameObj;
});
