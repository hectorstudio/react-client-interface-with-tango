import {combineReducers} from 'redux';
import deviceList from './deviceList';
import deviceViewer from './deviceViewer';

const rootReducer = combineReducers({
  deviceList,
  deviceViewer
});

export default rootReducer;