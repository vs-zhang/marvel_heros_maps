import { Record } from 'immutable';

import {
  GET_NEARBY_HEROES_SUCCESS,
} from './action-types';

export const HeroesState = new Record({
  list: [],
});

export function heroesReducer(state = new HeroesState(), { payload, type }) {
  switch (type) {
    case GET_NEARBY_HEROES_SUCCESS:
      return state.merge(payload);
    default:
      return state;
  }
}
