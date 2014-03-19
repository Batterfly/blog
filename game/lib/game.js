define(function (require, exports, module) {
    var util = require('./util');
    var preload = require('./preload');
    var shape = require('./shape');
    var gameObj = require('./gameObj');
    var sprite = require('./sprite');
    var canvas = require('./canvas');
    
    var Game = function (width, height) {

        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.objList = [];
        this.preload = preload;
        this.util = util;
        this.shape = shape;
        this.sprite = sprite;
        this.gameObj = gameObj;

        util.bindHandler.call(this.canvas, type, function (event) {
            for (var i = this.objList.length -1; i > -1; i--) {
                var obj = this.objList[i];
                if ((Math.abs(obj.x - event.pageX) < obj.width / 2) && (Math.abs(obj.y - event.pageY) < obj.height / 2)) {
                    for (var j = 0, len = obj.eventlist.length; j < len; j++) {
                        if (obj.eventList[j].eventType = event.Type) {
                            obj.eventList[j].callback(obj);
                        }
                    }
                }
            }
        });

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
    Game.prototype.init = function () {
        this.canvas = this.canvas(this.width, this.height);
        this.canvas.fillStyle = '#ccc';
        this.canvas.fillRect(0, 0, this.width, this.height);
        return this;
    };

    return Game;

})
