import CTextInput from "@/components/atom/RNInput";
import CBtn from "@/components/atom/RNTouchableOpacity";
import BottomNav from "@/components/ui/BottomNav";
import Chat from "@/components/atom/Chat";
import Header from "@/components/ui/Header";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import OptionButton from "@/components/atom/OptionButton";
import { petInfo } from "@/interface/chat";
import { enrolledMypet, getMyPet } from "@/service/api/chatApi";

export default function AddPetScreen() {
  const router = useRouter();

  const [petInfo, setPetInfo] = useState<petInfo>();

  const [chatHistory, setChatHistory] = useState([
    {
      step: 1,
      message: "반려동물의 종을 알려주세요",
      type: "question",
      category: "species",
      examples: ["강아지", "고양이"],
    },
  ]);

  const [step, setStep] = useState(1);

  const questions = [
    {
      step: 2,
      message: "반려동물의 이름을 알려주세요",
      category: "name",
      type: "question",
      examples: [],
    },
    {
      step: 3,
      message: "반려동물의 품종을 알려주세요",
      category: "breed",
      type: "question",
      examples: ["모름"],
    },
  ];

  const [isTyping, setIsTyping] = useState(false);

  const [finish, setFinish] = useState(false);

  const [pet, setPet] = useState({
    name: "",
    species: "",
    breed: "",
  });

  useEffect(() => {
    const newPet = {
      name: chatHistory.find((value) => value.type === "answer" && value.category === "name")?.message || "",
      species: chatHistory.find((value) => value.type === "answer" && value.category === "species")?.message || "",
      breed: chatHistory.find((value) => value.type === "answer" && value.category === "breed")?.message || "",
    };
    
    setPet(newPet);
  
    // ✅ `pet` 객체가 완전히 채워졌을 때 `enrolledMypet()` 실행
    if (newPet.name && newPet.species && newPet.breed && step >= 3) {
      setTimeout(() => {
        setFinish(true);
        enrolledMypet(newPet); // ✅ 모든 데이터가 채워진 후 실행
      }, 300);
    }
  }, [chatHistory]); // ✅ `chatHistory`가 변경될 때마다 실행

  const handleAnswerSubmit = (value?: string) => {
    const userAnswer = value || answer;
    const matchingQuestion = chatHistory.find((chat) => chat.step === step);
    const answerInfo = {
      step: step,
      message: userAnswer,
      type: "answer",
      category: matchingQuestion?.category || "",
      examples: [],
    };
    console.log(answerInfo);

    setChatHistory((prev) => [...prev, answerInfo]);
    setAnswer("");
    Keyboard.dismiss();

    if (step >= 3) {
      setTimeout(() => {
        setFinish(true);
      }, 300);
      console.log(pet)
      enrolledMypet(pet);
      return;
    } else {
      addQuestion();
    }
  };

  const addQuestion = () => {
    setTimeout(() => setIsTyping(true), 300);
    setTimeout(() => {
      setChatHistory((prev) => [...prev, questions[step - 1]]);
      setStep((prev) => prev + 1);
      setIsTyping(false);
    }, 1200);
  };

  const [pageState, setPageState] = useState("register");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    getMyPet();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <Header />
      </View>
      <View>
        <View style={styles.buttonArea}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => router.push("/help/ChatAI")}
            style={[
              styles.topButton,
              pageState === "chat" && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                pageState === "chat" && styles.selectedButtonText,
              ]}
            >
              상담하기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => router.push("/help/AddPet")}
            style={[
              styles.topButton,
              pageState === "register" && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                pageState === "register" && styles.selectedButtonText,
              ]}
            >
              반려동물 등록하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <Chat
            type="question"
            text="안녕하세요. 시작 전 반려동물의 정보를 등록하겠습니다. 답변의 내용이 올바르지 않으면 잘못된 진단을 받으실 수 있으니 정확한 답변 부탁드립니다. "
          ></Chat>
          {chatHistory.map((chat, index) => (
            <Chat key={index} type={chat.type} text={chat.message} />
          ))}
          {isTyping && <Chat type="question" text="..." />}
          {finish && (
            <Chat type="question" text="정보 등록이 완료되었습니다." />
          )}
        </ScrollView>
      </ScrollView>
      <View>
        <View
          style={{
            flexDirection: "row",
            marginLeft: 7,
            marginRight: 7,
            gap: 7,
          }}
        >
          {chatHistory
            .filter((chat) => chat.step === step)
            .flatMap((chat) => chat.examples)
            .map((example, index) => (
              <OptionButton
                key={index}
                option={example}
                callbackFx={(example) => handleAnswerSubmit(example)}
              />
            ))}
          <OptionButton
            key={"finish-btn"}
            option={"대화종료"}
            callbackFx={(example) => handleAnswerSubmit(example)}
            filled={true}
          />
        </View>
        <View style={{ flexDirection: "row", padding: 7, paddingBottom: 50 }}>
          <CTextInput
            style={{ flex: 1 }}
            placeholder="직접 입력 또는 선택"
            placeholderTextColor="#A0A0A0"
            onChangeText={(answer) => setAnswer(answer)}
            onSubmitEditing={() => handleAnswerSubmit()}
            value={answer}
            editable={!finish}
          />
          <CBtn style={{ width: 80 }} onPress={() => handleAnswerSubmit()}>
            확인
          </CBtn>
        </View>
      </View>
      <View>
        <BottomNav />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
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
