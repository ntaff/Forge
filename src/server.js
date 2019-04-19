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
server.use("/geojson", express.static(__dirname + '/geojson'));

server.engine('html', require('atpl').__express);
server.set('devel', false);
server.set('view engine', 'html');
server.set('view cache', false);
server.set('views', __dirname);

var bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

let bdd = new Points();
var ob = new Points();
var ff = new Points();
var fftm = new Points();
var ffinhabitants = new Points();
var obCA = new Points();

async function Db_ressources()
{
    bdd.setPoints(await dao.AllTable("Macdonald's"));
    bdd.setPoints(await dao.AllTable("Burger King's"));
    bdd.setPoints(await dao.AllTable("Macdonald's Europe"));
    bdd.setPoints(await dao.AllTable("Tim Horton's"));
    ob.setPoints(await dao.AllObesity("Obesity USA"));
    ff.setPoints(await dao.AllFastFoodNumber("State's Fast Food"));
    fftm.setPoints(await dao.AllFastFoodNumber("Tim Horton per State"));
    ffinhabitants.setPoints(await dao.AllFastFoodNumber("Inhabitants per State"));
    obCA.setPoints(await dao.AllFastFoodNumber("ObesityCanada"));
}

async function run()
{
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
    server.get('/ffinhabitants', async function(req, res){
      res.send(ffinhabitants.listPoints);
    });
    server.get('/obCA', async function(req, res){
      res.send(obCA.listPoints);
    });

    // Gestion of pages
    server.get('/', function(req, res){
      res.render('index.html');
    });
    server.get('/index.html', function(req, res){
      res.render('index.html');
    });
    server.get('/engine.html', function(req, res){
      bdd.listPoints;
      res.render('engine.html');
    });
    server.get('/scriptchart_correlation.html', function(req, res){
      res.render('scriptchart_correlation.html');
    });
    server.listen(process.env.PORT || port, address, function() {
        console.log('Listening to port:  ' + port);
    });

    // Post requests from view
    server.post('/engine.html', function(req, res){
      // var points = req.body.enseignes;
      res.status(204).send();
    });
}

Db_ressources();
run();
