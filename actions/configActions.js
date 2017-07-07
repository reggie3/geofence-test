export default configActions = {
    setDistanceCheckInterval : (value) =>{
        return{
            type: 'SET_DISTANCE_CHECK_INTERVAL',
            value
        }
    },
    setDistanceCheckAccuracy: (value)=>{
        return{
            type: 'SET_DISTANCE_CHECK_ACCURACY',
            value
        }
    },
    setDistanceCheckPrecision: (value)=>{
        return{
            type: 'SET_DISTANCE_CHECK_PRECISION',
            value
        }
    },
    setLocationSensitivityDamping: (value)=>{
        return{
            type: 'SET_LOCATION_SENSITIVITY_DAMPING',
            value
        }
    }
}