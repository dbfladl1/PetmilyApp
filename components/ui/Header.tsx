import React from "react";
import { View, StyleSheet, Image } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <Image
        source={require("@/assets/images/pm-logo.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    borderBottomWidth: 0.5,
    borderBottomColor: "#bbb",
    zIndex: 100,
  },
  logo: {
    height: 45,
    width: 45,
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
  },
});
