import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {CustomHeader} from '../export';
import config from '../../config.json';
import {observer, inject} from 'mobx-react';
import axios from 'axios';
import {IMAGE} from '../constans/Image';
import mergeByKey from 'array-merge-by-key';
import AnimatedLoader from 'react-native-animated-loader';
import {ListItem} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import ProgressBarAnimated from 'react-native-progress-bar-animated';

@inject('store')
@observer
export class RehabilitionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RehabPlanExsist: false,
      videoIds: '',
      videoStatusArray: [],
      iconName: '',
      videoStatus: '',
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

  getVidoId = () => {
    this.setState({visible: true});
    const length = this.props.store.RehabPlan.videos.length;
    let i = 0;
    while (i < length) {
      const temp = this.props.store.RehabPlan.videos[i].videoID;
      this.state.videoStatusArray.push({
        id: this.props.store.RehabPlan.videos[i].videoID,
        Videostatus: this.props.store.RehabPlan.videos[i].done,
        times: this.props.store.RehabPlan.videos[i].timesLeft,
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
    setTimeout(() => {
      this.getVideoDetails();
    }, 500);
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
        console.log(url.data);
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
      this.state.videoStatusArray,
    );
    this.setState({mergeArray: MergeArray});
    console.log(this.state.mergeArray);

    setTimeout(() => {
      this.setState({visible: false});
    }, 1000);
  };

  FlatListItemSeparator = () => <View style={styles.line} />;

  renderItem = ({item}) =>
    item.times != 0 ? (
      <ListItem
        onPress={() =>
          this.props.navigation.navigate('VideoDetailes', {
            id: item.id,
            title: item.name,
            videoLink: item.link,
            videoStatus: item.Videostatus,
            times: item.times,
          })
        }
        Component={TouchableScale}
        friction={90}
        tension={100}
        activeScale={0.95}
        linearGradientProps={{
          colors: ['#48A1A7', '#203546'],
          start: {x: 1, y: 0},
          end: {x: 0.2, y: 0},
        }}
        ViewComponent={LinearGradient}
        leftAvatar={{
          rounded: true,
          source: {
            uri:
              'https://c.static-nike.com/a/images/f_auto/dpr_1.0/h_700,c_limit/285d7865-7d0a-4b91-9267-56f5f85004d7/nike-training-club-app-home-workouts-more.jpg',
          },
        }}
        title={item.name}
        titleStyle={{color: 'white', fontWeight: 'bold'}}
        subtitleStyle={{color: 'white'}}
        subtitle={`you have ${item.times} more times to compleate this part!`}
        chevron={{color: 'white'}}
        style={{height: 100}}
      />
    ) : (
      <ListItem
        onPress={() =>
          this.props.navigation.navigate('VideoDetailes', {
            id: item.id,
            title: item.name,
            videoLink: item.link,
            videoStatus: item.Videostatus,
            times: item.times,
          })
        }
        Component={TouchableScale}
        friction={90}
        tension={100}
        activeScale={0.95}
        linearGradientProps={{
          colors: ['#6EAF50', '#294B19'],
          start: {x: 1, y: 0},
          end: {x: 0.2, y: 0},
        }}
        ViewComponent={LinearGradient}
        leftAvatar={{
          rounded: true,
          source: {
            uri:
              'https://c.static-nike.com/a/images/f_auto/dpr_1.0/h_700,c_limit/285d7865-7d0a-4b91-9267-56f5f85004d7/nike-training-club-app-home-workouts-more.jpg',
          },
        }}
        title={item.name}
        titleStyle={{color: 'white', fontWeight: 'bold'}}
        subtitleStyle={{color: 'white'}}
        subtitle={'Well done you finish this task!'}
        chevron={{color: 'white'}}
      />
    );

  render() {
    const {visible} = this.state;

    return (
      <SafeAreaView style={styles.rehabView}>
        <StatusBar barStyle="dark-content" />
        <CustomHeader isRehabScreen={true} navigation={this.props.navigation} />
        <View style={styles.background}>
          {this.state.RehabPlanExsist && (
            <View style={styles.listContainer}>
              <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,0.75)"
                source={require('../constans/loader.json')}
                animationStyle={styles.lottie}
                speed={1}
              />
              <View style={{}}>
                <Text style={styles.descriptionTitle}>
                  {this.props.store.RehabPlan.instructions}
                </Text>
              </View>
              <View style={{width: Dimensions.get('window').width - 14}}>
                <FlatList
                  data={this.state.mergeArray}
                  renderItem={this.renderItem}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  style={styles.FlatList}
                />
              </View>
              <View style={styles.ProgressBarAnimated}>
                <Text style={styles.label}>
                  {`You've made ${this.props.store.rehabProgress}% progress`}
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
                  If you made test already, Your program will appear as soon as
                  possible
                </Text>
              </View>
            </SafeAreaView>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
  rehabView: {
    flex: 1,
  },
  background: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
  },
  SafeAreaAlert: {
    flex: 1,
  },
  descriptionTitle: {
    color: '#C9BDBD',
    fontFamily: 'Lato-Bold',
    fontSize: 25,
    top: 20,
    textAlign: 'center',
  },
  FlatList: {
    top: 30,
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
  line: {
    height: 15,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  ProgressBarAnimated: {
    top: 50,
  },
  label: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
  },
  listContainer: {
    height: 600,
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
