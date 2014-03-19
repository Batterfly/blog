define (function (require, exports, module) {
    exports.util = function () {
        var that = {};
        /**
         * 通过id获取元素
        **/
        that.$ = function (id) {
            return document.getElementById(id);
        };

        /**
         * 通过类名获取元素
        **/
        that.$$ = function (classname) {
            return document.querySelector('.'+ classname);
        };

        /**
         *通过标签名获取元素
        **/
        that.$$$ = function (tagName, parent) {
            var parent = parent || document;
            return parent.getElmentByTagName(tagName);
        };

        /**
         * 事件绑定
        **/
        that.bindHandler = (function () {
            if (window.addEventListener) {
                return function(elem, type, handler) {
                    elem.addEventListener(type, handler, false);
                }
            }
            else if (window.attachEvent) {
                return function (elem, type, handler) {
                    elem.attachEvent("on" + type, handler);
                }
            }
        })();

        /**
         * 事件解除绑定
        **/
        that.unbindHandler = (function () {
            if (window.removeEventListener) {
                return function(elem, type, handler) {
                    elem.removeEventListener(type, handler, false);
                }
            }
            else if (window.detachEvent) {
                return function (elem, type, handler) {
                    elem.detachEvent("on" + type, null);
                }
            }
        })();

        /**
         * 获取事件对象
        **/
        that.getEventObj = function (evt) {
            return evt || win.event;
        };

        /**
         * 获取事件目标对象
        **/
        that.getEventTarget = function (evt) {
            var e = that.getEventObj(evt);
            return e.target || e.srcElement;
        };

        /**
         * 获取元素在页面上的位置
        **/
        that.getPos = function (elem) {
            var left = 0, top = 0;
            while (elem.offsetParent) {
                left += elem.offsetLeft;
                top += elem.offsetTop;
                elem = elem.offsetParent;
            }
            return {
                left : left, 
                top : top
            };
        };

        /**
         * 阻止默认事件
        **/
        that.preventDefault = function (evt) {
            if (evt.preventDefault) {
                evt.preventDefault();
            }else {
                evt.returnValue = false;
            }
        };

        /**
         * 获取对象计算的样式
        **/
        that.getComputedStyle = (function () {
            var body = document.body;
            if(body.currentStyle) {
                return function (elem) {
                    return elem.currentStyle;
                }
            }
            else if (document.defaultView.getComputedStyle) {
                return function (elem) {
                    return document.defaultView.getComputedStyle(elem, null);
                }
            }
        })();

        /**
         * 是否为undefined
        **/
        that.isUndefined = function (elem) {
            return typeof elem === 'undefined';
        };

        /**
         * 是否为数组
        **/
        that.isArray = function (elem) {
            return Object.prototype.toString.call(elem) === "[object, Array]";
        };

        /**
         * 是否为对象
        **/
        that.isObject = function (elem) {
            return elem === Object(elem);
        };

        /**
         * 是否数字
        **/
        that.isNumber = function (elem) {
            return Object.prototype.toString.call(elem) === "[object, Number]";
        };
        /**
         * 是否为字符串
        **/
        that.isString = function (elem) {
            return Object.prototype.toString.call(elem) === "[object, String]";
        };

        /**
         * 复制对象属性
        **/
        that.extend = function (des, sour, isCover) {
            for (var key in sour) {
                if (des[key]) {
                    /*if (isCover) {
                        des[key] = sour[key];
                    }
                    else {
                        continue;
                    }*/
                    isCover && (des[key] = sour[key]);
                }
                else {
                    des[key] = sour[key];
                }

                // 另一种方案
                /*var isUndefined = that.isUndefined;
                (isUndefined(isCover)) && (isCover = true);
                for (var name in sour) {
                    if (isCover || isUndefined(des[name])) {
                        des[name] = sour[name];
                    }
                }*/
            }
        };

        /**
         * 原型继承对象
        **/
        that.inherit = function (child, parent) {
            var func = function () {};
            func.prototype = parent.prototype;
            child.prototype = new func();
            child.prototype.constructor = child;
            child.prototype.parent = parent;
        };
        
        return that;
    };
});