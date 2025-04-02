import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface OptionProps {
  option: string;
  callbackFx: (option: string) => void;
  filled?: boolean;
}

export default function OptionButton({
  option,
  callbackFx,
  filled = false,
}: OptionProps) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => callbackFx(option)}
      style={!filled ? styles.optionButton : styles.colorButton}
    >
      <Text style={{ textAlign: "center", ...(filled && { color: "#fff" }) }}>
        {option}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  optionButton: {
    padding: 5,
    paddingHorizontal: 10,
    borderColor: "#666",
    borderWidth: 0.5,
    borderRadius: 8,
  },
  colorButton: {
    padding: 5,
    paddingHorizontal: 10,
    borderColor: "#6E37AB",
    backgroundColor: "#6E37AB",
    borderWidth: 0.5,
    borderRadius: 8,
    marginLeft:"auto"
  },
});
