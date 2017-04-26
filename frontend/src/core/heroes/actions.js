import * as axios from 'axios';
import {
  GET_NEARBY_HEROES_SUCCESS,
} from './action-types';

function getNearbyHeroesSuccess(result) {
  return {
    type: GET_NEARBY_HEROES_SUCCESS,
    payload: { list: result },
  };
}

export function getNearbyHeroes(longitude, latitude, radius) {
  return (dispatch) => {
    axios.get(`http://127.0.0.1:5000/nearby_heroes?longitude=${longitude}&latitude=${latitude}&radius=${radius}`)
      .then((result) => {
        dispatch(getNearbyHeroesSuccess(result.data));
      });
  };
}
