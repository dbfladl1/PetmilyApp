import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import CPicker from "@/components/atom/RNPicker";
import { Picker } from "@react-native-picker/picker";
import CText from "@/components/atom/RNText";
import CTextInput from "@/components/atom/RNInput";
import { addrType } from "@/interface/user";
import CBtn from "@/components/atom/RNTouchableOpacity";
import SearchAddrView from "@/components/ui/SearchAddr";
import BottomNav from "@/components/ui/BottomNav";
import Header from "@/components/ui/Header";
import axios from "axios";

export default function FindingPetRegister() {
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

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
  
      const response = await axios.get(
        `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc`,
        {
          params: {
            coords: `${longitude},${latitude}`,
            orders: "roadaddr",
            output: "json",
          },
          headers: {
            "X-NCP-APIGW-API-KEY-ID": "7isoi1lsxq", // ✅ 본인 API 키 입력
            "X-NCP-APIGW-API-KEY": "8xDGcu6egD1bP7duQOHldXR3MPfzKjFAElFSnTt8", // ✅ 본인 API 키 입력
          },
        }
      );
  
      const address = response.data.results[0]?.region?.area1?.name + " " +
                      response.data.results[0]?.region?.area2?.name + " " +
                      response.data.results[0]?.region?.area3?.name;
  
      return address; // ✅ 변환된 주소 반환
    } catch (error) {
      console.error("❌ [ERROR] 주소 변환 실패:", error);
      return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Header />
      </View>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.title}>반려동물 찾기 게시글 등록</Text>
        </View>
        <View style={styles.pickerContainer}>
          <CPicker
            selectedValue={"map/FindingPet"}
            onValueChange={(value) => {}}
          >
            <Picker.Item label="찾아요" value="" />
            <Picker.Item label="봤어요" value="" />
          </CPicker>
          <View>
            <CPicker
              selectedValue={"map/FindingPet"}
              onValueChange={(value) => {}}
            >
              <Picker.Item label="강아지" value="" />
              <Picker.Item label="고양이" value="" />
              <Picker.Item label="기타" value="" />
            </CPicker>
          </View>
        </View>
        <View>
          <CText style={styles.label}>주소 등록</CText>
          <View style={{flexDirection:"row",gap:5}}>
            <CBtn style={styles.mainButton}>현재 위치</CBtn>
            <CBtn
              style={styles.mainButton}
              onPress={() => openSearchAddr(!addr.state)}
            >
              <Text style={styles.mainButtonText}>주소 검색</Text>
            </CBtn>
          </View>
          <View style={styles.inputRow}>
            <CTextInput
              style={[styles.input, styles.flex]}
              value={addr.address}
              editable={false}
            />
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
        <View>
          <CBtn style={{ width: 120, marginLeft: 0, marginTop: 30 }}>
            사진 추가
          </CBtn>

          <View style={styles.textContainer}>
            <TextInput
              style={styles.inputBox}
              multiline={true}
              placeholder="내용을 입력해주세요"
              onChangeText={(text) => {}}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CBtn style={styles.mainButton} onPress={() => {}}>
            등록
          </CBtn>
        </View>
      </ScrollView>
      <View>
        <BottomNav />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontFamily: "DMSans",
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  pickerContainer: {
    marginBottom: 10,
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
  mainButton: {
    backgroundColor: "#7D3DCF",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginLeft: 0,
    width: 120,
  },
  mainButtonText: {
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
  inputBox: {
    borderBottomColor: "#555",
    borderBottomWidth: 0.5,
    width: "100%",
  },
  textContainer: {
    paddingTop: 40,
    paddingBottom: 30,
  },
});
