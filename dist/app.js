'use strict';

var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var config = require('./config');
var routes = require('./routes');

// mongoose.connect(process.env.MONGO_URI)

var app = express();
var server = http.createServer(app);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use('/', routes.main);

server.listen(process.env.PORT, function () {
  console.log('PORT: ' + process.env.PORT);
});