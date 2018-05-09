import React, { Component } from 'react';

import { Icon, Input, Label, Menu } from 'semantic-ui-react';

import * as Router from '../router';

class Sidemenu extends Component {
    state = { 
        activeItem: 'inbox' 
    }

    onClickItem(event, { name }){
        this.setState({ activeItem: name });
        Router.goPath(`/${name}`);
    }

    render() {
        const { activeItem } = this.state

        return (
            <Menu vertical>
                <Menu.Item name='exportar' active={activeItem === 'exportar'} onClick={this.onClickItem.bind(this)}>
                    <Icon name='download' />
                    Exportar Coleções
                </Menu.Item>

                <Menu.Item name='importar' active={activeItem === 'importar'} onClick={this.onClickItem.bind(this)}>
                    <Icon name='upload' />
                    Importar Coleções
                </Menu.Item>

                <Menu.Item name='propriedades' active={activeItem === 'propriedades'} onClick={this.onClickItem.bind(this)}>
                    <Icon name='clone' />
                    Clonar Propriedades
                </Menu.Item>

                <Menu.Item name='criar' active={activeItem === 'criar'} onClick={this.onClickItem.bind(this)}>
                    <Icon name='folder' />
                    Criar Coleções
                </Menu.Item>

                <Menu.Item name='' onClick={this.onClickItem.bind(this)}>
                    <Icon name='retweet' />
                    Reconectar
                </Menu.Item>
            </Menu>
        )
  }
}

export default Sidemenu;
