var burgerKing;
var macdonald;

// Conncetion to DataBase
export function DAO()
{
    const MongoClient = require('mongodb').MongoClient;
    // Replace user and <password>
    const uri = "mongodb+srv://Nicolas:Nicolas@forge-kmw2f.gcp.mongodb.net/test?retryWrites=true";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect(err => {
      const bk = client.db("Forge").collection("Burger King's");
      const mc = client.db("Forge").collection("Macdonald's");
      console.log("Connection to MongoDB Atlas DataBase Forge succefull");
      client.close();
      return bk;
    });
}


// Queries to DataBase
function Macdonald()
{
    var query = {};
    const cursor = macdonald.find(query);
    cursor.each(function(err, item)
    {
        if(item != null)
        {
          console.log(item);
        }
    });
}


function BurgerKing()
{
    var query = {};
    const cursor = burgerKing.find(query);
    cursor.each(function(err, item)
    {
        if(item != null)
        {
          console.log(item);
        }
    });
}

async function Test()
{
  burgerKing = await DAO();
  //BurgerKing();
  console.log(burgerKing);
}

Test();
