import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  Button,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {CustomHeader} from '../export';
import {observer, inject} from 'mobx-react';
import axios from 'axios';
import config from '../../config.json';
import ProgressBarAnimated from 'react-native-progress-bar-animated';

@inject('store')
@observer
export class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rehabPlanID: '',
      progressWithOnComplete: 0,
      progressCustomized: 0,
      maxValue: 100,
    };
  }

  componentDidMount() {
    if (this.props.store.userDetails.rehabPlanID != '') {
      this.calculateProgress();
    }
  }

  calculateProgress = () => {
    const length = this.props.store.RehabPlan.videos.length;
    let i, j;
    for (i = 0, j = 0; i < length; i++) {
      this.props.store.RehabPlan.videos[i].done ? j++ : '';
    }
    this.props.store.rehabProgress = Number(((j / length) * 100).toFixed(1));
  };

  /*getPatientDetails = async () => {
    const options = {
      method: 'GET',
      url: `${config.SERVER_URL}/patient/${
        this.props.store.userLoginDetails.id
      }`,
      headers: {
        'x-auth-token': this.props.store.userLoginDetails.token,
      },
    };
    try {
      const url = await axios(options);
      if (url.status === 200) {
        this.props.store.userDetails = url.data;
        this.setState({rehabPlanID: url.data.rehabPlanID});
      } else {
        Alert.alert('error has occured, Please try again in a few minutes');
      }
    } catch (err) {
      Alert.alert('error has occured... please check your details');
      console.log('err', err);
    }
  };

  getRehabPlan = async props => {

    const options = {
      method: 'GET',
      url: `${config.SERVER_URL}/rehabPlan/${this.state.rehabPlanID}`,
      headers: {
        'x-auth-token': this.props.store.userLoginDetails.token,
      },
    };

    try {
      const url = await axios(options);
      if (url.status === 200) {
        this.props.store.RehabPlan = url.data;
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
*/
  render() {
    const barWidth = Dimensions.get('screen').width - 1500;

    return (
      <SafeAreaView style={styles.app}>
        <CustomHeader isTestScreen={true} navigation={this.props.navigation} />
        <View style={styles.background}>
          <Text style={styles.title}>
            Hey {this.props.store.userDetails.name}!
          </Text>
          <Text style={styles.sentence}>
            Before starting, please connect your kit
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.StartTest}>
            <Text style={styles.buttonText}>Start Test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.instructionButton}
            onPress={() => this.props.navigation.navigate('Description')}>
            <Text style={styles.instructionTitle}>Press to instruction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ProgressBarAnimated}
            onPress={() => this.props.navigation.navigate('RehabPlan')}>
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
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          headers: {
            'x-auth-token': token,
          },
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

  scanGaitAndAnalyze(ip, sensorName, token, testID) {
    return new Promise(async (resolve, reject) => {
      try {
        const options = {
          timeout: 15000,
        };

        // start walking process

        const response = await axios.get(`http://${ip}`, options);

        //start loading
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
            `Error while trying to take sample from ${sensorName} -- ${
              ex.message
            }`,
          ),
        );
      }
    });
  }

  analayseData(token, rawData, sensorName, testID) {
    return new Promise(async (resolve, reject) => {
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

  StartTest = async () => {
    try {
      this.props.navigation.navigate('TestProcess');
      const {IPs} = await this.getKitDetails(
        this.props.store.userLoginDetails.token,
      );
      const test = await this.createTest(
        this.props.store.userLoginDetails.token,
      );
      let promise1; // , promise2, promise3, promise4, promise5, promise6, promise7;
      promise1 = this.scanGaitAndAnalyze(
        IPs.sensor1,
        'sensor1',
        this.props.store.userLoginDetails.token,
        test.id,
      );
      // promise2 = this.scanGaitAndAnalyze(IPs.sensor2, 'sensor2', this.props.store.userLoginDetails.token, test.id);
      // promise3 = this.scanGaitAndAnalyze(IPs.sensor3, 'sensor3', this.props.store.userLoginDetails.token, test.id);
      // promise4 = this.scanGaitAndAnalyze(IPs.sensor4, 'sensor4', this.props.store.userLoginDetails.token, test.id);
      // promise5 = this.scanGaitAndAnalyze(IPs.sensor5, 'sensor5', this.props.store.userLoginDetails.token, test.id);
      // promise6 = this.scanGaitAndAnalyze(IPs.sensor6, 'sensor6', this.props.store.userLoginDetails.token, test.id);
      // promise7 = this.scanGaitAndAnalyze(IPs.sensor7, 'sensor7', this.props.store.userLoginDetails.token, test.id);
      // const conclusions = await Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7]);
      const conclusions = await Promise.all([promise1]);
      //stop loading
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

  background: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
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
    backgroundColor: 'rgb(32,53,70)',
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
