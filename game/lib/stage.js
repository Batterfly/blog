define(function (require, exports, module) {
    var util = require('./util');
    var gameObj = require('./gameObj');
    var preload = require('./preload');
    var shape = require('./shape');
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

        // 监听事件
        /*util.bindHandler.call(this.canvas, type, function (event) {
            for (var i = this.objList.length -1; i > -1; i--) {
                var obj = this.objList[i];
                var posX = Math.abs(obj.x - event.pageX), 
                    posY = Math.abs(obj.y - event.pageY);
                if (obj.type == 'rect') {
                    if ((posX < obj.width / 2) && ( posY < obj.height / 2)) {
                        obj.triggerEvent(event.type);
                    }
                }
                if (obj.type == 'circle') {
                    if (posX * posX + posY * posY < obj.rad * obj.rad) {
                        obj.triggerEvent(event.type);
                    }
                }
            }

            return this;
        });*/
        /*this.canvas.addEventListener(type,handler, false);
        function handler (event) {
            var type = event.type;
            for (var i = this.objList.length -1; i > -1; i--) {
                var obj = this.objList[i];
                var posX = Math.abs(obj.x - event.pageX), 
                    posY = Math.abs(obj.y - event.pageY);
                if (obj.type == 'rect') {
                    if ((posX < obj.width / 2) && ( posY < obj.height / 2)) {
                        obj.triggerEvent(event.type);
                    }
                }
                if (obj.type == 'circle') {
                    if (posX * posX + posY * posY < obj.rad * obj.rad) {
                        obj.triggerEvent(event.type);
                    }
                }
            }
        }*/
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
