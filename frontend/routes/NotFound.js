import React from 'react';

const NotFound = () => (
  <div style={styles.viewContainer}>
    <h3>Página não encontrada!</h3>
  </div>
);

const styles = {
  viewContainer: { backgroundColor: '#FAFAFA', display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }
};

export default NotFound;
