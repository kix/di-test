var express = require('express');
var mongorito = require('mongorito');
var jade = require('jade');
var fs = require('fs');

var models = require('./models');

mongorito.connect(['mongo://127.0.0.1:27017/om']);

/*
for (var i = 60 - 1; i >= 0; i--) {
	var doc = new models.Document();
	doc.name = 'Name';
	doc.price = 1.49;
	doc.quantity = 3;

	doc.save(function(err){
	    console.log(err);
	});
};
*/
/*
var doc = new models.Document();
doc.name = 'Name';
doc.price = 'beaver';
doc.quantity = 3;

doc.save(function(err){
    console.log(err);
});


var doc = new models.Document();
doc.name = 'Name';
doc.price = 1.49;
doc.quantity = 3.3;

doc.save(function(err, values){
	console.log(values);
    console.log(err);
});

models.Document.find({}, function(err, docs) {
	console.log(docs);
});*/

var app = express.createServer();
app.set('view engine', 'jade');
app.set('view options', {layout: false});

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.logger({ format: ':method :url' }));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	template = jade.compile(fs.readFileSync(__dirname + '/views/index.jade'));

	models.Document.find({limit: 20}, function(err, docs) {
		if (docs) {
			res.render('index.jade', {"items": docs})
		}	
	})
});

app.get('/documents', function(req, res){
	var page = (req.param('page') || 1) - 1;

	models.Document.find({
		limit: 20,
		skip: page * 20
	}, function(err, docs) {
		console.log(docs.length);
		res.write(JSON.stringify(docs));
		res.end();
	})
});

app.get('/documents/:id', function(req, res) {
	console.log(req.param('id'));
	models.Document.find({
		'_id': req.param('id')
	}, function(err, doc) {
		if (doc) {
			console.log(doc);
			res.write(JSON.stringify(doc));
			res.end();
		} else {
			console.log('error');
		}
	});
	
});

app.put('/documents/:id', function(req, res) {

});

app.post('/documents', function(req, res){
	var doc = new models.Document();
	console.log(req.body);
	doc.updateAttributes(req.body);
	doc.save(function(err, attrs) {
		console.log(err, attrs);
		// console.log(doc)
	});
	res.end();
});

app.listen(3000);