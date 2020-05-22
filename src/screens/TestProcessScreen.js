import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, BackHandler} from 'react-native';
import {StyleSheet} from 'react-native';
import {CustomHeader} from '../export';
import {IMAGE} from '../constans/Image';
import {observer, inject} from 'mobx-react';
import AnimatedLoader from 'react-native-animated-loader';

@inject('store')
@observer
export class TestProcessScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPart1: true,
      isPart2: false,
      isPart3: false,
      thereIsAProblem: false,
      thereIsntProblem: false,
      testProcessError: false,
      testProcess: true,
      visible: false,
    };
  }

  componentDidMount() {
    this.timeoutHandle = setTimeout(() => {
      this.setState({isPart1: false, isPart2: true});
    }, 3000);
    this.timeoutHandle = setTimeout(() => {
      this.setState({isPart2: false});
      while (
        this.props.store.abnormality != '' &&
        this.props.store.testProcessError != ''
      ) {
        this.setState({visible: true});
      }
      if (this.props.store.abnormality === true) {
        this.setState({thereIsAProblem: true});
      } else {
        if (this.props.store.abnormality === false) {
          this.setState({thereIsntProblem: true});
        } else {
          this.setState({testProcessError: true});
        }
      }
      this.setState({visible: false});
    }, 15000);
  }
  render() {
    const {visible} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgb(32,53,70)'}}>
        <CustomHeader
          isTestProcess={this.state.testProcess}
          navigation={this.props.navigation}
        />
        <AnimatedLoader
          visible={visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../constans/loader.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#C9BDBD',
          }}>
          {this.state.isPart1 && (
            <Text style={styles.message}>
              Please stand and don't move for 5 seconds !
            </Text>
          )}
          {this.state.isPart2 && (
            <Text style={styles.message}>
              Pleast start walking in a straight line for 60 seconds !
            </Text>
          )}
          {this.state.thereIsAProblem && (
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
          )}
          {this.state.thereIsntProblem && (
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
          {this.state.testProcessError && (
            <SafeAreaView style={styles.SafeAreaAlert}>
              <View style={styles.viewAlert}>
                <Image
                  source={IMAGE.ICOM_ALERT}
                  style={styles.alertImg}
                  resizeMode="contain"
                />
                <Text style={styles.message}>Something wrong !</Text>
                <Text style={styles.message}>
                  {this.props.store.testProcessError}
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
    marginBottom: 70,
  },
  SafeAreaAlert: {
    flex: 1,
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
});
