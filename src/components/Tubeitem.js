import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TouchableOpacityComponent,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {CustomHeader} from '../export';
import config from '../../config.json';
import {observer, inject} from 'mobx-react';
import {observable, action} from 'mobx';
import axios from 'axios';
import {IMAGE} from '../constans/Image';

@inject('store')
@observer
export default class Tubeitem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImgPress: false,
    };
  }
  render() {
    let {id, title, imageSrc, iconName, iconStatus} = this.props;
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View>
          <WebView style={{width: '100%', height: 220}} source={imageSrc} />
          <SafeAreaView
            style={{
              flex: 1,
              alignItems: 'center',
              height: 100,
              paddingTop: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'ComicNeue-BoldItalic',
                paddingTop: 10,
              }}>
              {title}
            </Text>
            <TouchableOpacity
              style={{alignItems: 'center', paddingTop: 15}}
              onPress={this.videoDone()}>
              <Image
                source={
                  iconName || ImgPress ? IMAGE.ICONE_DONE : IMAGE.ICONE_NOT_DONE
                }
                style={{width: 30, height: 30, justifyContent: 'center'}}
                resizeMode="contain"
              />
              <Text>{iconStatus}</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  videoDone = async () => {
    this.setState({ImgPress: true});
    const options = {
      method: 'POST',
      url: `${config.SERVER_URL}/rehabPlan/${
        this.props.store.userDetails.rehabPlanID
      }/markVideo`,
      data: {
        videoID: this.props.id,
      },
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': this.props.store.userLoginDetails.token,
      },
    };
    try {
      const url = await axios(options);
      console.log(url.data);

      if (url.status === 200) {
      } else {
        Alert.alert('error has occured, Please try again in a few minutes');
      }
    } catch (err) {
      alert(
        'error has occured when trying to return Data. please check your details',
      );
      console.log('err', err);
    }
  };
}
