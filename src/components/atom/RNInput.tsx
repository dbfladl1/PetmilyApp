import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  color?: string
}

const CTextInput = forwardRef<RNTextInput, CustomTextInputProps>(
  ({ style, color = "#C0C0C0", ...rest }, ref ) => {
    const customStyle = {
      height: 45,
      borderWidth: 1,
      borderColor: color,
      borderRadius: 4,
      paddingHorizontal: 15,
      marginBottom: 5,
      marginTop: 5,
      fontSize: 16,
    };

    return (
      <RNTextInput
        ref={ref} 
        style={[customStyle, style]}
        {...rest}   
      />
    );
  }
);

export default CTextInput;
