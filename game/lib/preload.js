define (function (require, exports, module) {

    var util = require('./util');
    /*exports.preLoad = function(imglist, callback) {
        if (util.isArray(imglist)) {
            var imgLen = imglist.length;
            var loadedImg = 1;
            for (var i = 0; i < imgLen; i++) {
                var img = new Image();
                img.src = imglist[i];

                // 判断是否在缓存中
                if (img.complete || img.width) {
                    loadedImg += 1;

                    if(loadedImg == imgLen) {
                        callback(imglist);
                        return;
                    }
                    continue;

                } else {
                    img.onload = function () {

                        img.onload = null;  // 释放内存
                        loadedImg += 1;
                        if(loadedImg == imgLen) {
                            callback(imglist);
                            return;
                        }
                    }
                }
                
            }
        }
        else {
            var img = new Image();
            img.src = imglist;
            img.onload = function () {
                callback(imglist);
            }
            return;
        }
    };*/
    var ImageLoad = function (arr, callback) {
        if (!arr) return;
        var result = [];
        var loadedNum = 0;
        for (var i = 0, len = arr.length; i < len; i++) {
            var obj = arr[i];
            var img = new Image();
            img.src = obj.url;

            if (img.complete || img.width) {
                loadedNum += 1;
                result[obj.id] = img;
                if (loadedNum == len) {
                    callback(result);
                    return result;
                }
                continue;
            } 
            else {
                img.onload = function () {
                    result[obj.id] = img;
                    img.onload = null;
                    loadedNum += 1;
                    if (loadedNum == len) {
                        callback(result);
                        return result;
                    }
                }
            }
            
        }

    };

    var AudioLoad = function (obj) {
        if (!arr) return;
        var result = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            var obj = arr[i];
            var aud = new Audio();
            aud.src = obj.url;

            aud.onload = function () {
                result[obj.id] = aud;
                aud.onload = null;
            }
            
        }

        callback(result);
        return result;
    };

    return {
        ImageLoad : ImageLoad, 
        AudioLoad : AudioLoad
    };
});