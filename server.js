/*globals response qr:true*/
/*eslint-disable no-native-reassign */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql      = require('mysql');

const CONNECTION_DATA = {
	  host     : 'localhost',
	  user     : 'vudeouser',
	  password : 'videopass',
	  database : 'videosdb'
    };

function mysqlConnect(queryString, queryArray, callback) { 
   var connection = mysql.createConnection(CONNECTION_DATA);
   connection.connect();
   
   if (queryArray) {
   	    // insert
       connection.query(queryString, queryArray, callback);
   } else {
   	   // select
       connection.query(queryString, callback);	
   }
   
   connection.end();
}

app.set('view engine', 'ejs');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// creamos una url "/static" que va mostrar lo que hay en la carpeta "public"
app.use('/static', express.static('public'));

// creamos una url "/" que devuelve el contenido de "index.html"
app.get('/', function (req, res) {
	
   var listar;
   mysqlConnect('SELECT * from lista_videos', null, function(err, rows, fields) {
	  if (err) throw err;
	  listar = {listado : rows};
	  res.render('index', listar );
   });
   
   console.log(123);
 
});

// creamos una url "/process_post" de metodo "post" la cual recibe los datos del formulario
// y los coloca en la variable "response" para luego convertirlos en un string y devolverlos
app.post('/process_post', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   var listado;
   console.log(req.body);
   qr = {
      url: req.body.url,
      creador: req.body.personas,
      tema: req.body.temas,
      fecha: req.body.fechas
   };
   
   mysqlConnect('INSERT INTO lista_videos (url, creador, tema, fecha) values (?,?,?,?)',
                [qr.url, qr.creador, qr.tema, qr.fecha], function(err, rows) {
   					if (err) throw err	
   					res.redirect('/');
   				});	
});

app.get('/search', urlencodedParser, function (req, res) {
   var resultado;
   var texto = req.query.texto;
   mysqlConnect(`SELECT * FROM lista_videos WHERE creador LIKE "%${texto}%" OR url LIKE "%${texto}%"  OR tema LIKE "%${texto}%"`, null, function(err, rows, fields) {
	  if (err) throw err;
	  resultado = {listado : rows};
	  res.render('index', resultado );
   });
      
      
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port);  
});



