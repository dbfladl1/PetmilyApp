import CTextInput from "@/src/components/atom/RNInput";
import CBtn from "@/src/components/atom/RNTouchableOpacity";
import Chat from "@/src/components/atom/Chat";
import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, Keyboard } from "react-native";
import OptionButton from "@/src/components/atom/OptionButton";
import { chatContentInfo } from "@/src/interface/chat";
import { helpWithAiStore } from "@/src/store/help/helpWithAiStore";
import { useChatAiFlow } from "@/src/hooks/useChatAiFlow";
import { callGPTGenerateSolution } from "@/src/service/chatApi";
import { shortTips } from "@/data/tips";

const initialChat: chatContentInfo = {
  step: 0,
  message: "어떤 도움이 필요하신가요?",
  sender: "bot",
  type: "question",
  examples: ["먹어도 되나요?", "행동 분석", "행동 훈련/교정", "건강"],
};

export default function ChatAi() {
  const scrollRef = useRef<ScrollView>(null);

  const selectedPet = helpWithAiStore((s) => s.selectedPet);

  const [chatHistory, setChatHistory] = useState<chatContentInfo[]>([
    initialChat,
  ]);
  const [flowScript, setFlowScript] = useState<chatContentInfo[]>([]);

  const [step, setStep] = useState(0);
  const [loadingText, setLoadingText] = useState("...");

  const [isTyping, setIsTyping] = useState(false);
  const { returnExpectedFlow, returnUnexpectedFlow, returnSolution, matchingSecondFlow } =
    useChatAiFlow();

  const buildUserMessage = (input: string): chatContentInfo => ({
    step: step,
    message: input,
    sender: "user",
    type: "userInput",
  });

  const handleAnswerSubmit = (value?: string) => {
    const input = value || answer;
    const userMessage = buildUserMessage(input);

    updateChatState(userMessage);
    getAiChat(userMessage);
    Keyboard.dismiss();
  };

  const updateChatState = (userMessage: chatContentInfo) => {
    setAnswer("");
    setChatHistory((prev) => [...prev, userMessage]);
    setStep((prev) => prev + 1);
  };

  const checkUsersQuestionType = (userChatInfo: chatContentInfo) => {
    if (
      chatHistory[step].examples?.findIndex(
        (ex) => ex === userChatInfo.message
      ) === -1
    ) {
      return "unexpected";
    } else {
      return "expected";
    }
  };

  const getChatFlow = async (
    userChatInfo: chatContentInfo,
    expected: string
  ) => {
    const updatedHistory = [...chatHistory, userChatInfo];
    const questionParams = {
      petInfo: selectedPet,
      question: chatHistory[step].message,
      userAnswer: userChatInfo.message,
      chatHistory: chatHistory.toString(),
    };
    const solutionParams = {
      petInfo: selectedPet,
      chatHistory: updatedHistory,
      userInput: userChatInfo,
    };

    const flowResult =
      expected === "expected"
        ? returnExpectedFlow(solutionParams)
        : await returnUnexpectedFlow(questionParams);
    setFlowScript(flowResult);
  };
  const getSolution = (guide: string | undefined) => {
    const aiSolution = returnSolution(chatHistory, guide);

    return aiSolution;
  };

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * shortTips.length);
    return shortTips[randomIndex];
  };
  useEffect(() => {
    if (!flowScript.length) return;

    let interval: NodeJS.Timeout | null = null;
    const getLoadingText = () => {
      setLoadingText(`열심히 답변을 입력하고 있어요 🤔. 조금만 기다려주세요🙏

...

        
tip: ${getRandomTip()}`);
    };

    const run = async () => {
      const newFlowScript = flowScript.find((item) => item.step === step);
      const alreadyExists = chatHistory.some((item) => item.step === step);

      if (newFlowScript?.type === "solution") {
        getLoadingText();

        interval = setInterval(() => getLoadingText(), 2800);

        const solution = await getSolution(newFlowScript.guide);
        const solutionMessage: chatContentInfo = {
          ...newFlowScript,
          message: solution,
        };
        setChatHistory((prev) => [...prev, solutionMessage]);
        setIsTyping(false);
      }

      if (
        newFlowScript?.type !== "solution" &&
        newFlowScript &&
        !alreadyExists 
      ) {
        const timer = setTimeout(() => {
          setIsTyping(false);
          setChatHistory((prev) => [...prev, newFlowScript]);
        }, 480);

        return () => {
          clearTimeout(timer);
        };
      }
    };

    run();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [flowScript, step]);

  const getAiChat = async (userChatInfo: chatContentInfo) => {
    setTimeout(() => setIsTyping(true), 100);
    if (userChatInfo.step === 0) {
      const questionType = checkUsersQuestionType(userChatInfo);
      getChatFlow(userChatInfo, questionType);
    }
    if (userChatInfo.step === 1) {
      const flowResult = matchingSecondFlow(chatHistory, userChatInfo);
      flowResult && setFlowScript((pre) => [...pre, ...flowResult]);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory, isTyping]);

  const [answer, setAnswer] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1, padding: 10 }} ref={scrollRef}>
        {selectedPet ? (
          <View>
            <Chat
              type="bot"
              text={`${selectedPet?.name}에 대한 상담을 진행하겠습니다.`}
            ></Chat>
            <Chat
              type="bot"
              text="질문에 맞추어 답변을 선택하거나 입력해주세요. 답변은 자세할수록 좋으며 상담은 최근 한달 이내의 내역을 바탕으로 이루어집니다."
            ></Chat>
          </View>
        ) : (
          <View>
            <Chat type="bot" text="반려동물을 먼저 등록해주세요"></Chat>
          </View>
        )}
        {chatHistory.map((chat, index) => (
          <Chat key={index} type={chat.sender} text={chat.message} />
        ))}
        {isTyping && <Chat type="botMessage" text={loadingText} />}
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
            onSubmitEditing={() => handleAnswerSubmit(answer)}
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
