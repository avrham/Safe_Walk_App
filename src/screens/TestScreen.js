import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {CustomHeader} from '../export';
import {RVText} from '../core';
import {observer, inject} from 'mobx-react';
import {observable} from 'mobx';
import axios from 'axios';
import config from '../../config.json';
import {IMAGE} from '../constans/Image';

@inject('store')
@observer
export class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rehabPlanID: '',
    };
  }

  componentDidMount() {
    this.getPatientDetails();
    this.timeoutHandle = setTimeout(() => {
      this.getRehabPlan();
    }, 500);
  }

  getPatientDetails = async () => {
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

  render() {
    return (
      <SafeAreaView style={styles.app}>
        <CustomHeader
          title="Test"
          isTestScreen={true}
          navigation={this.props.navigation}
        />
        <View style={styles.background}>
          <Text style={styles.title}>
            hey {this.props.store.userDetails.name}!
          </Text>
          <Text style={styles.sentence}>
            Before starting, please connect your kit
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.StartTest}>
            <Text style={styles.buttonText}>Start Test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.instruction}
            onPress={() => this.props.navigation.navigate('Description')}>
            <Image
              style={styles.instructionImg}
              source={IMAGE.ICON_INSTRUCTION}
            />
          </TouchableOpacity>
          <Text style={styles.instructionTitle}>Press to instruction</Text>
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
  background: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontFamily: 'ComicNeue-BoldItalic',
    fontSize: 25,
    top: 80,
  },
  sentence: {
    color: 'black',
    fontFamily: 'ComicNeue-BoldItalic',
    fontSize: 20,
    top: 80,
  },
  button: {
    backgroundColor: '#373838',
    height: 200,
    width: 200,
    padding: 5,
    borderRadius: 400,
    top: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#f2f0f1',
    fontFamily: 'ComicNeue-BoldItalic',
    fontSize: 25,
  },
  instruction: {
    top: Dimensions.get('window').height * 0.31,
    textAlign: 'center',
    justifyContent: 'center',
  },
  instructionImg: {
    width: 40,
    height: 40,
  },
  instructionTitle: {
    top: Dimensions.get('window').height * 0.31,
    fontSize: 20,
    fontFamily: 'ComicNeue-BoldItalic',
  },
  app: {
    flex: 1,
  },
});
