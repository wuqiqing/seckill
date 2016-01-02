var express = require('express');
var router = express.Router();
var mqlight = require('mqlight');
var recvClient;

// socket.io to update each msg received to the browser
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(4000);

io.on('connection', function(socket){
    console.log('a user connected');
    
    io.on('disconnect', function(){
        console.log('user disconnected');
    });
});

router.get('/', function(req, res, next) {
	res.render('mqlight', {
		title : 'MQ Light'
	});
	console.log('[GET]  /           - end of processing');
});

router.post('/send', function(req, res, next) {
	var service = req.body.inSendUrl;
	var topic = req.body.inSendTopic;
	var msg = req.body.inMsg;
	console.log("inpit param: " + service + " " + topic + " " + msg);
	
	var sendClient = mqlight.createClient({service: service});
	sendClient.on('started', function() {
	    sendClient.send(topic, msg);
	    console.log("message sent: " + msg);
	    res.send({status: msg});
	});
});

router.post('/subscribe', function(req, res, next) {
	var service = req.body.inReceiveUrl;
	var topic = req.body.inReceiveTopic;
	console.log("inpit param: " + service + " " + topic);
	
	recvClient = mqlight.createClient({service: service});
	recvClient.on('started', function() {
	    recvClient.subscribe(topic);
	    res.send({status: 'subscribed'});

	    recvClient.on('message', function(data, delivery) {
	        console.log("Message received: " + data);
	        io.emit(topic, data);
	    });
	   
	});
});

router.post('/unsubscribe', function(req, res, next) {
	var topic = req.body.inReceiveTopic;
	recvClient.unsubscribe(topic);
	res.send({status: 'unsubscribed'});
});

module.exports = router;
