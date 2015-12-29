var express = require('express');
var router = express.Router();
var mqlight = require('mqlight');
var recvClient;

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

router.post('/receive', function(req, res, next) {
	var dataReceived = "";
	var service = req.body.inReceiveUrl;
	var topic = req.body.inReceiveTopic;
	console.log("inpit param: " + service + " " + topic);
	
	recvClient = mqlight.createClient({service: service});
	recvClient.on('started', function() {
	    recvClient.subscribe(topic);

	    recvClient.on('message', function(data, delivery) {
	        console.log("Message received: " + data);
	        dataReceived = dataReceived + data + "\r";
	        //res.send({received: data});
	    });
	    
	    // wait 5s to receive messages: 
	    setTimeout(function() {
	    	recvClient.unsubscribe(topic);
	    	 if (dataReceived === "") {
	    	     console.log("no message received in 5s");
	    	     res.send({received: "no message received in 5s"});
	    	 } else{
	    		 res.send({received: dataReceived});
	    	 }
	    }, 5000);

	   
	});
});

module.exports = router;
