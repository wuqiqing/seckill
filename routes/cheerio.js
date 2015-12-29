var express = require('express');
var router = express.Router();
var http = require('http');
var cheerio = require('cheerio');

var url = "http://www.echojs.com/";

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
	http.get(url, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			callback(data);
		});
	}).on("error", function() {
		callback(null);
	});
}

router.get('/', function(req, res, next) {
	var output = '';
	download(url, function(data) {
		if (data) {
			console.log("----------------------raw----------------------");
			console.log(data);
			
			var $ = cheerio.load(data);
			$("article").each(
					function(i, e) {
						var link = $(e).find("h2>a");
						var poster = $(e).find("username").text();
						output = output + poster + ": [" + link.html() + "](" + link.attr("href") + ")\n";
					});
			
			console.log("----------------------extracted----------------------");
			console.log(output);
		}
	});
	
	res.render('cheerio', { title: 'cheerio' });
	
});

module.exports = router;
