import React, { Component } from 'react';
import { Text, View, SafeAreaView, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { CustomHeader } from '../export';
import { IMAGE } from '../constans/Image';
import { observer, inject } from 'mobx-react';
import AnimatedLoader from 'react-native-animated-loader';

@inject('store')
@observer
export class TestProcessScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldStand: true,
      shouldWalk: false,
      failureObserved: false,
      testProcess: true,
      visible: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ shouldStand: false, shouldWalk: true });
      setTimeout(() => {
        let abnormality = this.props.store.abnormality;
        let errorOccured = this.props.store.errorOccured;
        this.setState({ visible: true });
        this.setState({ shouldWalk: false });
        while (abnormality === '' && !errorOccured) {
          abnormality = this.props.store.abnormality;
          errorOccured = this.props.store.errorOccured
        }
        if (abnormality === true && !errorOccured)
          this.setState({ failureObserved: true });
        else if (abnormality === false && !errorOccured)
          this.setState({ failureObserved: false });
      }, 12000);
    }, 3000);
  }

  render() {
    const { visible } = this.state;
    const abnormality = this.props.store.abnormality;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(32,53,70)' }}>
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
          {this.state.shouldStand && (
            <Text style={styles.message}>
              Please stand in place for 3 seconds
            </Text>
          )}
          {this.state.shouldWalk && (
            <Text style={styles.message}>
              Pleast start walking in a straight line for 15 seconds
            </Text>
          )}
          {this.state.failureObserved && abnormality ?
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
            : null}
          {!this.state.failureObserved && abnormality ?
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
            : null}
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
