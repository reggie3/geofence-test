import uuid from 'uuid/v1';

export default function locations(locations = {}, action) {
    switch (action.type) {
        case 'SET_MARKER_LOCATION':
            return locations.concat({
                ID: uuid(),
                name: action.name,
                loc: [action.coords.latitude, action.coords.longitude]
            });
            case 'DELETE_MARKER':
            return locations.filter((location)=>{
                return location.ID !== action.ID;
            })
        default:
            return locations;
    }
}