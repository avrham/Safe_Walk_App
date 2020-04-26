import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {IMAGE} from './constans/Image';
import {observer, inject} from 'mobx-react';
import {observable} from 'mobx';

@inject('store')
@observer
export class CustomDrawerContent extends React.Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{height: 150, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            style={{width: 120, height: 120, borderRadius: 100}}
            source={{
              uri: this.props.store.userDetails.picture,
            }}
            resizeMode="contain"
          />
        </View>
        <ScrollView style={{marginLeft: 5}}>
          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={() => this.props.navigation.navigate('MenuTab')}>
            <Text>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={() => this.props.navigation.navigate('Notifications')}>
            <Text>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop: 500, marginLeft: 100}}
            onPress={() => this.props.navigation.navigate('Login')}>
            <Image
              style={{width: 40, height: 40}}
              source={IMAGE.ICON_LOGOUT}
              resizeMode="contain"
            />
            <Text>LogOut</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
