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
import { getAccessToken, setAccessToken } from "@/src/utils/useAuth";
import LoadingWrapper from "@/components/Loadingwrapper";
import { handleCommonApiError } from "@/src/utils/clientErrorHandler";

export const LoginScreen=()=> {
  const [autoLogin, setAutoLogin] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState({ loginId: "", password: "" });

  function updateUserField(field: keyof loginInfo, value: string) {
    setUser((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (refreshToken !== null) {
          setAutoLogin(true);
          const res = await submitRefreshToken({ refreshToken });
          if (!res.success) {
            const { status } = res;
            handleCommonApiError(status, "login");
            return;
          }
          const token = res.response.data.token;
          await setAccessToken(token);
          router.replace("/sns/snsFeed");
        }
      } catch (error) {
        alertDialog("로그인 실패");
      } finally {
        setIsLoading(false);
      }
    };

    checkAutoLogin();
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleLogin = async () => {
    const res = await login(user);
    if (!res.success) {
      const { status, message } = res;
      handleCommonApiError(status, message);
      return;
    }
    if (res.success) {
      const token = res.response.data.token;
      const headers = res.response.headers;
      if (autoLogin === true) {
        await setAccessToken(token);
        const setCookieHeader = headers["set-cookie"];
        if (setCookieHeader && setCookieHeader.length > 0) {
          const autoAuthRefreshToken = setCookieHeader
            .find((cookie: string) => /refreshToken=([^;]*)/.test(cookie))
            ?.match(/refreshToken=([^;]*)/)?.[1];

          autoAuthRefreshToken &&
            (await SecureStore.setItemAsync(
              "refreshToken",
              autoAuthRefreshToken
            ));
        }
      } else {
        setAccessToken(token);
        await SecureStore.deleteItemAsync("refreshToken");
      }
      router.replace("/sns/snsFeed");
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

        <CLongBtn style={styles.button} onPress={handleLogin}>
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
