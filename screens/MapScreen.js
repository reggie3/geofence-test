import React, { Component } from 'react';
import { View } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import actions from '../actions/actions';
import Prompt from 'react-native-prompt';

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
            location: e.nativeEvent.coordinate
        })
    }

    createMarker = (name, location) => {
        this.props.dispatch(actions.locationsActions.setMarkerLocation(
            this.state.name,
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
                    defaultValue="Marker Name"
                    visible={this.state.showNamePrompt}
                    onCancel={() => this.setState({
                        showNamePrompt: false,
                    })}
                    onSubmit={(value) => {
                        console.log('name: ' + value);
                        this.setState({
                            showNamePrompt: false,
                            name: value
                        });
                        this.createMarker();
                    }} />
                <Expo.MapView
                    style={{ flex: 1 }}
                    provider="google"
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    followsUserLocation={true}
                    initialRegion={{
                        latitude: this.props.currentLocation.coords.latitude,
                        longitude: this.props.currentLocation.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onPress={this.onMapPressed.bind(this)}
                >
                    {
                        this.props.locations.map((location, index) => {
                            return (
                                <Expo.MapView.Marker
                                    key={index}
                                    pinColor="blue"
                                    coordinate={{
                                        latitude: location.loc[0],
                                        longitude: location.loc[1],
                                    }}

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