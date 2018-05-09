var public = require('../public');

var getPort = function() {
  return public.getPort();
};

var getNodeEnv = function() {
  return public.getNodeEnv();
}

module.exports.getPort = getPort;
module.exports.getNodeEnv = getNodeEnv;
