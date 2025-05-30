import React from "react";
import {
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
  Text,
  ViewStyle,
} from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  children?: React.ReactNode;
}
export const CBtn: React.FC<CustomButtonProps> = ({
  style,
  children,
  ...rest
}) => {
  const customStyle: ViewStyle = {
    backgroundColor: "#7D3DCF",
    height: 45,
    borderRadius: 5,
    borderWidth: 0,
    borderColor: "#7D3DCF",
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    minWidth: 60
  };

  return (
    <RNTouchableOpacity
      style={[customStyle, style]}
      {...rest}
      activeOpacity={1}
    >
      {children && (
        <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>{children}</Text>
      )}
    </RNTouchableOpacity>
  );
};

export const CLongBtn: React.FC<CustomButtonProps> = (
  { style, children, ...rest },
  text: string
) => {
  const customStyle: ViewStyle = {
    backgroundColor: "#7D3DCF",
    height: 45,
    borderRadius: 5,
    borderWidth: 0,
    borderColor: "#7D3DCF",
    marginBottom: 5,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal:15,
    padding:10,
  };

  return (
    <RNTouchableOpacity
      style={[customStyle, style]}
      {...rest}
      activeOpacity={1}
    >
      {children && (
        <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>{children}</Text>
      )}
    </RNTouchableOpacity>
  );
};

export default CBtn;
