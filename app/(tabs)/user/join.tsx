import React, { MutableRefObject, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Picker } from "@react-native-picker/picker";
import CText from "@/components/atom/RNText";
import CTextInput from "@/components/atom/RNInput";
import CBtn, { CLongBtn } from "@/components/atom/RNTouchableOpacity";
import CPicker from "@/components/atom/RNPicker";
import SearchAddrView from "@/components/ui/SearchAddr";
import {
  checkIdDupicate,
  joinUser,
  matchAuth,
  sendAuthCodeToEmail,
} from "@/service/api/userApi";
import { regEngNumChar, regLowerEngNum } from "@/service/Reg";
import { alertDialog } from "@/components/atom/Alert";
import { addrType, userForm } from "@/interface/user";
import { useRouter } from "expo-router";

export default function JoinScreen() {
  const router = useRouter();
  const [user, setUser] = useState<userForm>({
    id: "",
    idVal: false,
    pw: "",
    pwChk: false,
    pwMatch: "",
    isPwMatch: false,
    gender: "F",
    phone: "",
    email: "",
    emailVal: false,
    profile: "",
    address: "",
    term: false,
  });

  function updateUserField(field: keyof userForm, value: string) {
    setUser((prev) => ({ ...prev, [field]: value }));
  }

  function updateCheckField(chkProperty: keyof userForm) {
    setUser((prev) => ({ ...prev, [chkProperty]: false }));
  }

  async function checkIdAvailability() {
    if (!regLowerEngNum(user.id)) {
      return alertDialog("아이디 형식을 확인해주세요");
    }

    if (await checkIdDupicate(user.id)) {
      setUser((prev) => ({ ...prev, idVal: true }));
      return alertDialog("아이디를 사용하실 수 있습니다.");
    } else {
      return alertDialog("아이디를 조회 중 문제가 발생했습니다.");
    }
  }

  function isPwAvailability(value: string) {
    const pwRes = regEngNumChar(value);
    setUser((prev) => ({ ...prev, pwChk: pwRes }));
  }

  function isPwMatch(value: string) {
    setUser((prev) => ({
      ...prev,
      pwMatch: value,
      isPwMatch: prev.pw === value,
    }));
  }

  const [emailLocal, setEmailLocal] = useState("");
  const [emailDomain, setEmailDomain] = useState("gmail.com");
  const [customDomain, setCustomDomain] = useState("");
  const [sendAuth, setSendAuth] = useState(false);

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
    console.log(response);
    setUser((prev) => ({ ...prev, emailVal: true }));
    return alertDialog("인증이 완료되었습니다.");
  }


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

  async function join() {
    const value = valueCheck();
    if (value) {
      const data = {
        loginId: user.id,
        password: user.pw,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        recoveryQuestion: "",
        recoveryAnswer: "",
      };
      const result = await joinUser(data);
      if (result) {
        alertDialog("회원가입이 완료되었습니다.");
        router.push("/user/login");
      } else {
        alertDialog("회원가입 중 에러가 발생했습니다.");
      }
    }
  }

  function valueCheck() {
    const validations = [
      { condition: user.idVal, message: "아이디를 확인해주세요." },
      { condition: user.pwChk, message: "비밀번호 형식이 올바르지 않습니다." },
      { condition: user.isPwMatch, message: "비밀번호가 일치하지 않습니다." },
      { condition: user.emailVal, message: "이메일 인증이 필요합니다." },
      { condition: user.term, message: "약관에 동의해주세요." },
    ];

    for (const validation of validations) {
      if (!validation.condition) {
        return alertDialog(validation.message);
      }
      return true;
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("@/assets/images/pm-logo.png")}
          style={styles.logo}
        />

        <CText style={styles.title}>회원가입</CText>
        <View>
          <CText style={styles.label}>* 아이디</CText>
          <CText style={styles.smallText}>
            6~12자리 영(소)문자or숫자or영(소)문자+숫자
          </CText>
          <View style={styles.inputRow}>
            <CTextInput
              style={[styles.input, styles.flex]}
              onChangeText={(text) => {
                updateUserField("id", text);
                updateCheckField("idVal");
              }}
            />
            <CBtn
              style={styles.smallButton}
              activeOpacity={0.9}
              onPress={checkIdAvailability}
            >
              <Text style={styles.smallButtonText}>중복확인</Text>
            </CBtn>
          </View>
        </View>

        <View>
          <CText style={styles.label}>* 비밀번호</CText>
          <CText style={styles.smallText}>
            8~14자리의 영문+숫자+특수문자(.!*^@) 조합
          </CText>
          <CTextInput
            style={styles.input}
            placeholder="비밀번호를 입력하세요"
            placeholderTextColor="#A0A0A0"
            color={
              user.pw === "" ? "#C0C0C0" : user.pwChk ? "#3C83F6" : "#EA4D4D"
            }
            secureTextEntry
            onChangeText={(id) => {
              updateUserField("pw", id);
              isPwAvailability(id);
            }}
          />
          <CTextInput
            style={styles.input}
            placeholder="비밀번호를 한 번 더 입력하세요"
            placeholderTextColor="#A0A0A0"
            color={
              user.pwMatch === ""
                ? "#C0C0C0"
                : user.isPwMatch
                ? "#3C83F6"
                : "#EA4D4D"
            }
            secureTextEntry
            onChangeText={(pw) => {
              updateUserField("pwMatch", pw);
              isPwMatch(pw);
            }}
          />
        </View>
        <View style={styles.input}>
          <CText style={styles.label}>* 성별</CText>
          <CPicker
            onValueChange={(gender) =>
              updateUserField("gender", gender as string)
            }
          >
            <Picker.Item label="여성" value="F" />
            <Picker.Item label="남성" value="M" />
          </CPicker>
        </View>
        <View>
          <CText style={styles.label}>전화번호</CText>
          <CTextInput
            style={styles.input}
            placeholder="01012341234"
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
        <View>
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
        </View>
        <CText style={styles.label}>약관</CText>
        <ScrollView style={styles.termBox} nestedScrollEnabled={true}>
          <Text>
            본 약관은 PETMILY가 제공하는 반려동물 관련 SNS 서비스를 이용함에
            있어 서비스와 이용자 간의 권리, 의무, 책임 및 기타 필요한 사항을
            규정함을 목적으로 합니다.{"\n"}
            {"\n"}
            PETMILY는 회원가입 과정에서 다음과 같은 정보를 수집할 수 있습니다:
            {"\n"}- 필수 정보: 이름, 이메일 주소, 비밀번호{"\n"}- 선택 정보:
            전화번호, 주소, 반려동물 관련 정보 (이름, 나이, 품종 등){"\n"}
            {"\n"}
            수집된 개인정보는 다음의 목적을 위해 사용됩니다:{"\n"}- 서비스 제공
            및 사용자 식별{"\n"}- 고객 상담 및 서비스 개선{"\n"}- 서비스 관련
            알림, 이벤트 안내, 마케팅 자료 제공{"\n"}
            {"\n"}
            회원은 개인정보 수집 및 이용에 대해 동의하지 않을 권리가 있습니다.
            다만, 필수 정보 제공에 동의하지 않을 경우, 서비스 이용이 제한될 수
            있습니다.{"\n"}
            {"\n"}
            PETMILY는 회원의 명시적인 동의 없이 개인정보를 제3자에게 제공하지
            않습니다. 다만, 다음의 경우 예외로 합니다:{"\n"}- 법령에 의한 요구가
            있는 경우{"\n"}- 서비스 운영에 필요한 최소한의 범위 내에서 제휴사에
            제공되는 경우{"\n"}
            {"\n"}
            PETMILY는 이용자의 주소 및 연락처 정보를 다음의 목적으로 활용할 수
            있습니다:{"\n"}- 커뮤니티 이벤트 초대 및 기념품 발송{"\n"}- 사용자
            맞춤형 서비스 제공{"\n"}- 긴급 공지 및 중요 알림{"\n"}
            {"\n"}
            회원은 서비스 이용 시 제공하는 모든 정보가 정확하고 진실해야 합니다.
            {"\n"}
            {"\n"}
            회원은 타인의 정보를 도용하거나 허위 정보를 제공해서는 안 됩니다.
            {"\n"}
            {"\n"}
            회원은 서비스와 관련된 공지사항 및 약관을 준수해야 합니다.{"\n"}
            {"\n"}
            PETMILY는 회원의 개인정보를 안전하게 보호하기 위해 최선을 다하며,
            관련 법령을 준수합니다.{"\n"}
            {"\n"}
            PETMILY는 안정적인 운영을 위해 지속적으로 개선과 업데이트를
            수행합니다.
            {"\n"}
            {"\n"}
            PETMILY는 필요에 따라 본 약관을 변경할 수 있으며, 변경 사항은 사전에
            공지됩니다. 변경된 약관에 동의하지 않을 경우, 회원은 언제든지 서비스
            탈퇴를 요청할 수 있습니다.{"\n"}
            {"\n"}
            서비스 관련 문의는 아래 연락처를 통해 가능합니다.{"\n"}- 이메일:
            yurim2222@petmily.com{"\n"}- 전화: [010-4163-0862]{"\n"}
            {"\n"}본 약관은 [2025.1.31]부터 적용됩니다.{"\n"}
            {"\n"}본 약관에 명시되지 않은 사항은 관계 법령 및 상관례에 따릅니다.
            {"\n"}
            {"\n"}
          </Text>
        </ScrollView>

        <BouncyCheckbox
          onPress={() => setUser((prev) => ({ ...prev, term: !prev.term }))}
          size={20}
          text="상기 약관에 동의합니다. (필수)"
          fillColor="#7D3DCF"
          textStyle={{
            textDecorationLine: "none",
          }}
        />

        <CLongBtn style={styles.button} onPress={join}>
          <CText style={styles.buttonText}>회원가입</CText>
        </CLongBtn>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontFamily: "DMSans",
    textAlign: "center",
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
    marginTop: 5,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#C0C0C0",
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
  profilePicture: {
    marginBottom: 15,
    height: 90,
  },
  photoImg: {
    margin: "auto",
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
  termBox: {
    height: 250,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
    marginBottom: 20,
  },
});
