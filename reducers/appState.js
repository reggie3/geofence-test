export default function appState(appState = {}, action) {
 switch (action.type) {
      case 'SET_LOCATION':
            return Object.assign({}, appState, {
                currentLocation: Object.assign({}, appState.currentLocation, {
                    coords: Object.assign({}, appState.currentLocation.coords, action.coords)
                })
            });
        case 'SET_LOCATION_WATCH_ID':
            return Object.assign({}, appState, { locationWatchID: action.watchID });
     default:
            return appState;
    }
}