var express = require('express');
var router = express.Router();
var request = require('request');

var getCollectionsNames = function(collections) {
    const collectionsNames = [];
  
    for (var i = 0, len = collections.length; i < len; i++) {
      if (collections[i].isSystem) {
        continue;
      }
  
      collectionsNames.push(collections[i].name);
    }
  
    return collectionsNames;
}

var getArangoDBUrl = function(hostName, username, password) {
    return 'http://' + encodeURI(username) + ':' + encodeURI(password) + '@' + hostName;
}

var collectionsMiddleware = function(req, res, next) {
    var hostName = req.body.hostName;
    var dbName = req.body.dbName;
    var username = req.body.username;
    var password = req.body.password;
  
    var options = {
        url: getArangoDBUrl(hostName, username, password) + '/_db/' + dbName + '/_api/collection',
        method: 'GET'
    }

    var httpRequest = request(options, function(error, response, body) {
        if (error) {
            res.locals.sendObject = { status: 500, message: error };
        } else {
            if (!body) {
                res.locals.sendObject = { status: response.statusCode, message: response.statusMessage };
            } else {
                var parsedBody = JSON.parse(body);

                if (parsedBody.error) {
                    res.locals.sendObject = { status: 500, message: parsedBody.errorMessage };
                } else {
                    var collectionsNames = getCollectionsNames(parsedBody.result);
                    res.locals.sendObject = { status: 200, collectionsNames: collectionsNames };
                }
            }
      }
  
      next();
    });
  
    httpRequest.on('error', function(error) {
      res.locals.sendObject = { status: 500, message: error.code };
      next();
    });
}

var importMiddleware = function(req, res, next) {
    var hostName = req.body.hostName;
    var dbName = req.body.dbName;
    var username = req.body.username;
    var password = req.body.password;
    var collectionName = req.body.collectionName;
    var documents = req.body.documents;
  
    var options = {
        url: getArangoDBUrl(hostName, username, password) + '/_db/' + dbName + '/_api/import?collection=' + collectionName + '&type=list&overwrite=true',
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(documents)
    }

    var httpRequest = request(options, function(error, response, body) {
      if (error) {
        res.locals.sendObject = { status: 500, message: error };
      } else {
            if (!body) {
                res.locals.sendObject = { status: response.statusCode, message: response.statusMessage };
            } else {
                var parsedBody = JSON.parse(body);

                if (parsedBody.error) {
                    res.locals.sendObject = { status: 500, message: parsedBody.errorMessage };
                } else {
                    res.locals.sendObject = { status: 200 };
                }
            }
      }
  
      next();
    });
  
    httpRequest.on('error', function(error) {
      res.locals.sendObject = { status: 500, message: error.code };
      next();
    });
}

var exportMiddleware = function(req, res, next) {
    var hostName = req.body.hostName;
    var dbName = req.body.dbName;
    var username = req.body.username;
    var password = req.body.password;
    var collectionName = req.body.collectionName;
  
    var options = {
        url: getArangoDBUrl(hostName, username, password) + '/_db/' + dbName + '/_api/cursor',
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(
            { 
                query: 'FOR doc IN `' + collectionName + '` RETURN doc',
                batchSize: 10000000
            } 
        )
    }

    var httpRequest = request(options, function(error, response, body) {
      if (error) {
        res.locals.sendObject = { status: 500, message: error };
      } else {
            if (!body) {
                res.locals.sendObject = { status: response.statusCode, message: response.statusMessage };
            } else {
                var parsedBody = JSON.parse(body);

                if (parsedBody.error) {
                    res.locals.sendObject = { status: 500, message: parsedBody.errorMessage };
                } else {
                    var documents = parsedBody.result;
                    res.locals.sendObject = { status: 200, documents: documents };
                }
            }
      }
  
      next();
    });
  
    httpRequest.on('error', function(error) {
      res.locals.sendObject = { status: 500, message: error.code };
      next();
    });
}

var propertiesMiddleware = function(req, res, next) {
    var hostName = req.body.hostName;
    var dbName = req.body.dbName;
    var username = req.body.username;
    var password = req.body.password;
    var collectionName = req.body.collectionName;
  
    var options = {
        url: getArangoDBUrl(hostName, username, password) + '/_db/' + dbName + '/_api/collection/' + collectionName + '/properties',
        method: 'GET'
    }

    console.log('url', options.url);

    var httpRequest = request(options, function(error, response, body) {
        if (error) {
            res.locals.sendObject = { status: 500, message: error };
        } else {
            if (!body) {
                res.locals.sendObject = { status: response.statusCode, message: response.statusMessage };
            } else {
                var parsedBody = JSON.parse(body);

                if (parsedBody.error) {
                    res.locals.sendObject = { status: 500, message: parsedBody.errorMessage };
                } else {
                    delete parsedBody.keyOptions.lastValue;
                    var properties = {
                        name: parsedBody.name,
                        type: parsedBody.type,
                        keyOptions: parsedBody.keyOptions
                    };
                    res.locals.sendObject = { status: 200, properties: properties };
                }
            }
      }
  
      next();
    });
  
    httpRequest.on('error', function(error) {
      res.locals.sendObject = { status: 500, message: error.code };
      next();
    });
}

var createMiddleware = function(req, res, next) {
    var hostName = req.body.hostName;
    var dbName = req.body.dbName;
    var username = req.body.username;
    var password = req.body.password;
    var collectionName = req.body.collectionName;
    var collectionType = req.body.collectionType;
    var generatorType = req.body.generatorType;
    var increment = req.body.increment;
    var offset = req.body.offset;
    var allowUserKeys = req.body.allowUserKeys;
  
    var options = {
        url: getArangoDBUrl(hostName, username, password) + '/_db/' + dbName + '/_api/collection',
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ 
            name: collectionName,
            type: collectionType,
            keyOptions: {
                type: generatorType, offset: parseInt(offset, 10), increment: parseInt(increment, 10), allowUserKeys: allowUserKeys
            }
        })
    }

    var httpRequest = request(options, function(error, response, body) {
      if (error) {
        res.locals.sendObject = { status: 500, message: error };
      } else {
            if (!body) {
                res.locals.sendObject = { status: response.statusCode, message: response.statusMessage };
            } else {    
                var parsedBody = JSON.parse(body);

                if (parsedBody.error) {
                    res.locals.sendObject = { status: 500, message: parsedBody.errorMessage };
                } else {
                    res.locals.sendObject = { status: 200 };
                }
            }
      }
  
      next();
    });
  
    httpRequest.on('error', function(error) {
      res.locals.sendObject = { status: 500, message: error.code };
      next();
    });
}

var recreateMiddleware = function(req, res, next) {
    var hostName = req.body.hostName;
    var dbName = req.body.dbName;
    var username = req.body.username;
    var password = req.body.password;
    var collectionBody = req.body.collectionBody;
  
    var options = {
        url: getArangoDBUrl(hostName, username, password) + '/_db/' + dbName + '/_api/collection',
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(collectionBody)
    }

    var httpRequest = request(options, function(error, response, body) {
      if (error) {
        res.locals.sendObject = { status: 500, message: error };
      } else {
            if (!body) {
                res.locals.sendObject = { status: response.statusCode, message: response.statusMessage };
            } else {
                var parsedBody = JSON.parse(body);

                if (parsedBody.error) {
                    res.locals.sendObject = { status: 500, message: parsedBody.errorMessage };
                } else {
                    res.locals.sendObject = { status: 200 };
                }
            }
      }
  
      next();
    });
  
    httpRequest.on('error', function(error) {
      res.locals.sendObject = { status: 500, message: error.code };
      next();
    });
}

var sendResponseObject = function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(JSON.stringify(res.locals.sendObject));
}

router.post('/collections', collectionsMiddleware, sendResponseObject);
router.post('/import', importMiddleware, sendResponseObject);
router.post('/export', exportMiddleware, sendResponseObject);
router.post('/properties', propertiesMiddleware, sendResponseObject);
router.post('/create', createMiddleware, sendResponseObject);
router.post('/recreate', recreateMiddleware, sendResponseObject);

module.exports = router;
