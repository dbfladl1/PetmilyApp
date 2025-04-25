import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { alertDialog } from "@/components/atom/Alert";
import { useRouter } from "expo-router";
import { addrType, userInfo } from "@/interface/user";
import { regEngNumChar, regLowerEngNum } from "@/service/Reg";
import {
  getUserInfo,
  matchAuth,
  modifyUser,
  profileUpdate,
  sendAuthCodeToEmail,
} from "@/service/api/userApi";
import CText from "@/components/atom/RNText";
import CTextInput from "@/components/atom/RNInput";
import CBtn, { CLongBtn } from "@/components/atom/RNTouchableOpacity";
import CPicker from "@/components/atom/RNPicker";
import { Picker } from "@react-native-picker/picker";
import SearchAddrView from "@/components/ui/SearchAddr";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import * as ImagePicker from "expo-image-picker";

export default function ModifyInfo() {
  const [user, setUser] = useState<userInfo>({
    email: "",
    emailVal: true,
    gender: "",
    joinDate: "",
    loginId: "",
    phone: "",
    profilePicturePath: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = await getUserInfo();
      setUser((prev) => Object.assign({}, prev, user));
    };

    fetchUserInfo();
  }, []);

  function updateUserField(field: keyof userInfo, value: string) {
    setUser((prev) => ({ ...prev, [field]: value }));
  }

  const [emailLocal, setEmailLocal] = useState("");
  const [emailDomain, setEmailDomain] = useState("gmail.com");
  const [customDomain, setCustomDomain] = useState("");
  const [sendAuth, setSendAuth] = useState(false);

  useEffect(() => {
    if (user.email) {
      const [local, domain] = user.email.split("@");
      setEmailLocal(local || "");
      setEmailDomain(domain || "");
    }
  }, [user.email]);

  async function emailAuthHandler() {
    if (emailLocal === "") {
      return alertDialog("아이디를 입력해주세요");
    }
    const email =
      emailDomain === "custom"
        ? `${emailLocal.trim()}@${customDomain.trim()}`
        : `${emailLocal.trim()}@${emailDomain.trim()}`;

    setUser((prev) => ({ ...prev, email }));

    const response = await sendAuthCodeToEmail({ email });
    if (response !== 200) {
      return alertDialog("인증번호 발송에 실패했습니다");
    }
    setSendAuth(true);
    return alertDialog(
      "인증번호를 전송했습니다",
      "인증번호는 3분간 유효합니다"
    );
  }

  const [authCode, setAuthCode] = useState("");

  async function matchAuthWithUser() {
    if (!sendAuth) {
      return alertDialog("인증번호를 전송해주세요");
    }
    if (authCode === "") {
      return alertDialog("인증번호를 입력해주세요");
    }
    const response = await matchAuth({ email: user.email, authCode });
    if (response !== 200) {
      return alertDialog("메일 인증 중 문제가 발생했습니다.");
    }
    setUser((prev) => ({ ...prev, emailVal: true }));
    return alertDialog("인증이 완료되었습니다.");
  }
  const selectProfile = () => {
    Alert.alert(
      "프로필 사진",
      "무엇을 하시겠어요?",
      [
        {
          text: "앨범에서 선택",
          onPress: () => openGallery(),
        },
        // {
        //   text: "삭제",
        //   style: "destructive",
        //   onPress: () => {
        //     setUser((prev) => ({
        //       ...prev,
        //       profilePicturePath: "",
        //     }));

        //     profileModify("");
        //   },
        // },
        {
          text: "취소",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  async function profileModify(imgUri: string) {
    const result = await profileUpdate(imgUri);
    if (result.status === 200) {
      alertDialog("변경되었습니다.");
    } else {
      alertDialog("회원정보 변경에 실패했습니다.");
    }
  }

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alertDialog("권한 필요", "갤러리에 접근하려면 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (result.canceled) {
      return;
    } else {
      const imgUri = result.assets[0].uri;
      setUser((prev) => ({ ...prev, profilePicturePath: imgUri }));
      profileModify(imgUri);
    }
  };
  const [addr, setAddr] = useState<addrType>({
    state: false,
    address: "",
    postcode: "",
  });

  const inputAdress = (data: { zonecode: string; address: string }) => {
    setAddr((prev) => ({
      ...prev,
      address: data.address,
      postcode: data.zonecode,
    }));
  };

  const openSearchAddr = (state: boolean) => {
    try {
      setAddr({ ...addr, state });
    } catch {
      console.log("error");
    }
  };

  async function modify() {
    const modifiedInfo = {
      email: user.email,
      phone: user.phone,
      gender: user.gender,
    };
    const result = await modifyUser(modifiedInfo);
    if (result.status === 200) {
      alertDialog("변경되었습니다.");
    } else {
      alertDialog("회원정보 변경에 실패했습니다.");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View>
          <Header />
        </View>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.profilePicture}>
            <CText style={styles.title}>프로필 이미지 변경</CText>
            <TouchableOpacity
              activeOpacity={1}
              onPress={selectProfile}
              style={styles.profileImageView}
            >
              <View style={styles.imgContainer}>
                <Image
                  source={
                    user.profilePicturePath === ""
                      ? require("@/assets/images/icon/photo.png")
                      : { uri: user.profilePicturePath }
                  }
                  style={
                    user.profilePicturePath === ""
                      ? styles.photoImg
                      : styles.profileImageView
                  }
                />
              </View>
            </TouchableOpacity>
          </View>
          <CText style={styles.title}>회원정보 수정</CText>
          <View>
            <CText style={styles.label}>전화번호</CText>
            <CTextInput
              style={styles.input}
              placeholder="01012341234"
              value={user.phone}
              placeholderTextColor="#A0A0A0"
              keyboardType="number-pad"
              onChangeText={(phone) => {
                updateUserField("phone", phone);
              }}
            />
          </View>

          <View>
            <CText style={styles.label}>* 이메일</CText>
            <View style={styles.inputRow}>
              <CTextInput
                style={[styles.input, styles.flex]}
                placeholder="아이디"
                value={emailLocal}
                placeholderTextColor="#A0A0A0"
                onChangeText={(email) => {
                  setEmailLocal(email);
                  setSendAuth(false);
                }}
              />
              <CTextInput
                placeholder="직접 입력 또는 선택"
                placeholderTextColor="#A0A0A0"
                style={{ minWidth: 145 }}
                editable={emailDomain === "custom"}
                value={emailDomain !== "custom" ? emailDomain : undefined}
                onChangeText={(domain) => {
                  setCustomDomain(domain);
                  setSendAuth(false);
                }}
              />
            </View>
          </View>
          <View style={styles.input}>
            <CPicker
              selectedValue={emailDomain}
              onValueChange={(domain) => {
                setEmailDomain(
                  domain === "custom" ? "custom" : (domain as string)
                );
                setSendAuth(false);
              }}
            >
              <Picker.Item label="gmail.com" value="gmail.com" />
              <Picker.Item label="naver.com" value="naver.com" />
              <Picker.Item label="daum.net" value="daum.net" />
              <Picker.Item label="직접 입력" value="custom" />
            </CPicker>
          </View>
          <CLongBtn onPress={emailAuthHandler}>
            <Text style={styles.smallButtonText}>인증코드 발송</Text>
          </CLongBtn>
          <View style={styles.inputRow}>
            <CTextInput
              style={[styles.input, styles.flex]}
              onChangeText={(number) => setAuthCode(number)}
            />
            <CBtn style={styles.smallButton} onPress={matchAuthWithUser}>
              <CText style={styles.smallButtonText}>코드 확인</CText>
            </CBtn>
          </View>
          {/* <View>
            <CText style={styles.label}>주소 찾기</CText>
            <View style={styles.inputRow}>
              <CTextInput
                style={[styles.input, styles.flex]}
                value={addr.address}
                editable={false}
              />
              <CBtn
                style={styles.smallButton}
                onPress={() => openSearchAddr(!addr.state)}
              >
                <Text style={styles.smallButtonText}>주소 확인</Text>
              </CBtn>
            </View>
            {addr.state ? (
              <SearchAddrView
                state={addr.state}
                selectPostCode={inputAdress}
                HandleX={(state) => openSearchAddr(state)}
              />
            ) : (
              <></>
            )}
            <CTextInput
              style={[styles.input, styles.flex]}
              value={addr.postcode}
            />
            <CTextInput
              style={styles.input}
              placeholder="상세주소를 입력하세요"
              placeholderTextColor="#A0A0A0"
            />
          </View> */}

          <View style={styles.btnContainer}>
            <CLongBtn style={styles.button} onPress={modify}>
              <CText style={styles.smallButtonText}>회원정보 수정</CText>
            </CLongBtn>
          </View>
        </ScrollView>
        <View>
          <BottomNav />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontFamily: "DMSans",
    textAlign: "center",
    paddingBottom: 100,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    margin: "auto",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    width: "100%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 5,
  },
  flex: {
    flex: 1,
  },
  smallButton: {
    backgroundColor: "#7D3DCF",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginLeft: 5,
  },
  smallButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  profileImageView: {
    position: "relative",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#C0C0C0",
    overflow: "hidden",
  },
  profilePicture: {
    marginBottom: 30,
    height: 100,
  },
  imgContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  photoImg: {
    width: 15,
    height: 15,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    marginTop: 20,
    textAlign: "center",
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
  smallText: {
    fontSize: 12,
  },
  btnContainer: {
    marginTop: 30,
  },
});
