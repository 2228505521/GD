/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Main from "./components/main/GDMain"

export default class GD extends Component {
  render() {
    return (
      <Main />
    );
  }
}



AppRegistry.registerComponent('GD', () => GD);
