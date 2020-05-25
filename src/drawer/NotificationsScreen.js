import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Animated,
  StyleSheet,
} from 'react-native';
import {CustomHeader} from '../export';
import {observer, inject} from 'mobx-react';
import {observable} from 'mobx';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';

@inject('store')
@observer
export class NotificationsScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <CustomHeader title="Notification" navigation={this.props.navigation} />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <CountdownCircleTimer
            isPlaying
            duration={10}
            colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}>
            {({remainingTime, animatedColor}) => (
              <Animated.Text
                style={{...styles.remainingTime, color: animatedColor}}>
                {remainingTime}
              </Animated.Text>
            )}
          </CountdownCircleTimer>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  remainingTime: {
    fontSize: 46,
  },
});
