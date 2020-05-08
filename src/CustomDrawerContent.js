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
  constructor(props) {
    super(props);
    this.state = {
      item: [
        {
          navOptionName: 'Profile',
          screenToNavigate: 'MenuTab',
        },
        {
          navOptionName: 'Test',
          screenToNavigate: 'Test',
        },
        {
          navOptionName: 'Rehab Plan',
          screenToNavigate: 'Rehab Plan',
        },
      ],
    };
  }
  render() {
    return (
      <View style={styles.sideMenuContainer}>
        <Image
          source={{uri: this.props.store.userDetails.picture}}
          style={styles.sideMenuProfileIcon}
        />
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#e2e2e2',
            marginTop: 25,
          }}
        />
        {/*Setting up Navigation Options from option array using loop*/}
        <View style={{width: '100%'}}>
          {this.state.item.map(item => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <View style={{marginRight: 10, marginLeft: 20}} />
              <Text
                style={{
                  fontSize: 15,
                }}
                onPress={() => {
                  this.props.navigation.navigate(item.screenToNavigate);
                }}>
                {item.navOptionName}
              </Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={{marginTop: 500}}
          onPress={() => this.props.navigation.navigate('Login')}>
          <Image
            style={{width: 40, height: 40}}
            source={IMAGE.ICON_LOGOUT}
            resizeMode="contain"
          />
          <Text>LogOut</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  sideMenuProfileIcon: {
    top: 20,
    alignSelf: 'center',
    height: 150,
    width: 150,
    borderWidth: 1,
    borderRadius: 75,
  },
});

/*<SafeAreaView style={{flex: 1}}>
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
</SafeAreaView>*/
