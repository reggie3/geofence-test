import React, { Component } from 'react';
import {
    View, StyleSheet, Text

} from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
const reactMixin = require('react-mixin');
import { FontAwesome } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';


class LocationMarker extends Component {
    constructor() {
        super()
        this.state = {
            timeLastCalled: Date.now(),

        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ timeLastCalled: nextProps.time })

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
        console.log('***** render maker *****');
        debugger;
        return (
            <Expo.MapView.Marker
                key={this.props.key}
                coordinate={{
                    latitude: this.props.location.loc[0],
                    longitude: this.props.location.loc[1],
                }}
                time={this.props.time}>
                <Animatable.Text
                    animation="pulse"
                    easing="ease-out"
                    iterationCount="infinite"
                    style={{ textAlign: 'center' }}>
                    ❤️
                    </Animatable.Text>
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
