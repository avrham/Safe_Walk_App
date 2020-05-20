import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar
} from 'react-native';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {CustomHeader} from '../export';
import config from '../../config.json';
import {observer, inject} from 'mobx-react';
import axios from 'axios';
import {IMAGE} from '../constans/Image';
import mergeByKey from 'array-merge-by-key';
import AnimatedLoader from 'react-native-animated-loader';

@inject('store')
@observer
export class RehabilitionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RehabPlanExsist: false,
      videoIds: '',
      videoStatus: [],
      iconName: '',
      status: '',
      visible: false,
      Rehab_Plan: [],
      mergeArray: [],
    };
  }

  componentDidMount() {
    this.checkIfRehabPlanExsist();
  }

  checkIfRehabPlanExsist = () => {
    if (this.props.store.userDetails.rehabPlanID != '') {
      this.setState({RehabPlanExsist: true});

      this.getVidoId();
    }
  };

  getVidoId = async () => {
    this.setState({visible: true});
    const options = {
      method: 'GET',
      url: `${config.SERVER_URL}/rehabPlan/${
        this.props.store.userDetails.rehabPlanID
      }`,
      headers: {
        'x-auth-token': this.props.store.userLoginDetails.token,
      },
    };

    try {
      const url = await axios(options);
      console.log(url);
      if (url.status === 200) {
        const length = url.data.videos.length;
        let i = 0;
        while (i < length) {
          const temp = url.data.videos[i].videoID;

          this.state.videoStatus.push({
            id: url.data.videos[i].videoID,
            status: url.data.videos[i].done,
          });

          if (i < length - 1) {
            this.setState(prevState => ({
              videoIds: prevState.videoIds.concat(`${temp},`),
            }));
          } else {
            this.setState(prevState => ({
              videoIds: prevState.videoIds.concat(temp),
            }));
          }
          i++;
        }

        this.getVideoDetails();
      } else {
        Alert.alert('error has occured, Please try again in a few minutes');
      }
    } catch (err) {
      alert(
        'error has occured when trying to return Data. please check your details',
      );
      console.log('err', err);
    }
    this.setState({visible: false});
  };

  getVideoDetails = async () => {
    const options = {
      method: 'GET',
      url: `${config.SERVER_URL}/video?videoIDs=${this.state.videoIds}`,
      headers: {
        'x-auth-token': this.props.store.userLoginDetails.token,
      },
    };

    try {
      const url = await axios(options);
      if (url.status === 200) {
        this.setState({Rehab_Plan: url.data});
      } else {
        Alert.alert('error has occured, Please try again in a few minutes');
      }
    } catch (err) {
      alert(
        'error has occured when trying to return Data. please check your details',
      );
      console.log('err', err);
    }
    const MergeArray = mergeByKey(
      'id',
      this.state.Rehab_Plan,
      this.state.videoStatus,
    );
    this.setState({mergeArray: MergeArray});
  };

  render() {
    const {visible} = this.state;

    return (
      <SafeAreaView style={styles.rehabView}>
        <StatusBar barStyle="dark-content"/>
        <CustomHeader
          title="Rehabilition"
          isRehabScreen={true}
          navigation={this.props.navigation}
        />
        {this.state.RehabPlanExsist && (
          <View>
            <AnimatedLoader
              visible={visible}
              overlayColor="rgba(255,255,255,0.75)"
              source={require('../constans/loader.json')}
              animationStyle={styles.lottie}
              speed={1}
            />
            <FlatList
              data={this.state.mergeArray}
              renderItem={({item}) => (
                <TubeItem
                  id={item.id}
                  title={item.name}
                  imageSrc={item.link}
                  iconName={item.status}
                  iconStatus={item.status ? 'DONE' : 'PRESS AFTER DONE'}
                />
              )}
            />
          </View>
        )}
        {!this.state.RehabPlanExsist && (
          <SafeAreaView style={styles.SafeAreaAlert}>
            <View style={styles.viewAlert}>
              <Image
                source={IMAGE.ICOM_ALERT}
                style={styles.alertImg}
                resizeMode="contain"
              />
              <Text style={styles.message}>
                The system does not yet have a Rehabilitation program
              </Text>
              <Text style={styles.message}>
                If you made test already, Your program will appear as soon as possible
              </Text>
            </View>
          </SafeAreaView>
        )}
      </SafeAreaView>
    );
  }
}

@inject('store')
@observer
export default class TubeItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImgPress: false,
    };
  }
  render() {
    return (
      <View>
        <WebView
          style={{width: '100%', height: 220}}
          source={{uri: this.props.imageSrc}}
        />
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
              fontFamily: 'Lato-Light',
              paddingTop: 10,
            }}>
            {this.props.title}
          </Text>
          <TouchableOpacity
            disabled={this.props.iconName || this.state.ImgPress ? true : false}
            style={{alignItems: 'center', paddingTop: 15}}
            onPress={this.videoDone}>
            <Image
              source={
                this.props.iconName || this.state.ImgPress
                  ? IMAGE.ICONE_DONE
                  : IMAGE.ICONE_NOT_DONE
              }
              style={{width: 30, height: 30, justifyContent: 'center'}}
              resizeMode="contain"
            />
            <Text style={styles.instructionText}>{this.props.iconStatus}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
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
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
  rehabView: {
    flex: 1,
    marginBottom: 100,
  },
  SafeAreaAlert: {
    flex: 1,
  },
  viewAlert: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertImg: {
    width: 50,
    height: 50,
    marginBottom: 50,
  },
  message: {
    fontSize: 20,
    fontFamily: 'ComicNeue-BoldItalic',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20,
  },
});
//onPress={() => this.props.navigation.navigate('TestProcess')}
/*if (this.props.status === true) {
  this.setState({iconName: IMAGE.ICONE_DONE, status: 'DONE'});
  cosole.log(this.state.iconName);
} else {
  this.setState({
    iconName: IMAGE.ICONE_NOT_DONE,
    status: 'PRESS AFTER DONE',
  });
}*/
