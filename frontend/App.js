import React, { Component } from 'react';

import * as Router from './router';

import '../assets/styles/app.css';

class App extends Component {
  render() {
    return (
        <div className="App" style={styles.viewContainer}>
          { Router.renderPath(this.props.path) }
        </div>
    );
  }
}

const styles = {
  viewContainer: { display: 'flex', flex: 1, flexDirection: 'column' }
};

export default App;
