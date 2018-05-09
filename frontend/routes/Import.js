import React, { Component } from 'react';

import { Button, Form, Header, Icon, Input, Label, List } from 'semantic-ui-react';

import Sidemenu from '../components/Sidemenu';

import * as HttpUtils from '../utils/HttpUtils';

const STATUS_VALID = 'Será importado para a coleção ';
const STATUS_INVALID = 'Inválido para importação (deveria ser *.json)!';
const STATUS_IMPORTING = 'Importando...';
const STATUS_OK = 'Importação bem sucedida!';
const STATUS_ERROR_COLLECTION = 'Erro: coleção inexistente!';
const STATUS_ERROR_IMPORTING = 'Erro durante importação: ';

class Import extends Component {
    constructor(props) {
        super(props);
        
        this.state = { hostName: '', dbName: '', username: '', password: '', files: [], importing: false };
    }

    componentWillMount() {
        const hostName = sessionStorage.getItem('hostName');
        const dbName = sessionStorage.getItem('dbName');
        const username = sessionStorage.getItem('username');

        if (hostName && dbName && username) {
            this.setState({ hostName, dbName, username });
        }
    }

    isFileValid(file) {
        if (file.type !== 'application/json')  {
            return false;
        }
        return true;
    }

    getIconNameByStatus(status) {
        if (status.includes(STATUS_VALID)) {
            return 'file code outline';
        } else if (status.includes(STATUS_VALID)) {
            return 'ellipsis horizontal';
        } else if (status.includes(STATUS_OK)) {
            return 'checkmark';
        }

        return 'remove';
    }

    onChangeFilesInput(event) {
        this.fileInput = event.target;

        const inputFiles = event.target.files;
        const files = [];

        for (let i = 0, len = inputFiles.length; i < len; i++) {
            const file = inputFiles[i];
            if (this.isFileValid(file)) {
                const collectionName = file.name.split('.')[0];
                files.push({ name: file.name, status: `${STATUS_VALID}"${collectionName}".`, ref: file });
            } else {
                files.push({ name: file.name, status: STATUS_INVALID, ref: null });
            }
        }

        this.setState({ files });
    }

    onClickImport() {
        this.setState({ importing: true });

        const files = this.state.files;
        const self = this;
        
        HttpUtils.retrieveCollectionsNames(this.state.hostName, this.state.dbName, this.state.username, this.state.password, 
            (collectionsSuccess, collectionsNames) => {
                if (collectionsSuccess) {
                    for (let i = 0, len = files.length; i < len; i++) {
                        const file = files[i];
            
                        if (!file.ref) {
                            continue;
                        }

                        const collectionName = file.name.split('.')[0];
                        if (!collectionsNames.includes(collectionName)) {
                            file.status = STATUS_ERROR_COLLECTION;
                            self.setState(( files ));
                            continue;
                        }
            
                        file.status = STATUS_IMPORTING;
                        self.setState(( files ));
            
                        const fileReader = new FileReader();
                        fileReader.onload = ((f) => (e) => {
                            const documents = JSON.parse(e.target.result);
                            console.log('documents', documents);
                            HttpUtils.importCollection(
                                this.state.hostName, this.state.dbName, this.state.username, this.state.password, collectionName, documents, 
                                (importError, stop, errorMessage) => {
                                    if (importError && stop) {
                                        self.setState({ importing: false });
                                        return;
                                    } else if (importError && !stop) {
                                        file.status = `${STATUS_ERROR_IMPORTING}${importError}`;
                                        self.setState({ files, importing: false });
                                    } else {
                                        file.status = STATUS_OK;
                                        self.setState({ files, importing: false });
                                    }
                            });
                        })(file.ref);
                        fileReader.readAsText(file.ref);
                    }
                } else {
                    self.setState({ importing: false });
                }
        });
    }

    onClickListRemove(index) {
        const files = this.state.files;
        files.splice(index, 1);
        if (files.length <= 0) {
            this.fileInput.value = null;
        }
        this.setState({ files });
    }

    render() {
      return (
        <div style={styles.main}>

            <Sidemenu />

            <div style={styles.view}>
                <Header as='h2' icon>
                    <Icon name='upload' />
                    Importar Coleções
                    <Header.Subheader>
                        Escolha o(s) arquivo(s) a ser(em) importado(s) para a(s) coleção(ões) de mesmo nome
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
                    <Form.Group widths="equal">
                        <Form.Field>
                            <Input type="file" input={{ multiple: true }} onChange={this.onChangeFilesInput.bind(this)} />
                        </Form.Field>
                    </Form.Group>
                </Form>

                {
                    this.state.files.length > 0 &&
                        <List divided relaxed>
                        {
                            this.state.files.map((file, index) => {
                                return (
                                    <List.Item key={index}>
                                        <List.Icon name={this.getIconNameByStatus(file.status)} size='large' verticalAlign='middle' />
                                        <List.Content>
                                        <List.Header >{file.name}</List.Header>
                                        <List.Description >{file.status}</List.Description>
                                        </List.Content>
                                        {
                                            (file.status.includes(STATUS_VALID) || file.status.includes(STATUS_INVALID)) &&
                                                <List.Icon style={styles.listRemove} name='remove' size='large' verticalAlign='middle' onClick={this.onClickListRemove.bind(this, index)} />
                                        }
                                    </List.Item>
                                );
                            })
                        }
                        </List>
                }

                <Button onClick={this.onClickImport.bind(this)} disabled={this.state.importing || this.state.files.length <= 0}>Importar</Button>
            </div>
        </div>
      );
    }
}

const styles = {
    main: { backgroundColor: '#FAFAFA', display: 'flex', flex: 1 },
    view: { display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' },
    listRemove: { color: '#FF8080' }
};

export default Import;
