var express = require('express');
var mongorito = require('mongorito');
var jade = require('jade');
var fs = require('fs');

var models = require('./models');

var config = {
	"mongoUri":   "mongo://127.0.0.1:27017/om",
	"listenPort": 3000	
};

/**
 * Load config.json file if exists
 */

if (fs.existsSync(__dirname + '/config.json')) {
	console.log('Using config file');
	config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
}

mongorito.connect([config.mongoUri]);

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
			res.render('index.jade', {"items": docs, "count": docs.length})
		}	
	})
});

/**
 * The following is just a common RESTful implementation
 */

app.get('/documents', function(req, res){
	var page = (req.param('page') || 1) - 1;

	models.Document.find({
		limit: 20,
		skip: page * 20
	}, function(err, docs) {
		console.log(docs.length);
		res.json(docs);
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
			res.json(doc);
		} else {
			console.log('error');
		}
	});
	
});

app.put('/documents/:id', function(req, res) {
	models.Document.find({
		'_id': req.param('id')
	}, function(err, doc) {
		if (doc) {
			doc.updateAttributes(req.body);
			doc.save();
			res.json(doc);
		} else {
			console.log('error');
		}
	});
});

app.delete('/documents/:id', function(req, res) {
	models.Document.find({
		'_id': req.param('id')
	}, function(err, doc) {
		console.log('removing ' + req.param('id'));
		if (!doc) {
			res.status(404);
			res.json({success: false});
		} else {
			doc.remove(function(err){});
			res.json({success: true});
			res.end();
		}
	})
})

app.post('/documents', function(req, res){
	var doc = new models.Document();
	doc.updateAttributes(req.body);

	doc.save(function(err, attrs) {
		console.log(attrs);
	});
	if (req.xhr) {
		res.json(doc);
	} else {
		res.redirect('/');		
	}
});

app.listen(config.listenPort);
console.log('App listening on port '+ config.listenPort)