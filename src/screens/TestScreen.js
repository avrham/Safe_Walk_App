import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { CustomHeader } from '../export';
import { IMAGE } from '../constans/Image';
import AnimatedLoader from 'react-native-animated-loader';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import config from '../../config.json';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button } from 'react-native-elements';

@inject('store')
@observer
export class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      shouldRenderTestProcessPage: false,
      abnormality: false,
      testFinished: false,
      shouldStand: true,
      shouldWalk: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    if (this.props.store.userDetails.rehabPlanID !== '') {
      this.calculateProgress();
    }
  }

  calculateProgress = () => {
    const allVideolength = this.props.store.RehabPlan.videos.length;
    let timesOfVideo = 0;
    let timesLeft = 0;
    let i, j;
    for (i = 0, j = 0; i < allVideolength; i++) {
      timesOfVideo = timesOfVideo + this.props.store.RehabPlan.videos[i].times;
      timesLeft = timesLeft + this.props.store.RehabPlan.videos[i].timesLeft;
    }
    this.props.store.rehabProgress = Number(
      ((1 - timesLeft / timesOfVideo) * 100).toFixed(1),
    );
    this.props.store.timesOfAllVideo = timesOfVideo;
  };

  getKitDetails(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const options = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        };
        const response = await axios.get(
          `${config.SERVER_URL}/sensorsKit/${
          this.props.store.userDetails.sensorsKitID
          }`,
          options,
        );
        return resolve(response.data);
      } catch (ex) {
        return reject(new Error(ex.response.data.message));
      }
    });
  }

  createTest(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const options = {
          headers: { 'x-auth-token': token },
        };
        const response = await axios.post(
          `${config.SERVER_URL}/test`,
          null,
          options,
        );
        return resolve(response.data);
      } catch (ex) {
        return reject(new Error(ex.response.data.message));
      }
    });
  }

  async removeTest(token, testID) {
    try {
      const options = {
        headers: { 'x-auth-token': token },
      };
      await axios.delete(`${config.SERVER_URL}/test/${testID}`, options);
      return;
    } catch (ex) {
      return;
    }
  }

  updateTest(token, testID, abnormality) {
    return new Promise(async (resolve, reject) => {
      try {
        const body = { abnormality: abnormality };
        const options = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        };
        const response = await axios.put(
          `${config.SERVER_URL}/test/${testID}`,
          body,
          options,
        );
        return resolve(response.data);
      } catch (ex) {
        return reject(new Error(ex.response.data.message));
      }
    });
  }

  updatePatient(token, patientID, waitingStatus) {
    return new Promise(async (resolve, reject) => {
      try {
        const body = { waitForPlan: waitingStatus };
        const options = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        };
        const response = await axios.put(
          `${config.SERVER_URL}/patient/${patientID}`,
          body,
          options,
        );
        return resolve(response.data);
      } catch (ex) {
        return reject(new Error(ex.response.data.message));
      }
    });
  }

  scanGaitAndAnalyze(ip, sensorName, token, testID) {
    return new Promise(async (resolve, reject) => {
      try {
        const options = { timeout: 1500 };
        const response = await axios.get(`http://${ip}`, options);
        try {
          const stringLength = response.data.length;
          let output;
          if (response.data[stringLength - 2] === ',')
            output =
              response.data.slice(0, stringLength - 2) +
              response.data.slice(stringLength - 1, stringLength);
          output = JSON.parse(output);
          return resolve(this.analayseData(token, output, sensorName, testID));
        } catch (ex) {
          return reject(
            new Error(
              `${sensorName} has failed during the sample, please make another test`,
            ),
          );
        }
      } catch (ex) {
        return reject(
          new Error(
            `${sensorName} is probably not connected`,
          ),
        );
      }
    });
  }

  analayseData(token, rawData, sensorName, testID) {
    return new Promise(async (resolve, reject) => {
      if (!this.state.visible) this.setState({ visible: true });
      try {
        const body = {
          sensorName: sensorName,
          rawData: rawData,
          testID: testID,
        };
        const options = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        };
        const response = await axios.post(
          `${config.SERVER_URL}/sensorsKit/${
          this.props.store.userDetails.sensorsKitID
          }/analyzeRawData`,
          body,
          options,
        );
        return resolve(response.data);
      } catch (ex) {
        return reject(new Error(ex.response.data.message));
      }
    });
  }

  StartTestHandler = async () => {
    let testID, timeout;
    const token = this.props.store.userLoginDetails.token;
    try {
      this.setState({ visible: true, errorMessage: '' });
      const { IPs } = await this.getKitDetails(token);
      const test = await this.createTest(token);
      testID = test.id;
      let promise1; // promise2, promise3, promise4, promise5, promise6, promise7;
      this.setState({ visible: false, shouldRenderTestProcessPage: true });
      timeout = setTimeout(() => {
        this.setState({
          shouldStand: false,
          shouldWalk: true,
        });
      }, 5000);
      promise1 = this.scanGaitAndAnalyze(IPs.sensor1, 'sensor1', token, testID);
      // promise2 = this.scanGaitAndAnalyze(IPs.sensor2, 'sensor2', token, testID);
      // promise3 = this.scanGaitAndAnalyze(IPs.sensor3, 'sensor3', token, testID);
      // promise4 = this.scanGaitAndAnalyze(IPs.sensor4, 'sensor4', token, testID);
      // promise5 = this.scanGaitAndAnalyze(IPs.sensor5, 'sensor5', token, testID);
      // promise6 = this.scanGaitAndAnalyze(IPs.sensor6, 'sensor6', token, testID);
      // promise7 = this.scanGaitAndAnalyze(IPs.sensor7, 'sensor7', token, testID);
      // const conclusions = await Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7]);
      const conclusions = await Promise.all([promise1]);
      let abnormality = false,
        waitingStatus = false;
      for (let conclusion of conclusions)
        if (conclusion.failureObserved) {
          abnormality = true;
          waitingStatus = true;
          break;
        }
      await this.updateTest(token, testID, abnormality);
      await this.updatePatient(
        token,
        this.props.store.userDetails.id,
        waitingStatus,
      );
      this.setState({
        visible: false,
        testFinished: true,
        abnormality: abnormality,
      });
    } catch (err) {
      clearTimeout(timeout);
      this.setState({
        visible: false,
        shouldRenderTestProcessPage: false,
        abnormality: false,
        testFinished: false,
        shouldStand: true,
        shouldWalk: false,
        errorMessage: err.message,
      });
      // alert(err.message);
      if (testID) this.removeTest(token, testID);
    }
  };

  renderTestPage() {
    this.state.errorMessage ? alert(this.state.errorMessage) : null;
    console.log(this.state.errorMessage);
    return (
      <SafeAreaView style={styles.app}>
        <CustomHeader navigation={this.props.navigation} isTestScreen={true} />
        <StatusBar barStyle="dark-content" />
        <AnimatedLoader
          visible={this.state.visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../constans/loader.json')}
          animationStyle={styles.lottie}
          speed={2}
        />
        <View style={styles.background}>
          <Text style={styles.title}>
            Hey {this.props.store.userDetails.name} !
          </Text>
          <Text style={styles.sentence}>
            Before starting, please turn on your kit
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.StartTestHandler}>
            <Text style={styles.buttonText}>Start Gait Test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.instructionButton}
            onPress={() => this.props.navigation.navigate('Description')}>
            <Text style={styles.instructionTitle}>Instructions</Text>
          </TouchableOpacity>
          {this.props.store.userDetails.rehabPlanID !== '' && (
            <TouchableOpacity
              style={styles.ProgressBarAnimated}
              onPress={() => this.props.navigation.navigate('RehabPlan')}>
              <Text style={styles.label}>
                {`You've made ${
                  this.props.store.rehabProgress
                  }% progress of your rehab program`}
              </Text>
              <ProgressBarAnimated
                width={wp('72%')}
                maxValue={100}
                value={this.props.store.rehabProgress}
                backgroundColorOnComplete="#6CC644"
                backgroundColor="#C9BDBD"
              />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  renderTestProcess() {
    const { visible } = this.state;
    return (
      <SafeAreaView style={styles.app}>
        <CustomHeader navigation={this.props.navigation} isTestProcess={true} />
        <StatusBar barStyle="dark-content" />
        <AnimatedLoader
          visible={visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../constans/loader.json')}
          animationStyle={styles.lottie}
          speed={2}
        />
        <View style={styles.background}>
          {this.state.shouldStand && (
            <View>
              <Text style={styles.processTitle}>
                Please stand in place for 5 seconds
              </Text>
              <View style={styles.CircleTimer}>
                <CountdownCircleTimer
                  isPlaying
                  duration={5}
                  colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}>
                  {({ remainingTime, animatedColor }) => (
                    <Animated.Text
                      style={{
                        ...styles.remainingTime,
                        color: animatedColor,
                        fontSize: wp('25%'),
                      }}>
                      {remainingTime}
                    </Animated.Text>
                  )}
                </CountdownCircleTimer>
              </View>
            </View>
          )}
          {this.state.shouldWalk && (
            <View>
              <Text style={styles.processTitle}>
                Pleast start walking in a straight line for 15 seconds
              </Text>
              <View style={styles.CircleTimer}>
                <CountdownCircleTimer
                  isPlaying
                  duration={15}
                  colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}>
                  {({ remainingTime, animatedColor }) => (
                    <Animated.Text
                      style={{
                        ...styles.remainingTime,
                        color: animatedColor,
                        fontSize: wp('25%'),
                      }}>
                      {remainingTime}
                    </Animated.Text>
                  )}
                </CountdownCircleTimer>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  renderTestResults() {
    return (
      <SafeAreaView style={styles.app}>
        <CustomHeader navigation={this.props.navigation} isTestProcess={true} />
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.state.abnormality ? (
            <SafeAreaView style={styles.SafeAreaAlert}>
              <View style={styles.viewAlert}>
                <Image
                  source={IMAGE.ICOM_ALERT}
                  style={styles.alertImg}
                  resizeMode="contain"
                />
                <Text style={styles.message}>
                  Walking model might have problem !
                </Text>
                <Text style={styles.message}>
                  Your test results were sent to the main lab
                </Text>
                <Text style={styles.message}>
                  Rehabilitation program will be sent as soon as possible
                </Text>
              </View>
            </SafeAreaView>
          ) : (
              <SafeAreaView style={styles.SafeAreaAlert}>
                <View style={styles.viewAlert}>
                  <Image
                    source={IMAGE.ICON_TESTOK}
                    style={styles.alertImg}
                    resizeMode="contain"
                  />
                  <Text style={styles.message}>
                    We're happy to let you know that your Walking model is ok and
                    not might have problem !
                </Text>
                </View>
              </SafeAreaView>
            )}

          <Button
            style={styles.BackButton}
            onPress={() => this.setState({ shouldRenderTestProcessPage: false })}
            title="Back Home"
            type="outline"
          //containerStyle={{color: 'black'}}
          />
        </View>
      </SafeAreaView>
    );
  }

  render() {
    if (this.state.shouldRenderTestProcessPage && !this.state.testFinished)
      return this.renderTestProcess();

    if (this.state.shouldRenderTestProcessPage && this.state.testFinished)
      return this.renderTestResults();

    if (!this.state.shouldRenderTestProcessPage) return this.renderTestPage();
  }
}

const styles = StyleSheet.create({
  viewAlert: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: wp('6%'),
    fontFamily: 'ComicNeue-BoldItalic',
    justifyContent: 'center',
    textAlign: 'center',
    padding: wp('5%'),
  },
  alertImg: {
    width: wp('10%'),
    height: hp('10%'),
    marginBottom: hp('7%'),
  },
  SafeAreaAlert: {
    flex: 1,
  },
  lottie: {
    width: wp('55%'),
    height: hp('10%'),
  },

  background: {
    flex: 1,
    alignItems: 'center',
  },

  CircleTimer: {
    top: hp('30%'),
    flex: 1,
    alignItems: 'center',
  },

  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: wp('7%'),
    marginBottom: wp('3%'),
    top: hp('7%'),
  },

  processTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: wp('5.5%'),
    marginBottom: wp('3%'),
    top: hp('10%'),
    textAlign: 'center',
  },

  sentence: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: wp('5%'),
    opacity: 0.8,
    top: hp('7%'),
  },

  button: {
    backgroundColor: '#5D8B91',
    height: hp('23%'),
    width: wp('50%'),
    padding: 5,
    borderRadius: hp('23%'),
    top: hp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#C9BDBD',
  },
  BackButton: {
    marginBottom: hp('5%'),
    textAlign: 'center',
    justifyContent: 'center',
    borderColor: '#5D8B91',
    borderRadius: 5,
    width: wp('63%'),
    height: hp('6%'),
    alignItems: 'center',
  },
  BackBtnTitle: {
    fontSize: wp('5.5%'),
    color: '#5D8B91',
    backgroundColor: '#5D8B91',
  },

  buttonText: {
    color: '#FAFAFA',
    fontFamily: 'Lato-Bold',
    fontSize: wp('6%'),
  },

  instructionButton: {
    top: hp('30%'),
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D8B91',
    borderRadius: 5,
    width: wp('63%'),
    height: hp('6%'),
    alignItems: 'center',
  },

  instructionTitle: {
    fontSize: wp('5.5%'),
    fontFamily: 'Lato-Regular',
    color: '#FAFAFA',
  },

  app: {
    flex: 1,
  },

  label: {
    color: 'black',
    opacity: 0.8,
    fontSize: wp('3.5%'),
    fontWeight: '500',
    marginBottom: wp('3%'),
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
  },

  ProgressBarAnimated: {
    marginTop: hp('33%'),
    borderColor: 'black',
    borderWidth: 2,
    borderColor: '#C9BDBD',
    padding: 10,
    borderRadius: 5,
  },
});
