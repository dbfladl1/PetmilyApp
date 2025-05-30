import React, { useEffect, useState } from "react";
import Postcode from "@actbase/react-daum-postcode";
import { Modal, Text, TouchableOpacity, View, Alert } from "react-native";

export default function SearchAddrView({
  state,
  HandleX,
  selectPostCode,
}: {
  state: boolean;
  HandleX: (state: boolean) => void;
  selectPostCode: (data: any) => void;
}) {
  const [selectedAddress, setSelectedAddress] = useState(null);

  // 주소가 선택되었을 때 부모 컴포넌트의 함수 호출
  useEffect(() => {
    if (selectedAddress) {
      HandleX(false); // ✅ 모달 닫기
    }
  }, [selectedAddress]);

  const setAddr = (data:any) =>{
    selectPostCode(data);
    setSelectedAddress(data);
  }


  return (
    <Modal
      transparent={false}
      visible={state}
      animationType="slide"
      onRequestClose={() => HandleX(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 13,
            right: 13,
            backgroundColor: "#555",
            padding: 7,
            borderRadius: 5
          }}
          onPress={() => HandleX(false)}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
            }}
          >
            닫기
          </Text>
        </TouchableOpacity>

        <Postcode
          style={{ width: "100%", height: "90%",marginTop:23 }}
          jsOptions={{ animation: true }}
          onSelected={(data) => setAddr(data)}
          onError={(error) => {
            console.error("우편번호 검색 오류:", error);
            Alert.alert("오류", "우편번호 검색 중 문제가 발생했습니다.");
          }}
        />
      </View>
    </Modal>
  );
}
