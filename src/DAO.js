// Connection to DataBase
module.exports = {
    DAO: function() {
        return new Promise(resolve => {
            setTimeout(() => {
                var MongoClient = require('mongodb').MongoClient;
                var uri = "mongodb+srv://Nicolas:Nicolas@forge-kmw2f.gcp.mongodb.net/test?retryWrites=true";
                var client = new MongoClient(uri, { useNewUrlParser: true });

                client.connect(err => {
                    var bk = client.db("Forge").collection("Burger King's");
                    var mc = client.db("Forge").collection("Macdonald's");

                    console.log("Connection to MongoDB Atlas DataBase Forge succefull");

                    client.close();
                    resolve(bk);
                });
            }, 0);
        });
    },

    Macdonald: function(macdonald) {
        var query = {};
        const cursor = macdonald.find(query);

        cursor.each(function(err, item) {
            if(item != null) {
              console.log(item);
            }
        });
    },

    BurgerKing: function(burgerKing) {
        var query = {};
        const cursor = burgerKing.find(query);

        cursor.each(function(err, item) {
            if(item != null) {
              console.log(item);
            }
        });
    },

    Test: async function() {
        var burgerKing = await module.exports.DAO();
        console.log(typeof burgerKing);
    }
}
