'use strict';

import React from 'react';
import Search from '../search.js';
import ReactImageFallback from 'react-image-fallback';
import { Divider } from 'semantic-ui-react';

export default class Discover extends React.Component {
    constructor(props) {
        super(props);

        this._wrapperStyle = {
            display: 'flex',
            flexDirection: 'row',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            padding: 5
        };

        this._contentStyle = {
            overflow: 'hidden',
            textWrap: 'none',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        };

        this._titleStyle = {
            fontFamily: 'Lato, Arial, sans',
            fontWeight: 700,
            display: 'block'
        };

        this._descriptionStyle = {
            fontFamily: 'Lato, Arial, sans',
            fontSize: 12
        };

        this._imgStyle = {
            width: 40,
            height: 40,
            marginRight: 10
        };
    }

    renderResults() {
        return this.props.results.map((r, i) => {
            if (r.title) {
                return (
                    <div key={`k${i}`} style={this._wrapperStyle}>
                        <ReactImageFallback src={r.scaled_logo_url} fallbackImage="not-found.png" style={this._imgStyle} />
                        <div style={this._contentStyle}>
                            <span style={this._titleStyle}>{r.title}</span>
                            <span style={this._descriptionStyle}>{r.description}</span>
                        </div>
                    </div>
                );
            }
        });
    }

    render() {
        return (
            <div>
                <h2>Discover</h2>
                <Search onExecSearch={this.props.onExecSearch} />
                {this.renderResults()}
            </div>
        );
    }
}
