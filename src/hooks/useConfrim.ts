// hooks/useConfirmBeforeLeave.ts
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Alert } from "react-native";

export const useConfirmBeforeLeave = (message?: string) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        e.preventDefault(); // 기본 네비게이션 막기

        Alert.alert(
          "페이지를 떠나시겠어요?",
          message || "작성한 내용이 저장되지 않을 수 있어요.",
          [
            { text: "취소", style: "cancel", onPress: () => {} },
            {
              text: "떠나기",
              style: "destructive",
              onPress: () => navigation.dispatch(e.data.action), // 실제 페이지 이동
            },
          ]
        );
      };

      const unsubscribe = navigation.addListener("beforeRemove", onBeforeRemove);
      return unsubscribe;
    }, [navigation, message])
  );
};
