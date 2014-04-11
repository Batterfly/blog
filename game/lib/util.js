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
    self.bindHandler = (function (element) {
        if (window.addEventListener) {
            return function(elem, type, handler) {
                elem.addEventListener(type, handler, false);
            }
        }
        else if (window.attachEvent) {
            return function (elem, type, handler) {
                elem.attachEvent("on" + type, handler);
            }
        }else {
          element["on" + type] = handler;
        }
    })();

    /**
     * 事件解除绑定
    **/
    self.unbindHandler = (function (element) {
        if (window.removeEventListener) {
            return function(elem, type, handler) {
                elem.removeEventListener(type, handler, false);
            }
        }
        else if (window.detachEvent) {
            return function (elem, type, handler) {
                elem.detachEvent("on" + type, null);
            }
        }else {
          element["on" + type] = null;
        }

    })();
    /**
     * 判断数组中是否存在某个值
    **/
    self.indexOf = function (arr, key) {
        if (!arr) return false;
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] == key) {
                return i + 1;
            }
        }
        return false;
    }
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
     * 克隆对象
    **/
    self.clone = function (elem) {
        if (!elem || typeof elem != 'object') {
            return;
        }
        var temp;
        temp =  elem.constructor == Array ? [] : {};
        for (var key in elem) {
            temp[key] = (typeof elem[key] == 'object') ? self.clone(elem[key]) : elem[key];
        }
        return temp;
    }
    /**
     * 复制对象属性
    **/
    self.extend = function (des, sour, isCover) {            
        // 另一种方案
        var res = self.clone(des);
        var isUndefined = self.isUndefined;
        (isUndefined(isCover)) && (isCover = true);
        for (var name in sour) {
            if (isCover || isUndefined(res[name])) {
                res[name] = sour[name];
            }
        }
        return res;
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

    /*判断圆形和旋转矩形之间的碰撞*/
    self.circleRectCollide = function (obj1, obj2) {
        var rect, circle;
        if (obj1.type == 'circle')  {
            circle = obj1;
            rect = obj2;
        }
        else {
            circle = obj2;
            rect = obj1;
        }
        var rectPoints = self.getRotatedPoints(rect);
        for (var i = 0; i <  rectPoints.length; i++) {
            var point = rectPoints[i];

            // 判断矩形的顶点是否在圆内
            var distance = Math.sqrt((circle.x - point.x) * (circle.x - point.x) + (circle.y - point.y) * (circle.y - point.y));
            if (distance < circle.rad) {
                return true;
            }
            var point2 = rectPoints[i + 1];
            if (i == rectPoints.length - 1) {
                point2 = rectPoints[0];
            }

            // 垂直坐标轴
            if (rect.angle % 90 == 0) {
                continue ; 
            }
            // 圆心做矩形边的垂线的方程式 y = kx + b;
            var k = (point2.y - point.y) / (point2.x - point.x);
            var b0 = point.y - k * point.x;
            var b1 = circle.y + circle.x / k;
            // 交点的x轴坐标
            var xPos = (b1 - b0) / (k + 1 / k);
            var yPos = (b1 * k + b0 * -1 / k) /( k + 1 / k);
            var yPos = k * (xPos - point.x) + point.y;
            var distance = Math.sqrt((xPos - circle.x) * (xPos - circle.x) + (yPos - circle.y) * (yPos - circle.y));
            if (Math.abs(distance) < circle.rad) {
                
                if ((xPos - point.x) * (xPos - point2.x) < 0) {
                    return true;
                }
            }
        }
        return false;
    };

    /*旋转矩形直接的碰撞*/
    self.rotateRectCollid = function (obj1, obj2) {
        /*获取旋转之后的坐标*/
        var pointArr1 = self.getRotatedPoints(obj1);
        var pointArr2 = self.getRotatedPoints(obj2);
        
        var point1, point2, point3, point4;

        for (var i = 0; i < pointArr1.length; i++) {
            point1 = pointArr1[i];
            point2 = pointArr1[i + 1];

            if (i == pointArr1.length - 1) {
                point2 = pointArr1[0];
            }
            
            for (var j = 0; j < pointArr2.length; j++)　{
                point3 = pointArr2[j];
                point4 = pointArr2[j + 1];

                if (j == pointArr2.length - 1) {
                    point4 = pointArr2[0];
                }
                // 若存在线段相交，则立即返回
                if (self.segmentsIntr(point1, point2, point3, point4)) {
                    return true;
                }
            }
        }
        return false;
    }

    /*获取矩形旋转后的四点坐标*/
    self.getRotatedPoints = function (obj) {
        // 四点相对于中心点的坐标
        var points = [
                    {
                        x : -obj.width / 2,
                        y : -obj.height / 2
                    },
                    {
                        x : obj.width / 2,
                        y : -obj.height / 2
                    },
                    {
                        x : obj.width / 2,
                        y : obj.height / 2
                    },
                    {
                        x : -obj.width / 2,
                        y : obj.height / 2
                    }
                ];
            var centerPoint = {
                x : obj.x + obj.width / 2,
                y : obj.y + obj.height / 2
            };
            var resPoint = [];
            for (var i = 0 ; i < points.length; i++) {
                var point = points[i];
                var pointTmp = self.getRotatedPointPos(point, obj.angle);

                // 变换为正确的坐标
                resPoint.push({x : pointTmp.x + centerPoint.x, y : pointTmp.y + centerPoint.y});
            }
        return resPoint;
    };

    /*获取矩形某个顶点相对于中心点的旋转之后的坐标*/
    self.getRotatedPointPos = function (point, angle) {
        var matrix = [
                        [0, 0, 0],
                        [0, 0, 0],
                        [0, 0, 1]
                    ];
            var cos = Math.cos,
                sin = Math.sin,
                angle = angle / 180 * Math.PI;

            matrix[0][0] = cos(angle);
            matrix[0][1] = sin(angle);
            matrix[1][0] = -sin(angle);
            matrix[1][1] = cos(angle);

            var res = {};
            res.x = point.x * cos(angle) - point.y * sin(angle);
            res.y = point.x * sin(angle) + point.y * cos(angle);

            return res;
    };

    /*判断两条线段是否相交*/
    self.segmentsIntr = function (a, b, c, d) {
        var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);  
        var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);   
      
        // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);  
        if ( area_abc * area_abd > 0 ) {  
            return false;  
        }  
      
        // 三角形cda 面积的2倍  
        var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);  
        // 三角形cdb 面积的2倍  
        var area_cdb = area_cda + area_abc - area_abd ;  
        if (  area_cda * area_cdb > 0 ) {  
            return false;  
        }  
      
       return true;
    };

    /*判断两个圆形是否相交*/
    self.circleCollide = function (obj1, obj2) {
        var distance = (obj1.x - obj2.x) * (obj1.x - ob2.x) + (obj1.y - ob2.y) * (obj1.y -  obj2.y);
        return (obj1.rad + obj2.rad) * (obj1.rad + ob2.rad) > (obj1.x - obj2.x) * (obj1.x - ob2.x) + (obj1.y - ob2.y) * (obj1.y -  obj2.y);
    };
    
    return self;

});