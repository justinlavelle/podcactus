'use strict';

import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Image } from 'semantic-ui-react';

const RGL = WidthProvider(Responsive);

export default class Subscriptions extends React.Component {
    constructor(props) {
        super(props);
        this.ttt = [];
        for (let i = 0; i < 32; i++) {
            this.ttt.push(i);
        }
        this.renderImages = this.renderImages.bind(this);
        this.getLayout = this.getLayout.bind(this);
    }

    renderImages() {
        return this.ttt.map(i => {
            return <div key={i.toString()}><Image
                className="pod-art"
                src="not-found.png"
                /></div>
        });
    }

    getLayout(cols) {
        let j = 0;
        return this.ttt.map(i => {
            if (cols % i === 0) j++;
            return {
                x: i % cols,
                y: Math.floor(i / cols),
                w: 1,
                h: 1,
                i: i.toString()
            };
        });
    }

    render() {
        let cols = { lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 };
        let layouts = {};
        Object.keys(cols).reduce((a, c) => {
            a[c] = this.getLayout(cols[c]);
            return a;
        }, layouts);
        return (
            <div>
                <button onClick={this.props.test}>TEST</button>
                <RGL
                    className="subscription-layout"
                    layouts={layouts}
                    cols={cols}
                    rowHeight={200}
                    isResizable={false}
                    isDraggable={false}>
                    {this.renderImages()}
                </RGL>

            </div>
        );
    }
}
