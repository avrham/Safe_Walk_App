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

@inject('store')
@observer
export class CustomHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  /*componentDidMount() {
    this.props.isRehabScreen ? this.calculateProcecc() : '';
  }

  calculateProcecc = () => {
    console.log(this.props.store.RehabPlan[1].status);
  };*/

  render() {
    let {navigation, isTestScreen, isRehabScreen, title} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 50,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          {isTestScreen && (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                style={{width: 30, height: 30, marginLeft: 10}}
                source={IMAGE.ICON_MENU}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {isRehabScreen && (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                style={{width: 30, height: 30, marginLeft: 10}}
                source={IMAGE.ICON_MENU}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {!isRehabScreen && !isTestScreen && (
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => navigation.goBack()}>
              <Image
                style={{width: 20, height: 20, marginLeft: 5}}
                source={IMAGE.ICON_RETURN}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            flex: 1.5,
            justifyContent: 'center',
          }}>
          <Text style={{textAlign: 'center'}}>{title}</Text>
        </View>
        <View
          style={{
            flex: 1,
          }}
        />
      </View>
    );
  }
}
