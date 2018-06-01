import {combineReducers} from 'redux';

import devices from './devices';
import filtering from './filtering';
import ui from './ui';

const rootReducer = combineReducers({
  devices,
  filtering,
  ui,
});

export default rootReducer;
