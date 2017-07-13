import React from 'react';
import { ScrollView, Picker, StyleSheet, Slider, Text, View } from 'react-native';
import { connect } from 'react-redux';
import actions from '../actions/actions';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.configItemView}>
          <Text style={styles.configLabel}>
            Location Sensitivity Damping
        </Text>
          <Slider
            maximumValue={5}
            minimumValue={1}
            step={1}
            onValueChange={(itemValue, itemIndex) => {
              this.props.dispatch(actions.configActions.setLocationSensitivityDamping(itemValue))
            }} />
          <Text
            style={styles.sliderValue}>
            {this.props.config.locationSensitivityDamping}
          </Text>
        </View>
        <View style={styles.configItemView}>
          <Text style={styles.configLabel}>
            Distance Checking Interval (seconds)
        </Text>
          <Slider
            maximumValue={100}
            minimumValue={1}
            step={1}
            onValueChange={(itemValue, itemIndex) => {
              this.props.dispatch(actions.configActions.setDistanceCheckInterval(itemValue))
            }} />
          <Text
            style={styles.sliderValue}>
            {`${this.props.config.distanceCheckInterval} seconds`}
          </Text>
        </View>
        <View style={styles.configItemView}>
          <Text style={styles.configLabel}>
            Distance Accuracy (meters)
        </Text>
          <Slider
            onValueChange={(itemValue, itemIndex) => {
              this.props.dispatch(actions.configActions.setDistanceCheckInterval(itemValue))
            }} />
          <Text
            style={styles.sliderValue}>
            {`${this.props.config.distanceCheckAccuracy} meters`}
          </Text>
        </View>
        <View style={styles.configItemView}>
          <Text style={styles.configLabel}>
            Distance Precision
        </Text>

          <Picker
            selectedValue={this.props.config.distanceCheckPrecision}
            onValueChange={(itemValue, itemIndex) => {
              this.props.dispatch(actions.configActions.setDistanceCheckPrecision(itemValue))
            }}>
            <Picker.Item label="1 meter" value={1} />
            <Picker.Item label=".1 meters" value={.1} />
            <Picker.Item label=".01 meters" value={.01} />
          </Picker>
        </View>
      </ScrollView>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  configItemView: {
    flex: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  configLabel: {
    color: '#33aaff',
    fontSize: 20,
    paddingBottom: 5
  },
  sliderValue: {
    fontSize: 18,
    alignSelf: 'center'
  }
});
