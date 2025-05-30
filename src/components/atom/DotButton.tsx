import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

interface DotButtonProp {
  callbackFx: () => void;
}

export default function DotButton({ callbackFx }: DotButtonProp) {
  return (
    <TouchableOpacity
      style={styles.buttonOut}
      onPress={() => callbackFx()}
      activeOpacity={1}
    >
      <View style={styles.topIconDot01}></View>
      <View style={styles.topIconDot02}></View>
      <View style={styles.topIconDot03}></View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonOut: {
    flexDirection: "row",
    gap: 4,
    height:40,
    alignItems:'center'
  },
  topIconDot01: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#555",
  },
  topIconDot02: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#555",
  },
  topIconDot03: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#555",
  },
});
