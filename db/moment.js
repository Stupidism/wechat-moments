var mongoose = require('mongoose');

// 定义Schema
MomentSchema = new mongoose.Schema({
	publishTime: {
		type: Number,
		required: true
	},
	text: {
		type: String,
		required: false
	},
	imgUrls: {
		type: Array,
		required: false
	},
	sessionId: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	headImg: {
		type: String,
		required: true
	},
	zan: {
		type: Array,
		required: false
	}
});

// 定义Model
var MomentModel = mongoose.model('Moment', MomentSchema);

// 暴露接口
module.exports = MomentModel;
