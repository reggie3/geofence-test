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
import { View, Text } from 'react-native';

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
        let title;
        switch (routeName) {
          case 'MapImageSwapping':
            title = "Image Swapping";
            iconName = 'map';
            break;
          case 'MapRequestAnimationFrame':
            title = "RequestAnimationFrame";
            iconName = 'map';
            break;
          case 'Locations':
            title = "Locations";
            iconName = 'list';
            break;
          case 'Settings':
            title = "Settings";
            iconName = 'cog';
        }
        return (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center'
            }}>
            <FontAwesome
              name={iconName}
              size={30}
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
            <Text
              style={{
                fontSize: 8,
                color: focused ? Colors.tabIconSelected : Colors.tabIconDefault
              }}>
              {title}
            </Text>
          </View>
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
      showLabel: false,
    },
  }
);
