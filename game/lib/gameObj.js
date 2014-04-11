define (function (require, exports, module) {
    var Util = require('./util');
    var canvas = require('./canvas');
    var ObjList = require('./objlist');
    var EventList = require('./eventlist');

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

        return this;
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
            return this;
        }
    };

    function Event (type, callback) {
        this.eventType = type;
        this.callback = callback;
    };
    /*碰撞检测*/
    gameObj.prototype.collide = function (obj, callback) {
        var res;

        // 圆形和矩形的碰撞
        if ((this.type == 'circle' && obj.type == 'rect') || (this.type == 'rect' && obj.type == 'circle')) {
           res =  Util.circleRectCollide(this, obj);
        }

        if (this.type == 'circle' && obj.type == 'circle') {
            res = Util.circleCollide(this, obj);
        }

        if (this.type == 'rect' && obj.type == 'rect') {
            if (this.angle == '0' && obj.angle == '0') {
                res = Util.rectCollide(this, obj);
            } else {
                res = Util.rotateRectCollid(this, obj);
            }
        }

        
        res && callback.call(this);
        return this;
    };

    /*添加事件侦听函数*/
    gameObj.prototype.addEventListener = function (type, callback) {
        var tmp = new Event(type, callback);
        this.eventlist.push(tmp);

        if(!Util.indexOf(EventList, type)) {
            EventList.push(type);
            Util.bindHandler(canvas, type, handler);
        }

        function handler (event) {
            for (var i = ObjList.length - 1; i > -1; i--) {
                var obj = ObjList[i];
                if (obj.type == 'rect') {
                    var posX = Math.abs(obj.x + obj.width / 2 - event.pageX),
                        posY = Math.abs(obj.y + obj.height / 2- event.pageY);
                    if ((posX < obj.width / 2) && ( posY < obj.height / 2)) {
                        obj.triggerEvent(event.type);
                        return;
                    }
                }
                if (obj.type == 'circle') {
                    var posX = Math.abs(obj.x - event.pageX),
                        posY = Math.abs(obj.y - event.pageY);
                    if (posX * posX + posY * posY < obj.rad * obj.rad) {
                        obj.triggerEvent(event.type);
                        return ;
                    }
                }
            }
        }
        
        
    };

    /**/
    gameObj.prototype.removeEventListener = function (event) {
        var event = new Event(event);
        if (this.eventlist.indexOf(event) !== -1) {
            this.eventlist.splice(event, 1);
        }
        return this;
    };

    /*事件触发*/
    gameObj.prototype.triggerEvent = function (eventType) {
        var eventlist = this.eventlist;
        for (var i = 0, len = eventlist.length; i < len; i++) {
            var Event = eventlist[i];
            if (eventType == Event.eventType) {
                Event.callback.call(this);
                return this;
            }
        }
        return this;
    }
    /**/
    gameObj.prototype.isEvent = function (e, event) {

    };
    /*判断函数*/
    return gameObj;
});
