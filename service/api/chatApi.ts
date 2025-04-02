import axios from "axios";
import apiClient from "./apiClient";
import { petInfo } from "@/interface/chat";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra || {};

export const getMyPet = async () => {
  try {
    const response = await apiClient.get("/api/v1/animal");
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};

export const enrolledMypet = async (pet: petInfo) => {
  try {
    const response = await apiClient.post(`/api/v1/animal`, pet);

    return response.status;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};

export const getAnswer = async () => {};

export const callGPTGenerateQuestion = async (
  petInfo: object,
  question: string,
  userAnswer: string,
  setChatHistory: string
) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `${setChatHistory}와 ${petInfo}를 참고하고, 사용자의 질문을 확인해서 답변을 해줘, 추가 정보가 필요하다면 사용자에게 요청하도록 해.  ${setChatHistory}를 참고해서 형식에 맞게 반환해주면 돼. 넌 전문가니까 사용자에게 직접 말하듯, 상담하듯 말해. 하지만 정말말 어렵거나 답을 알 수 없는 질문은 전문가를 실제로 만나서서 상담을 권장하도록 해. `,
          },
          {
            role: "user",
            content: `사용자가 "${question}" 라는 질문에 "${userAnswer}"라고 했어. `,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${extra.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const gptQuestion = response.data.choices[0].message.content.trim();
    console.log(response.data.choices[0].message.content.toString());
    return gptQuestion;
  } catch (error) {
    console.log(error);
    return "내용을 확인하는 중 에러가 발생했습니다.";
  }
};

export const callGPTGenerateAnswer = async (
  petInfo: object,
  setChatHistory: object[],
  answerGuide: string
) => {
  const chatPrompt = `
  너는 반려동물 전문가야. 아래는 보호자와의 상담 대화 기록이야.
  
  각 항목은 다음 필드를 포함해:
  - step: 순서
  - type: 'question', 'answer', 또는 'solution'
  - message: 질문 또는 답변 내용
  - guide: (옵션) 답변 가이드라인
  
    type이 'question'이면 전문가가 한 질문이고,
    type이 'answer'면 사용자의 답변이야.
  
  💡 목적: ${answerGuide}의 내용에 맞추어 답변해줘
    guide에 포함된 각 항목을 기반으로 답변을 구조화해야 해. 하지만 guide내용을 한번 더 표시해 줄 필요는 없어
  - 답변은 message로 전달해주면 돼
  - 반드시 모든 항목을 포함해서 항목별로 답변을 작성해.
  - 항목이 불필요하거나 해당사항 없는 경우에만 생략해도 좋아.
  - 순서는 guide에 나온 대로 따라야 해.
  - 포인트에는 이모지를 넣어서 가독성을 높여줘도 좋아

  지금까지의 Q&A 흐름을 이해하고, 전문가처럼 사용자에게 말하듯 답변해 줘.

  
  주의:
  - 전문가의 말투로 직접 상담하듯 이야기해 줘
  - 사용자가 질문한 포인트에 대해 정확하고 신뢰 있는 답변을 줘
  - 두루뭉술하거나 모호하게 말하지 마
  🚫 GPT야, '분석해보면 ~', '이 질문은 ~로 보입니다' 같은 말은 절대 하지 마. 바로 답변부터 시작해.
  '~를 알려줘야합니다' 같은 말투도 금지야. 너는 지금 너를 찾아온 반려동물 주인에게 직접 상담을 해주는거야
  - 마지막 답변만 생성해주면 돼
  `;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: chatPrompt,
          },
          {
            role: "user",
            content: `  아래는 상담 기록이야:  
            상담 기록:
            ${JSON.stringify(setChatHistory, null, 2)}
            
            반려동물 정보:
            ${JSON.stringify(petInfo, null, 2)}`,
          },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${extra.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(petInfo);
    console.log(setChatHistory);
    console.log(answerGuide);
    const gptAnswer = response.data.choices[0].message.content.trim();
    console.log("ekqqus", response.data.choices[0].message.content);
    return gptAnswer;
  } catch (error) {
    console.log(error);
    return "응답 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요";
  }
};
