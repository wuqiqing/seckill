var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

//create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: 'wangxiaoniu626@gmail.com',
        pass: 'xid78xBcGFm'
    }
});

//setup e-mail data with unicode symbols
var mailOptions = {
	to : '',        // list of receivers
	subject : '',   // Subject line
	text : '',      // plaintext body
};

router.get('/', function(req, res, next) {
	res.render('nodemailer', {
		title : 'nodemailer'
	});
	console.log('[GET]  /           - end of processing');
});

router.post('/send', function(req, res, next) {
	mailOptions.to = req.body.inTo;
	mailOptions.subject = req.body.inSubject;
	mailOptions.text = req.body.txtText;

	console.log('Sending mail ......');
	// send mail
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log('Message sent with error: ' + error);
			res.send({status: error});
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
		res.send({status: info.response});
	});
});

module.exports = router;