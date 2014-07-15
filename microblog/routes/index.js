
/*
 * GET home page.
 */
var User = require('../models/user.js');
var crypto = require('crypto');
var Post = require('../models/post.js');

exports.index = function (req, res) {
	Post.get(null, function (err, posts) {
		if (err) {
			posts = [];

		}
		res.render('index', {
			title: 'index', 
			posts: posts, 
			user: req.session.user, 
			success: req.flash('sucess').toString(),
			error: req.flash('error').toString()
		});
	});
};

exports.user = function (req, res) {
	User.get(req.params.user, function (err, user) {
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/');
		}
		Post.get(user.name, function (err, posts) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('user', {
				tittle: user.name,
				posts: posts,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString();
			});
		});
	});
};

exports.posts = function (req, res) {
	var currentUser = req.session.user;
	var post = new Post(currentUser.name, req.body.post);

	post.save(function (err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '发表成功');
		res.redirect('/u/' + currentUser.name);
	});
};

exports.reg = function (req, res) {
	res.render('reg', {
		title: 'register', 
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
}

exports.doReg = function (req, res) {

	// check password
	if (req.body['password-repeat'] != req.body['password']) {
		req.flash('error', '两次输入密码不一样');
		return res.redirect('/reg');
	}

	// 生成md5的密码
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	var newUser = new User({
		password: password,
		name: req.body.username
	});

	// 检查用户名是否已经存在
	User.get(newUser.name, function (err, user) {
		if (user) {
			err = 'Username already exists.';
		}
		if (err) {
			err.flash('error', err);
			return res.redirect('/reg');
		}

		// 如果不存在
		newUser.save(function (err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success', '注册成功');
			res.redirect('/');
		});
	});
}

exports.login = function(req, res) {
	res.render('login', {
		title: '用户登录',
		user : req.session.user,
		success : req.flash('success').toString(),
		error : req.flash('error').toString()
    });
};

exports.doLogin = function(req, res) {
	//生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    
	User.get(req.body.username, function(err, user) {
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/login');
		}
		if (user.password != password) {
			req.flash('error', '密码错误');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', '登录成功');
		res.redirect('/');
	});
};

exports.logout = function(req, res) {
	req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
};
/*module.exports = function (app) {
	app.get('/', function (req, res) {
		res.render('index', {
			title: 'for zhao meng'
		});
	});

	app.get('/reg', function (req, res) {
		res.render('reg', {
			title: 'user register'
		});
	});

	app.post('/reg', function(req, res) {
		if (req.body['password-repeat'] != req.body['password']) {
			req.flash('error', 'the password is not same');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5');
		var password = mdt.update(req.body.password).digest('base64');

		var newUser = new User({
			name: req.body.username,
			password: password,
		});

		User.get(newUser.name, function (err, user) {
			if (user) {
				err = 'Username already exists.';
			}
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}

			// 如果不存在新的用户
			newUser.save(function (err) {
				if (err) {
					req.flash('error', err);
					return res.redirect('/reg');
				}
				req.session.user = newUser;
				req.flash('success', 'register successfully');
				res.redirect('/');
			});
		});
	});
}
*/