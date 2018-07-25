import {combineReducers} from 'redux';

import devices from './devices';
import filtering from './filtering';
import ui from './ui';
import deviceView from './deviceView';

const rootReducer = combineReducers({
  devices,
  deviceView,
  filtering,
  ui,
});

export default rootReducer;
