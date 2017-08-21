'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect(process.env.MONGO_URI, { useMongoClient: true });

var app = (0, _express2.default)();
var server = _http2.default.createServer(app);

app.use(_bodyParser2.default.urlencoded());
app.use(_bodyParser2.default.json());

app.use('/auth', _routes2.default.auth);
app.use('/task', _routes2.default.task);
app.use('/group', _routes2.default.group);

server.listen(_config2.default.PORT, function () {
  console.log('PORT: ' + _config2.default.PORT);
});