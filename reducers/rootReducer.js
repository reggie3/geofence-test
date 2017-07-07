import { combineReducers } from 'redux';
import locations from './locations';
import appState from './appState';
import config from './config';

export default rootReducer = combineReducers({
    locations,
    appState,
    config
})