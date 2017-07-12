import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import AnimatedSprite from 'react-native-animated-sprite';
import monsterSprite from '../assets/sprites/monster/monsterSprite';

class LocationMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
            bounceDuration: 1,
             animationType: 'WALK',
        };
    }


    componentWillReceiveProps(nextProps) {
        // TODO: implement the average distance algorithm
        let distanceSum = 0;
        let averageDistance = distanceSum / this.props.config.locationSensitivityDamping;

        if (nextProps.location < 10) {
            this.setState({ bounceDuration: .5 });
        }
        else if (averageDistance < 100) {
            this.setState({ bounceDuration: 1 });
        }
        else if (averageDistance < 1000) {
            this.setState({ bounceDuration: 2 });
        }
        else if (averageDistance < 5000) {
            this.setState({ bounceDuration: 3 });
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
                <AnimatedSprite
                    ref={'monsterRef'}
                    sprite={monsterSprite}
                    animationFrameIndex={monsterSprite.animationIndex(this.state.animationType)}
                    loopAnimation={true}
                    coordinates={{
                        top: 100,
                        left: 100,
                    }}
                    size={{
                        width: monsterSprite.size.width * 1.65,
                        height: monsterSprite.size.height * 1.65,
                    }}
                    onPress={() => { this.onPress(); }}
                />
            </Expo.MapView.Marker>

        )
    }
}

const mapStateToProps = (state) => {
    return Object.assign({}, {
        locations: state.locations,
        config: state.locations,
    });
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationMarker);
