import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
const reactMixin = require('react-mixin');
import { FontAwesome } from '@expo/vector-icons';



const MIN_MARKER_SIZE = 28;
const MAX_MARKER_SIZE = 48;
class LocationMarkerRequestAnimationFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markerGrowthSpeed: 0,
            size: MIN_MARKER_SIZE,
            then: Date.now(),
            growthSwitch: "grow"
        };
    }

    componentDidMount = () => {
        let animation = this.requestAnimationFrame(this.animationLooper.bind(this));
    }

    animationLooper = () => {
        let now = Date.now();
        let deltaTime = now - this.state.then;
        let growth = deltaTime / 1000 * this.state.markerGrowthSpeed;

        let newSize;
        if (this.state.growthSwitch === 'shrink') {
            newSize = Math.max(this.state.size - growth, MIN_MARKER_SIZE);

        }
        else if (this.state.growthSwitch === 'grow') {
            newSize = Math.min(this.state.size + growth, MAX_MARKER_SIZE);
        }
        else{
            console.log("error");
        }
        //console.log("size: " + newSize);
        let newGrowthSwitch = newSize >= MAX_MARKER_SIZE ? "shrink" :
            newSize <= MIN_MARKER_SIZE ? "grow" : this.state.growthSwitch;
        //console.log("newGrowthSwitch: " + newGrowthSwitch);


        this.setState({
            size: newSize,
            then: now,
            growthSwitch: newGrowthSwitch
        });

        this.requestAnimationFrame(this.animationLooper.bind(this));
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
            this.setState({ markerGrowthSpeed: 120 });
        }
        else if (nextProps.location.distanceAverage < 100) {
            this.setState({ markerGrowthSpeed: 40 });
        }
        else if (nextProps.location.distanceAverage < 1000) {
            this.setState({ markerGrowthSpeed:20 });
        }
        else if (nextProps.location.distanceAverage < 5000) {
            this.setState({ markerGrowthSpeed: 10 });
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

reactMixin(LocationMarkerRequestAnimationFrame.prototype, TimerMixin);
export default connect(mapStateToProps, mapDispatchToProps)(LocationMarkerRequestAnimationFrame);