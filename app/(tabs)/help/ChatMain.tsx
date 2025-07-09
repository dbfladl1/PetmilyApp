import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { addedPetInfo } from "@/src/interface/chat";
import { StyleSheet } from "react-native";
import AddPet from "../../../src/components/features/AddPet";
import ChatAi from "../../../src/components/features/ChatAI";
import BottomNav from "@/src/components/ui/BottomNav";
import Header from "@/src/components/ui/Header";
import Pannel from "@/src/components/atom/Pannel";
import { helpWithAiStore } from "@/src/store/help/helpWithAiStore";

export default function ChatMain() {
  const fetchPetList = helpWithAiStore((s) => s.fetchPetList);
  const petList = helpWithAiStore((s) => s.petList);
  const handleSelectPet = helpWithAiStore((s) => s.handleSelectPet);
  const chatType = helpWithAiStore((s) => s.chatType);
  const setChatType = helpWithAiStore((s) => s.setChatType);

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    fetchPetList();
  }, []);



  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <Header />
      </View>
      {chatType === "chat" && (
        <Pannel
          title={"상담 내역"}
          list={petList}
          selectHandle={(pet) => handleSelectPet(pet as addedPetInfo)}
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
      <View style={{ flex: 1 }} pointerEvents="box-none">
        {chatType === "add" ? (
          <AddPet />
        ) : chatType === "chat" ? (
          <ChatAi />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
      {isPanelOpen && (
        <TouchableWithoutFeedback onPress={() => setIsPanelOpen(false)}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "transparent",
            }}
          />
        </TouchableWithoutFeedback>
      )}

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
