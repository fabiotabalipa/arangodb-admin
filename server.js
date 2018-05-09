var express = require('express');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var path = require('path');

require("dotenv").config();

var config = require('./config/protected');

var server = express();

server.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: config.getNodeEnv() === 'development' ? ["'self'", "'unsafe-eval'"] : ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'http://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'data:', 'https://cdnjs.cloudflare.com', 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:'],
    connectSrc: ["'self'"]
  },
  loose: true
}));
server.use(helmet.dnsPrefetchControl());
server.use(helmet.frameguard());
server.use(helmet.hidePoweredBy());
server.use(helmet.ieNoOpen());
server.use(helmet.noSniff());
server.use(helmet.xssFilter());

server.use(bodyParser.json({limit: '10mb'}));
server.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

server.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', `http://localhost:${config.getPort()}`);
  res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
  //res.setHeader('Acess-Control-Allow-Credentials', 'true');

  next();
});

server.use('/arangodb', require('./backend/routes/arangodb'));

var publicDir = path.join(__dirname, 'public');

if (config.getNodeEnv() === 'development') {
  var webpack = require('webpack');
  var webpackConfig = require('./webpack.config');

  var compiler = webpack(webpackConfig);

  server.use(require('webpack-dev-middleware')(compiler, {
    hot: true,
    stats: {
      colors: true
    }
  }));

  server.use(require('webpack-hot-middleware')(compiler));
} else {
  server.use(express.static(publicDir));
}

server.get('*', function(req, res) {
  res.sendFile(path.join(publicDir, 'index.html'));
});

server.listen(config.getPort(), '0.0.0.0', function() {
  console.log('Express server listening on ' + config.getPort() + '...');
});
