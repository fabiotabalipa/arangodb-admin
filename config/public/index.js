var getPort = function() {
    return process.env.PORT || 4008;
};

var getNodeEnv = function() {
    return process.env.NODE_ENV || "development";
}
  
var getBackendHost = function() {
    var hostname = process.env.HOST || 'localhost';
  
    if (hostname === 'localhost') {
      hostname = hostname + ':' + getPort();
    }
  
    return hostname;
}
  
module.exports.getPort = getPort;
module.exports.getNodeEnv = getNodeEnv;
module.exports.getBackendHost = getBackendHost;
