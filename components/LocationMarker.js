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
const TWEEN = require('@tweenjs/tween.js');




const SCALE_MIN = 16;
const SCALE_MAX = 24;
class LocationMarker extends Component {
    constructor() {
        super();
        this.state = {
            timeLastCalled: Date.now(),
            duration: 16000,
            tweenRunning: false,

        };
    }

    componentWillMount() {
        this.tweenVars = {
            scale: SCALE_MIN
        };
        this.tween = new TWEEN.Tween(this.tweenVars);
    }

    componentDidMount = () => {
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
        let animation = this.requestAnimationFrame(this.animationLooper.bind(this));

    }

    animationLooper = () => {
        TWEEN.update();
        this.checkTweenStatus();
        requestAnimationFrame(this.animationLooper);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ timeLastCalled: nextProps.time })

        if (nextProps.location.distanceAverage < 10) {
            this.setState({ duration: 250 });
        }
        else if (nextProps.location.distanceAverage < 100) {
            this.setState({ duration: 500 });
        }
        else if (nextProps.location.distanceAverage < 500) {
            this.setState({ duration: 1000 });
        }
        else if (nextProps.location.distanceAverage < 1000) {
            this.setState({ duration: 2000 });
        }
    }

    checkTweenStatus() {
        if (!this.state.tweenRunning) {
            let that = this;
            this.tween.to({ scale: SCALE_MAX }, that.state.duration)
                .yoyo(true)
                .repeat(1)
                .easing(TWEEN.Easing.Elastic.InOut)
                .onUpdate(function () {
                    console.log(that.tweenVars.scale);
                });
            this.tween.onStart(() => {
                that.setState({ tweenRunning: true })
            });
            this.tween.onComplete(() => {
                that.onTweenComplete();
            });
            this.tween.start();
        }
    }

    onTweenComplete() {
        this.setState({
            tweenRunning: false,
        });
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
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: this.tweenVars.scale
                    }}>
                    ❤️
                    </Text>
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
