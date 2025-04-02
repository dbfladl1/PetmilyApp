import CTextInput from "@/components/atom/RNInput";
import CBtn from "@/components/atom/RNTouchableOpacity";
import BottomNav from "@/components/ui/BottomNav";
import Chat from "@/components/atom/Chat";
import Header from "@/components/ui/Header";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import {
  callGPTGenerateAnswer,
  callGPTGenerateQuestion,
  getMyPet,
} from "@/service/api/chatApi";
import Pannel from "@/components/atom/Pannel";
import {
  behaviorFlows,
  healthFlows,
  questions,
  trainingFlows,
} from "@/data/flow";
import { Alert } from "react-native";

interface questionInfo {
  step: number;
  message: string;
  type: string;
  examples?: string[];
  branchMap?: { [key: string]: string };
  guide?: string;
}
[];

export default function ChatAiScreen() {
  const [petInfo, setPetInfo] = useState<petInfo[]>([]);
  const [selectedPet, setSelectedPet] = useState<petInfo>(petInfo[0]);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  
  const confirmRouterPush = (path: string) => {
    Alert.alert(
      "페이지를 떠나시겠어요?",
      "지금 페이지를 나가면 상담 내용은 저장되지 않습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "확인",
          style: "destructive",
          onPress: () => router.push(path as any),
        },
      ]
    );
  };
  useEffect(() => {
    const fetchPetInfo = async () => {
      try {
        const res = await getMyPet();
        if (res.answerInfo === 0) {
          router.push("/help/AddPet");
        }
        setPetInfo(res.animalInfos);
        setSelectedPet(res.animalInfos[0]);
      } catch (error) {
        console.error("❌ 반려동물 정보 가져오기 실패:", error);
      }
    };

    fetchPetInfo();
  }, []);

  const settingPetInfo = (pet: {
    breed: string;
    id: string;
    name: string;
    species: string;
  }) => {
    setSelectedPet(pet);
  };

  const initialChat = {
    step: 0,
    message: "어떤 도움이 필요하신가요?",
    type: "question",
    examples: ["식용 가능여부", "행동 분석", "행동 훈련/교정", "건강"],
  };

  const [chatHistory, setChatHistory] = useState<questionInfo[]>([initialChat]);
  const [chatFlow, setChatFlow] = useState<questionInfo[]>([]);

  const [step, setStep] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleAnswerSubmit = (value?: string) => {
    const userAnswer = value || answer;
    const answerInfo = {
      step: step,
      message: userAnswer,
      type: "answer",
      examples: [],
    };
    addQnA(answerInfo);
    setStep((prev) => prev + 1);
    setAnswer("");
    Keyboard.dismiss();
  };

  const addQnA = async (answerInfo: {
    step: number;
    message: string;
    type: string;
    examples?: string[];
  }) => {
    setTimeout(() => setIsTyping(true), 300);
    let newFlow = chatFlow;

    let isHandledByRule = true;

    if (answerInfo.step === 0) {
      console.log("해당");
      if (answerInfo.message === "식용 가능여부") {
        newFlow = [...chatFlow, ...questions["food"]];
      } else if (answerInfo.message === "행동 분석") {
        newFlow = [...chatFlow, ...questions["behavior"]];
      } else if (answerInfo.message === "행동 훈련/교정") {
        newFlow = [...chatFlow, ...questions["training"]];
      } else if (answerInfo.message === "건강") {
        newFlow = [...chatFlow, ...questions["health"]];
      } else {
        isHandledByRule = false;
      }
    }
    setChatFlow(newFlow);
    setAnswer("");
    setChatHistory((prev) => [...prev, answerInfo]);

    const current = chatHistory.find((chat) => chat.step === step);
    console.log("@@@", isHandledByRule);
    console.log("~~~", chatHistory);
    console.log("~~~", current);
    if (current?.branchMap) {
      const branchKey = current.branchMap[answerInfo.message];
      const flowMap = {
        diet_flow: healthFlows.diet_flow,
        cough_flow: healthFlows.cough_flow,
        check_flow: healthFlows.check_flow,
        repeat_flow: behaviorFlows.repeat_flow,
        unexpected_flow: behaviorFlows.unexpected_flow,
        bark_flow: behaviorFlows.bark_flow,
        training_flow: trainingFlows.training_flow,
        correction_flow: trainingFlows.correction_flow,
      } as const;

      if (branchKey && branchKey in flowMap) {
        newFlow = [...chatFlow, ...flowMap[branchKey as keyof typeof flowMap]];
        isHandledByRule = true;
      }
    }

    if (!isHandledByRule) {
      const gptQuestion = await callGPTGenerateQuestion(
        petInfo,
        chatHistory[step].message,
        answerInfo.message,
        chatHistory.toString()
      );
      const aiGenerated = {
        step: step + 1,
        message: gptQuestion,
        type: "question",
      };
      newFlow = [...newFlow, aiGenerated];
    }

    if (newFlow.length > 0) {
      const [nextQuestion, ...rest] = newFlow;
      setChatFlow(rest);
      setTimeout(async () => {
        console.log("nextQuestion::", nextQuestion);
        if (nextQuestion.type === "solution") {
          console.log("보여줘!!!!!!!!!", chatHistory);
          const gptAnswer = await callGPTGenerateAnswer(
            selectedPet,
            chatHistory,
            nextQuestion.guide || ""
          );
          console.log(selectedPet);
          const aiGenerated = {
            step: step + 1,
            message: gptAnswer,
            type: "solution",
          };
          newFlow = [...newFlow, aiGenerated];
          setChatHistory((prev) => [...prev, aiGenerated]);
        } else {
          setChatHistory((prev) => [...prev, nextQuestion]);
        }
        setIsTyping(false);
      }, 1200);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory, isTyping]);

  const [answer, setAnswer] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <Header />
      </View>
      <Pannel
        title={"상담 내역"}
        list={petInfo}
        selectHandle={(pet) => settingPetInfo(pet)}
      />
      <View>
        <View style={styles.buttonArea}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => router.push("/help/ChatAI")}
            style={[styles.topButton, styles.selectedButton]}
          >
            <Text style={[styles.buttonText, styles.selectedButtonText]}>
              상담하기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => router.push("/help/AddPet")}
            style={[styles.topButton]}
          >
            <Text style={[styles.buttonText]}>반려동물 등록하기</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ flex: 1, padding: 10 }} ref={scrollRef}>
        <Chat
          type="question"
          text={`${selectedPet?.name}에 대한 상담을 진행하겠습니다.`}
        ></Chat>
        <Chat
          type="question"
          text="질문에 맞추어 답변을 선택하거나 입력해주세요. 답변은 자세할수록 좋으며 상담은 최근 한달 이내의 내역을 바탕으로 이루어집니다."
        ></Chat>
        {chatHistory.map((chat, index) => (
          <Chat key={index} type={chat.type} text={chat.message} />
        ))}
        {isTyping && <Chat type="question" text="..." />}
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
            .flatMap((chat) => chat.examples ?? [])
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
            // editable={!finish}
          />
          <CBtn style={{ width: 80 }} onPress={() => handleAnswerSubmit()}>
            확인
          </CBtn>
        </View>
      </View>
      <View>
        <BottomNav onNavigate={confirmRouterPush} />
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
