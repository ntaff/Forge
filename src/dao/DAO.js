// Connection to DataBase
module.exports = {
    DAO: function(bdd_name) {
        return new Promise(resolve => {
            setTimeout(() => {
                var MongoClient = require('mongodb').MongoClient;
                var uri = "mongodb+srv://Nicolas:Nicolas@forge-kmw2f.gcp.mongodb.net/test?retryWrites=true";
                var client = new MongoClient(uri, { useNewUrlParser: true });

                client.connect(err => {
                    // "Macdonald's" or "Burger King's"
                    var bdd = client.db("Forge").collection(bdd_name);
                    console.log("Connection to MongoDB Atlas DataBase Forge succefull for " + bdd_name);
                    resolve([bdd,client]);
                });
            }, 1000);
        });
    },

    AllTable: async function(bdd_name) {
        var bdd_client = await module.exports.DAO(bdd_name);
        var bdd = bdd_client[0];
        var client = bdd_client[1];
        var query = {};
        const cursor = await bdd.find(query);

        var tab = [];
        var result = "";

        while(await cursor.hasNext())
        {
          const doc = await cursor.next();
          // String with Longitude,Latitude
          result+= doc.Longitude + "," + doc.Latitude + ",";
          // Object with Longitude: , Latitude:
          tab.push({Name: bdd_name, Longitude: doc.Longitude, Latitude: doc.Latitude});
        }
        // Deleting the last ',' from the String
        result.slice(0,-1);


        // Do not forget to close the connection
        client.close();

        //console.log(tab);

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(tab);
                });
            }, 0);
    },

    AllObesity: async function(bdd_name) {
        var bdd_client = await module.exports.DAO(bdd_name);
        var bdd = bdd_client[0];
        var client = bdd_client[1];
        var query = {};
        const cursor = await bdd.find(query);

        var tab = [];
        var result = "";

        while(await cursor.hasNext())
        {
          const doc = await cursor.next();
          // String with Longitude,Latitude
          result+= doc.State + "," + doc.Value + ",";
          // Object with Longitude: , Latitude:
          tab.push({State: doc.State, Value: doc.Value});
        }
        // Deleting the last ',' from the String
        result.slice(0,-1);

        // Do not forget to close the connection
        client.close();

        //console.log(tab);

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(tab);
                });
            }, 0);
    },

    AllFastFoodNumber: async function(bdd_name) {
        var bdd_client = await module.exports.DAO(bdd_name);
        var bdd = bdd_client[0];
        var client = bdd_client[1];
        var query = {};
        const cursor = await bdd.find(query);

        var tab = [];
        var result = "";

        while(await cursor.hasNext())
        {
          const doc = await cursor.next();
          // String with Longitude,Latitude
          result+= doc.State + "," + doc.Quantity + ",";
          // Object with Longitude: , Latitude:
          tab.push({State: doc.State, Quantity: doc.Quantity});
        }
        // Deleting the last ',' from the String
        result.slice(0,-1);

        // Do not forget to close the connection
        client.close();

        //console.log(tab);

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(tab);
                });
            }, 0);
    },

    ModificationPoint: async function(bdd_name, lat, lng, fastfoodType) {
        var bdd_client = await module.exports.DAO(bdd_name);
        var bdd = bdd_client[0];
        var client = bdd_client[1];
        var query = { $or: [{Latitude: lat}, {Longitude: lng}] };
        const cursor = await bdd.deleteOne(query);
        // Do not forget to close the connection
        client.close();
        console.log("Enregistrement supprimé : " + cursor.deletedCount);

        bdd_client = await module.exports.DAO(fastfoodType);
        bdd = bdd_client[0];
        client = bdd_client[1];
        query = { Latitude: lat, Longitude: lng };
        const cursor2 = await bdd.insertOne(query);
        // Do not forget to close the connection
        client.close();
        console.log("Enregistrement ajouté : " + cursor2);
        var end = "end";

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(end);
                });
            }, 0);
    },

    DeletePoint: async function(bdd_name, lat, lng) {
      var bdd_client = await module.exports.DAO(bdd_name);
      var bdd = bdd_client[0];
      var client = bdd_client[1];
      var query = { $or: [{Latitude: lat}, {Longitude: lng}] };
      const cursor = await bdd.deleteOne(query);
      // Do not forget to close the connection
      client.close();
      console.log("Enregistrement supprimé : " + cursor.deletedCount);
      var end = "end";

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(end);
                });
            }, 0);
    },

    AddPoint: async function(bdd_name, lat, lng) {
        var bdd_client = await module.exports.DAO(bdd_name);
        bdd = bdd_client[0];
        client = bdd_client[1];
        query = { Latitude: lat, Longitude: lng };
        const cursor = await bdd.insertOne(query);
        // Do not forget to close the connection
        client.close();
        console.log("Enregistrement ajouté : " + cursor);
        var end = "end";

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(end);
                });
            }, 0);
    },

    // Test method for DAO
    Test: async function() {
        var mc = await module.exports.AllTable("Macdonald's");
        var bk = await module.exports.AllTable("Burger King's");
        console.log(mc);
        console.log(bk);
    }
}


// module.exports.Test();
