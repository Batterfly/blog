var canvas;
var context;
var stageWidth = 1024;
var stageHeight = 768;
var displayObjectList = new Array();

$(document).ready(function () {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
});
function Stage2D () {
    this.init = function () {
        setTimeout(paint, 0);
    };
    this.addChild = function (child) {
        if (indexOf(child) === -1) {
            displayObjectList.push(child);
        }else {
            displayObjectList.splice(indexOf(child), 1);
            displayObjectList.push(child);
        }
    };
    this.removeChild = function (child) {
        if (indexOf(child) != -1) {
            displayObjectList.splice(indexOf(child), 1);
        }
    };
};
var displayObjectList = new Array();
function indexOf(object) {
    for (var i = 0; i < displayObjectList.length; i++) {
        if (displayObjectList[i] == object) {
            return i;
        } else {
            return -1;
        }
    }
};
function paint () {
    context.clearRect(0, 0, stageWidth, stageHeight);
    context.globalAlpha = 1;
    for (var i = 0; i < displayObjectList.length; i++) {
        displayObjectList[i].paint();
    }
    setTimeout(paint, 0);
}

function MoviceClip2D(img, data) {
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.visible = true;
    this.alpha = 1;
    this.paint = function () {
        if (this.visible) {
            context.save();
            context.globalAlpha = this.alpha;
            context.translate(this.x, this.y);
            context.rotate(this.rotation * Math.PI / 180);
            context.scale(this.scaleX, this.scaleY);
            context.drawImage(img, 0, 0, img.width, img.height, -img.width / 2, -img.height/ 2, img.width, img.height);
            context.restore();
        }
    }
}