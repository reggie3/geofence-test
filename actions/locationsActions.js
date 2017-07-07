export default locationsActions = {
    setMarkerLocation : (name, coords) =>{
        return{
            type: 'SET_MARKER_LOCATION',
            name,
            coords
        }
    },
    deleteMarker: (ID)=>{
        return{
            type: 'DELETE_MARKER',
            ID
        }
    }
}