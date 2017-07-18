import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import actions from '../actions/actions';
import Prompt from 'react-native-prompt';
import shortid from 'shortid';
import LocationMarker from '../components/LocationMarker';
import TimerMixin from 'react-timer-mixin';
const reactMixin = require('react-mixin');

// hack from https://github.com/airbnb/react-native-maps/issues/1332 to
// force showsMyLocationButton to display
const { width, height } = Dimensions.get('window');

class MapScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showNamePrompt: false,
            location: undefined,
            name: undefined,
            lastFrameTime: Date.now(),
            hackHeight: height
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

    componentWillMount() {
        setTimeout( () => this.setState({ hackHeight: height+1}), 500);
        setTimeout( () => this.setState({ hackHeight: height}), 1000);
    }
    componentDidMount = () => {
        let animation = this.requestAnimationFrame(this.animationLooper.bind(this));
    }

    animationLooper = () => {
        this.setState({ lastFrameTime: Date.now() });
        // console.log('tick');
        this.requestAnimationFrame(this.animationLooper.bind(this));
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
                        flex: 1,
                        top: 0,
                        paddingBottom: this.state.hackHeight
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
                                <LocationMarker
                                    key={index}
                                    pinColor={location.pinColor}
                                    location={location}
                                    time={this.state.lastFrameTime}
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
        currentLocation: state.appState.currentLocation,
    });
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
}

reactMixin(MapScreen.prototype, TimerMixin);
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);