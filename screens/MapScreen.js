import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import actions from '../actions/actions';
import Prompt from 'react-native-prompt';
import shortid from 'shortid';
import LocationMarker from '../components/LocationMarker';

class MapScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initialRegion: {
                latitude: this.props.currentLocation.coords.latitude ?
                    this.props.currentLocation.coords.latitude : 38.889931,
                longitude: this.props.currentLocation.coords.longitude ?
                    this.props.currentLocation.coords.longitude : -77.0059,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            mapRegion: undefined,
            showNamePrompt: false,
            location: undefined,
            name: undefined
        };
    }
    onMapPressed = (e) => {
        this.setState({
            showNamePrompt: !this.showNamePrompt,
            location: e.nativeEvent.coordinate
        })
    }

    createMarker = (name) => {
        this.props.dispatch(actions.locationsActions.setMarkerLocation(
            name,
            this.state.location
        ));
    }

    regionChanged(mapRegion) {
        this.setState({ mapRegion });
    }

    render() {
        return (
            <View
                style={{ flex: 1 }}>
                <Prompt
                    title="Location Name"
                    placeholder="Start typing"
                    defaultValue={`Marker ${shortid.generate()}`}
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
                    ref={(map) => { this.map = map; }}
                    style={{
                        flex: 1
                    }}
                    provider="google"
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    followsUserLocation={true}
                    onPress={this.onMapPressed.bind(this)}
                    initialRegion={this.state.initialRegion}
                    onRegionChangeComplete={this.regionChanged.bind(this)}
                    region={this.state.mapRegion}
                >
                </Expo.MapView>
                {
                    this.props.locations.map((location, index) => {
                        return (
                            <LocationMarker
                                region={this.state.mapRegion}
                                key={index}
                                pinColor={location.pinColor}
                                location={location}
                            />
                        )
                    })
                }
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