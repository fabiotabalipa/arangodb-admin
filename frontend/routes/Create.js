import React, { Component } from 'react';

import { Button, Form, Header, Icon, Input, Label, List, Message, Tab } from 'semantic-ui-react';

import Sidemenu from '../components/Sidemenu';

import * as HttpUtils from '../utils/HttpUtils';
import * as Router from '../router';

const STATUS_READY = 'Pronta para ser criada';
const STATUS_OK = 'Criada com sucesso!';

class Create extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTabIndex: 0,
            hostName: '',
            dbName: '',
            username: '',
            collectionName: '', 
            collectionType: 2, 
            generatorType: 'traditional', 
            increment: null, 
            offset: null,
            allowUserKeys: true,
            creating: false, 
            success: false,
            collections: [],
            recreating: false
        };
    }

    componentWillMount() {
        const hostName = sessionStorage.getItem('hostName');
        const dbName = sessionStorage.getItem('dbName');
        const username = sessionStorage.getItem('username');

        if (hostName && dbName && username) {
            this.setState({ hostName, dbName, username });
        }
    }

    getCollectionsWithStatuses(collections) {
        for (let i = 0, len = collections.length; i < len; i++) {
            Object.assign(collections[i], { status: STATUS_READY });
        }

        return collections;
    }

    getIconNameByStatus(status) {
        if (status.includes(STATUS_READY)) {
            return 'folder';
        } else if (status.includes(STATUS_OK)) {
            return 'checkmark';
        }

        return 'remove';
    }

    onChangeFileInput(event) {
        this.fileInput = event.target;

        const file = event.target.files[0];

        if (file.type !== 'application/json')  {
            alert('Arquivo inválido!');
            return;
        }

        const self = this;
        const fileReader = new FileReader();
        fileReader.onload = ((f) => (e) => {
            const collections = self.getCollectionsWithStatuses(JSON.parse(e.target.result));
            self.setState({ collections });
        })(file);
        fileReader.readAsText(file);
    }

    onClickCreate() {
        this.setState({ creating: true });

        const { hostName, dbName, username, password, collectionName, collectionType, generatorType, increment, offset, allowUserKeys } = this.state;

        const self = this;

        HttpUtils.createCollection(hostName, dbName, username, password, 
            collectionName, collectionType, generatorType, increment, offset, allowUserKeys, (success) => {
                if (success) {
                    self.setState({ collectionName: '', creating: false, success: true });
                    setTimeout(() => { self.setState({ success: false }) }, 5000);
                } else {
                    self.setState({ creating: false });
                }
        });
    }

    onClickListRemove(index) {
        const collections = this.state.collections;
        files.splice(index, 1);
        if (collections.length <= 0) {
            this.fileInput.value = null;
        }
        this.setState({ collections });
    }

    onClickRecreate() {
        this.setState({ recreating: true });
        this.recursiveCreateCollection();
    }

    recursiveCreateCollection(index = 0) {
        const { hostName, dbName, username, password } = this.state;

        const self = this;

        HttpUtils.recreateCollection(hostName, dbName, username, password, 
            this.state.collections[index], (error, stop, errorMessage) => {
                const collections = self.state.collections;

                if (error && stop) {
                    self.setState({ recreating: false });
                    return;
                } else if (error && !stop) {
                    collections[index].status = `Erro: ${errorMessage}`;
                } else {
                    collections[index].status = STATUS_OK;
                }

                index++;
                if (index < collections.length) {
                    self.recursiveCreateCollection(index);
                    self.setState({ collections });
                } else {
                    self.setState({ collections, recreating: false });
                }
        });
    }

    render() {
      return (
        <div style={styles.main}>

            <Sidemenu />

            <div style={styles.view}>
                <Header as='h2' icon>
                    <Icon name='folder' />
                    Criar Coleções
                    <Header.Subheader>
                        Crie coleções para o banco de dados indicado
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

                <Tab activeIndex={this.state.activeTabIndex} menu={{ pointing: true }} panes={panes} onTabChange={(event, { activeIndex }) => this.setState({ activeTabIndex: activeIndex })} />
                {
                    this.state.activeTabIndex === 0 &&
                        <div>
                            <Form style={styles.form}>
                                <Form.Group widths="equal">
                                    <Form.Input label="Nome" placeholder="Nome" onChange={(event) => this.setState({ collectionName: event.target.value })} />
                                    <Form.Select label="Tipo" placeholder="Tipo" options={typeOptions} onChange={(event, { value }) => this.setState({ collectionType: value })} />
                                </Form.Group>
                                <Form.Group widths="equal">
                                    <Form.Select label="Gerador de Chaves" placeholder="Gerador de Chaves" options={generatorOptions} onChange={(event, { value }) => this.setState({ generatorType: value })} />
                                </Form.Group>
                                {
                                    this.state.generatorType === 'autoincrement' &&
                                    <Form.Group widths="equal">
                                        <Form.Input label="Chave Inicial" placeholder="Chave Inicial" onChange={(event) => this.setState({ offset: event.target.value })} />
                                        <Form.Input label="Valor de Incremento" placeholder="Valor de Incremento" onChange={(event) => this.setState({ increment: event.target.value })} />
                                    </Form.Group>
                                }
                                <Form.Checkbox label="Bloquear edição das chaves" checked={!this.state.allowUserKeys} onChange={() => this.setState({ allowUserKeys: !this.state.allowUserKeys })} />
                            </Form>

                            {
                                this.state.success &&
                                <Message
                                    success
                                    header="Sucesso"
                                    content="Coleção criada com sucesso!"
                                />
                            }
                            
                            <Button onClick={this.onClickCreate.bind(this)} disabled={this.state.creating}>Criar</Button>
                        </div>
                }
                {
                    this.state.activeTabIndex === 1 &&
                        <div style={styles.secondTab}>
                            <Header as='h2'>
                                <Header.Subheader>
                                    Arquivo *.json previamente gerado com a ferramenta de <a onClick={() => { Router.goPath('/propriedades') }}>clonar propriedades</a>:
                                </Header.Subheader>
                            </Header>
                            <Form>
                                <Form.Group widths="equal">
                                    <Form.Field>
                                        <Input type="file" onChange={this.onChangeFileInput.bind(this)} />
                                    </Form.Field>
                                </Form.Group>

                                {
                                    this.state.collections.length > 0 &&
                                        <List divided relaxed>
                                        {
                                            this.state.collections.map((collection, index) => {
                                                return (
                                                    <List.Item key={index}>
                                                        <List.Icon name={this.getIconNameByStatus(collection.status)} size='large' verticalAlign='middle' />
                                                        <List.Content>
                                                        <List.Header >{collection.name}</List.Header>
                                                        <List.Description >{collection.status}</List.Description>
                                                        </List.Content>
                                                        {
                                                            collection.status === STATUS_READY &&
                                                                <List.Icon style={styles.listRemove} name='remove' size='large' verticalAlign='middle' onClick={this.onClickListRemove.bind(this, index)} />
                                                        }
                                                    </List.Item>
                                                );
                                            })
                                        }
                                        </List>
                                }

                                <Button onClick={this.onClickRecreate.bind(this) || this.state.collections.length <= 0} disabled={this.state.recreating}>Recriar Coleções</Button>
                            </Form>
                        </div>
                }
            </div>
        </div>
      );
    }
}

const panes = [
    { menuItem: 'Nova Coleção', render: () => {} },
    { menuItem: 'De Arquivo', render: () => {} }
];

const typeOptions = [
    { key: '2', text: 'Documentos', value: 2 },
    { key: '3', text: 'Vértices', value: 3 },
]

const generatorOptions = [
    { key: '1', text: 'Tradicional', value: 'traditional' },
    { key: '2', text: 'Auto-incremento', value: 'autoincrement' },
]

const styles = {
    main: { backgroundColor: '#FAFAFA', display: 'flex', flex: 1 },
    view: { display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' },
    form: { marginBottom: 15 },
    secondTab: { marginBottom: 45, marginTop: 30 },
    listRemove: { color: '#FF8080' }
};

export default Create;
