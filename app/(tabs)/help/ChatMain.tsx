import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getMyPet } from "@/service/api/chatApi";
import { useRouter } from "expo-router";
import { petInfo, addedPetInfo } from "@/interface/chat";
import { StyleSheet } from "react-native";
import AddPet from "../../../components/features/AddPet";
import ChatAi from "../../../components/features/ChatAI";
import BottomNav from "@/components/ui/BottomNav";
import Header from "@/components/ui/Header";
import Pannel from "@/components/atom/Pannel";

export default function ChatMain() {
  const [petInfo, setPetInfo] = useState<addedPetInfo[]>([]);
  const [selectedPet, setSelectedPet] = useState<addedPetInfo>(petInfo[0]);
  const [chatType, setChatType] = useState<"loading" | "chat" | "add">(
    "loading"
  );

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const fetchPetInfo = async () => {
    try {
      const res = await getMyPet();
      if (res.animalInfos.length === 0) {
        setChatType("add");
      } else {
        setPetInfo(res.animalInfos);
        setSelectedPet(res.animalInfos[0]);
        setChatType("chat");
      }
    } catch (error) {
      console.error("❌ 반려동물 정보 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchPetInfo();
  }, []);

  const settingPetInfo = (pet: addedPetInfo) => {
    setSelectedPet(pet);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <Header />
      </View>
      {chatType === "chat" && (
        <Pannel
          title={"상담 내역"}
          list={petInfo}
          selectHandle={(pet) => settingPetInfo(pet as addedPetInfo)}
          onOpen={() => setIsPanelOpen(true)}
          onClose={() => setIsPanelOpen(false)}
          isOpen={isPanelOpen}
        />
      )}
      <View>
        <View style={styles.buttonArea}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setChatType("chat")}
            style={[
              styles.topButton,
              chatType === "chat" && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                chatType === "chat" && styles.selectedButtonText,
              ]}
            >
              상담하기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setChatType("add")}
            style={[
              styles.topButton,
              chatType === "add" && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                chatType === "add" && styles.selectedButtonText,
              ]}
            >
              반려동물 등록하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={()=>setIsPanelOpen(false)}>
        <View style={{ flex: 1 }}>
          {chatType === "add" ? (
            <AddPet />
          ) : chatType === "chat" ? (
            <ChatAi pet={selectedPet} petInfoChanged={fetchPetInfo} />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <View>
        <BottomNav />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonArea: {
    flexDirection: "row",
    gap: 15,
    marginHorizontal: 20,
    marginVertical: 12,
  },
  topButton: {
    flex: 1,
    textAlign: "center",
    borderColor: "#666",
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 12,
  },
  selectedButton: {
    borderColor: "#6E37AB",
  },
  buttonText: {
    textAlign: "center",
  },
  selectedButtonText: {
    textAlign: "center",
    color: "#6E37AB",
  },
});
