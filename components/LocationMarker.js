import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
const reactMixin = require('react-mixin');
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
        setTimeout(
            this.animationLooper.bind(this),
            this.state.loopSpeed);
    }

    animationLooper = () => {
        this.setState({
            imageCounter: this.state.imageCounter + 1
        });
        setTimeout(
            this.animationLooper.bind(this),
            this.state.loopSpeed);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.location.distanceAverage < 100) {
            this.setState({ loopSpeed: 5 });
        }
        else if (nextProps.location.distanceAverage < 500) {
            this.setState({ loopSpeed: 100 });
        }
        else if (nextProps.location.distanceAverage < 1000) {
            this.setState({ loopSpeed: 500 });
        }
        else if (nextProps.location.distanceAverage < 5000) {
            this.setState({ loopSpeed: 1000 });
        }
        else {
            this.setState({ loopSpeed: 2000 });
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
