// Recorda a tenir ben restaurat la bbdd de video
//   mongorestore -d db_video "./dump/video"


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("db_video");

  dbo.collection("movies").find({year:1991, title:/^T/}).toArray(function(err, result) {
  
    if (err) throw err;

    result.forEach(function(peli) {
            console.log(peli.title);
    });

    db.close();
  });

});
