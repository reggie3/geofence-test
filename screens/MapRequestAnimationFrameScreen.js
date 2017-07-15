import React, { Component } from 'react';
import { View } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import actions from '../actions/actions';
import Prompt from 'react-native-prompt';
import shortid from 'shortid';
import LocationMarkerRequestAnimationFrame from '../components/LocationMarkerRequestAnimationFrame';

class MapScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showNamePrompt: false,
            location: undefined,
            name: undefined
        };
    }
    onMapPressed = (e) => {
        this.setState({
            showNamePrompt: !this.showNamePrompt,
            location: e.nativeEvent.coordinate,
            markerName: `Marker ${shortid.generate()}`
        })
    }

    createMarker = (name) => {
        this.props.dispatch(actions.locationsActions.setMarkerLocation(
            name,
            this.state.location
        ));
    }

    render() {
        return (
            <View
                style={{ flex: 1 }}>
                <Prompt
                    title="Location Name"
                    placeholder="Start typing"
                    defaultValue={this.state.markerName} 
                    visible={this.state.showNamePrompt}
                    onCancel={() => this.setState({
                        showNamePrompt: false,
                    })}
                    onSubmit={(value) => {
                        this.createMarker(value);
                        this.setState({
                            showNamePrompt: false,
                        })
                    }} />
                <Expo.MapView
                    style={{
                        flex: 1
                    }}
                    provider="google"
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    followsUserLocation={true}
                    onPress={this.onMapPressed.bind(this)}
                    initialRegion={{
                        latitude: this.props.currentLocation.coords.latitude ?
                            this.props.currentLocation.coords.latitude : 38.889931,
                        longitude: this.props.currentLocation.coords.longitude ?
                            this.props.currentLocation.coords.longitude : -77.0059,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    {
                        this.props.locations.map((location, index) => {
                            return (
                                <LocationMarkerRequestAnimationFrame
                                    key={index}
                                    pinColor={location.pinColor}
                                    location={location}
                                />
                            )
                        })
                    }
                </Expo.MapView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return Object.assign({}, {
        locations: state.locations,
        currentLocation: state.appState.currentLocation
    });
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);