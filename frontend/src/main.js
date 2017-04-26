import React from 'react';
import ReactDOM from 'react-dom';
import Root from './views/root';

const root = document.getElementById('root');

function render() {
  ReactDOM.render(<Root />, root);
}

render();

if (module.hot) {
  module.hot.accept('./views/root', () => {
    /* eslint-disable global-require */
    const NewRoot = require('./views/root').default;
    /* eslint-enable global-require */
    ReactDOM.render(<NewRoot />, root);
  });
}
