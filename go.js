var http = require('http');
// var serveStatic = require('serve-static');
var express = require('express');
var app = express();

app.use(express.static('webpage'));

var server = app.listen(8080);