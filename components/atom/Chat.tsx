import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ChatProps{
    type:string,
    text:string
}

export default function Chat({type, text}:ChatProps) {
  return (
    <View>
      <Text style={type === "answer" ? styles.clientChat : styles.aiChat}>
        {text}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  aiChat: {
    maxWidth: "70%",
    padding: 12,
    backgroundColor: "#ebe3f3",
    marginLeft: 20,
    marginBottom:12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf:"flex-start",
  },
  clientChat:{
    maxWidth: "70%",
    padding: 12,
    backgroundColor: "#eeeeee",
    alignSelf:"flex-end",
    marginRight: 20,
    marginBottom:12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  }
});
