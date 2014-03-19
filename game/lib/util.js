define (function (require, exports, module) {

    var self = {};
    /**
     * 通过id获取元素
    **/
    self.$ = function (id) {
        return document.getElementById(id);
    };

    /**
     * 通过类名获取元素
    **/
    self.$$ = function (classname) {
        return document.querySelector('.'+ classname);
    };

    /**
     *通过标签名获取元素
    **/
    self.$$$ = function (tagName, parent) {
        var parent = parent || document;
        return parent.getElmentByTagName(tagName);
    };

    /**
     * 事件绑定
    **/
    self.bindHandler = (function () {
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
    self.unbindHandler = (function () {
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
    self.getEventObj = function (evt) {
        return evt || win.event;
    };

    /**
     * 获取事件目标对象
    **/
    self.getEventTarget = function (evt) {
        var e = self.getEventObj(evt);
        return e.target || e.srcElement;
    };

    /**
     * 获取元素在页面上的位置
    **/
    self.getPos = function (elem) {
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
    self.preventDefault = function (evt) {
        if (evt.preventDefault) {
            evt.preventDefault();
        }else {
            evt.returnValue = false;
        }
    };

    /**
     * 获取对象计算的样式
    **/
    self.getComputedStyle = (function () {
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
    self.isUndefined = function (elem) {
        return typeof elem === 'undefined';
    };

    /**
     * 是否为数组
    **/
    self.isArray = function (elem) {
        return Object.prototype.toString.call(elem) === "[object Array]";
    };

    /**
     * 是否为对象
    **/
    self.isObject = function (elem) {
        return elem === Object(elem);
    };

    /**
     * 是否数字
    **/
    self.isNumber = function (elem) {
        return Object.prototype.toString.call(elem) === "[object Number]";
    };
    /**
     * 是否为字符串
    **/
    self.isString = function (elem) {
        return Object.prototype.toString.call(elem) === "[object String]";
    };

    /**
     * 复制对象属性
    **/
    self.extend = function (des, sour, isCover) {            
        // 另一种方案
        var isUndefined = self.isUndefined;
        (isUndefined(isCover)) && (isCover = true);
        for (var name in sour) {
            if (isCover || isUndefined(des[name])) {
                des[name] = sour[name];
            }
        }
        return des;
    };

    /**
     * 原型继承对象
    **/
    self.inherit = function (child, parent) {
        var func = function () {};
        func.prototype = parent.prototype;
        child.prototype = new func();
        child.prototype.constructor = child;
        child.prototype.parent = parent;
    };
    
    /*矩形碰撞检测*/
    self.RectAndRect = function (obj1, obj2, callback) {
        // var cx1 =
    };

    /*判断两条线段是否相交*/
    self.LineAndLine = function (point1, point2, point3, point4) {
        var k = (point2.y - point1.y) / (point2.x - point1.x);

        return ! ( ( (k * (point3.x - point1.x) + point1.y) - point3.y) && ( (k * (point4.x - point1.x) + point1.y) - point4.y) );

        // 另一种方案
        
    };

    /*判断两个没有旋转的矩形是否相交*/
    self.rectCollide = function(obj1, obj2) {
        var cx1 = obj1.x + obj1.width / 2,
            cy1 = obj1.y + obj1.height / 2,
            cx2 = obj2.x + obj1.width / 2,
            cy2 = obj2.y + obj2.height / 2; 
        var collX = false, collY = false;
        (Math.abs(cx2 - cx1) < (obj1.width + obj2.width) / 2) && collX = true;
        (Math.abs(cy2 - cy1) < (obj1.height + obj2.height) / 2) && collY = true;

        return collX && collY;
    };

    /*判断两个原型之间的碰撞*/
    self.circleRectCollide = function (obj1, obj2) {
        var rect, cir;
        if (obj1.type == 'circle')  {
            cir = obj1;
            rect = obj2;
        }
        else {
            cir = obj2;
            rect = obj1;
        }

        var distance = Math.sqrt((cir.x - rect.x) * (cir.x * rect.x) + (cir.y - rect.y) * (cir.y - rect.y));

    };
    /*判断两个原型是否相交*/
    self.circleCollide = function (obj1, obj2) {
        var distance = (obj1.x - obj2.x) * (obj1.x - ob2.x) + (obj1.y - ob2.y) * (obj1.y -  obj2.y);
        return (obj1.rad + obj2.rad) * (obj1.rad + ob2.rad) > (obj1.x - obj2.x) * (obj1.x - ob2.x) + (obj1.y - ob2.y) * (obj1.y -  obj2.y);
    };
    
    return self;

});