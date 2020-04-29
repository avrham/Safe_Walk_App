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

  async componentDidMount() {
    this.props.isRehabScreen ? await this.calculateProgress() : '';
  }

  calculateProgress = () => {
    const length = this.props.store.RehabPlan.videos.length;
    let i, j;
    for (i = 0, j = 0; i < length; i++) {
      this.props.store.RehabPlan.videos[i].done ? j++ : '';
    }
    this.props.store.rehabProgress = (j / length) * 100;
  };

  render() {
    let {navigation, isTestScreen, isRehabScreen, title} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 70,
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
            justifyContent: 'center',
            flex: 1.5,
          }}>
          <Text style={{textAlign: 'center'}}>{title}</Text>
        </View>
        <View style={{flex: 1, right: -50}}>
          {isRehabScreen && (
            <AnimatedCircularProgress
              size={60}
              width={9}
              fill={this.props.store.rehabProgress}
              tintColor="#00e0ff"
              onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="#3d5875">
              {fill => <Text>{`${this.props.store.rehabProgress}%`}</Text>}
            </AnimatedCircularProgress>
          )}
        </View>
      </View>
    );
  }
}
