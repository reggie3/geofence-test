import React, { Component } from 'react';
import {
    View, StyleSheet, Text

} from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
const reactMixin = require('react-mixin');
import { FontAwesome } from '@expo/vector-icons';
import { Motion, spring } from 'react-motion';


const MIN_MARKER_SIZE = 28;
const MAX_MARKER_SIZE = 48;
const SIZE_DELTA = MAX_MARKER_SIZE - MIN_MARKER_SIZE;

const MIN_MARKER_ALT = 0;
const MAX_MARKER_ALT = 8;
const ALT_DELTA = MAX_MARKER_ALT - MIN_MARKER_ALT;

const MIN_MARKER_SCALE_Y = .5;
const MAX_MARKER_SCALE_Y = 1;
const SCALE_DELTA_Y = MAX_MARKER_SCALE_Y - MIN_MARKER_SCALE_Y;
class LocationMarker extends Component {
    constructor() {
        super()
        this.state = {
            timeLastCalled: Date.now(),
            size: 24,
            alt: 0,
            scaleY: .75,
            growthSwitch: "grow"
        };
    }

    componentWillReceiveProps(nextProps) {
        // console.log(`delta time: ${Date.now() - this.state.timeLastCalled}`);
        let deltaTime = Date.now() - this.state.timeLastCalled;
        console.log("**** delta: " + deltaTime + " *****");

        let time = 20000;   //time to complete the animation
        if (nextProps.location.distanceAverage < 10) {
            time = 500;
        }
        else if (nextProps.location.distanceAverage < 100) {
            time = 1000;
        }
        else if (nextProps.location.distanceAverage < 500) {
            time = 4000;
        }
        else if (nextProps.location.distanceAverage < 1000) {
            time = 8000;
        }
        else {
            time = 16000;
        }
        console.log("time: " + time);

        let rate = SIZE_DELTA / time;
        let altRate = ALT_DELTA / time;
        let scaleYRate = (SCALE_DELTA_Y / time) * 2;

        console.log("rate: " + rate);
        console.log("altRate: " + altRate);
        console.log("scaleYRate: " + scaleYRate);

        let sizeChange = deltaTime * rate;
        let altChange = deltaTime * altRate;
        let scaleYChange = deltaTime * scaleYRate;

        console.log("sizeChange: " + sizeChange);
        console.log("altChange: " + altChange);
        console.log("scaleYChange: " + scaleYChange);

        let newSize = 0;
        let newAlt = 0;
        let newScaleY = 0;

        if (this.state.growthSwitch === 'shrink') {
            newSize = Math.max(this.state.size - sizeChange, MIN_MARKER_SIZE);
            newAlt = Math.max(this.state.alt - altChange, MIN_MARKER_ALT);
            newScaleY = Math.max(this.state.scaleY - scaleYChange, MIN_MARKER_SCALE_Y);
        }
        else {
            newSize = Math.min(this.state.size + sizeChange, MAX_MARKER_SIZE);
            newAlt = Math.min(this.state.alt + altChange, MAX_MARKER_ALT);
            newScaleY = Math.min(this.state.scaleY + scaleYChange, MAX_MARKER_SCALE_Y);
        }

        console.log("----------- newSize: " + newSize + " --------------");
        console.log("----------- newAlt: " + newAlt + " --------------");
        console.log("----------- newScaleY: " + newScaleY + " --------------");

        let newGrowthSwitch = newSize >= MAX_MARKER_SIZE ? "shrink" :
            newSize <= MIN_MARKER_SIZE ? "grow" : this.state.growthSwitch;

        this.setState((prevState, props) => ({
            size: newSize,
            alt: newAlt,
            scaleY: newScaleY,
            growthSwitch: newGrowthSwitch,
            timeLastCalled: Date.now()
        }));

    }

    componentDidMount() {
        debugger;
        let currentLoc = this.props.currentLoc;
        let location = this.props.location;

        this.props.dispatch(actions.locationsActions.writeDistanceResults(
            location.ID,
            geolib.getDistance(
                { latitude: currentLoc.latitude, longitude: currentLoc.longitude },
                { latitude: location.loc[0], longitude: location.loc[1] },
                this.props.config.distanceCheckAccuracy,
                this.props.config.distanceCheckPrecision
            ),
            this.props.config.locationSensitivityDamping
        ));
    }

    render() {
        return (
            <Expo.MapView.Marker
                key={this.props.key}
                coordinate={{
                    latitude: this.props.location.loc[0],
                    longitude: this.props.location.loc[1],
                }}
                time={this.props.time}>
                    <View
                        style={{
                            marginBottom: this.state.alt,
                        }}>
                        <FontAwesome
                            name='map-marker'
                            color={this.props.location.pinColor}
                            size={this.state.size}
                            backgroundColor='blue'
                        />
                    </View>
            </Expo.MapView.Marker>
        )
    }
}

const mapStateToProps = (state) => {
    return Object.assign({}, {
        config: state.config,
        currentLoc: state.appState.currentLocation.coords

    });
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
}

reactMixin(LocationMarker.prototype, TimerMixin);
export default connect(mapStateToProps, mapDispatchToProps)(LocationMarker);
