loadImag = function () {
	var imageObj = new Image();
	imageObj.src = imageAddress[imageId];
	imageObj.onload = function () {
		if (iamgeObj.complete == true) {
			imageStart.push(imageObj);
			imageId++;
			if (imageId < imageAddress.length) {
				loadImag();
			}
			if (imageId == imageAddress.length) {
				return;
			}
		}
	}
}
var object = function (params) {
	this.x = params.x;
	this.y = params.y;
	this.w = this.w;
	this.h = this.h;
	this.vx = params.vx
	this.vy = params.vy;
};
var Dog = function object();
Dog.prototype = new object();
var bird1 = new Dog();
console.dir(bird);