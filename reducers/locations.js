export default function locations(locations = {}, action) {
    switch (action.type) {
        case 'SET_MARKER_LOCATION':
            return locations.concat({
                name: action.name,
                loc: [action.coords.latitude, action.coords.longitude]
            })
        default:
            return locations;
    }
}