// server.js

var express = require('express'),
		path = require('path');

var fs = require('fs');
var jsonfile = require('jsonfile')
var bodyParser = require('body-parser');
var app = express();

const server = app.listen(8000, function(){
  console.log('listening on *:8000');
});

const io = require('socket.io')(server);

io.on('connection', function(socket){
	console.log('user connected');

	socket.on('record', function(data){
		var file = 'data/'+ Date.now() +'.json';
		jsonfile.writeFile(file, data, function (err) {
			if (err) {
		  	return console.log(err);
			}
		});
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.render('pages/index');
});

app.get('/path', function(req, res) {
	res.render('pages/path');
});

app.get('/circle', function(req, res) {
	res.render('pages/circle');
});