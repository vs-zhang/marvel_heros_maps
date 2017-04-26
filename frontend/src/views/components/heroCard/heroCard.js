import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HeroCard extends Component {
  static propTypes = {
    cityname: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  };

  render() {
    const { cityname, distance, name, thumbnail } = this.props;
    return (
      <div className="hero-card">
        <img src={thumbnail} alt={`${name} thumbnail`} className="hero-card__thumbnail" />
        <p className="hero-card__name">{name}</p>
        <p>{cityname}</p>
        <p>{distance} miles away</p>
      </div>
    );
  }
}

export default HeroCard;
