import React, { Component } from 'react';

import { Button, Form, Header, Icon, List } from 'semantic-ui-react';

import * as HttpUtils from '../utils/HttpUtils';
import * as Router from '../router';

class Intro extends Component {

    constructor(props) {
        super(props);
        
        this.state = { hostName: '', dbName: '', username: '', password: '', connecting: false, connected: false, collectionsNames: [] };
    }

    componentWillMount() {
        const hostName = sessionStorage.getItem('hostName');
        const dbName = sessionStorage.getItem('dbName');
        const username = sessionStorage.getItem('username');

        if (hostName && dbName && username) {
            this.setState({ hostName, dbName, username });
        }
    }

    onClickConnect() {
        this.setState({ connecting: true });

        const { hostName, dbName, username, password } = this.state;

        const self = this;

        HttpUtils.retrieveCollectionsNames(hostName, dbName, username, password, 
            (collectionsSuccess, collectionsNames) => {
                if (collectionsSuccess) {
                    sessionStorage.setItem('hostName', hostName);
                    sessionStorage.setItem('dbName', dbName);
                    sessionStorage.setItem('username', username);

                    self.setState({ collectionsNames, connecting: false, connected: true });
                } else {
                    self.setState({ connecting: false });
                }
        });
    }

    render() {
      return (
        <div style={styles.main}>
            <Header style={styles.header} as='h2' icon textAlign='center'>
                <Icon name='database' circular />
                <Header.Content>
                    ArangoDB Admin
                </Header.Content>
                <Header.Subheader>
                    Ferramenta de importação e exportação de coleções
                </Header.Subheader>
            </Header>

            {
                !this.state.connected &&
                    <div style={styles.forms}>
                        <Form>
                            <Form.Group widths="equal">
                                <Form.Input label="Domínio" placeholder='Ex.: "localhost:8529"' value={this.state.hostName} onChange={(event) => this.setState({ hostName: event.target.value })} />
                                <Form.Input label="Nome do Banco" placeholder='Ex.: "_system"' value={this.state.dbName} onChange={(event) => this.setState({ dbName: event.target.value })} />
                            </Form.Group>
                            <Form.Group widths="equal">
                                <Form.Input label="Usuário" placeholder="Usuário" value={this.state.username} onChange={(event) => this.setState({ username: event.target.value })} />
                                <Form.Input label="Senha" placeholder="Senha" type="password" onChange={(event) => this.setState({ password: event.target.value })} />
                            </Form.Group>
                        </Form>

                        <Button onClick={this.onClickConnect.bind(this)} disabled={this.state.connecting}>Conectar</Button>
                    </div>
            }

            {
                this.state.connected &&
                    <div>
                        {
                            this.state.collectionsNames.length > 0 &&
                                <div style={styles.collections}>
                                    <div style={styles.dbHeader}>
                                        <Header as='h1' icon textAlign='center'>
                                            <Header.Content>
                                                {this.state.dbName}
                                            </Header.Content>
                                        </Header>
                                    </div>
                                    <List style={styles.list}>
                                    {
                                        this.state.collectionsNames.map((collection, index) => {
                                            return (
                                                <List.Item key={index}>
                                                    <List.Icon name='folder' />
                                                    <List.Content>{collection}</List.Content>
                                                </List.Item>
                                            )
                                        })
                                    }
                                    </List>
                                </div>
                        }
                        

                        <div style={styles.buttons}>
                            <Button style={styles.button} icon labelPosition='left' onClick={() => Router.goPath('/exportar')}>
                                <Icon name='download' />
                                Exportar Coleções
                            </Button>
                            <Button style={styles.button} icon labelPosition='left' onClick={() => Router.goPath('/importar')}>
                                <Icon name='upload' />
                                Importar Coleções
                            </Button>
                            <Button style={styles.button} icon labelPosition='left' onClick={() => Router.goPath('/propriedades')}>
                                <Icon name='clone' />
                                Clonar Propriedades
                            </Button>
                            <Button style={styles.button} icon labelPosition='left' onClick={() => Router.goPath('/criar')}>
                                <Icon name='folder' />
                                Criar Coleções
                            </Button>
                        </div>
                    </div> 
            }
        </div>
      );
    }
}

const styles = {
    main: { backgroundColor: '#FAFAFA', display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 },
    header: { marginBottom: 20 },
    forms: { display: 'flex', flexDirection: 'column', marginTop: 20, alignItems: 'center' },
    buttons: { marginTop: 20, marginBottom: 20 },
    button: { marginRight: 10 },
    collections: { display: 'flex', flex: 1, flexDirection: 'row', marginTop: 10, marginBottom: 40 },
    dbHeader: { display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
    list: { display: 'flex', flex: 1, flexDirection: 'column' }
};

export default Intro;
