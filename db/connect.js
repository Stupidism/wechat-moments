var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/wechat-moments');

db.connection.on('error', error => {
	console.log('fail', error);
});

db.connection.on('open', () => {
	// console.log('success');
});
