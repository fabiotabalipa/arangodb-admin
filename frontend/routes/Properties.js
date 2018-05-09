import React, { Component } from 'react';

import { Button, Form, Header, Icon, Label } from 'semantic-ui-react';

import Sidemenu from '../components/Sidemenu';

import * as HttpUtils from '../utils/HttpUtils';
import * as JsonUtils from '../utils/JsonUtils';

class Properties extends Component {
    constructor(props) {
        super(props);
        
        this.properties = [];

        this.state = { hostName: '', dbName: '', username: '', password: '', cloning: false };
    }

    componentWillMount() {
        const hostName = sessionStorage.getItem('hostName');
        const dbName = sessionStorage.getItem('dbName');
        const username = sessionStorage.getItem('username');

        if (hostName && dbName && username) {
            this.setState({ hostName, dbName, username });
        }
    }

    onClickClone() {
        this.properties = [];
        
        this.setState({ cloning: true });

        const self = this;
        
        HttpUtils.retrieveCollectionsNames(this.state.hostName, this.state.dbName, this.state.username, this.state.password, 
            (collectionsSuccess, collectionsNames) => {
                if (collectionsSuccess) {
                    for (let i = 0, len = collectionsNames.length; i < len; i++) {
                        const collectionName = collectionsNames[i];
            
                        HttpUtils.getPropertiesFromCollection(
                          this.state.hostName, this.state.dbName, this.state.username, this.state.password, collectionName, 
                          (propertiesSuccess, properties) => {
                              if (propertiesSuccess) {
                                  self.properties.push(properties);
                              }

                              if ((i + 1) === len) {
                                if (self.properties.length > 0) {
                                    JsonUtils.downloadObjectAsJson(self.properties, 'Propriedades das coleções de ' + this.state.dbName);
                                }
                                
                                self.setState({ cloning: false });
                              }
                      });
                    }
                } else {
                    self.setState({ cloning: false });
                }
        });
    }

    render() {
      return (
        <div style={styles.main}>

            <Sidemenu />

            <div style={styles.view}>
                <Header as='h2' icon>
                    <Icon name='clone' />
                    Clonar Propriedades
                    <Header.Subheader>
                        Clonar as propriedades de todas as coleções do banco de dados indicado
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

                <Button onClick={this.onClickClone.bind(this)} disabled={this.state.cloning}>Clonar</Button>
            </div>
        </div>
      );
    }
}

const styles = {
    main: { backgroundColor: '#FAFAFA', display: 'flex', flex: 1 },
    view: { display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }
};

export default Properties;
