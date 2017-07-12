import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
var reactMixin = require('react-mixin');
const monster1 = require('../assets/sprites/monster/monster_walk01.png')
const monster2 = require('../assets/sprites/monster/monster_walk02.png')
const monster3 = require('../assets/sprites/monster/monster_walk03.png')


class LocationMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
            bounceDuration: 1,
            imageCounter: 0,
            sprites: [monster1, monster2, monster3],
            loopSpeed: 1000
        };
    }


    componentDidMount = () => {
        const looper = () => {
            let newCount =
                console.log('looper image: ' + this.state.imageCounter);
            this.setState({
                imageCounter: this.state.imageCounter + 1
            });

            setTimeout(
                looper,
                100
            );
        }
        looper();
    }

    componentWillReceiveProps(nextProps) {
        // TODO: implement the average distance algorithm
        let distanceSum = 0;
        let averageDistance = distanceSum / this.props.config.locationSensitivityDamping;

        if (nextProps.location < 10) {
            this.setState({ loopSpeed: 10 });
        }
        else if (averageDistance < 100) {
            this.setState({ loopSpeed: 100 });
        }
        else if (averageDistance < 1000) {
            this.setState({ loopSpeed: 500 });
        }
        else if (averageDistance < 5000) {
            this.setState({ loopSpeed: 1000 });
        }
    }

    render() {
        return (

            <Expo.MapView.Marker
                key={this.props.key}
                image={this.state.sprites[this.state.imageCounter % 3]}
                coordinate={{
                    latitude: this.props.location.loc[0],
                    longitude: this.props.location.loc[1],
                }}
            />

        )
    }
}

const mapStateToProps = (state) => {
    return Object.assign({}, {
        locations: state.locations,
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
