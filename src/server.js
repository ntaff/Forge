var express = require('express');
var server = express();
var cars = ["Saab", "Volvo", "BMW"];

server.use("/css", express.static(__dirname + '/css'));
server.use("/images", express.static(__dirname + '/images'));
server.use("/js", express.static(__dirname + '/js'));

server.engine('html', require('atpl').__express);
server.set('devel', false);
server.set('view engine', 'html');
server.set('view cache', true);
server.set('views', __dirname);

server.get('/', function(req, res){
  res.render('index.html', {message:"coucou", cars: cars});
});

server.get('/index.html', function(req, res){
  res.render('index.html', {message:"coucou", cars: cars});
});

server.get('/carte.html', function(req, res){
  res.render('carte.html', {message:"coucou"});
});

server.listen(3000, "0.0.0.0", function() {
    console.log('Listening to port:  ' + 3000);
