var MongoClient = require('mongodb').MongoClient;
assert = require('assert');
var url = "mongodb://localhost:27017/";

var express = require('express');
var fs = require('fs');
app=express();
var $ = require('jquery');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mongodb = require('mongodb');

app.get('/Recetas',function(req, res){
	
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null,err);
	  var db = db.db("Cocina");
		var consulta = req.params.consulta;
		if (consulta == undefined || consulta == ""){
			var consulta_bd;
		}else{
			var consulta_bd = {$or:[{nombre: new RegExp('.*'+consulta+'.*')},{duracion: new RegExp('.*'+consulta+'.*')},{tipo: new RegExp('.*'+consulta+'.*')},{descripcion: new RegExp('.*'+consulta+'.*')}]}
		}
	  db.collection("Recetas").find(consulta_bd).toArray(function(err, result) {
			if (err) throw err;
		var lista = "";
		console.log(result);
		for (var i = 0; i < result.length; i++) {
			var id = result[i]['_id'];
			var item = '<li>'+result[i]['_id']+" "+result[i]['nombre']+'</li>';
			var edit = '<a class="btn btn-success" href="Recetas/editar/'+id+'">Editar</a>';
			var eliminar = '<a class="btn btn-primary" href="/Recetas/eliminar/'+id+'">Eliminar</a>';
			var itemlista = item+edit+eliminar;
			lista = lista + itemlista;
		}
		var body1 = "<div class='container'>";
		var body2 = "</div>";
		var form = "<form action='/Recetas' method='get'>\
		<input type='text' class='search_input' placeholder='Buscar...' name='consulta'>\
		<input type='submit' value='Buscar' class='btn btn-dark'>\
		<a href='/Recetas/crear' class='btn btn-primary' >Crear</a>\
		</form>"
		fs.readFile("inicio.html","utf8",(err,data)=>{
			if(err){
				console.log(err);
				return err;
			}else{
				res.send(data+body1+form+lista+body2);
			}
		});
  });
});
});

app.get('/Recetas/crear',function(req, res){
		fs.readFile("prueba.html","utf8",(err,data)=>{
			if(err){
				console.log(err);
				return err;
			}else{
				res.send(data);
			}
		});
});

app.post('/Recetas/crear',urlencodedParser,function(req,res){
		MongoClient.connect(url, function(err, db) {
			assert.equal(null,err);
			var db = db.db("Cocina");
			var myOBj = {nombre : req.body.nombre, duracion: req.body.nombre,tipo : req.body.tipo, descripcion: req.body.descripcion};
			db.collection("Recetas").insertOne(myOBj,function(err,res){
				if(err)throw err;
				console.log("Yaiza no confia en nosotros");
			});
			res.redirect("/Recetas");
		});
});

app.get('/Recetas/eliminar/:_id',function(req,res){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null,err);
		var db = db.db("Cocina");
		var myOBj = req.params._id;
		db.collection("Recetas").deleteOne({_id: new mongodb.ObjectID(myOBj)});
		res.redirect("/Recetas");
	});
})

app.post('/Recetas/editar/:_id',urlencodedParser,function(req,res){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null,err);
		var db = db.db("Cocina");
		var idEdit = req.params._id;
		db.collection('Recetas').updateOne({_id: new mongodb.ObjectID(idEdit)},
		{$set: {"nombre":String(req.body.nombre),"duracion":String(req.body.duracion) ,
		"tipo":String(req.body.tipo) ,"descripcion":String(req.body.descripcion)}},function (err,result){
			if (err) throw err;
			console.log("Jordi no confiaba en nosotros");
		});
		res.redirect("/Recetas");
	});
})


app.get('/Recetas/editar/:_id',function(req, res){
	
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null,err);
	  var db = db.db("Cocina");
		var idEdit = req.params._id;
	  db.collection("Recetas").findOne({_id: new mongodb.ObjectID(idEdit)},function(err, result) {
			if (err) throw err;
			var form ='<div class="container">\
					<form action="/Recetas/editar/'+idEdit+'" method="post">\
					<label class="badge badge-info" for="nombre">Nombre</label><br>\
					<input class="form-control" type="text" name="nombre" value="'+result["nombre"]+'"><br>\
					<label class="badge badge-info" for="duracion">Duracion</label><br>\
					<input class="form-control" type="text" name="duracion" value="'+result["duracion"]+'"><br>\
					<label class="badge badge-info" for="tipo">Tipo</label><br>\
					<input class="form-control" type="text" name="tipo" value="'+result["tipo"]+'"><br>\
					<label class="badge badge-info" for="descripcion">Descripcion</label><br>\
					<input class="form-control" type="text" name="descripcion" value="'+result["descripcion"]+'"><br>\
					<input class="btn btn-primary" type="submit" value="Editar">\
			</form>\
			</div>\
			</body>';
			fs.readFile("inicio.html","utf8",(err,data)=>{
				if(err){
					console.log(err);
					return err;
				}else{
					res.send(data+form);
				};
			});
  });
});
});



app.get('/Recetas/editar/:_id',function(req, res){
	
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null,err);
	  var db = db.db("Cocina");
		var idEdit = req.params._id;
	  db.collection("Recetas").findOne({_id: new mongodb.ObjectID(idEdit)},function(err, result) {
			if (err) throw err;
			fs.readFile("inicio.html","utf8",(err,data)=>{
				if(err){
					console.log(err);
					return err;
				}else{
					res.send(data+form);
				};
			});
  });
});
});




app.use(function(req, res){
	res.sendStatus(404);
});
var server = app.listen(3000, function(){
	var port = server.address().port;
	console.log('Express server listening on port %s',port)
});
