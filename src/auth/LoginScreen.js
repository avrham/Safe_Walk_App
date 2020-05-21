import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  AsyncStorage,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {StyleSheet} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import {IMAGE} from '../constans/Image';
import config from '../../config.json';
import {observer, inject} from 'mobx-react';
import {observable, action} from 'mobx';
import axios from 'axios';

@inject('store')
@observer
export class LoginScreen extends React.Component {
  @observable email = '';
  @observable password = '';

  @action onLoginSucsess = () => {
    (this.email = ''), (this.password = '');
  };

  constructor(props) {
    super(props);
    this.state = {visible: false, rehabPlanID: ''};
  }

  render() {
    const {visible} = this.state;
    return (
      <SafeAreaView style={styles.app}>
        <AnimatedLoader
          visible={visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../constans/loader.json')}
          animationStyle={styles.lottie}
          speed={2}
        />
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView behavior="padding" style={styles.app}>
          <TouchableWithoutFeedback
            style={styles.app}
            onPress={Keyboard.dismiss}>
            <View style={styles.logoContainer}>
              <View style={styles.logoContainer}>
                <Image source={IMAGE.ICON_LOGO} style={styles.logo} />
              </View>

              <View style={styles.infoContainer}>
                <TextInput
                  onChangeText={val => (this.email = val)}
                  clearButtonMode={'always'}
                  style={styles.input}
                  placeholder={'Enter Email'}
                  placeholderTextColor={'rgba(255,255,255,0.8)'}
                  keyboardType="email-address"
                  returnKeyType="next"
                  autoCorrect={false}
                  onSubmitEditing={() => this.refs.txtPassword.focus()}
                />
                <TextInput
                  onChangeText={val => (this.password = val)}
                  clearButtonMode={'always'}
                  style={styles.input}
                  placeholder={'Enter Password'}
                  placeholderTextColor={'rgba(255,255,255,0.8)'}
                  returnKeyType="go"
                  secureTextEntry
                  autoCorrect={false}
                  ref={'txtPassword'}
                />
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={this.login}>
                  <Text style={styles.buttonText}>SIGN IN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  resetParameters = () => {
    this.email = '';
    this.password = '';
  };

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
        if (url.data.rehabPlanID != '') {
          this.getRehabPlan(url.data.rehabPlanID);
          this.setState({rehabPlanID: url.data.rehabPlanID});
        } else {
          this.props.navigation.navigate('HomeApp');
        }
      } else {
        Alert.alert('error has occured, Please try again in a few minutes');
      }
    } catch (err) {
      Alert.alert(
        'error has occured when trying to return Data from getPatientDetails query. please check your details',
      );
      console.log('err', err);
    }
  };

  getRehabPlan = async rehabPlanID => {
    const options = {
      method: 'GET',
      url: `${config.SERVER_URL}/rehabPlan/${rehabPlanID}`,
      headers: {
        'x-auth-token': this.props.store.userLoginDetails.token,
      },
    };
    try {
      const url = await axios(options);
      if (url.status === 200) {
        this.props.store.RehabPlan = url.data;
        console.log(url.data);
        setTimeout(() => {
          this.setState({visible: false});
          this.props.navigation.navigate('HomeApp');
        }, 1500);
      } else {
        Alert.alert('error has occured, Please try again in a few minutes');
      }
    } catch (err) {
      alert(
        'error has occured when trying to return Data from getRehabPlan query. please check your details',
      );
      console.log('err', err);
    }
  };

  login = async () => {
    this.setState({visible: true});
    const m = 'ziperfal@gmail.com';
    const p = '123456';
    //const m = 'aneeman@gmail.com';
    // const p = 'aaabbb';
    const options = {
      method: 'post',
      url: `${config.SERVER_URL}/auth/login`,
      data: {
        mail: m,
        password: p,
        //mail: this.email,
        //password: this.password,
      },
    };

    try {
      const url = await axios(options);
      console.log(url);
      if (url.status === 200) {
        this.props.store.userLoginDetails = url.data;
        this.getPatientDetails();
      } else {
        Alert.alert('error has occured, Please try again in a few minutes');
      }
    } catch (err) {
      alert(
        'error has occured when trying to log in. please check your details',
      );
      console.log('err', err);
    }
    this.onLoginSucsess();
  };
}

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200,
  },
  loader: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.565,
    width: 50,
    height: 50,
    opacity: 0.5,
  },

  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 70,
  },
  title: {
    color: '#C9BDBD',
    fontFamily: 'Lato-Bold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
    padding: 20,
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#FFF',
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 6,
    borderWidth: 0.5,
  },

  buttonContainer: {
    backgroundColor: '#f7c744',
    //width: Dimensions.get('window').width * 0.75,
    //height: Dimensions.get('window').height * 0.058,
    borderRadius: 9,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'rgb(32,53,70)',
    //fontFamily: 'ComicNeue-BoldItalic',
    fontSize: 19,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  app: {
    flex: 1,
    backgroundColor: 'rgb(32,53,70)',
    flexDirection: 'column',
  },
});

/*
  textInput: {
    borderWidth: 0.5,
    borderRadius: 6,
    backgroundColor: 'white',
    borderColor: '#505f35',
    width: Dimensions.get('window').width * 0.78,
    height: Dimensions.get('window').height * 0.06,
    top: 100,
    fontSize: 18,
    fontFamily: 'ComicNeue-BoldItalic',
    color: 'black',
    paddingLeft: 10,
    marginTop: 20,
  },*/
