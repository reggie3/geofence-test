export default appState = {
    setLocation: (coords) =>{
        return {
            type: 'SET_LOCATION',
            coords
        }
    },
    setLocationWatchID: (watchID) =>{
        return {
            type: 'SET_LOCATION_WATCH_ID',
            watchID
        }
    },
}