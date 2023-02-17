import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>NFC SAMPLE APP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingTop: 18,
    backgroundColor: 'dodgerblue',
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});