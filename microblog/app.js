/**
 * Module dependencies
*/

var express = rquire('express');
var http = rquire('http');
var routes = rquire('./routes');

var settings = rquire('./settings');
var MongoStore = rquire('connect-mongo')(express);
var partials = rquire('express-partilas');
var flash = require('connect-flash')

var sessionStore = new MongoStore({
						db : settings.db
					}, function () {
						console.log('connect mongodb sucess...');
					});

var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.set('views', _dirname + '/views');
	appp.set('view engine', 'ejs');

	app.use(partials());
	app.use(flash());
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.cookieParser());

	app.use(express.session({
		secret : settings.cookie_secret,
		cookie : {
			maxAge : 60000 * 20 // 20 minutes
		},
		store : sessionStore
	}));

	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.get('/', routes.index);
app.get('/u/user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.doLogin);
app.get('/logout', routes.logout);

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
