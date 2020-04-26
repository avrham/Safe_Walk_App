import React, {Component} from 'react';
import {Text} from 'react-native';

export class RVText extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {content, style} = this.props;
    return (
      <Text {...this.props} style={[{fontSize: 67}, style]}>
        {content}
      </Text>
    );
  }
}
