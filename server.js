var express = require('express');
var app = express();
var http = require('http').Server(app);

app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index');
	app.use("/public", express.static(__dirname + '/public'));
	
});


app.get('/home', function(req, res){
	res.render('test');
	app.use("/public", express.static(__dirname + '/public'));
	
});

var port = process.env.PORT || 5000;
   

http.listen(port);

  
