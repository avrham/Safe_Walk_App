import React, {Component} from 'react';
import {Text, View, SafeAreaView, StatusBar} from 'react-native';
import {CustomHeader} from '../export';
import {WebView} from 'react-native-webview';
import AnimatedLoader from 'react-native-animated-loader';
import {StyleSheet} from 'react-native';

export class VideoDetailesScreen extends React.Component {
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
    const {id, title, videoLink, videoStatus, times} = this.props.route.params;
    const {visible} = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgb(32,53,70)'}}>
        <StatusBar barStyle="dark-content" />
        <View>
          <CustomHeader navigation={this.props.navigation} />
        </View>
        <View style={{flex: 1, top: 20, alignItems: 'center'}}>
          <AnimatedLoader
            visible={visible}
            overlayColor="rgba(255,255,255,0.75)"
            source={require('../constans/loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
          <View style={{width: '100%', height: 250}}>
            <WebView style={{margin: 10}} source={{uri: videoLink}} />
          </View>
          <Text
            style={{
              color: '#C9BDBD',
              fontFamily: 'Lato-Bold',
              fontSize: 24,
              textAlign: 'center',
            }}>
            {title}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

export default VideoDetailesScreen;

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
});
