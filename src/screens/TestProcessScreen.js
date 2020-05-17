import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, BackHandler} from 'react-native';
import {StyleSheet} from 'react-native';
import {CustomHeader} from '../export';
import {IMAGE} from '../constans/Image';

export class TestProcessScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPart1: true,
      isPart2: false,
      isPart3: false,
      thereIsAProblem: false,
      thereIsntProblem: false,
    };
  }

  componentDidMount() {
    this.timeoutHandle = setTimeout(() => {
      // Add your logic for the transition
      this.setState({isPart1: false, isPart2: true});
    }, 5000);
    this.timeoutHandle = setTimeout(() => {
      // Add your logic for the transition
      this.setState({isPart2: false, isPart3: true});
    }, 15000);
    this.timeoutHandle = setTimeout(() => {
      // Add your logic for the transition
      this.setState({isPart3: false, thereIsAProblem: true});
    }, 20000);
    this.timeoutHandle = setTimeout(() => {
      // Add your logic for the transition
      this.setState({thereIsAProblem: false, thereIsntProblem: true});
    }, 25000);
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgb(32,53,70)'}}>
        <CustomHeader title="Test Process" navigation={this.props.navigation} />

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C9BDBD'}}>
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
          {this.state.isPart3 && (
            <Text style={styles.message}>
              Please stop walking and stand in tour position for 5 seconds !
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
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
