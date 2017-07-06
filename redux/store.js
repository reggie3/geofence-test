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
        locationWatchID: undefined
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


