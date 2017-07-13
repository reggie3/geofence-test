import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
const reactMixin = require('react-mixin');
import { FontAwesome } from '@expo/vector-icons';



const MIN_MARKER_SIZE=32;
const MAX_MARKER_SIZE=48;
class LocationMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageCounter: 0,
            markerGrowthSpeed: 0,
            size: MIN_MARKER_SIZE,
            then: Date.now()
        };
    }

    componentDidMount = () => {
        requestAnimationFrame(this.animationLooper.bind(this));
    }

    animationLooper = () => {
        let now = Date.now();
        let deltaTime = now - this.state.then;
        let growth = deltaTime / 1000 * this.state.markerGrowthSpeed;

        let growthSwitch = 1;
        if(this.state.size+growth >MAX_MARKER_SIZE){
            growthSwitch = -1;
        }
        else if(this.state.size-growth <MIN_MARKER_SIZE){
            growthSwitch = 1;
        }
        else{
            console.log('no growthswitch change');
        }
        let newSize = this.state.size + (growth * growthSwitch);
        this.setState({
            size: newSize,
            then: now
        });

        requestAnimationFrame(this.animationLooper.bind(this));
    }

    createMarkerArray = (pinColor) => {
        let markerArray = [];

        for (let i = 0; i < 10; i++) {
            markerArray.push(
                <FontAwesome
                    name='map-marker'
                    color={this.props.location.pinColor}
                    size={this.state.size}
                />
            )
        }
        debugger;
        return markerArray;

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
                    size={this.state.size}
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
