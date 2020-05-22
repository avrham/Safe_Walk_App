import React from 'react';
import {Text, View, SafeAreaView, StatusBar, Dimensions} from 'react-native';
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
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content" />
        <View>
          <CustomHeader navigation={this.props.navigation} />
        </View>
        <View style={{top: 20}}>
          <AnimatedLoader
            visible={visible}
            overlayColor="rgba(255,255,255,0.75)"
            source={require('../constans/loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
          <View style={styles.videoScreen}>
            <WebView
              style={{margin: 10}}
              source={{uri: 'https://www.youtube.com/embed/CdCClhtKH2Q'}}
              scalesPageToFit={false}
            />
          </View>
          <View>
            <View style={styles.videoInfo}>
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.videoTitle}>Instruction video</Text>
                <Text style={styles.videoTimes}>
                  Before you start your test, please watch this movie!
                </Text>
              </View>
            </View>
            <View style={{paddingHorizontal: 14, top: 20}}>
              <Text style={{color: 'black', opacity: 0.8, lineHeight: 20}}>
                To finish this mision yon need to watch this movie and press the
                button when you done!
              </Text>
            </View>
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
  videoScreen: {
    width: '100%',
    height: 270,
  },
  videoInfo: {
    flexDirection: 'row',
    top: 16,
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 14,
  },
  videoTitle: {
    paddingLeft: 14,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 6,
  },
  videoTimes: {
    paddingLeft: 14,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
    opacity: 0.8,
  },
});
