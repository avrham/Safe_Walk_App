import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { StyleSheet } from 'react-native';
import { CustomHeader } from '../export';
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
      rehabPlanID: '',
      progressWithOnComplete: 0,
      progressCustomized: 0,
      maxValue: 100,
      visible: false
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

  removeTest(token, testID) {
    return new Promise(async (resolve, reject) => {
      try {
        const options = {
          headers: { 'x-auth-token': token }
        };
        await axios.delete(`${config.SERVER_URL}/test/${testID}`, null, options);
        return resolve();
      } catch (ex) {
        return reject(new Error(ex.response.data.message));
      }
    });
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
        const response = await axios.put(`${serverURL}/test/${testID}`, body, options);
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
        const response = await axios.put(`${serverURL}/patient/${patientID}`, body, options);
        return resolve(response.data);
      } catch (ex) {
        return reject(new Error(ex.response.data.message));
      }
    });
  }

  scanGaitAndAnalyze(ip, sensorName, token, testID) {
    return new Promise(async (resolve, reject) => {
      try {
        const options = { timeout: 500 };
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
    let testID;
    const token = this.props.store.userLoginDetails.token;
    try {
      this.setState({ visible: true });
      const { IPs } = await this.getKitDetails(token);
      const test = await this.createTest(token);
      testID = test.id;
      let promise1; // , promise2, promise3, promise4, promise5, promise6, promise7;
      promise1 = this.scanGaitAndAnalyze(IPs.sensor1, 'sensor1', token, testID);
      // promise2 = this.scanGaitAndAnalyze(IPs.sensor2, 'sensor2', token, testID);
      // promise3 = this.scanGaitAndAnalyze(IPs.sensor3, 'sensor3', token, testID);
      // promise4 = this.scanGaitAndAnalyze(IPs.sensor4, 'sensor4', token, testID);
      // promise5 = this.scanGaitAndAnalyze(IPs.sensor5, 'sensor5', token, testID);
      // promise6 = this.scanGaitAndAnalyze(IPs.sensor6, 'sensor6', token, testID);
      // promise7 = this.scanGaitAndAnalyze(IPs.sensor7, 'sensor7', token, testID);
      // const conclusions = await Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7]);
      this.setState({ visible: false });
      this.props.navigation.navigate('TestProcess');
      const conclusions = await Promise.all([promise1]);
      this.setState({ visible: true });
      let abnormality = false, waitingStatus = false;
      for (let conclusion of conclusions)
        if (conclusion.failureObserved) {
          abnormality = true;
          waitingStatus = true
          break;
        }
      await this.updateTest(token, testID, abnormality);
      await this.updatePatient(token, this.props.store.userDetails.id, waitingStatus);
      this.props.store.abnormality = abnormality;
    } catch (err) {
      this.setState({ visible: false });
      alert(err.message);
      this.props.navigation.goBack();
      await this.removeTest(token, testID);
      console.log();
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.app}>
        <CustomHeader isTestScreen={true} navigation={this.props.navigation} />
        <AnimatedLoader
          visible={this.state.visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../constans/loader.json')}
          animationStyle={styles.lottie}
          speed={1}
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
}

const styles = StyleSheet.create({
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
