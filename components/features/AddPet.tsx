import CTextInput from "@/components/atom/RNInput";
import CBtn from "@/components/atom/RNTouchableOpacity";
import Chat from "@/components/atom/Chat";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Keyboard } from "react-native";
import OptionButton from "@/components/atom/OptionButton";
import { enrolledMypet, getMyPet } from "@/service/api/chatApi";
import { questions } from "@/data/enrolledStep";
import { addedPetInfo, petInfo } from "@/interface/chat";

export default function AddPet() {
  const scrollRef = useRef<ScrollView>(null);
  const [chatHistory, setChatHistory] = useState([
    {
      step: 0,
      message: "반려동물의 종을 알려주세요",
      type: "question",
      category: "species",
      examples: ["강아지", "고양이", "토끼"],
    },
  ]);

  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [finish, setFinish] = useState(false);

  const [answer, setAnswer] = useState("");
  const [pet, setPet] = useState<petInfo>({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    weight: "",
  });

  const [exampleState, setExampleState] = useState(true);
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
    setExampleState(false);

    setChatHistory((prev) => [...prev, answerInfo]);
    const updatedPet = {
      ...pet,
      [matchingQuestion?.category || ""]: userAnswer,
    };
    setPet(updatedPet);

    setAnswer("");
    Keyboard.dismiss();

    if (step >= 5) {
      setTimeout(() => {
        setFinish(true);
      }, 300);
      pet && enrolledMypet(updatedPet);
      return;
    } else {
      addQuestion();
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory, isTyping]);

  const addQuestion = () => {
    setTimeout(() => setIsTyping(true), 300);
    setTimeout(() => {
      setChatHistory((prev) => [...prev, questions[step]]);
      setStep((prev) => prev + 1);
      setIsTyping(false);
      setExampleState(true);
    }, 1200);
  };

  useEffect(() => {
    getMyPet();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView ref={scrollRef}>
        <View>
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
        </View>
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
          {exampleState &&
            chatHistory
              .filter((chat) => chat.step === step)
              .flatMap((chat) => chat.examples)
              .map((example, index) => (
                <OptionButton
                  key={index}
                  option={example}
                  callbackFx={(example) => handleAnswerSubmit(example)}
                />
              ))}
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
