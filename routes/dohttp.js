var express = require('express');
var router = express.Router();
var http = require('http');
var querystring = require('querystring');

router.get('/', function(req, res, next) {
  res.render('dohttp', { title: 'dohttp' });
});

router.post('/dopost', function(req, res, next) {
  var contents = querystring.stringify({
	  inUrl: 'mongodb://localhost:27017/test',
	  inCollection: 'restaurants'
  });
	
  console.log(contents);
  
  var options = {
		  host: 'localhost',
		  port: 3000,
		  path: '/mongodb/connect',
		  method: 'POST',
		  headers: {
			  'Host': 'localhost:3000',
			  'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0',
			  'Accept':'application/json, text/javascript, */*; q=0.01',
			  'Accept-Language':'en-US,en;q=0.5',
			  'Accept-Encoding': 'gzip, deflate',
			  'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
			  'X-Requested-With': 'XMLHttpRequest',
			  'Referer':'http://localhost:3000/mongodb',
			  'Content-Length':contents.length,
			  'Connection':'Keep-Alive', 
			  'Pragma':'no-cache',
			  'Cache-Control':'no-cache'
		  }
  };
  
  var newReq=http.request(options,function(newRes){
	  var data = '';
	  newRes.setEncoding('utf8');
	  
	  console.log('STATUS: ' + newRes.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(newRes.headers));
	  
	  newRes.on('data', function (chunk) {
		data = data + chunk;
	    console.log('BODY: ' + chunk);
	  });
	  
	  newRes.on('end', function() {
		console.log('Final data: ' + data);
		//res.sendStatus(newRes.statusCode);
		//res.send(data);
		res.send("-STATUS: \n"
				+ newRes.statusCode
				+ "\n"
				+ "-HEADERS: \n"
				+ JSON.stringify(newRes.headers)
				+ "\n"
				+ "-DATA: \n"
                + data				
				 );
	  });
  });
  
  newReq.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
  
  newReq.write(contents);
  newReq.end();
  
});


router.get('/doget', function(req, res, next) {
	  var options = {
			  host: 'localhost',
			  port: 3000,
			  path: '/mongodb',
			  method: 'GET',
			  headers: {
				  'Host': 'localhost:3000',
				  'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0',
				  'Accept':'application/json, text/javascript, */*; q=0.01',
				  'Accept-Language':'en-US,en;q=0.5',
				  'Accept-Encoding': 'gzip, deflate',
				  'Connection':'Keep-Alive'
			  }
	  };
	  
	  var newReq=http.request(options,function(newRes){
		  var data = '';
		  newRes.setEncoding('utf8');
		  
		  console.log('STATUS: ' + newRes.statusCode);
		  console.log('HEADERS: ' + JSON.stringify(newRes.headers));
		  
		  newRes.on('data', function (chunk) {
			data = data + chunk;
		    console.log('BODY: ' + chunk);
		  });
		  
		  newRes.on('end', function() {
			console.log('Final data: ' + data);
			res.send("-STATUS: \n"
					+ newRes.statusCode
					+ "\n"
					+ "-HEADERS: \n"
					+ JSON.stringify(newRes.headers)
					+ "\n"
					+ "-DATA: \n"
	                + data				
					 );
		  });
	  });
	  
	  newReq.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});
	  
	  newReq.end();
	  
	});

module.exports = router;

