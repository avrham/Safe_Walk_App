import React, {Component} from 'react';
import {Text, View, SafeAreaView, TouchableOpacity,StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {CustomHeader} from '../export';

export class InstructionScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content"/>
        <CustomHeader
          title="Instruction Details"
          navigation={this.props.navigation}
        />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(32,53,70)'}}>
          <Text>Instruction here - test!</Text>
        </View>
      </SafeAreaView>
    );
  }
}
