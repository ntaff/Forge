/*var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, resp){
  // Print the name of the file for which request is made.
  console.log("Request for demo file received.");
  fs.readFile("./Forge-master/src/index.html",function(error, data){
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


server.use("/css", express.static(__dirname + '/css'));
server.use("/images", express.static(__dirname + '/images'));
server.use("/js", express.static(__dirname + '/js'));

// viewed at http://localhost:8080
server.get('/', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '')});
});




//server.listen(8080);

server.listen(8080, '127.0.0.1');

console.log('Server running at http://127.0.0.1:8080/');


// http://127.0.0.1:8080
// http://localhost:8080
// $ npm install express --save
