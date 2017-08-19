'use strict';

import React from 'react';
import { Icon } from 'semantic-ui-react';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this._id = `search-${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 50)}`;
        this._inputStyle = {
            border: 'none',
            background: 'transparent',
            outline: 'none',
            width: '100%',
            margin: '2px 5px 3px 5px',
            fontFamily: 'Lato, Arial, sans',
            fontWeight: '700'
        };
        this._divStyle = {
            border: '2px solid #484848',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: '5px'
        };
    }

    defaultProps = { onExecSearch: () => {} };

    componentWillMount() {
        this.setState({ value: '', focus: false });
    }

    componentDidMount() {
        let s = document.getElementById(this._id);
        s.addEventListener('input', e => this.setState({ value: e.target.value || '' }));
        s.addEventListener('keyup', e => { if (e.keyCode === 13 || e.code === 'Enter') this.props.onExecSearch(this.state.value) });
        s.addEventListener('focus', () => this.setState({ focus: true }));
        s.addEventListener('blur', () => this.setState({ focus: false }));
    }

    render() {
        const s = this.state.focus ?
            Object.assign({}, this._divStyle, { boxShadow: '0px 0px 6px #516CF3' }) : this._divStyle;
        return (
            <div style={s}>
                <Icon name="search" style={{ marginBottom: '5px' }} />
                <input id={this._id} type="text" style={this._inputStyle}/>
            </div>
        );
    }

}
