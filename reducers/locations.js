import uuid from 'uuid/v1';
const colors = ['red', 'green', 'blue', 'orange', 'yellow'];

export default function locations(locations = {}, action) {
    switch (action.type) {
        case 'SET_MARKER_LOCATION':
            return locations.concat({
                ID: uuid(),
                name: action.name,
                loc: [action.coords.latitude, action.coords.longitude],
                distances: [],
                pinColor: colors[Math.floor(Math.random() * colors.length)],
                touched: false
            });
        case 'DELETE_MARKER':
            return locations.filter((location) => {
                return location.ID !== action.ID;
            });
        case 'WRITE_DISTANCE_RESULTS':
            return locations.map((location) => {
                if (location.ID === action.ID) {
                    return Object.assign({},
                        location,
                        {
                            distances: [action.distance].concat(location.distances)
                        });
                }
                return location;
            })
        default:
            return locations;
    }
}