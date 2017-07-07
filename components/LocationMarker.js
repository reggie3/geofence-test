import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';


class LocationMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
            bounceDuration: 1
        };
    }

    componentDidMount() {
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: 10000,              // Make it take a while
            }
        ).start();                        // Starts the animation
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
            <Animated.View                 // Special animatable View
                style={{
                    opacity: this.state.fadeAnim,         // Bind opacity to animated value
                }}>
                <Expo.MapView.Marker
                    key={this.props.key}
                    pinColor={this.props.pinColor}
                    coordinate={{
                        latitude: this.props.location.loc[0],
                        longitude: this.props.location.loc[1],
                    }}
                />
            </Animated.View>
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
