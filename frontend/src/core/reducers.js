import { combineReducers } from 'redux';
import { locationReducer } from './location';
import { heroesReducer } from './heroes';

export default combineReducers({
  location: locationReducer,
  heroes: heroesReducer,
});
