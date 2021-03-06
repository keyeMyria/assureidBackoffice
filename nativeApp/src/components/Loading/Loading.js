import React from 'react';
import PropTypes from 'prop-types';

import { View, ActivityIndicator } from 'react-native';
import styles from './styles';

const Loading = (props) => {
  return (
    <View style={styles.container}>
       <ActivityIndicator size="large" color="#0000ff" />
     </View>
  );
};

Loading.propTypes = {
  size: PropTypes.string,
};

Loading.defaultProps = {
  size: 'large',
};

export default Loading;
