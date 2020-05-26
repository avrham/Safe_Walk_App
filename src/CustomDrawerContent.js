import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {IMAGE} from './constans/Image';
import {observer, inject} from 'mobx-react';
import {observable} from 'mobx';
import {NavigationContainer} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

@inject('store')
@observer
export class CustomDrawerContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [
        {
          navOptionName: 'Profile',
          screenToNavigate: 'Profile',
          icon: IMAGE.ICON_PROFILE,
        },
        {
          navOptionName: 'Test',
          screenToNavigate: 'Test',
          icon: IMAGE.ICON_TEST_PRESS,
        },
        {
          navOptionName: 'Rehab Plan',
          screenToNavigate: 'RehabPlan',
          icon: IMAGE.ICON_RP,
        },
      ],
    };
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <ImageBackground
          source={IMAGE.BACKGRUND}
          style={{width: undefined, padding: hp('2%'), paddingTop: hp('8%')}}>
          <Image
            source={{uri: this.props.store.userDetails.picture}}
            style={styles.sideMenuProfileIcon}
          />
          <Text style={styles.name}>{this.props.store.userDetails.name}</Text>
        </ImageBackground>
        {this.state.item.map(item => (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              padding: hp('1.5%'),
              top: hp('2.5%'),
              marginBottom: hp('2%'),
            }}>
            <Image
              source={item.icon}
              style={{
                marginLeft: wp('3%'),
                width: wp('7%'),
                height: hp('3.5%'),
              }}
            />
            <Text
              style={{
                fontSize: wp('5%'),
                left: wp('7%'),
              }}
              onPress={() => {
                this.props.navigation.navigate(item.screenToNavigate);
              }}>
              {item.navOptionName}
            </Text>
          </View>
        ))}
        <TouchableOpacity
          style={{marginTop: hp('36%'), marginLeft: wp('27%')}}
          onPress={() => this.props.navigation.navigate('Login')}>
          <Image
            style={{width: 40, height: 40}}
            source={IMAGE.ICON_LOGOUT}
            resizeMode="contain"
          />
          <Text>LogOut</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sideMenuProfileIcon: {
    height: hp('9%'),
    width: wp('20%'),
    borderWidth: 3,
    borderRadius: 40,
    borderColor: '#fff',
  },
  name: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginVertical: 8,
  },
});
