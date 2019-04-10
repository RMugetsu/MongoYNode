
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID; // objecte necessari pel find_peli_id


var url = "mongodb://localhost:27017/";

var llista_pelis1991_comencinT = function(dbo){
  // Equivalent a fer : db.getCollection('movies').find({year:1991, title:/^T/},{title:1, year:1})
  // http://mongodb.github.io/node-mongodb-native/3.0/api/Collection.html#find
   
  dbo.collection("movies").find({year:1991, title:/^T/}, {projection: { _id:0, title:1, year:1}}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    
  });
  console.log("a) Fet!"); console.log("");
  
}

var llista_pelis1991_comencinT_alfabeticament_ascendent =  function(dbo){

  var sort_title_desc = { title: -1 };

  dbo.collection("movies").find({year:1991, title:/^T/}, {projection: { _id:0, title:1, year:1}}).sort(sort_title_desc).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);

    console.log("b) Fet!"); console.log("");
    
    
  });
} 

var find_peli_id =  function(dbo, id){

  dbo.collection("movies").find( {"_id": ObjectId(id)} ).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);

    console.log("c) Fet!"); console.log("");
   
  });
}

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("db_video");
  
  console.log("a) Llista pelis del 1991 i comencin per T");
  llista_pelis1991_comencinT(dbo);

  console.log("b) idem, pero descendent"); 
  llista_pelis1991_comencinT_alfabeticament_ascendent(dbo);

  var id = "56929df324de1e0ce2dfce6c";
  find_peli_id(dbo, id);

  console.log("OBS) .. i per cert, per que es mostren abans aquestes tres línies (a,b) abans que els resultats? TIP: Callback functions! ");
  console.log("");
  db.close();

});
