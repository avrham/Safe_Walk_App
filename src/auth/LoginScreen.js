import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { StyleSheet } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import { IMAGE } from '../constans/Image';
import config from '../../config.json';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

@inject('store')
@observer
export class LoginScreen extends React.Component {
  @observable email = '';
  @observable password = '';

  // @action onLoginSucsess = () => {
  //   (this.email = ''), (this.password = '');
  // };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      rehabPlanID: '',
      errorMessage: ''
    };
  }

  resetParameters = () => {
    this.email = '';
    this.password = '';
  };

  login = async () => {
    this.setState({ visible: true, errorMessage: '' });
    this.props.store.rehabProgress = 0;
    // const m = 'aneeman@gmail.com';
    // const p = 'aaabbb';
    let options = {
      method: 'post',
      url: `${config.SERVER_URL}/auth/login`,
      data: {
        // mail: m,
        // password: p,
        mail: this.email,
        password: this.password,
      },
      timeout: 2000
    };
    try {
      const loginDetails = await axios(options);
      options = {
        url: `${config.SERVER_URL}/patient/${loginDetails.data.id}`,
        headers: {
          'x-auth-token': loginDetails.data.token,
        },
      };
      const patient = await axios(options);
      if (patient.data.rehabPlanID !== '') {
        options = {
          url: `${config.SERVER_URL}/rehabPlan/${patient.data.rehabPlanID}`,
          headers: {
            'x-auth-token': loginDetails.data.token,
          },
        };
        const rehabPlan = await axios(options);
        this.props.store.RehabPlan = rehabPlan.data;
        this.props.navigation.navigate('HomeApp');
        this.setState({
          visible: false,
          rehabPlanID: rehabPlan.data.rehabPlanID
        });
      } else {
        this.setState({ visible: false });
        this.props.navigation.navigate('HomeApp');
      }
      this.props.store.userLoginDetails = loginDetails.data;
      this.props.store.userDetails = patient.data;
    } catch (err) {
      this.setState({
        visible: false,
        errorMessage: err.response.data.message
      });
    }
  };

  render() {
    const { visible } = this.state;
    this.state.errorMessage ? Alert.alert(this.state.errorMessage) : null;
    return (
      <SafeAreaView style={styles.app}>
        <AnimatedLoader
          visible={visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../constans/loader.json')}
          animationStyle={styles.lottie}
          speed={2}
        />
        <StatusBar barStyle="dark-content" />
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
                  autoCorrect={true}
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
}

const styles = StyleSheet.create({
  lottie: {
    width: wp('10%'),
    height: hp('10%'),
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
    width: wp('55%'),
    height: hp('10%'),
  },

  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: hp('25%'),
    padding: 20,
  },
  input: {
    height: hp('5%'),
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#FFF',
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 6,
    borderWidth: 0.5,
    fontSize: wp('4%'),
  },

  buttonContainer: {
    backgroundColor: '#f7c744',
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.058,
    borderRadius: 9,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'rgb(32,53,70)',
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
