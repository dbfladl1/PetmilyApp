import { useState } from "react";
import { chatContentInfo } from "../interface/chat";
import {
  behaviorFlows,
  healthFlows,
  botMessage,
  trainingFlows,
} from "@/data/flow";
import { helpWithAiStore } from "../store/help/helpWithAiStore";
import {
  callGPTGenerateSolution,
  callGPTGenerateStep,
} from "../service/chatApi";

export const useChatAiFlow = () => {
  const selectedPet = helpWithAiStore((s) => s.selectedPet);

  const returnUnexpectedFlow = async (
    params: {
      petInfo: object;
      question: string;
      userAnswer: string;
      chatHistory: string;
    },
  ) => {
    {
      const aiQuestion = await callGPTGenerateStep(params);
      return [
        { step: 1, sender: "bot", type: "question", message: aiQuestion },
        { step: 2, sender: "bot", type: "solution", message: "", guide: "질문을 확인해서 답변" },
      ];
    }
  };

  const returnExpectedFlow = (params: {
    petInfo: any;
    chatHistory: chatContentInfo[];
    userInput: chatContentInfo;
  }) => {
    const matchedFlow = matchingFirstFlow(params.userInput);
    return matchedFlow;
  };

  const returnSolution = async (chatHistory:chatContentInfo[], guide: string | undefined) => {
    const solution = await callGPTGenerateSolution({
      petInfo: selectedPet,
      chatHistory,
      guide,
    });
    return solution;
  }

  const matchingFirstFlow = (answerInfo: chatContentInfo) => {
    if (answerInfo.step === 0) {
      const messageMap: { [key: string]: any } = {
        "먹어도 되나요?": botMessage.food,
        "행동 분석": botMessage.behavior,
        "행동 훈련/교정": botMessage.training,
        건강: botMessage.health,
      };

      return messageMap[answerInfo.message];
    }
  };

  const matchingSecondFlow = (
    chatHistory: chatContentInfo[],
    answerInfo: chatContentInfo
  ) => {
    const current = chatHistory.find((chat) => chat.step === 1);
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
        const flow = flowMap[branchKey as keyof typeof flowMap];
        return flow;
      }
    }
  };

  return {
    returnUnexpectedFlow,
    returnExpectedFlow,
    returnSolution,
    matchingSecondFlow,
  };
};
