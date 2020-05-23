import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { CustomHeader } from '../export';
import { IMAGE } from '../constans/Image';
import AnimatedLoader from 'react-native-animated-loader';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import config from '../../config.json';
import ProgressBarAnimated from 'react-native-progress-bar-animated';

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
      errorMessage: ''
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
    this.props.store.rehabProgress = Number(((1 - timesLeft / timesOfVideo) * 100).toFixed(1));
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
        const response = await axios.get(`${config.SERVER_URL}/sensorsKit/${this.props.store.userDetails.sensorsKitID}`, options);
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
          headers: { 'x-auth-token': token }
        };
        const response = await axios.post(`${config.SERVER_URL}/test`, null, options);
        return resolve(response.data);
      } catch (ex) {
        return reject(new Error(ex.response.data.message));
      }
    });
  }

  async removeTest(token, testID) {
    try {
      const options = {
        headers: { 'x-auth-token': token }
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
            'x-auth-token': token
          }
        };
        const response = await axios.put(`${config.SERVER_URL}/test/${testID}`, body, options);
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
            'x-auth-token': token
          }
        };
        const response = await axios.put(`${config.SERVER_URL}/patient/${patientID}`, body, options);
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
            output = response.data.slice(0, stringLength - 2) + response.data.slice(stringLength - 1, stringLength);
          output = JSON.parse(output);
          return resolve(this.analayseData(token, output, sensorName, testID));
        } catch (ex) {
          return reject(new Error(`${sensorName} has failed during the sample, please make another test`));
        }
      } catch (ex) {
        return reject(new Error(`${sensorName} has failed during the sample, please make another test`));
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
        const response = await axios.post(`${config.SERVER_URL}/sensorsKit/${this.props.store.userDetails.sensorsKitID}/analyzeRawData`, body, options);
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
          shouldWalk: true
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
      let abnormality = false, waitingStatus = false;
      for (let conclusion of conclusions)
        if (conclusion.failureObserved) {
          abnormality = true;
          waitingStatus = true
          break;
        }
      await this.updateTest(token, testID, abnormality);
      await this.updatePatient(token, this.props.store.userDetails.id, waitingStatus);
      this.setState({ visible: false, testFinished: true, abnormality: abnormality });
    } catch (err) {
      clearTimeout(timeout);
      this.setState({
        visible: false,
        shouldRenderTestProcessPage: false,
        abnormality: false,
        testFinished: false,
        shouldStand: true,
        shouldWalk: false,
        errorMessage: err.message
      });
      // alert(err.message);
      if (testID)
        this.removeTest(token, testID);
    }
  };

  renderTestPage() {
    this.state.errorMessage ? alert(this.state.errorMessage) : null;
    return (
      <SafeAreaView style={styles.app}>
        <CustomHeader navigation={this.props.navigation} />
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
          <TouchableOpacity style={styles.button} onPress={this.StartTestHandler}>
            <Text style={styles.buttonText}>Start Gait Test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.instructionButton}
            onPress={() => this.props.navigation.navigate('Description')}>
            <Text style={styles.instructionTitle}>Instructions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ProgressBarAnimated}
            onPress={() => this.props.navigation.navigate('RehabPlan')}>
            <Text style={styles.label}>
              {`You've made ${this.props.store.rehabProgress}% progress of your rehab program`}
            </Text>
            <ProgressBarAnimated
              width={300}
              maxValue={100}
              value={this.props.store.rehabProgress}
              backgroundColorOnComplete="#6CC644"
              backgroundColor="#C9BDBD"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  renderTestProcess() {
    const { visible } = this.state;
    return (
      <SafeAreaView style={styles.app}>
        <CustomHeader
          navigation={this.props.navigation}
        />
        <AnimatedLoader
          visible={visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../constans/loader.json')}
          animationStyle={styles.lottie}
          speed={2}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#C9BDBD',
          }}>
          {this.state.shouldStand && (
            <Text style={styles.message}>
              Please stand in place for 5 seconds
            </Text>
          )}
          {this.state.shouldWalk && (
            <Text style={styles.message}>
              Pleast start walking in a straight line for 15 seconds
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  renderTestResults() {
    return (
      <SafeAreaView style={styles.app}>
        <CustomHeader
          navigation={this.props.navigation}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#C9BDBD',
          }}>
          {this.state.abnormality ?
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
            :
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
          }
        </View>
      </SafeAreaView>
    );
  }

  render() {
    if (this.state.shouldRenderTestProcessPage && !this.state.testFinished)
      return this.renderTestProcess();

    if (this.state.shouldRenderTestProcessPage && this.state.testFinished)
      return this.renderTestResults();

    if (!this.state.shouldRenderTestProcessPage)
      return this.renderTestPage();
  }
}

const styles = StyleSheet.create({
  viewAlert: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    fontFamily: 'ComicNeue-BoldItalic',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20,
  },
  alertImg: {
    width: 50,
    height: 50,
    marginBottom: 50,
  },
  SafeAreaAlert: {
    flex: 1,
  },
  lottie: {
    width: 100,
    height: 100
  },

  background: {
    height: '100%',
    flex: 1,
    alignItems: 'center'
  },

  title: {
    color: '#C9BDBD',
    fontFamily: 'Lato-Bold',
    fontSize: 25,
    top: 80,
  },

  sentence: {
    color: '#C9BDBD',
    fontFamily: 'Lato-Regular',
    fontSize: 20,
    top: 85,
  },

  button: {
    backgroundColor: '#5D8B91',
    height: 200,
    width: 200,
    padding: 5,
    borderRadius: 400,
    top: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C9BDBD',
  },

  buttonText: {
    color: '#FAFAFA',
    fontFamily: 'Lato-Bold',
    fontSize: 25,
  },

  instructionButton: {
    top: 300,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D8B91',
    borderRadius: 5,
    width: 200,
    height: 42,
    alignItems: 'center',
  },

  instructionTitle: {
    fontSize: 20,
    fontFamily: 'Lato-Regular',
    color: '#FAFAFA',
  },

  app: {
    flex: 1,
  },

  label: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
  },

  ProgressBarAnimated: {
    marginTop: 350,
    borderColor: 'black',
    borderWidth: 2,
    borderColor: '#C9BDBD',
    padding: 10,
    borderRadius: 5,
  },
});
