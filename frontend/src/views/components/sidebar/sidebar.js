import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import HeroCard from '../heroCard/heroCard';

class Sidebar extends Component {
  static propTypes = {
    location: PropTypes.shape({
      longitude: PropTypes.number,
      latitude: PropTypes.number,
      radius: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
    getNearbyHeroes: PropTypes.func,
    changeRadius: PropTypes.func,
    onSubmit: PropTypes.func,
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
    changeRadius: () => {},
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
    this.handleChange = ::this.handleChange;
    this.handleOnKeyDown = ::this.handleOnKeyDown;
    this.handleChangeRadius = ::this.handleChangeRadius;
    this.onSubmit = ::this.onSubmit;
  }

  componentWillReceiveProps(nextProps) {
    const { longitude, latitude, radius } = nextProps.location;
    if (longitude && latitude && radius) {
      const didLngChange = this.props.location.longitude !== longitude;
      const didLatChange = this.props.location.latitude !== latitude;
      const didRadiusChange = this.props.location.radius !== radius;
      if (didLngChange || didLatChange || didRadiusChange) {
        this.props.getNearbyHeroes(longitude, latitude, radius);
      }
    }
  }

  onSubmit() {
    if (this.state.searchText !== '') {
      this.props.onSubmit(this.state.searchText);
      this.setState({ searchText: '' });
    }
  }

  handleChangeRadius(e) {
    this.props.changeRadius(parseInt(e.target.value, 10));
  }

  handleOnKeyDown(e) {
    if (e.keyCode === 13) {
      this.onSubmit();
    }
  }

  handleChange(e) {
    this.setState({ searchText: e.target.value });
  }

  render() {
    const { heroes } = this.props;
    const { name } = this.props.location;
    const heroCards = _.map(heroes, (hero) => {
      const key = _.uniqueId('hero-card');
      return (
        <HeroCard
          key={key}
          name={hero.name}
          distance={hero.distance}
          cityname={hero.cityname}
          thumbnail={hero.thumbnail}
        />
      );
    });

    return (
      <aside className="sidebar">
        <div className="search-container">
          <input
            type="text"
            placeholder="City Name"
            onKeyDown={this.handleOnKeyDown}
            onChange={this.handleChange}
            value={this.state.searchText}
            className="search-input"
          />
          <button onClick={this.onSubmit} className="search-button">
            Search
          </button>
          <div className="radius-select-container">
            <label htmlFor="radius-select">Radius:</label>
            <select id="radius-select" onChange={this.handleChangeRadius} defaultValue="500" className="radius-select">
              <option value="10">10mi</option>
              <option value="100">100mi</option>
              <option value="500">500mi</option>
              <option value="1500">1500mi</option>
              <option value="2500">2500mi</option>
              <option value="5000">5000mi</option>
            </select>
          </div>
        </div>
        {name &&
        <div className="search-desc">
          <p>Heroes nearby {name}</p>
        </div>
        }
        <div>
          {heroCards}
        </div>
      </aside>
    );
  }
}

export default Sidebar;
