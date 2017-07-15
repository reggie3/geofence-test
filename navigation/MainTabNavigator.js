/**
 * @flow
 */

import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import MapImageSwappingScreen from '../screens/MapImageSwappingScreen';
import MapRequestAnimationFrameScreen from '../screens/MapRequestAnimationFrameScreen';

import LocationsScreen from '../screens/LocationsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default TabNavigator(
  {
    MapImageSwapping: {
      screen: MapImageSwappingScreen
    },
    MapRequestAnimationFrame: {
      screen: MapRequestAnimationFrameScreen
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
          case 'MapImageSwapping':
            iconName = 'map';
            break;
          case 'MapRequestAnimationFrame':
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
    animationEnabled: true,
    // Don't show the labels
    tabBarOptions: {
      showLabel: true,
    },
  }
);
