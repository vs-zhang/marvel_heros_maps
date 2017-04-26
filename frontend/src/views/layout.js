import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import HomePage from './pages/home/home';

const Layout = () => (
  <div className="docs-root">
    <Route component={HomePage} />
  </div>
);

Layout.propstype = {
  children: PropTypes.object.isRequired,
};

export default Layout;
