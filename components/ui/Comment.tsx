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
import { createComment } from "@/service/api/snsApi";
import { CommentProps } from "@/interface/post";
import { alertDialog } from "../atom/Alert";
import CommentItem from "../atom/CommentItem";

export default function Comment({
  comments,
  postId,
  closeComment,
  getComment,
}: CommentProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 10);
  
    return () => clearTimeout(timer);
  }, [comments]);

  const [isVisible, setIsVisible] = useState(true);
  const barRef = useRef<View>(null); // null로 초기화

  const [content, setContent] = useState("");

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

  const submitComment = async () => {
    const result = await createComment(postId, {
      content,
      parentComentId: "0",
    });
    if (result.status === 200) {
      getComment();
      setContent("");
    } else {
      return alertDialog("댓글 등록에 실패했습니다.");
    }
  };

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
        <ScrollView style={styles.commentBox} ref={scrollRef}>
          {comments.map((comment) => (
            <CommentItem postId={postId} comment={comment} />
          ))}
        </ScrollView>
        <View style={styles.typeArea}>
          <TextInput
            value={content}
            style={styles.inputBox}
            multiline={true}
            onChangeText={(content) => setContent(content)}
          />
          <CBtn style={{ width: "17%" }} onPress={submitComment}>
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
    bottom: 0,
  },
  panel: {
    position: "absolute",
    width: "100%",
    height: "85%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 50,
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
  basicImage: {
    height: 29,
    width: 29,
    margin: 7,
  },
  profileImage: {
    height: 35,
    width: 35,
    borderRadius: 25,
  },
});
