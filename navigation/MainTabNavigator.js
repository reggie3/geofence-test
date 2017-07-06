/**
 * @flow
 */

import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import MapScreen from '../screens/MapScreen';
import LocationsScreen from '../screens/LocationsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default TabNavigator(
  {
    Map: {
      screen: MapScreen
    },
    Locations: {
      screen: LocationsScreen
    },
    Settings: {
      screen: SettingsScreen
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      // Set the tab bar icon
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Map':
            iconName = 'map';
            break;
          case 'Locations':
            iconName = 'list';
            break;
          case 'Settings':
            iconName = 'cog';
        }
        return (
          <FontAwesome
            name={iconName}
            size={32}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    // Put tab bar on bottom of screen on both platforms
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    // Disable animation so that iOS/Android have same behaviors
    animationEnabled: false,
    // Don't show the labels
    tabBarOptions: {
      showLabel: false,
    },
  }
);
