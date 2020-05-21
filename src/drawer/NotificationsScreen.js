import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {CustomHeader} from '../export';
import {observer, inject} from 'mobx-react';
import {observable} from 'mobx';

@inject('store')
@observer
export class NotificationsScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <CustomHeader title="Notification" navigation={this.props.navigation} />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{this.props.store.userDetails.name}</Text>
          <Text>{this.firemas}</Text>
          <TextInput
            style={{
              paddingLeft: 10,
              marginTop: 20,
            }}
            onChangeText={val => (this.firemas = val)}
          />
          <Test firemas={this.firemas} />
        </View>
      </SafeAreaView>
    );
  }
}

const Test = observer(({firemas}) => <Text>{firemas}</Text>);
