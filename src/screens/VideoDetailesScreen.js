import React, { Component } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { StyleSheet } from 'react-native';
import { CustomHeader } from '../export';
import { WebView } from 'react-native-webview';
import { CustomAppStatusBar } from '../components/AppBar'
import {colorStatus} from '../components/colors'


export class VideoDetailesScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(32,53,70)' }}>
        <CustomAppStatusBar
         backgroundColor={colorStatus}></CustomAppStatusBar> 
        <View >
          <CustomHeader
            navigation={this.props.navigation}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{
            color: '#C9BDBD',
            fontFamily: 'Lato-Bold',
            fontSize: 24,
            textAlign: 'center',
            bottom: 100
          }}>Before you start your test, please watch this movie!</Text>
          <View style={{ width: '100%', height: 250 }}>
            <WebView style={{ margin: 10 }} source={{ uri: 'https://www.youtube.com/embed/CdCClhtKH2Q' }} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
