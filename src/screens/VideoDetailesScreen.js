import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import {CustomHeader} from '../export';
import {WebView} from 'react-native-webview';
import AnimatedLoader from 'react-native-animated-loader';
import {StyleSheet} from 'react-native';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import {observer, inject} from 'mobx-react';
import axios from 'axios';
import config from '../../config.json';
import {Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

@inject('store')
@observer
export class VideoDetailesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.setState({visible: true});
    setTimeout(() => {
      this.setState({visible: false});
    }, 2000);
  }

  videoDone = async () => {
    this.setState({ImgPress: true});
    this.props.store.rehabProgress =
      this.props.store.rehabProgress +
      (1 / this.props.store.RehabPlan.videos.length) * 100;

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

  render() {
    const {id, title, videoLink, videoStatus, times} = this.props.route.params;
    const {visible} = this.state;

    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content" />
        <View>
          <CustomHeader navigation={this.props.navigation} />
        </View>
        <View style={{top: 20}}>
          <AnimatedLoader
            visible={visible}
            overlayColor="rgba(255,255,255,0.75)"
            source={require('../constans/loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
          <View style={styles.videoScreen}>
            <WebView
              style={{margin: 10}}
              source={{uri: videoLink}}
              scalesPageToFit={false}
            />
          </View>
          {times > 0 && (
            <View>
              <View style={styles.videoInfo}>
                <View style={{justifyContent: 'center'}}>
                  <Text style={styles.videoTitle}>{title}</Text>
                  <Text style={styles.videoTimes}>
                    {`You have ${times} more time to finish this mission!`}
                  </Text>
                </View>
              </View>
              <View style={{paddingHorizontal: 14, marginTop: 20}}>
                <Text style={{color: 'black', opacity: 0.8, lineHeight: 20}}>
                  To finish this mision yon need to watch this movie and press
                  the button when you done!
                </Text>
              </View>
              <View style={styles.ButtonContainer}>
                <Button
                  title="Executed"
                  ViewComponent={LinearGradient} // Don't forget this!
                  linearGradientProps={{
                    colors: ['#48A1A7', '#203546'],
                    start: {x: 0, y: 0.5},
                    end: {x: 1, y: 0.5},
                  }}
                  style={styles.Button}
                />
              </View>
            </View>
          )}
          {times === 0 && (
            <View>
              <View style={styles.videoInfo}>
                <View style={{justifyContent: 'center'}}>
                  <Text style={styles.videoTitle}>{title}</Text>
                  <Text style={styles.videoTimes}>
                    {`Well done you finish this mission!`}
                  </Text>
                </View>
              </View>
              <View style={styles.ButtonContainer}>
                <Button
                  icon={
                    <Icon name="checkmark-outline" size={15} color="white" />
                  }
                  title="Done"
                  ViewComponent={LinearGradient} // Don't forget this!
                  linearGradientProps={{
                    colors: ['#6EAF50', '#294B19'],
                    start: {x: 0, y: 0.5},
                    end: {x: 1, y: 0.5},
                  }}
                  disabled={true}
                  style={styles.Button}
                />
              </View>
            </View>
          )}
          <View style={styles.ProgressBarAnimated}>
            <Text style={styles.label}>
              {`You've made ${this.props.store.rehabProgress}% progress`}{' '}
            </Text>
            <ProgressBarAnimated
              width={300}
              maxValue={100}
              value={this.props.store.rehabProgress}
              backgroundColorOnComplete="#6CC644"
              backgroundColor="#C9BDBD"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default VideoDetailesScreen;

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
  videoScreen: {
    width: '100%',
    height: 270,
  },
  videoInfo: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 14,
  },

  videoTitle: {
    paddingLeft: 14,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 6,
  },
  videoTimes: {
    paddingLeft: 14,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
    opacity: 0.8,
  },
  ProgressBarAnimated: {
    marginTop: 20,
    alignItems: 'center',
  },
  label: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
  },
  ButtonContainer: {
    marginTop: 200,
    alignItems: 'center',
  },
  Button: {
    width: 200,
  },
});
