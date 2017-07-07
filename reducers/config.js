export default function config(config = {}, action) {
    switch (action.type) {
        case 'SET_DISTANCE_CHECK_INTERVAL':
            return Object.assign({}, config, { distanceCheckInterval: action.value });
        case 'SET_DISTANCE_CHECK_ACCURACY':
            return Object.assign({}, config, { distanceCheckAccuracy: action.value });
        case 'SET_DISTANCE_CHECK_PRECISION':
            return Object.assign({}, config, { distanceCheckPrecision: action.value });
        case 'SET_LOCATION_SENSITIVITY_DAMPING':
            return Object.assign({}, config, { locationSensitivityDamping: action.value });
        default:
            return config;
    }
}