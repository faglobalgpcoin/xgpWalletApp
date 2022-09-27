import React from 'react';
import {View, Platform} from 'react-native';

const LineSeparator = ({width}) => (
  <View
    style={{
      borderBottomWidth: 1,
      borderColor: Platform.OS === 'ios' ? '#e3e3e3' : '#ededed',
      width: width || '100%',
    }}
  />
);

export default LineSeparator;
