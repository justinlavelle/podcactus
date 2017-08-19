'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import AppContainer from './containers/app.container'

// styles
import 'rc-slider/assets/index.css';
import 'semantic-ui/dist/semantic.min.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

class App extends React.Component {
    render () {
        return (
            <AppContainer />
        );
    }
}

// render to index.html
ReactDOM.render(
    <App />,
    document.getElementById('content')
);
