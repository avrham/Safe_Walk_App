import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {IMAGE} from '../constans/Image';
import {observer, inject} from 'mobx-react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

@inject('store')
@observer
export class CustomHeader extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    let {navigation, isTestScreen, isRehabScreen} = this.props;
    return (
      <SafeAreaView
        style={{
          flexDirection: 'row',
          height: 100,
          borderBottomColor: '#5D8B91',
          borderBottomWidth: 1,
        }}>
           <TouchableOpacity
             style={{ flex:1,flexDirection: 'row',alignItems: 'center'}}
             onPress={() => this.props.navigation.navigate('Test')}>
             <Image
               style={styles.logoIcon}
               source={IMAGE.ICON_LOGO}
             />
           </TouchableOpacity>
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            right:25
          }}>
          {(isTestScreen || isRehabScreen) && (
            <SafeAreaView>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                style={{width: 30, height: 30}}
                source={IMAGE.ICON_MENU}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </SafeAreaView>
          )}
          {!isRehabScreen && !isTestScreen && (
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => navigation.goBack()}>
              <Image
                style={{width: 25, height: 25}}
                source={IMAGE.ICON_RETURN}
                resizeMode="contain"
              />
              <Text style={{color:'#5D8B91'}}>Back</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
        <View
          style={{
            justifyContent: 'center',
            marginLeft:300,
            right:15
          }}>
            <Image
          source={{uri: this.props.store.userDetails.picture}}
          style={styles.sideMenuProfileIcon}
        />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  
  sideMenuProfileIcon: {
    alignSelf: 'center',
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 75,
  },
  logoIcon:{
    marginLeft:148, 
    width:125,
    height:49,
  }
});
