import React, { createElement } from 'react';
import DOM from 'react-dom';
import app from './containers/app';

const App = React.createFactory(app);

DOM.render(createElement(App, {host: undefined}), document.getElementById('app'));
