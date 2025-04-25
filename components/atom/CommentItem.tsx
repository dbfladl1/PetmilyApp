import { View, Text, Pressable, Alert, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { deleteComment } from "@/service/api/snsApi";
import { alertDialog } from "./Alert";
import { CommentItemType } from "@/interface/post";

export default function CommentItem({
  postId,
  comment,
}: {
  postId: string;
  comment: CommentItemType;
}) {
  const [pressed, setPressed] = useState(false);

  const handleLongPress = (postId: string, commentId: string) => {
    Alert.alert("삭제하시겠습니까?", "댓글을 삭제하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: async () => {
          try {
            const response = await deleteComment(postId, commentId);
            if (response.status === 200) {
              alertDialog("삭제되었습니다.");
            } else {
              alertDialog("다시 시도해주세요.");
            }
          } catch (error) {
            alertDialog("오류 발생. 다시 시도해주세요.");
          }
        },
      },
    ]);
  };
  return (
    <Pressable
      key={comment.commentId}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onLongPress={() => handleLongPress(postId, comment.commentId)}
      delayLongPress={600}
      style={{
        backgroundColor: pressed ? "#f2f2f2" : "transparent",
        marginBottom: 10,
        flexDirection: "row",
        gap: 8,
        padding: 10,
        borderRadius: 8,
      }}
    >
      <View style={{ marginBottom: 10, flexDirection: "row", gap: "8" }}>
        <View>
          {comment.profilePicturePath === null ? (
            <Image
              source={require("@/assets/images/icon/foot-frint.png")}
              style={styles.basicImage}
            />
          ) : (
            <Image
              source={{ uri: comment.profilePicturePath }}
              style={styles.profileImage}
            />
          )}
        </View>
        <View style={{ gap: 3 }}>
          <Text style={{ fontWeight: "bold" }}>{comment.loginId}</Text>
          <Text>{comment.content}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
