import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { useState } from "react";
import LoginScreen from "./user/login";
import SnsFeedScreen from "./sns/snsFeed";

export default function HomeScreen() {
  const [loginSession, setLoginSession] = useState<boolean>(false);

  // 세션 상태에 따라서 로그인 혹은 SNS

  // return loginSession ? <SnsFeedScreen/> : <LoginScreen/>
  return <LoginScreen />;
}
