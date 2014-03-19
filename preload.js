define (function (require, exports, module) {
    exports.preLoad = function(imglist, callback) {
        if (isArray(imglist)) {
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
    };
});