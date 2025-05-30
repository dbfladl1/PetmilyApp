import CText from "@/src/components/atom/RNText";
import BottomNav from "@/src/components/ui/BottomNav";
import Header from "@/src/components/ui/Header";
import { getUserInfo } from "@/src/service/api/userApi";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { TokenStorage } from "@/src/utils/auth/useAuth";
import { apiProcess } from "@/src/utils/handler/clientResHandler";
import { ApiResult } from "@/src/interface/api";

export default function ModifyMain() {
  const [user, setUser] = useState<{
    loginId: string;
    profilePicturePath: string;
  }>({ loginId: "", profilePicturePath: "" });

  const fetchUserInfo = async () => {
    const res: ApiResult = await getUserInfo();
    apiProcess(res, async (res) => {
      const user = res.response.data;
      setUser((prev) => Object.assign({}, prev, user));
    });
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const logout = () => {
    TokenStorage.clearAll();
    router.push("/user/login");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>계정 관리</Text>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileContainerItem}
            activeOpacity={1}
            onPress={() => {
              router.push("/user/modify/ModifyInfo");
            }}
          >
            <View style={styles.iconImgView}>
              <Image
                source={{ uri: user.profilePicturePath }}
                style={styles.photoImg}
              />
            </View>
            <View style={{ justifyContent: "center" }}>
              <Text>회원정보 수정</Text>
              <Text>{user.loginId}</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.profileContainerItem}
            activeOpacity={1}
            onPress={() => {
              router.push("/user/modify/ModifyPw");
            }}
          >
            <View style={styles.iconImgView}>
              <Image
                source={require("@/assets/images/icon/password.png")}
                style={styles.iconImg}
              ></Image>
            </View>
            <View style={{ justifyContent: "center" }}>
              <Text>비밀번호 변경</Text>
            </View>
          </TouchableOpacity> */}
        </View>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileContainerItem}
            activeOpacity={1}
            onPress={() => logout()}
          >
            <View style={{ justifyContent: "center" }}>
              <Text>로그아웃</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  profileContainer: {
    backgroundColor: "#fff",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    marginBottom: 30,
  },
  profileContainerItem: {
    padding: 18,
    flexDirection: "row",
  },
  profilePicture: {
    marginBottom: 15,
    height: 90,
  },
  photoImg: {
    margin: "auto",
    width: "100%",
    borderRadius: 30,
    aspectRatio: 1,
  },
  iconImgView: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#C0C0C0",
    overflow: "hidden",
    marginRight: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImg: {
    margin: "auto",
    width: 15,
    resizeMode: "contain",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  imgBtn: {
    position: "absolute",
    bottom: 0,
    right: -5,
    borderColor: "#ddd",
    width: 15,
    height: 15,
    padding: 5,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  profileImageView: {
    marginTop: 5,
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 30,
    backgroundColor: "#e0e0e0",
  },
});
