const express = require('express');
const server = express();
const dao = require('./DAO.js');
const port = 3000;
const address = "0.0.0.0";

server.use("/css", express.static(__dirname + '/css'));
server.use("/images", express.static(__dirname + '/images'));
server.use("/js", express.static(__dirname + '/js'));
server.use(".././data", express.static(__dirname + '../data'));

server.engine('html', require('atpl').__express);
server.set('devel', false);
server.set('view engine', 'html');
server.set('view cache', false);
server.set('views', __dirname);


async function run()
{
    server.get('/', function(req, res){
      res.render('index.html', {message:"coucou"});
    });

    server.get('/index.html', function(req, res){
      res.render('index.html', {message:"coucou"});
    });

    var mc = await dao.AllTable("Macdonald's");
    var bk = await dao.AllTable("Burger King's");
    var mceu = await dao.AllTable("Macdonald's Europe");
    var ob = await dao.AllObesity("Obesity USA");
    var ffs = await dao.AllFastFoodNumber("State's Fast Food");

    // console.log(mc);
    // console.log(bk);

    server.get('/carte.html', function(req, res){
      // "{{ Variable }}" in html to display parameters sent to html page
      res.render('carte.html', {message:"coucou", macdonald: mc, burgerKing: bk, macdonaldeu: mceu});
    });

    server.get('/scriptchart_correlation.html', function(req, res){
      // "{{ Variable }}" in html to display parameters sent to html page
      res.render('scriptchart_correlation.html', {message:"coucou", Obesity: ob, FastFood: ffs});
    });

    server.listen(port, address, function() {
        console.log('Listening to port:  ' + port);
    });
}

run();
