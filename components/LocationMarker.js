import React, { Component } from 'react';
import {
    View, Animated, StyleSheet,
    Easing
} from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
const reactMixin = require('react-mixin');
import { FontAwesome } from '@expo/vector-icons';



const MIN_MARKER_SIZE = 32;
const MAX_MARKER_SIZE = 48;
class LocationMarker extends Component {
    constructor() {
        super()
        this.spinValue = new Animated.Value(0)
    }
    componentDidMount() {
        this.spin()
    }
    spin() {
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear
            }
        ).start(() => this.spin())
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.distanceAverage < 10) {
            this.setState({ markerGrowthSpeed: 4 });
        }
        else if (nextProps.location.distanceAverage < 100) {
            this.setState({ markerGrowthSpeed: 3 });
        }
        else if (nextProps.location.distanceAverage < 1000) {
            this.setState({ markerGrowthSpeed: 2 });
        }
        else if (nextProps.location.distanceAverage < 5000) {
            this.setState({ markerGrowthSpeed: 1 });
        }
    }

    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        return (
            <Expo.MapView.Marker
                key={this.props.key}
                coordinate={{
                    latitude: this.props.location.loc[0],
                    longitude: this.props.location.loc[1],
                }}>
                <Animated.View
                    style={{ transform: [{ rotate: spin }] }}>
                    <FontAwesome
                        name='map-marker'
                        color={this.props.location.pinColor}
                        size={32}
                    />
                </Animated.View>
            </Expo.MapView.Marker>
        )
    }
}

const mapStateToProps = (state) => {
    return Object.assign({}, {
        config: state.config,
    });
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
}

reactMixin(LocationMarker.prototype, TimerMixin);
export default connect(mapStateToProps, mapDispatchToProps)(LocationMarker);
