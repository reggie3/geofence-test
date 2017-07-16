import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers/rootReducer';

export let defaultState = {
    appState: {
        currentLocation: {  // contains results of navigator.geolocation.getCurrentPosition API call
            coords: {
                latitude: 38.889931,
                longitude: -77.0059
            }
        },
    },
    config:{
        // 1 to 5 value of how many readings to average to calculate how close
        // to indicate to the user
        locationSensitivityDamping: 3,
        //seconds between checks
        distanceCheckInterval: 20,
        // argument is accuracy (in meters).
        distanceCheckAccuracy: 1,
        //precision in sub-meters (1 is meter presicion, 2 is decimeters, 3 is centimeters, etc).
        distanceCheckPrecision: 1
    },
    locations: []
};

const logger = createLogger();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    rootReducer,
    defaultState, composeEnhancers(
        applyMiddleware(
            logger,
        ))
);


