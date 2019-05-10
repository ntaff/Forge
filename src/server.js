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

async function Db_ressources_mcdo() { bdd.setPoints(await dao.AllTable("Macdonald's")); }
async function Db_ressources_bk() { bdd.setPoints(await dao.AllTable("Burger King's")); }
//async function Db_ressources_mcdoeu() { bdd.setPoints(await dao.AllTable("Macdonald's Europe")); }
async function Db_ressources_tim() { bdd.setPoints(await dao.AllTable("Tim Horton's")); }
async function Db_ressources_obusa() { ob.setPoints(await dao.AllObesity("Obesity USA")); }
async function Db_ressources_nbff() { ff.setPoints(await dao.AllFastFoodNumber("State's Fast Food")); }
async function Db_ressources_timstate() { fftm.setPoints(await dao.AllFastFoodNumber("Tim Horton per State")); }
async function Db_ressources_habstate() { ffinhabitants.setPoints(await dao.AllFastFoodNumber("Inhabitants per State")); }
async function Db_ressources_obca() { obCA.setPoints(await dao.AllFastFoodNumber("ObesityCanada")); }

async function Db_ressources()
{
  Db_ressources_mcdo();
  Db_ressources_bk();
  //Db_ressources_mcdoeu();
  Db_ressources_tim();
  Db_ressources_obusa();
  Db_ressources_nbff();
  Db_ressources_timstate();
  Db_ressources_habstate();
  Db_ressources_obca();
}

async function Index_ressources()
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
}

async function run()
{
    Index_ressources();

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
    server.get('*', function(req, res){
      res.render('404.html');
    });
    server.listen(process.env.PORT || port, address, function() {
        console.log('Listening to port:  ' + port);
    });

    // Post requests from view
    server.post('/engine.html', async function(req, res){
      // var points = req.body.enseignes;
      // console.log(req.body.lat);
      // console.log(req.body.lng);
      switch (req.body.type)
      {
        case "change":
          await dao.ModificationPoint(req.body.oldFastfood,req.body.lat,req.body.lng,req.body.newFastfood);
          break;
        case "delete":
          await dao.DeletePoint(req.body.oldFastfood,req.body.lat,req.body.lng);
          break;
        case "add":
          await dao.AddPoint(req.body.newFastfood,req.body.lat,req.body.lng);
          break;
        default: // Nothing
      }
      bdd = new Points();
      ob = new Points();
      ff = new Points();
      fftm = new Points();
      ffinhabitants = new Points();
      obCA = new Points();
      await Db_ressources();
      server.get('/bdd', async function(req, res){
        res.send(bdd.listPoints);
        res.status(204).send();
      });
    });
}

Db_ressources();
run();
