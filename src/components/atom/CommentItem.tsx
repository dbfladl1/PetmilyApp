import { View, Text, Pressable, Alert, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { deleteComment } from "@/src/service/api/snsApi";
import { alertDialog } from "./Alert";
import { apiProcess } from "@/src/utils/handler/clientResHandler";
import { snsFeedStore } from "@/src/store/sns/snsFeedStore";
import { CommentType } from "@/src/interface/post";
import { isPostWriter } from "@/src/utils/auth/authUtils";

export default function CommentItem({
  postId,
  comment,
  refresh,
}: {
  postId: string;
  comment: CommentType;
  refresh: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  const handleLongPress = async (postId: string, commentId: string) => {
    const isWriter = await isPostWriter(comment.loginId);

    if (isWriter !== true) {
      return;
    }
    Alert.alert("삭제하시겠습니까?", "댓글을 삭제하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: async () => {
          try {
            const res = await deleteComment(postId, commentId);
            await apiProcess(res, async () => {
              alertDialog("삭제되었습니다.");
              refresh();
            });
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
