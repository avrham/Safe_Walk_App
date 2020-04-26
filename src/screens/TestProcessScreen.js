import React, {Component} from 'react';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import {CustomHeader} from '../export';

export class TestProcessScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <CustomHeader title="Test Process" navigation={this.props.navigation} />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Test Process</Text>
        </View>
      </SafeAreaView>
    );
  }
}
