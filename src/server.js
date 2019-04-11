const express = require('express');
const server = express();
const dao = require('./dao/DAO.js');
const Points = require('./dao/Points.js');
const port = 3000;
const address = "0.0.0.0";

server.use("/css", express.static(__dirname + '/css'));
server.use("/images", express.static(__dirname + '/images'));
server.use("/js", express.static(__dirname + '/js'));
server.use("/dao", express.static(__dirname + '/dao'));

server.engine('html', require('atpl').__express);
server.set('devel', false);
server.set('view engine', 'html');
server.set('view cache', false);
server.set('views', __dirname);


async function Db_ressources()
{
    let bdd = new Points();
    bdd.setPoints(await dao.AllTable("Macdonald's"));
    bdd.setPoints(await dao.AllTable("Burger King's"));
    bdd.setPoints(await dao.AllTable("Macdonald's Europe"));
    bdd.setPoints(await dao.AllTable("Tim Horton's"));

    var ob = new Points();
    ob.setPoints(await dao.AllObesity("Obesity USA"));

    var ff = new Points();
    ff.setPoints(await dao.AllFastFoodNumber("State's Fast Food"));

    var fftm = new Points();
    fftm.setPoints(await dao.AllFastFoodNumber("Tim Horton per State"));

    // Index of ressources
    server.get('/bdd', async function(req, res){
      res.send(bdd.listPoints);
    });
    server.get('/ob', async function(req, res){
      res.send(ob.listPoints);
    });
    server.get('/ff', async function(req, res){
      res.send(ff.listPoints);
    });
    server.get('/fftm', async function(req, res){
      res.send(fftm.listPoints);
    });

}

function run()
{
    // Gestion of pages
    server.get('/', function(req, res){
      res.render('index.html');
    });
    server.get('/index.html', function(req, res){
      res.render('index.html');
    });
    server.get('/carte.html', function(req, res){
      res.render('carte.html');
    });
    server.get('/statistiques.html', function(req, res){
      res.render('statistiques.html');
    });
    server.get('/scriptchart_correlation.html', function(req, res){
      res.render('scriptchart_correlation.html');
    });
    server.listen(port, address, function() {
        console.log('Listening to port:  ' + port);
    });
}

Db_ressources();
run();
