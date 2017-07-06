import React, { Component } from 'react';
import { Components } from 'expo';
import { connect } from 'react-redux';
import actions from '../actions/actions';
import {FlatList, Text} from 'react-native';


const LocationItem = (props) => {
    return(
        <Text>Location Item</Text>
    )
}

class LocationsScreen extends Component {

    render() {
        return (
           <FlatList
                data={this.props.locations}
                keyExtractor={(location, index) => index}
                renderItem={({ item, index }) => <LocationItem
                  key={index}
                  location={item} />
                }

              />
        );
    }
}

const mapStateToProps = (state) => {
    return Object.assign({}, {
        locations: state.locations,
    });
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationsScreen);