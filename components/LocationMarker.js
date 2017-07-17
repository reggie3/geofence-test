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



const MIN_MARKER_SIZE = 32;
const MAX_MARKER_SIZE = 48;
class LocationMarker extends Component {
    constructor() {
        super()
        this.state = {
            fadeIn: true
        };
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

    componentWillUpdate(nextProps, nextState) {
        // perform any preparations for an upcoming update
        // console.log('******componentWillUpdate*********');
    }
    animationComplete() {
        debugger;
        this.setState({ fadeIn: !this.state.fadeIn })
    }

    render() {
        console.log('render marker');
        return (
            <Expo.MapView.Marker
                key={this.props.key}
                coordinate={{
                    latitude: this.props.location.loc[0],
                    longitude: this.props.location.loc[1],
                }}>
                <Motion
                    style={{
                        fade: spring(this.state.fadeIn ? 1 : 0)
                    }}
                    onRest={this.animationComplete.bind(this)}
                    >
                    {({ fade }) =>
                        <View
                            style={{
                                opacity: fade
                            }}>
                            <Text>{fade}</Text>
                            <FontAwesome
                                name='map-marker'
                                color={this.props.location.pinColor}
                                size={32}
                            />
                        </View>
                    }
                </Motion>
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
