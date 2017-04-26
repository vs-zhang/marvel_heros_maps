import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import Sidebar from '../../components/sidebar/sidebar';
import { locationActions, getLocation } from '../../../core/location';
import { heroesActions, getHeroes } from '../../../core/heroes';

class HomePage extends Component {
  static propTypes = {
    location: PropTypes.shape({
      longitude: PropTypes.number,
      latitude: PropTypes.number,
      radius: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
    getNearbyHeroes: PropTypes.func,
    getLocationAction: PropTypes.func,
    changeRadius: PropTypes.func,
    heroes: PropTypes.arrayOf(PropTypes.shape({
      cityname: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      coordinate: PropTypes.array.isRequired,
      distance: PropTypes.number.isRequired,
    })).isRequired,
  };

  static defaultProps = {
    getNearbyHeroes: () => {},
    getLocationAction: () => {},
    changeRadius: () => {},
  };

  render() {
    const { getLocationAction, location, heroes, getNearbyHeroes, changeRadius } = this.props;
    return (
      <div>
        <Sidebar
          onSubmit={getLocationAction}
          getNearbyHeroes={getNearbyHeroes}
          changeRadius={changeRadius}
          location={location}
          heroes={heroes}
        />
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  getLocation,
  getHeroes,
  (location, heroes) => ({ location, heroes }),
);

const mapDispatchToProps = Object.assign(
  {},
  locationActions,
  heroesActions,
);

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
