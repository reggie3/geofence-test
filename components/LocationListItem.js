import React, { Component } from 'react';
import { Components } from 'expo';
import { connect } from 'react-redux';
import actions from '../actions/actions';
import { Text, View, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';




class LocationListItem extends Component {

    deleteMarker = () => {
        this.props.dispatch(actions.locationsActions.deleteMarker(
            this.props.location.ID
        ));
    }

    render() {
        return (
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    marginVertical: 2,
                    justifyContent: 'space-between',
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    alignItems: 'center'
                }}>
                <FontAwesome
                    name='map-marker'
                    color={this.props.location.pinColor}
                    size={48} />
                <Text
                    style={{
                        fontSize: 24
                    }}>
                    {this.props.location.name}
                </Text>
                <TouchableHighlight
                    activeOpacity={.5}
                    underlayColor='white'
                    onPress={this.deleteMarker.bind(this)}>
                    <View
                        style={{
                            borderRadius: 2,
                            backgroundColor: '#33aaff',
                            height: 48,
                            width: 48,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <FontAwesome
                            name='trash'
                            color={'white'}
                            size={32} />
                    </View>
                </TouchableHighlight>

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

export default connect(mapStateToProps, mapDispatchToProps)(LocationListItem);