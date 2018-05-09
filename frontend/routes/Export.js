import React, { Component } from 'react';

import { Button, Form, Header, Icon, Label } from 'semantic-ui-react';

import Sidemenu from '../components/Sidemenu';

import * as HttpUtils from '../utils/HttpUtils';
import * as JsonUtils from '../utils/JsonUtils';

class Export extends Component {
    constructor(props) {
        super(props);
        
        this.state = { hostName: '', dbName: '', username: '', password: '', exporting: false };
    }

    componentWillMount() {
        const hostName = sessionStorage.getItem('hostName');
        const dbName = sessionStorage.getItem('dbName');
        const username = sessionStorage.getItem('username');

        if (hostName && dbName && username) {
            this.setState({ hostName, dbName, username });
        }
    }

    onClickExport() {
        this.setState({ exporting: true });

        const self = this;
        
        HttpUtils.retrieveCollectionsNames(this.state.hostName, this.state.dbName, this.state.username, this.state.password, 
            (collectionsSuccess, collectionsNames) => {
                if (collectionsSuccess) {
                    for (let i = 0, len = collectionsNames.length; i < len; i++) {
                        const collectionName = collectionsNames[i];
            
                        HttpUtils.exportCollection(
                          this.state.hostName, this.state.dbName, this.state.username, this.state.password, collectionName, 
                          (exportSuccess, documents) => {
                              if (exportSuccess) {
                                    JsonUtils.downloadObjectAsJson(documents, collectionName);
                                    self.setState({ exporting: false });
                              } else {
                                    self.setState({ exporting: false });
                              }
                      });
                    }
                } else {
                    self.setState({ exporting: false });
                }
        });
    }

    render() {
      return (
        <div style={styles.main}>

            <Sidemenu />

            <div style={styles.view}>
                <Header as='h2' icon>
                    <Icon name='download' />
                    Exportar Coleções
                    <Header.Subheader>
                        Exportar todas as coleções do banco de dados indicado
                    </Header.Subheader>
                </Header>

                <Form>
                    <Form.Group widths="equal">
                        <Form.Input label="Domínio" placeholder='Ex.: "localhost:8529"' value={this.state.hostName} disabled />
                        <Form.Input label="Nome do Banco" placeholder='Ex.: "_system"' value={this.state.dbName} disabled />
                    </Form.Group>
                        <Form.Group widths="equal">
                        <Form.Input label="Usuário" placeholder="Usuário" value={this.state.username} disabled />
                        <Form.Input label="Senha" placeholder="Senha" type="password" onChange={(event) => this.setState({ password: event.target.value })} />
                    </Form.Group>
                </Form>

                <Button onClick={this.onClickExport.bind(this)} disabled={this.state.exporting}>Exportar</Button>
            </div>
        </div>
      );
    }
}

const styles = {
    main: { backgroundColor: '#FAFAFA', display: 'flex', flex: 1 },
    view: { display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }
};

export default Export;
