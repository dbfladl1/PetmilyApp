import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Animated,
  PanResponder,
} from "react-native";
import CBtn from "../atom/RNTouchableOpacity";
import { SafeAreaProvider } from "react-native-safe-area-context";

type contentsDetails = {
  id: number,
  content: string,
  imagePaths: string[  ],
  createdAt: string,
  likeCount: number
} 

export default function Comment({ comment, closeComment }: any) {
  const [isVisible, setIsVisible] = useState(true);
  const barRef = useRef<View>(null); // null로 초기화
  const comments = [
    { userId: "ULIM", text: "어디보고있어 ㅎㅎ", date: "2024-01-18" },
    { userId: "UUNG", text: "우와 기여워", date: "2024-01-19" },
    { userId: "APPLE", text: "꺄아", date: "2024-01-21" },
  ];
  // const [comments, setComments] = useState<contentsDetails>([]);

  useEffect(()=>{
    console.log(comment)
    // setComments(comment)
  },[])

  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e) => {
        const { pageX, pageY } = e.nativeEvent; // 터치 위치
        let isOnBar = false;

        if (barRef.current) {
          // 상단 바의 위치 및 크기 계산
          barRef.current.measure((_, __, width, height, x, y) => {
            // 터치 위치가 상단 바 내부인지 확인
            if (
              pageX >= x &&
              pageX <= x + width &&
              pageY >= y &&
              pageY <= y + height
            ) {
              isOnBar = true; // 상단 바 내부에서 터치 발생
            }
          });
        }
        return isOnBar; // PanResponder 활성화 여부 반환
      },
      onPanResponderMove: Animated.event(
        [null, { dy: pan }], // dy를 Animated.Value에 전달
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          // 일정 거리 이상 내렸다면
          Animated.timing(pan, {
            toValue: 1000, // 화면 아래로 이동
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setIsVisible(false); // 창 비활성화
            closeComment(); // 부모 상태 업데이트
          }); // 패널 숨김
        } else {
          // 원래 위치로 복귀
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start();

          closeComment;
        }
      },
    })
  ).current;
  if (!isVisible) {
    return null;
  } // 패널 숨김 처리

  return (
    <SafeAreaProvider style={styles.overlay}>
      <Animated.View
        style={[
          styles.panel,
          { transform: [{ translateY: pan }] }, // 드래그에 따라 이동
        ]}
        {...panResponder.panHandlers} // PanResponder 연결
      >
        <View ref={barRef} style={styles.handler}>
          <View style={styles.bar}></View>
        </View>
        <ScrollView style={styles.commentBox}>
          {comments.map((comment, i) => (
            <View style={{ marginBottom: 10 }}>
              <Text style={{ color: "#888", fontSize: 12 }}>
                {comment.userId}
              </Text>
              <View style={{ flexDirection: "row", gap: 7 }} key={i}>
                <Text style={{ fontWeight: "bold" }}>{comment.userId}</Text>
                <Text>{comment.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.typeArea}>
          <TextInput style={styles.inputBox} multiline={true} />
          <CBtn style={{ width: "17%" }}>
            <Text style={{ color: "#fff" }}>등록</Text>
          </CBtn>
        </View>
      </Animated.View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
    justifyContent: "flex-end", // 아래쪽 정렬
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // bottom을 0으로 설정해 전체 화면 덮기
  },
  panel: {
    width: "100%",
    height: "90%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  handler: {
    height: 33,
    backgroundColor: "#eee",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bar: {
    width: 100,
    height: 4,
    borderRadius: 2.5,
    backgroundColor: "#999",
    alignSelf: "center",
    marginBottom: 10,
    transform: "translateY(-10px)",
  },
  commentBox: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  typeArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 10,
  },
  inputBox: {
    borderBottomColor: "#555",
    borderBottomWidth: 0.5,
    width: "80%",
  },
});
