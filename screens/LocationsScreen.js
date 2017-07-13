import React, { Component } from 'react';
import { Components } from 'expo';
import { connect } from 'react-redux';
import actions from '../actions/actions';
import {FlatList, Text, View} from 'react-native';
import LocationListItem from '../components/LocationListItem'

class LocationsScreen extends Component {

    render() {
        return (
            <View
            style={{
                padding: 10
            }}>
           <FlatList
                data={this.props.locations}
                keyExtractor={(location, index) => index}
                renderItem={({ item, index }) => <LocationListItem
                  key={index}
                  location={item} />
                }
              />
              </View>
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