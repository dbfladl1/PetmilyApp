import { Alert, AlertButton } from "react-native";

export function alertDialog(
  text: string,
  subtext?: string,
  btnText?: AlertButton[]
) {
  Alert.alert(
    text,
    subtext ? subtext : "",
    btnText
      ? btnText
      : [
          {
            text: "확인",
          },
        ]
  );
}
