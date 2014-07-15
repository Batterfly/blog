var http = require('http');
var url = require('url');
var fs = require('fs');
var mine = require('./mine').types;
var path = require('path');

var server = http.createServer(function (req, res) {
	var pathname = url.parse(req.url).pathname;
	var realPath = path.join('.', pathname);
	console.log(req.url, pathname, realPath);

	var ext = path.extname(realPath);
	ext = ext ? ext.slice(1) : 'unknown';

	fs.exists(realPath, function (exists) {
		console.dir(exists, ext);
		if (!exists) {
			res.writeHead(404, {
				'Content-Type' : 'text/plain'
			});
			res.write('this request URL ' + pathname + ' was not found');
			res.end();
		} else {
			fs.readFile(realPath, 'binary', function (err, file) {
				if (err) {
					respose.writeHead(500, {
						'Content-Type' : 'text/plain'
					});
					res.end(err);
				} else {
					var contentType = mine[ext] || 'text/plain';
					res.writeHead(200, {
						'Content-Type' : contentType
					});
					res.write(file, 'binary');
					res.end();
				}
			});
		}
	});
}).listen(3000);
console.log('server running at port: 3000');