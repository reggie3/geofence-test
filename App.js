import { connect } from 'react-redux';
import actions from './actions/actions';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Location, Permissions, AppLoading } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import geolib from 'geolib';
import TimerMixin from 'react-timer-mixin';
const reactMixin = require('react-mixin');

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
    this.initLocationServices();
    // periodically check device location and write the results to 
    // the location markers
    this.performLocationChecking();

  }

  performLocationChecking() {
    if (this.props.appState.currentLocation.coords.latitude) {
      let currentLoc = this.props.appState.currentLocation.coords;
      // for each location marker, perform work in its reducer that stores the distance
      // from the device to the location
      this.props.locations.forEach((location) => {
        this.props.dispatch(actions.locationsActions.writeDistanceResults(
          location.ID,
          geolib.getDistance(
            { latitude: currentLoc.latitude, longitude: currentLoc.longitude },
            { latitude: location.loc[0], longitude: location.loc[1] },
            this.props.config.distanceCheckAccuracy,
            this.props.config.distanceCheckPrecision
          ),
          this.props.config.locationSensitivityDamping
        ));
      });
    }
    setTimeout(
      this.performLocationChecking.bind(this),
      this.props.config.distanceCheckInterval * 1000);
  }

  initLocationServices() {
    const that = this;
    const action = actions.appStateActions; // cache the action so that it's available in the callback
    this.getLocationAsync()
      .then((position) => {

        var initialPosition = JSON.stringify(position);
        that.setState({ initialPosition });
        that.props.dispatch(actions.appStateActions.setLocation(position.coords));
      })
      .catch((error) => {
        console.log("Error Getting Location", error);
      });
    let removeFunction = this.startWatchingLocation()
      .then((removeFunction) => {

      })
      .catch((error) => {
        console.log("Error Watching Location", error);
      });

    this.setState({ removeFunction })
  }

  async getLocationAsync() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      return Location.getCurrentPositionAsync({ enableHighAccuracy: false });
    } else {
      throw new Error('Location permission not granted');
    }
  }

  async startWatchingLocation() {
    const that = this;
    const action = actions.appStateActions; // cache the action so that it's available in the callback
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    // TODO: change time interval and distance interval for more accurate location detection
    let subscription = await Location.watchPositionAsync(
      {
        enableHighAccuracy: false,
        timeInterval: 10000,
        distanceInterval: 100,
      },
      (position) => {
        var lastPosition = JSON.stringify(position.coords);
        that.setState({ lastPosition });
        that.props.dispatch(action.setLocation(position.coords));
      });

    this.setState({ subscription });
  };


  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
        'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <Provider store={store}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {Platform.OS === 'android' &&
              <View style={styles.statusBarUnderlay} />}
            <RootNavigation />
          </View>
        </Provider>
      );
    } else {
      return <AppLoading />;
    }
  }
}


function connectWithStore(store, WrappedComponent, ...args) {
  var ConnectedWrappedComponent = connect(...args)(WrappedComponent)
  return function (props) {
    return <ConnectedWrappedComponent {...props} store={store} />
  }
}

const mapStateToProps = (state) => {
  return Object.assign({}, {
    locations: state.locations,
    appState: state.appState,
    config: state.config,
  });
}

const App = connectWithStore(store, AppContainer, mapStateToProps);
reactMixin(App.prototype, TimerMixin);
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
