import React from "react";
import { Picker as RNPicker, PickerProps } from "@react-native-picker/picker";
import { View } from "react-native";

interface CustomPickerProps extends PickerProps {}

const CPicker: React.FC<CustomPickerProps> = ({  ...rest }) => {
  const customStyle = {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: 4,
    paddingHorizontal: 15,
    marginBottom: 5,
    marginTop: 5,
    fontSize: 16,
    height: 45,
    padding:0
  };

  return (
    <View style={customStyle}>
      <RNPicker {...rest} style={{padding:0, transform:"translateY(-6px)"}} />
    </View>
  );
};

export default CPicker;
