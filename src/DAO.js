// Global Variable
var burgerKing = {};
var macdonald;

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
            }, 0);
        });
    },

    Macdonald: async function() {
        var bdd = await module.exports.DAO("Macdonald's");
        var macdonald = bdd[0];
        var client = bdd[1];
        var query = {};
        const cursor = macdonald.find(query);

        var tab = [];

        while(await cursor.hasNext())
        {
          const doc = await cursor.next();
          tab.push({Longitude: doc.Longitude, Latitude: doc.Latitude});
        }

        // Do not forget to close the connection
        client.close();

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(tab);
                });
            }, 0);
    },

    BurgerKing: async function() {
        var bdd = await module.exports.DAO("Burger King's");
        var burgerKing = bdd[0];
        var client = bdd[1];
        var query = {};
        const cursor = await burgerKing.find(query);

        var tab = [];

        while(await cursor.hasNext())
        {
          const doc = await cursor.next();
          tab.push({Longitude: doc.Longitude, Latitude: doc.Latitude});
        }

        // Do not forget to close the connection
        client.close();

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(tab);
                });
            }, 0);
    },

    Test: async function() {
        var mc = await module.exports.Macdonald();
        var bk = await module.exports.BurgerKing();
        console.log(mc);
        console.log(bk);
    }
}

// module.exports.Test();
