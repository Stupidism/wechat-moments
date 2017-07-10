var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
var wechatMoments = require('./routes/wechat-moments');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/wechat-moments', wechatMoments);

app.use(express.static('./client/build'));
app.use(express.static('./public'));

app.listen(8000);
