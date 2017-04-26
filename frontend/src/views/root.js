import React from 'react';
import { Provider } from 'react-redux';
import {
  HashRouter,
} from 'react-router-dom';
import routers from './routers';
import './styles/app.css';
import configureStore from '../core/store';

const store = configureStore();

export default function Root() {
  return (
    <Provider store={store}>
      <HashRouter>
        {routers}
      </HashRouter >
    </Provider>
  );
}
