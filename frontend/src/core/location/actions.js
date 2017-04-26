import * as axios from 'axios';
import {
  GET_LOCATION_SUCCESS,
  CHANGE_RADIUS_SUCCESS,
} from './action-types';

function getLocationSuccess(payload) {
  return {
    type: GET_LOCATION_SUCCESS,
    payload,
  };
}

export function getLocationAction(s) {
  return (dispatch) => {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${s}`)
      .then((result) => {
        const firstResult = result.data.results[0];
        const location = firstResult.geometry.location;
        const payload = {
          longitude: location.lng,
          latitude: location.lat,
          name: firstResult.formatted_address,
        };
        dispatch(getLocationSuccess(payload));
      });
  };
}

export function changeRadius(radius) {
  return {
    type: CHANGE_RADIUS_SUCCESS,
    payload: { radius },
  };
}
