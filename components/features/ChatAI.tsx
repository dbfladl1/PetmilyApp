import CTextInput from "@/components/atom/RNInput";
import CBtn from "@/components/atom/RNTouchableOpacity";
import Chat from "@/components/atom/Chat";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, ScrollView, Keyboard } from "react-native";
import OptionButton from "@/components/atom/OptionButton";
import { petInfo, questionInfo, addedPetInfo } from "@/interface/chat";
import {
  callGPTGenerateAnswer,
  callGPTGenerateQuestion,
} from "@/service/api/chatApi";
import {
  behaviorFlows,
  healthFlows,
  questions,
  trainingFlows,
} from "@/data/flow";

export default function ChatAi({
  pet,
  petInfoChanged,
}: {
  pet: addedPetInfo;
  petInfoChanged: () => void;
}) {
  const [petInfo, setPetInfo] = useState<petInfo[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // const confirmRouterPush = (path: string) => {
  //   Alert.alert(
  //     "페이지를 떠나시겠어요?",
  //     "지금 페이지를 나가면 상담 내용은 저장되지 않습니다.",
  //     [
  //       { text: "취소", style: "cancel" },
  //       {
  //         text: "확인",
  //         style: "destructive",
  //         onPress: () => router.push(path as any),
  //       },
  //     ]
  //   );
  // };

  const initialChat = {
    step: 0,
    message: "어떤 도움이 필요하신가요?",
    type: "question",
    examples: ["먹어도 되나요?", "행동 분석", "행동 훈련/교정", "건강"],
  };

  const [chatHistory, setChatHistory] = useState<questionInfo[]>(
    pet ? [initialChat] : []
  );
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
    console.log("answerInfo", answerInfo);
    let isHandledByRule = true;

    if (answerInfo.step === 0) {
      if (answerInfo.message === "먹어도 되나요?") {
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
        if (nextQuestion.type === "solution") {
          const updatedHistory = [...chatHistory, answerInfo];

          const gptAnswer = await callGPTGenerateAnswer(
            pet,
            updatedHistory,
            nextQuestion.guide || ""
          );
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
    petInfoChanged();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory, isTyping]);

  const [answer, setAnswer] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1, padding: 10 }} ref={scrollRef}>
        {pet ? (
          <View>
            <Chat
              type="question"
              text={`${pet?.name}에 대한 상담을 진행하겠습니다.`}
            ></Chat>
            <Chat
              type="question"
              text="질문에 맞추어 답변을 선택하거나 입력해주세요. 답변은 자세할수록 좋으며 상담은 최근 한달 이내의 내역을 바탕으로 이루어집니다."
            ></Chat>
          </View>
        ) : (
          <View>
            <Chat type="question" text="반려동물을 먼저 등록해주세요"></Chat>
          </View>
        )}
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
    </View>
  );
}
