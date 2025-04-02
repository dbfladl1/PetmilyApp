export const questions = {
  food: [
    { step: 1, message: "어떤 음식이 궁금하신가요?", type: "question" },
    {
      step: 2,
      message: "음식이 조리된 상태인가요?",
      type: "question",
      examples: ["조리", "비조리", "가공식품"],
    },
    {
      step: 3,
      message: "",
      guide: `섭취 해도 괜찮은 경우에 대한 답변 :
        ① 음식의 효능
        ② 함께 섭취하면 좋은 것
        ③ 주의사항
        (장기 복용 시 주의할점, 해당 동물의 알레르기 보유 확률 혹은 당뇨, 비만 등의 건강 상 
        특수 조건 추가)
        ④ 권장량
        ⑤데이터 출처 명시,
        섭취 하면 안되는 경우에 대한 답변 :
        ① 섭취 시 부작용을 구체적으로
        ② 위험을 등급화 하여 분류
        (저위험군 : 소량 섭취 시 문제 없는것
        중위험군 : 알레르기나 건강 문제 유발 가능성이 있는 것
        고위험군 : 생명을 위협할 가능성이 있는 것)
        ③ 대체식품으로 추천할 수 있는 것
        ④ 고위험군의 식품을 섭취한 경우 병원으로 
        유도`,
      type: "solution",
    },
  ],

  behavior: [
    {
      step: 1,
      message: "어떤 행동이 궁금하신가요?",
      type: "question",
      examples: ["반복적인 행동", "짖음 혹은 울음", "하지않던 행동"],
      branchMap: {
        "반복적인 행동": "repeat_flow",
        "짖음 혹은 울음": "bark_flow",
        "하지않던 행동": "unexpected_flow",
      },
    },
  ],

  training: [
    {
      step: 1,
      message: "훈련/교정 중 어떤 걸 원하시나요?",
      type: "question",
      examples: ["훈련", "교정"],
      branchMap: {
        훈련: "training_flow",
        교정: "correction_flow",
      },
    },
  ],
  health: [
    {
      step: 1,
      message: "어떤 건강 정보가 궁금하신가요?",
      type: "question",
      examples: ["다이어트", "기침", "식단 및 운동 점검"],
      branchMap: {
        다이어트: "diet_flow",
        기침: "cough_flow",
        "식단 및 운동 점검": "diet_flow",
      },
    },
  ],
};

export const healthFlows = {
  diet_flow: [
    {
      step: 2,
      message: "하루 식사량과 간식량, 운동량을 알려주세요.",
      type: "question",
    },
    {
      step: 3,
      message:
        "현재 몸무게를 알려주시고 목표 몸무게가 있다면 알려주세요. 목표 몸무게가 없다면 등록해주신 정보를 바탕으로 권장 몸무계를 체크해드리겠습니다. ",
      type: "question",
    },
    {
      step: 4,
      message: "",
      guide: "1. 현재 비만도, 2. 식사와 운동량에 대한 피드백, 3. 다이어트 방법",
      type: "solution",
    },
  ],
  cough_flow: [
    {
      step: 2,
      message: "최근 특정 환경(미세먼지, 추운 날씨 등)에 노출된 적이 있나요?",
      type: "question",
      example: ["아니요"],
    },
    {
      step: 3,
      message:
        "기침이 주로 언제 발생하나요? 아침, 저녁, 산책 후 등으로 알려주세요.",
      type: "question",
    },
    {
      step: 4,
      message: "소리가 어느쪽에 가깝나요?",
      examples: [
        "거위소리",
        "숨이 막히는 듯한 소리",
        "쿨럭거리는 젖은 소리",
        "가볍게 켁켁거림",
        "빠르게 켁켁거림",
      ],
      type: "question",
      lastQuestion: true,
    },
    {
      step: 5,
      message: "",
      guide:
        "1. 기침의 원인 분석, 2. 해당 증상에 좋은 음식과 영양제 추천, 3. 해당 기침이 증상이 될 수 있는 질병 안내와, 심화될 경우 발생할 수 있는 질병 안내 4.병원 방문 권장",
      type: "solution",
    },
  ],
  check_flow: [
    {
      step: 2,
      message: "하루 식사량과 간식량, 운동량을 알려주세요",
      type: "question",
      lastQuestion: true,
    },
    {
      step: 3,
      message: "",
      guide:
        "1. 현재 비만도, 2. 식사와 운동량에 대한 피드백, 3. 나이와 품종에 따라 자주 발생하는 질병 안내, 예방방법과 영양제 추천",
      type: "solution",
    },
  ],
};

export const behaviorFlows = {
  repeat_flow: [
    {
      step: 2,
      message: "어떤 행동을 반복하나요?",
      type: "question",
    },
    {
      step: 3,
      message: "행동이 길게 지속되나요? 한번 시작하면 얼마나 하나요?",
      type: "question",
    },
    {
      step: 4,
      message:
        " 해당 행동이 특정 시간대나 상황(외출, 혼자있을때 등)에 발생하나요?",
      type: "question",
    },
    {
      step: 5,
      message: "",
      guide:
        "1. 특정 행동을 하는것에 대한 심리상태 추정, 2. 특정 행동을 하는 것에 대한 건강상태 추정, 3. 행동에 문제가 있을 시 주인이 해야 할 행동 (행동의 원인과 연계된 피드백이어야함, 최대한 실내/실외활동 두가지 제시), 4. 비슷한 행동 사례와 출처",
      type: "solution",
    },
  ],
  unexpected_flow: [
    {
      step: 2,
      message:
        "이상행동을 보이기 시작할 즘에 환경 혹은 식사에서 달라진 부분이이 있었나요?",
      type: "question",
    },
    {
      step: 3,
      message:
        " 최근 절뚝거리거나 울부짖는 듯 평소와 다른 점이 있었나요? 있다면 무엇인지 대답해주세요",
      type: "question",
    },
    {
      step: 4,
      message: "",
      guide:
        "1. 특정 행동을 하는것에 대한 심리상태 추정, 2. 특정 행동을 하는 것에 대한 건강상태 추정, 3. 행동에 문제가 있을 시 주인이 해야 할 행동 (행동의 원인과 연계된 피드백이어야함, 최대한 실내/실외활동 두가지 제시), 4. 비슷한 행동 사례와 출처",
      type: "solution",
    },
  ],
  bark_flow: [
    {
      step: 2,
      message: "우는 소리와 속도감을 자세히 묘사해주세요",
      type: "question",
    },
    {
      step: 3,
      message:
        "해당 행동이 특정 시간대나 상황(외출, 혼자있을때 등)에 발생하나요?",
      type: "question",
    },
    {
      step: 4,
      message:
        "해당 행동이 특정 시간대나 상황(외출, 혼자있을때 등)에 발생하나요?",
      type: "question",
    },
    {
      step: 5,
      message: "",
      guide:
        "1. 특정 행동을 하는것에 대한 심리상태 추정, 2. 특정 행동을 하는 것에 대한 건강상태 추정, 3. 행동에 문제가 있을 시 주인이 해야 할 행동 (행동의 원인과 연계된 피드백이어야함, 최대한 실내/실외활동 두가지 제시), 4. 비슷한 행동 사례와 출처",
      type: "solution",
    },
  ],
};

export const trainingFlows = {
  training_flow: [
    {
      step: 2,
      message: "어떤 훈련을 원하시나요?",
      type: "question",
      examples: ["빵", "기다려", "앉아", "배변훈련"],
    },
    {
      step: 3,
      message: "",
      guide:
        "1. 해당 훈련의 난이도와 성공 가능성, 2 교육 방법과 방향, 예상 소요 기간, 3. 정도가 심할 시 전문 동물 훈련사 상담 추천, 4. 해당 행동과 관련 된 좋은 자료나 유튜브 추천",
      type: "solution",
    },
  ],
  correction_flow: [
    {
      step: 2,
      message: "어떤 교정을 원하시나요?",
      type: "question",
      examples: ["식분증", "물어뜯음", "물음", "헛짖음", "배변실수"],
    },
    {
      step: 3,
      message:
        "행동을 시작한지 얼마나 되었나요? 특정 계기가 있었나요? (ex 3달 전, 친척 방문 후)",
      type: "question",
      examples: ["모름"],
    },
    {
      step: 4,
      message: "",
      guide:
        "1. 해당 행동교정의 난이도와 성공 가능성, 2 교육 방법과 방향, 예상 소요 기간, 3. 정도가 심할 시 전문 동물 훈련사 상담 추천, 4. 해당 행동과 관련 된 좋은 자료나 유튜브 추천",
      type: "solution",
    },
  ],
};
