/*var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, resp){
  // Print the name of the file for which request is made.
  console.log("Request for demo file received.");
  fs.readFile("index.html",function(error, data){
    if (error) {
      resp.writeHead(404);
      resp.write('Contents you are looking for-not found');
      resp.end();
    }  else {
      resp.writeHead(200, {
        'Content-Type': 'text/html'
      });
      resp.write(data.toString());
      resp.end();
    }
  });
});*/

var express = require('express');
var server = express();
var path = require('path');

// Access PATH to Static Ressources
server.use("/css", express.static(__dirname + '/css'));
server.use("/images", express.static(__dirname + '/images'));
server.use("/js", express.static(__dirname + '/js'));
server.use("", express.static(__dirname + ''));

server.get('/', function(req, res) {
    res.send({message: 'coucou'});
    res.sendFile('index.html', {root: path.join(__dirname)});
});

//server.listen(3000);
server.listen(3000, "0.0.0.0", function() {
    console.log('Listening to port:  ' + 3000);
});
