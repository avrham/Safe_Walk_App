import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import {IMAGE} from '../constans/Image';
import {observer, inject} from 'mobx-react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

@inject('store')
@observer
export class CustomHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      navigation,
      isTestScreen,
      isRehabScreen,
      isTestProcess,
      videoDetailes,
    } = this.props;
    return (
      <SafeAreaView
        style={{
          flexDirection: 'row',
          height: hp('10%'),
          borderBottomColor: '#5D8B91',
          borderBottomWidth: 1,
        }}>
        {(isTestScreen || isRehabScreen || !isTestProcess) && (
          <TouchableOpacity
            style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
            onPress={() => this.props.navigation.navigate('Test')}>
            <Image style={styles.logoIcon} source={IMAGE.ICON_LOGO} />
          </TouchableOpacity>
        )}
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            right: wp('40%'),
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
          {!isRehabScreen && !isTestScreen && !isTestProcess && !videoDetailes && (
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => navigation.goBack()}>
              <Image
                style={{width: wp('6%'), height: hp('5%')}}
                source={IMAGE.ICON_RETURN}
                resizeMode="contain"
              />
              <Text style={{width: wp('10%'), color: '#5D8B91'}}>Back</Text>
            </TouchableOpacity>
          )}
          {videoDetailes && (
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => this.props.navigation.navigate('RehabPlan')}>
              <Image
                style={{width: wp('6%'), height: hp('5%')}}
                source={IMAGE.ICON_RETURN}
                resizeMode="contain"
              />
              <Text style={{width: wp('10%'), color: '#5D8B91'}}>Back</Text>
            </TouchableOpacity>
          )}
          {isTestProcess && (
            <TouchableOpacity
              disabled={true}
              style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{
                  marginLeft: wp('73%'),
                  width: wp('34%'),
                  height: hp('6%'),
                }}
                source={IMAGE.ICON_LOGO}
              />
            </TouchableOpacity>
          )}
        </SafeAreaView>
        <View
          style={{
            justifyContent: 'center',
            right: wp('3%'),
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
    height: hp('6%'),
    width: wp('13%'),
    borderWidth: 1,
    borderRadius: 75,
  },
  logoIcon: {
    marginLeft: wp('33%'),
    width: wp('34%'),
    height: hp('6%'),
  },
});
