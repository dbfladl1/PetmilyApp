import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Image } from "react-native";
import CText from "@/components/atom/RNText";
import CTextInput from "@/components/atom/RNInput";
import { login, submitRefreshToken, testLogin } from "@/service/api/userApi";
import { loginInfo } from "@/interface/user";
import { CLongBtn } from "@/components/atom/RNTouchableOpacity";
import { useRouter } from "expo-router";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { alertDialog } from "@/components/atom/Alert";
import * as SecureStore from "expo-secure-store";
import { getAccessToken, setAccessToken } from "@/src/hooks/useAuth";
import LoadingWrapper from "@/components/Loadingwrapper";

export default function LoginScreen() {
  const [autoLogin, setAutoLogin] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState({ loginId: "", password: "" });

  function updateUserField(field: keyof loginInfo, value: string) {
    setUser((prev) => ({ ...prev, [field]: value }));
  }
  const [loginState, setLoginState] = useState(false);

  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        console.log("refT", refreshToken);

        if (refreshToken !== null) {
          setAutoLogin(true);
          const result = await submitRefreshToken({ refreshToken });
          const token = result.token;
          await setAccessToken(token);
          router.push("/sns/snsFeed");
        }
      } catch (error) {
        alertDialog("로그인 실패");
      } finally {
        setIsLoading(false);
      }
    };

    checkAutoLogin();
  }, []);

  // const checkToken = async () => {
  //   const token = await getAccessToken();
  //   console.log("tocken",token)
  //   console.log(isLoading)
  //   if (token && token !== "") {
  //     router.push("/sns/snsFeed");
  //   } else {
  //     setIsLoading(false);
  //   }
  // };

  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const loginHandler = async () => {
    console.log("click");
    const response = await login(user);
    console.log(response?.data);

    if (response?.status === 200) {
      const token = response.data.token;
      console.log("초기", token);
      if (autoLogin === true) {
        console.log(response);
        await setAccessToken(token);
        const setCookieHeader = response?.headers["set-cookie"];
        if (setCookieHeader && setCookieHeader.length > 0) {
          const refreshToken = setCookieHeader
            .find((cookie) => /refreshToken=([^;]*)/.test(cookie))
            ?.match(/refreshToken=([^;]*)/)?.[1];

          refreshToken &&
            (await SecureStore.setItemAsync("refreshToken", refreshToken));
        }
      } else {
        setAccessToken(token);
        await SecureStore.deleteItemAsync("refreshToken");
      }
      router.push("/sns/snsFeed");
    } else {
      alertDialog("아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <LoadingWrapper isLoading={isLoading}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/pm-logo.png")}
          style={styles.logo}
        />

        <CTextInput
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#A0A0A0"
          onChangeText={(id) => {
            updateUserField("loginId", id);
          }}
        />

        <CTextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#A0A0A0"
          secureTextEntry={true}
          onChangeText={(pw) => {
            updateUserField("password", pw);
          }}
        />

        <CLongBtn style={styles.button} onPress={loginHandler}>
          <CText style={styles.buttonText}>로그인</CText>
        </CLongBtn>

        <View style={styles.pwJoinLink}>
          <View style={{ flex: 1 }}>
            <BouncyCheckbox
              size={20}
              text="자동 로그인"
              fillColor="#7D3DCF"
              isChecked={autoLogin}
              onPress={() => setAutoLogin((prev) => !prev)}
              textStyle={{
                textDecorationLine: "none",
                flex: 1,
                minHeight: 24,
              }}
            />
          </View>
          <View
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Link href="/user/findPw" style={styles.linkText}>
              비밀번호 찾기
            </Link>
            <CText style={styles.divider}> / </CText>
            <Link href="/user/join" style={styles.linkText}>
              회원가입
            </Link>
          </View>
        </View>
      </View>
    </LoadingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 27,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#7D3DCF",
  },
  input: {
    width: "100%",
  },
  button: {
    backgroundColor: "#7D3DCF",
    width: "100%",
    height: 50,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  pwJoinLink: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  linkText: {
    color: "#777",
    fontSize: 16,
    fontFamily: "DMSans",
  },
  divider: {
    color: "#777",
    fontSize: 16,
    marginHorizontal: 5,
  },
  footerText: {
    fontSize: 14,
    color: "#A0A0A0",
    textDecorationLine: "underline",
  },
});
