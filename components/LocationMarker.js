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


var position = { x: 0 }; // Start at (0, 0)
let tween = new TWEEN.Tween(position); // Create a new tween that modifies 'coords'.




class LocationMarker extends Component {
    constructor() {
        super();
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
        tween.to({ x: 200 }, time);
    }

    componentDidMount = () => {
        let animation = this.requestAnimationFrame(this.animationLooper.bind(this));
        tween.onUpdate(function () {
            console.log(position.x);
        });
        tween.start();
    }

    animationLooper = () => {
        requestAnimationFrame(this.animationLooper);
        TWEEN.update();
    }

    render() {
        // console.log('***** render maker *****');
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
