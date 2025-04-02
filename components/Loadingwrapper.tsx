import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface Props {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingWrapper = ({ isLoading, children }: Props) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingWrapper;
