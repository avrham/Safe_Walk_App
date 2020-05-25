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
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={IMAGE.BACKGRUND}
          style={{width: undefined, padding: 16, paddingTop: 48}}>
          <Image
            source={{uri: this.props.store.userDetails.picture}}
            style={styles.sideMenuProfileIcon}
          />
          <Text style={styles.name}>{this.props.store.userDetails.name}</Text>
        </ImageBackground>
        {this.state.item.map(item => (
          <View style={{flex: 1, flexDirection: 'row', padding: 10, top:25, marginBottom:20}}>
            <Image
              source={item.icon}
              style={{width: 30, height: 30}}
            />
            <Text
              style={{
                fontSize: 20,
                left:40
              }}
              onPress={() => {
                this.props.navigation.navigate(item.screenToNavigate);
              }}>
              {item.navOptionName}
            </Text>
          </View>
        ))}
        <TouchableOpacity
          style={{marginTop: 400, marginLeft: '37%'}}
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
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    paddingTop: 20,
  },
  sideMenuProfileIcon: {
    height: 80,
    width: 80,
    borderWidth: 3,
    borderRadius: 40,
    borderColor: '#fff',
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 8,
  },
});

/*
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
*/
