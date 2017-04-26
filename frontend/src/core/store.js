import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

export default (initialState = {}) => {
  const middleware = applyMiddleware(thunk);
  const store = createStore(reducers, initialState, middleware);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      /* eslint-disable global-require */
      store.replaceReducer(require('./reducers').default);
      /* eslint-enable global-require */
    });
  }

  return store;
};
