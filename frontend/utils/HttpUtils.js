import * as Config from '../../config/public';

export const retrieveCollectionsNames = (hostName, dbName, username, password, callback) => {
    fetch(`http://${Config.getBackendHost()}/arangodb/collections`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ hostName, dbName, username, password})
    }).then(
      (response) => response.json()
    ).then(
      (responseJson) => {
        if (responseJson.status === 200) {
          callback(true, responseJson.collectionsNames);
        } else {
          alert(`Erro: ${responseJson.message}`);
          console.error(responseJson.message);
          callback(false);
        }
      }
    ).catch((error) => {
      alert(`Erro de conexão: ${error}`);
      console.error(error);
      callback(false);
    });
};

export const importCollection = (hostName, dbName, username, password, collectionName, documents, callback) => {
  fetch(`http://${Config.getBackendHost()}/arangodb/import`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ hostName, dbName, username, password, collectionName, documents })
  }).then(
    (response) => response.json()
  ).then(
    (responseJson) => {
      if (responseJson.status === 200) {
        callback(false);
      } else {
        console.error(responseJson.message);
        callback(true, false, responseJson.message);
      }
    }
  ).catch((error) => {
    alert(`Erro de conexão: ${error}`);
    console.error(error);
    callback(true, true, responseJson.message);
  });
};

export const exportCollection = (hostName, dbName, username, password, collectionName, callback) => {
  fetch(`http://${Config.getBackendHost()}/arangodb/export`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ hostName, dbName, username, password, collectionName })
  }).then(
    (response) => response.json()
  ).then(
    (responseJson) => {
      if (responseJson.status === 200) {
        callback(true, responseJson.documents);
      } else {
        alert(`Erro: ${responseJson.message}`);
        console.error(responseJson.message);
        callback(false);
      }
    }
  ).catch((error) => {
    alert(`Erro de conexão: ${error}`);
    console.error(error);
    callback(true, responseJson.message);
  });
};

export const getPropertiesFromCollection = (hostName, dbName, username, password, collectionName, callback) => {
  fetch(`http://${Config.getBackendHost()}/arangodb/properties`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ hostName, dbName, username, password, collectionName })
  }).then(
    (response) => response.json()
  ).then(
    (responseJson) => {
      if (responseJson.status === 200) {
        callback(true, responseJson.properties);
      } else {
        alert(`Erro: ${responseJson.message}`);
        console.error(responseJson.message);
        callback(false);
      }
    }
  ).catch((error) => {
    alert(`Erro de conexão: ${error}`);
    console.error(error);
    callback(true, responseJson.message);
  });
};

export const createCollection = (hostName, dbName, username, password, collectionName, collectionType, generatorType, increment, offset, allowUserKeys, callback) => {
  fetch(`http://${Config.getBackendHost()}/arangodb/create`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ hostName, dbName, username, password, collectionName, collectionType, generatorType, increment, offset, allowUserKeys })
  }).then(
    (response) => response.json()
  ).then(
    (responseJson) => {
      if (responseJson.status === 200) {
        callback(true);
      } else {
        alert(`Erro: ${responseJson.message}`);
        console.error(responseJson.message);
        callback(false);
      }
    }
  ).catch((error) => {
    alert(`Erro de conexão: ${error}`);
    console.error(error);
    callback(false);
  });
};

export const recreateCollection = (hostName, dbName, username, password, collectionBody, callback) => {
  fetch(`http://${Config.getBackendHost()}/arangodb/recreate`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ hostName, dbName, username, password, collectionBody })
  }).then(
    (response) => response.json()
  ).then(
    (responseJson) => {
      if (responseJson.status === 200) {
        callback(false);
      } else {
        console.error(responseJson.message);
        callback(true, false, responseJson.message);
      }
    }
  ).catch((error) => {
    alert(`Erro de conexão: ${error}`);
    console.error(error);
    callback(true, true, error);
  });
};
