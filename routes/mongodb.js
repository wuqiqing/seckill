var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var myDB;
var myCollection;

router.get('/', function(req, res, next) {
	res.render('mongodb', {
		title : 'Mongodb'
	});
	console.log('[GET]  /           - end of processing');
});

router.post('/connect', function(req, res, next) {
	var inUrl = req.body.inUrl;
	myCollection = req.body.inCollection;
	var inputParam = inUrl + " " + myCollection;
	console.log("input param: " + inputParam);

	MongoClient.connect(inUrl, function(err, db) {
		assert.equal(null, err);
		myDB = db; // save the connected db as a global var
		console.log("mongodb connected!");
		res.send({status: "Connected!"});
		// db.close();
	});
});

router.post('/disconnect', function(req, res, next) {
	myDB.close(function () {
		console.log("mongodb closed!");
		res.send({status: "Disconnected!"});
	});
});

router.post('/findall', function(req, res, next) {
	var findRestaurants = function(db, callback) {
		var cursor = db.collection(myCollection).find();
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc !== null) {
				console.log(doc);
				res.send(doc);
			} else {
				callback();
			}
		});
	};

	if (myDB === null) {
		res.send("Not connected to DB. Connect first!");
	} else {
		findRestaurants(myDB, function() {
			//myDB.close();
		});
	}

	console.log('[POST] / FINDALL   - end of processing');
});

router.post('/findid', function(req, res, next) {
	var inId = new mongo.ObjectID(req.body._id);
	console.log("input param: " + inId);
	var findRestaurants = function(db, callback) {
		var cursor = db.collection(myCollection).find( { "_id" : inId } );
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc !== null) {
				console.log(doc);
				res.send(doc);
			} else {
				callback();
			}
		});
	};

	if (myDB === null) {
		res.send("Not connected to DB. Connect first!");
	} else {
		findRestaurants(myDB, function() {
			//myDB.close();
		});
	}

	console.log('[POST] / FINDID   - end of processing');
});

module.exports = router;
