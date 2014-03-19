define(function (require, exports, module) {
    /*var canvas = function (id) {
        var self = {};
        if (document.getElementById(id).tagName == 'CANVAS') {
            self.canvas = document.getElementById(id);
            self.ctx = self.canvas.getContext('2d');
            self.width = self.canvas.width;
            self.height = self.canvas.height;
        }
        else {*/
        /*var canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.width = 600;
        canvas.height = 400;
        self.canvas = canvas;
        self.ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);*/
        /*}

        self.getArrt = function (key) {
            return self[key];
        };

        self.setArrt = function (key, value) {
            if (self[key]) {
                self[key] = value;
            }
            else {
                return;
            }
        };

        return self;
    };
*/
    return function (width, height) {
        var canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.width = width || 600;
        canvas.height = height || 400;
        canvas.ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);
        return canvas;
    }

});