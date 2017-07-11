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
                    image={require('../assets/images/usa-american-flag-waving-animated-gif-26.gif')}
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
        config: state.locations,
    });
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationMarker);
