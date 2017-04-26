import { Record } from 'immutable';

import {
  GET_LOCATION_SUCCESS,
  CHANGE_RADIUS_SUCCESS,
} from './action-types';


export const LocationState = new Record({
  longitude: null,
  latitude: null,
  name: '',
  radius: 500,
});


export function locationReducer(state = new LocationState(), { payload, type }) {
  switch (type) {
    case CHANGE_RADIUS_SUCCESS:
    case GET_LOCATION_SUCCESS:
      return state.merge(payload);
    default:
      return state;
  }
}
