export default locationsActions = {
    setMarkerLocation: (name, coords) => {
        return {
            type: 'SET_MARKER_LOCATION',
            name,
            coords
        }
    },
    deleteMarker: (ID) => {
        return {
            type: 'DELETE_MARKER',
            ID
        }
    },
    writeDistanceResults: (ID, distance, locationArrayMaxLength) => {
        return {
            type: 'WRITE_DISTANCE_RESULTS',
            ID,
            distance,
            locationArrayMaxLength
        }
    },
    updateMarkersForRender: (deltaTime) => {
        return {
            type: 'UPDATE_MARKERS_FOR_RENDER',
        }
    }
}