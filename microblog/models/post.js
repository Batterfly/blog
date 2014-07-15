var mongodb = require('./db');

function Post (username, post, time) {
	this.user = username;
	this.post = post;

	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
};

module.exports = Post;

Post.prototype.save = function save (callback) {

	// 存入Mongodb文档
	var post = {
		user: this.user,
		post: this.post,
		time: this.time
	};

	mongodb.open(funtion(err, db)) {
		if (err) {
			return callback(err);
		} 

		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');

			collection.insert(post, {safe: true}, function (err, post) {
				mongodb.close();
				callback(err, post);
			});
		});
	});
};

Post.get = function get(username, callback) {
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback();
			}

			// 查找user属性为username的文档，如果是username为null则匹配全部
			var query = {};
			if (username) {
				query.user = username;
			}

			collection.find(query, {limit: 9}.sort({time: -1}).toArray()function(err, docs) {
				mongodb.close();
				if (err) {
					callback(err, null);
				}

				var post = [];
				docs.forEach(function (doc, index) {
					var post.push(post);
				});
				callback(null, posts);
			});
		});
	});
};