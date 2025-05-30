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
    height: 58,
    borderBottomWidth: 0.5,
    borderBottomColor: "#bbb",
    zIndex: 100,
    padding:0
  },
  logo: {
    height: 63,
    width: 53,
    margin: "auto",
    marginTop: 0,
    objectFit:"cover",
    transform:"translateY(-5px)"
  },
});
