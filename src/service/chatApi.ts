import axios from "axios";
import { petInfo } from "@/src/interface/chat";
import Constants from "expo-constants";
import { ApiService } from "./ApiService";

const extra = Constants.expoConfig?.extra || {};

export const getMyPet = async () => {
  const response = await ApiService.get("/api/v1/animal");

  return response;
};

export const enrolledMypet = async (pet: petInfo) => {
  const response = await ApiService.post(`/api/v1/animal`, pet);

  return response;
};

export const getAnswer = async () => {};

export const callGPTGenerateStep = async (params: {
  petInfo: object;
  question: string;
  userAnswer: string;
  chatHistory: string;
}) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `${params.chatHistory}와 ${params.petInfo}를 참고하고, 사용자의 질문을 확인해서 답변을 하기 위해 추가 정보를 수집하는 과정이야.  
            ${params.chatHistory}를 참고해서 형식에 맞게 필요한 추가정보를 알려달라고 요청해. 질문이 여러개라면 숫자를 붙여서 질문을 정리하고, 그에 맞추어 대답해달라고 요청해
            넌 전문가니까 사용자에게 직접 말하듯, 상담하듯 말해.
            사용자에게 호칭은 쓰지 마 `,
          },
          {
            role: "user",
            content: `사용자가 "${params.question}" 라는 질문에 "${params.userAnswer}"라고 했어. `,
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
    return gptQuestion;
  } catch (error) {
    console.log(error);
    return "내용을 확인하는 중 에러가 발생했습니다.";
  }
};

export const callGPTGenerateSolution = async (params: {
  petInfo: any;
  chatHistory: object[];
  guide?:string;
}) => {
  const chatPrompt = `
  너는 반려동물 전문가야. 아래는 보호자와의 상담 대화 기록이야.
  
  각 항목은 다음 필드를 포함해:
  - step: 순서
  - type: 'question', 'answer', 또는 'solution'
  - message: 질문 또는 답변 내용
  - guide: (옵션) 답변 가이드라인
  
    type이 'question'이면 전문가가 한 질문이고,
    type이 'answer'면 사용자의 답변이야.

  반려동물은 ${params.petInfo}에 해당하니 해당 반려동물의 특성에 맞게 대답해줘

  
  💡 목적: ${params.guide}의 내용에 맞추어 답변해줘
    guide에 포함된 각 항목을 기반으로 답변을 구조화해야 해. 하지만 guide내용을 한번 더 표시해 줄 필요는 없어
  - 답변은 message로 전달해주면 돼
  - 반드시 모든 항목을 포함해서 항목별로 답변을 작성해.
  - 항목이 불필요하거나 해당사항 없는 경우에만 생략해도 좋아.
  - 순서는 guide에 나온 대로 따라야 해.
  - 포인트에는 이모지를 넣어서 가독성을 높여줘도 좋아

  지금까지의 Q&A 흐름을 이해하고, 전문가처럼 사용자에게 말하듯 답변해 줘. 필요한 내용이 있다면 추가질문을 해도 좋아
  
  주의:
  - 전문가의 말투로 직접 상담하듯 이야기해 줘
  - 사용자가 질문한 포인트에 대해 정확하고 신뢰 있는 답변을 줘
  - 두루뭉술하거나 모호하게 말하지 마
   GPT야, '분석해보면 ~', '이 질문은 ~로 보입니다' 같은 말은 절대 하지 마. 바로 답변부터 시작해.
  '~를 알려줘야합니다' 같은 말투도 금지야. 너는 지금 너를 찾아온 반려동물 주인에게 직접 상담을 해주는거야
  - 마지막 답변만 생성해주면 돼
  - "반려동물"이라는 말 대신에 ${params.petInfo.species}라고 말해줘
  `;
  try {
    console.log("tlfgod");
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
            ${JSON.stringify(params.chatHistory, null, 2)}
            `,
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
    const gptAnswer = response.data.choices[0].message.content.trim();
    return gptAnswer;
  } catch (error) {
    console.log(error);
    return "응답 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요";
  }
};
