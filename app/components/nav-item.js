'use strict';

import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';

export default class NavItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Menu.Item name={this.props.name} className="nav-item" active={this.props.active} onClick={this.props.click}>
                <div>
                    <Icon name={this.props.name} className="nav-icon" />
                    {this.props.title}
                </div>
            </Menu.Item>
        );
    }
}
