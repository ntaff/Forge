
const MongoClient = require('mongodb').MongoClient;
// Replace user and <password>
const uri = "mongodb+srv://<user>:<password>@forge-kmw2f.gcp.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("Forge").collection("Burger King's");
  var query = { Longitude: "-149.77812" };
  collection.find(query).toArray(function(err, result){
		if (err) throw err;
		console.log(result); 
	});
  client.close();
});
