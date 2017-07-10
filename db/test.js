require('./connect');

var Moment = require('./moment');


// var moment = new Moment({
// 	publishTime: Date.now(),
// 	text: '第三条朋友圈'
// });

// moment.save((err, doc) => {
// 	if (err) {
// 		console.log('error', err);
// 	} else {
// 		console.log('success', doc);
// 	}
// });


// Moment.find({sessionId: '5wgks2rd0tum2zk1'}, null, {limit: 1, sort: {'_id': -1}}, (err, docs) => {
// 	console.log(docs);
// });

// Moment.findOne({sessionId: '5wgks2rd0tum2zk2'}, null, {sort: {'_id': -1}}, (err, docs) => {
// 	console.log(docs.name);
// });

// Moment.findOne({_id: '5962c5818a6e12da404f6167'}, (err, doc) => {
// 	console.log(doc);
// });

Moment.findByIdAndUpdate('5962c5818a6e12da404f6167', {zan: [1, 2, 3, 4]}, (err, doc) => {
	console.log(doc);
})