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
  }
  async componentDidMount() {
    this.getPatientDetails();
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
      console.log(url);
      if (url.status === 200) {
        this.props.store.userDetails = url.data;
      } else {
        Alert.alert('error has occured, Please try again in a few minutes');
      }
    } catch (err) {
      Alert.alert('error has occured... please check your details');
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('TestProcess')}>
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

  StartTest = () => {
    alert('test');
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
