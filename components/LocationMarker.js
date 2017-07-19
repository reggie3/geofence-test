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
const BOUNCE_MIN = 0;
const BOUNCE_MAX = 8;
const SHADOWX_MIN = 1.5;
const SHADOWX_MAX = 3.5;
const SHADOWY_MIN = .75;
const SHADOWY_MAX = 1.2;
const SHADOW_OPACITY_MIN = .3;
const SHADOW_OPACITY_MAX = .6;
const IMAGEX_SCALE_MIN = .8;
const IMAGEX_SCALE_MAX = 1.3;
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
            scale: SCALE_MIN,
            bounce: BOUNCE_MIN,
            shadowScaleX: SHADOWX_MIN,
            shadowScaleY: SHADOWY_MIN,
            shadowOpacity: SHADOW_OPACITY_MIN,
            imageXScale: IMAGEX_SCALE_MIN
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
            this.tween.to({
                scale: SCALE_MAX,
                bounce: BOUNCE_MAX,
                shadowScaleX: SHADOWX_MAX,
                shadowScaleY: SHADOWY_MAX,
                shadowOpacity: SHADOW_OPACITY_MAX,
                imageXScale: IMAGEX_SCALE_MAX
            }, that.state.duration)
                .yoyo(true)
                .repeat(1)
                .easing(TWEEN.Easing.Back.InOut)
                .onUpdate(function () {
                    //console.log(that.tweenVars.scale);
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
                <View
                    style={{
                        display: 'flex',
                        padding: 0,
                        margin: 0,
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>

                    <Text
                        style={{
                            padding: 0,
                            margin: 0,
                            fontSize: this.tweenVars.scale
                        }}>
                        ❤️
                    </Text>
                    <View
                        style={{
                            padding: 0,
                            margin: 0,
                            borderBottomWidth: this.tweenVars.bounce,
                            borderColor: 'rgba(0,0,0,0)'
                        }}>
                    </View>
                    <View
                        style={{
                            height: 2,
                            width: 4,
                            borderRadius: 50,
                            alignSelf: 'center',
                            transform: [
                                { scaleX: this.tweenVars.shadowScaleX },
                                { scaleY: this.tweenVars.shadowScaleY }
                            ],
                            backgroundColor: `rgba(50,50,50,${this.tweenVars.shadowOpacity})`
                        }}>
                    </View>
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
