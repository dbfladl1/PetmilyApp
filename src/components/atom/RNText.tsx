import React from "react";
import {Text as RNText, TextProps} from 'react-native';

interface CuntomTextProps extends TextProps{};

const CText:React.FC<CuntomTextProps> = ({style, ...rest}) =>{
    const customStyle={
        fontFamily:'DMSans',
        color:"#555"
    }

    return <RNText style={[customStyle, style]} {...rest}/>
}

export default CText