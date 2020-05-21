import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {CustomHeader} from '../export';
import {WebView} from 'react-native-webview';
import AnimatedLoader from 'react-native-animated-loader';

export class InstructionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentDidMount() {
    this.setState({visible: true});
    setTimeout(() => {
      this.setState({visible: false});
    }, 2000);
  }
  render() {
    const {visible} = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgb(32,53,70)'}}>
        <StatusBar barStyle="dark-content" />
        <View>
          <CustomHeader navigation={this.props.navigation} />
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <AnimatedLoader
            visible={visible}
            overlayColor="rgba(255,255,255,0.75)"
            source={require('../constans/loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
          <Text
            style={{
              color: '#C9BDBD',
              fontFamily: 'Lato-Bold',
              fontSize: 24,
              textAlign: 'center',
              bottom: 100,
            }}>
            Before you start your test, please watch this movie!
          </Text>
          <View style={{width: '100%', height: 250}}>
            <WebView
              style={{margin: 10}}
              source={{uri: 'https://www.youtube.com/embed/CdCClhtKH2Q'}}
            />
          </View>
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
});
