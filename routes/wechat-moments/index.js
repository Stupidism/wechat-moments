require('../../db/connect');
var Moment = require('../../db/moment');

var fs = require('fs');
var express = require('express');
var router = express.Router();

var { initNames, initHeadImgs } = require('./init');

var webRoot = 'http://192.168.1.3:8000/';

router.use('*', (req, res, next) => {
	var cookie = req.headers.cookie;
	var sessionId;
	if (/wechat-moments-session-id=[a-z0-9]{16}/.test(cookie)) {
		sessionId = /wechat-moments-session-id=([a-z0-9]{16})/.exec(cookie)[1];
		req.sessionId = sessionId;
	} else {
		sessionId = Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8);
		res.setHeader('set-cookie', 'wechat-moments-session-id=' + sessionId);
		req.sessionId = sessionId;
	}
	console.log(req.sessionId);
	next();
});

router.get('/get', (req, res) => {
	Moment.find({}, null, {sort: {'_id': -1}}, (err, docs) => {
		let contents = docs;
		Moment.findOne({sessionId: req.sessionId}, null, {sort: {'_id': -1}}, (err, docs) => {
			let name, headImg;

			if (docs && docs.name) {
				name = docs.name;
				if (docs.headImg) {
					headImg = docs.headImg;
				} else {
					headImg = initHeadImgs[Math.floor(Math.random() * initHeadImgs.length)];
					let moment = new Moment({
						publishTime: Date.now(),
						sessionId: req.sessionId,
						name: name,
						headImg: headImg
					});
					moment.save((err, doc) => {
						if (err) {
							console.log('error', err);
						} else {
							console.log('success', doc);
						}
					});
				}
			} else {
				name = initNames[Math.floor(Math.random() * initNames.length)];
				headImg = initHeadImgs[Math.floor(Math.random() * initHeadImgs.length)];
				let moment = new Moment({
					publishTime: Date.now(),
					sessionId: req.sessionId,
					name: name,
					headImg: headImg
				});
				moment.save((err, doc) => {
					if (err) {
						console.log('error', err);
					} else {
						console.log('success', doc);
					}
				});
			}

			let responseJson = {
				name: name,
				headImg: headImg,
				contents: contents,
				sessionId: req.sessionId
			};
			res.send(JSON.stringify(responseJson));
		});		
	});
});

router.post('/text', (req, res) => {
	Moment.findOne({sessionId: req.sessionId}, null, {sort: {'_id': -1}}, (err, docs) => {
		let name, headImg;
		if (docs && docs.name) {
			name = docs.name;
			if (docs.headImg) {
				headImg = docs.headImg;
			} else {
				headImg = initHeadImgs[Math.floor(Math.random() * initHeadImgs.length)];
			}			
		} else {
			name = initNames[Math.floor(Math.random() * initNames.length)];
			headImg = initHeadImgs[Math.floor(Math.random() * initHeadImgs.length)];
		}

		let moment = new Moment({
			publishTime: Date.now(),
			text: req.body.text,
			imgUrls: req.body.imgs,
			sessionId: req.sessionId,
			name: name,
			headImg: headImg
		});
		moment.save((err, doc) => {
			if (err) {
				console.log('error', err);
			} else {
				console.log('success', doc);
				res.send(doc.text);
			}
		});		
	});
});

router.post('/post-img', (req, res) => {
	var body = [];
	req.on('data', (chunk) => body.push(chunk));
	req.on('end', () => {
		body = Buffer.concat(body).toString();
		// console.log(body.length);
		body = body.replace(/^data:image\/\w+;base64,/, '');
		let randomFilename = Date.now() + Math.random().toString(36).substr(2, 8) + '.png';
		console.log(randomFilename);
		let bodyBuffer = new Buffer(body, 'base64');
		fs.writeFile(`./public/upload-img/${randomFilename}`, bodyBuffer, (e) => {
			if (e) {
				res.status(500).send('Something broke!');
			} else {
				res.send(`${webRoot}upload-img/${randomFilename}`);
			}
		});
	});
});

router.post('/zan', (req, res) => {
	// console.log(req.body);
	Moment.findOne({_id: req.body._id}, (err, doc) => {
		if (err) throw err;
		let zan = doc.zan;
		if (req.body.opera === 'insert') {
			zan.push({
				sessionId: req.body.sessionId,
				name: req.body.sessionName
			});
		} else {
			zan = zan.filter((item) => {
				return item.sessionId !== req.body.sessionId;
			});
		}
		Moment.findByIdAndUpdate(req.body._id, {zan: zan}, (err, doc) => {
			res.send('zan ok');
		})
	});	
});

module.exports = router;
