import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
var tweenState = require('react-tween-state');
tweenState.Mixin
import TimerMixin from 'react-timer-mixin';
var reactMixin = require('react-mixin');

const MIN_MARKER_SIZE = 32;
const MAX_MARKER_SIZE = 48;
class LocationMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = () => {
        this.tweenState('size', {
            easing: tweenState.easingTypes.easeInOutQuad,
            duration: 500,
            endValue: this.state.size === MIN_MARKER_SIZE ? MAX_MARKER_SIZE : MIN_MARKER_SIZE
        });
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

        let size = this.getTweeningValue('size')

        return (

            <Expo.MapView.Marker
                key={this.props.key}
                coordinate={{
                    latitude: this.props.location.loc[0],
                    longitude: this.props.location.loc[1],
                }}>
                <FontAwesome
                    name='map-marker'
                    color={this.props.location.pinColor}
                    size={size}
                />
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
