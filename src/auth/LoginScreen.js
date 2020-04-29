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
    this.state = {visible: false};
  }

  render() {
    const {visible} = this.state;
    return (
      <SafeAreaView style={styles.app}>
        <View style={styles.background}>
          <AnimatedLoader
            visible={visible}
            overlayColor="rgba(255,255,255,0.75)"
            source={require('../constans/loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
          <Text style={styles.title}>WELCOME TO</Text>

          <Image source={IMAGE.ICON_LOGO} style={styles.logo} />
          <TextInput
            onChangeText={val => (this.email = val)}
            clearButtonMode={'always'}
            style={styles.textInput}
            placeholder={'Email'}
            placeholderTextColor={'gray'}
          />
          <TextInput
            onChangeText={val => (this.password = val)}
            secureTextEntry
            clearButtonMode={'always'}
            style={styles.textInput}
            placeholder={'Password'}
            placeholderTextColor={'gray'}
          />
          <TouchableOpacity style={styles.button} onPress={this.login}>
            <Text style={styles.buttonText}>LogIn</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  resetParameters = () => {
    this.email = '';
    this.password = '';
  };

  login = async () => {
    this.setState({visible: true});

    const m = 'aneeman@gmail.com';
    const p = 'avin2010';
    //const m = 'aaabbb@gmail.com'
    //const p = 'aaabbb'
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
        //AsyncStorage.setItem('token', url.data.token);
        this.props.navigation.navigate('HomeApp');
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

    this.setState({visible: false});
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
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.565,
    width: 50,
    height: 50,
    opacity: 0.5,
  },
  logo: {},
  title: {
    color: '#60685d',
    fontFamily: 'ComicNeue-BoldItalic',
    fontSize: 30,
    top: -20,
  },
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
  },
  button: {
    backgroundColor: '#60685d',
    width: Dimensions.get('window').width * 0.75,
    height: Dimensions.get('window').height * 0.058,
    borderRadius: 9,
    top: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#f2f0f1',
    fontFamily: 'ComicNeue-BoldItalic',
    fontSize: 19,
  },
  app: {
    flex: 1,
  },
});
