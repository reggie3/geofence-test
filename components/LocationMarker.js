import React, { Component } from 'react';
import { View, Animated, StyleSheet, Dimensions, PixelRatio, Text } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';


class LocationMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
            bounceDuration: 1,
            markerPosition: { x: 100, y: 100 }
        };
    }

    componentWillMount = () => {
        this.setState({ viewport: Dimensions.get('window') });
        var { height, width } = Dimensions.get('window');
        this.setState({
            viewport: { width: width, height: height }
        },
            this.setMarkerPosition);
    }

    componentWillReceiveProps(nextProps) {
        this.setMarkerPosition();
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

    setMarkerPosition() {
        // longitude of the right side of your map
        let rightLongitude = this.props.region.longitude + (this.props.region.longitudeDelta / 2);
        // longitude of the left side of your map
        let leftLongitude = this.props.region.longitude - (this.props.region.longitudeDelta / 2);
        // latitude of the top side of your map
        let topLatitude = this.props.region.latitude - (this.props.region.latitudeDelta / 2);
        // latitude of the bottom side of your map
        let bottomLatitude = this.props.region.latitude + (this.props.region.latitudeDelta / 2);

        // this.props.position contains the longitude/latitude of your marker  
        // X position of your component in pixels
        let left = (this.state.viewport.width / PixelRatio.get()
            * (this.props.location.loc[1] - leftLongitude)
            / (rightLongitude - leftLongitude))
            - (this.state.viewport.width / PixelRatio.get() / 2);
        // Y position of your component in pixels   
        let top = ((this.state.viewport.height) / PixelRatio.get()
            * (this.props.location.loc[0] - bottomLatitude)
            / (topLatitude - bottomLatitude))
            - (this.state.viewport.width / PixelRatio.get() / 2)
            ;
        let markerPosition = { x: left, y: top };
        this.setState({
            markerPosition: markerPosition
        });
        console.log(`postion set: ${markerPosition.x }, ${markerPosition.y}`);
    }



    render() {
        
        return (
            <View
                key={this.props.key}
                style={{
                    position: 'absolute',
                    left: this.state.markerPosition.x,
                    top: this.state.markerPosition.y
                }}>
                <Text
                style={{color:'red'}}>Hello</Text>
            </View>

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
