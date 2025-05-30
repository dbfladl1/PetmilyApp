import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import CBtn from "../../atom/RNTouchableOpacity";
import { createComment } from "@/src/service/api/snsApi";
import { apiProcess } from "@/src/utils/handler/clientResHandler";
import { snsFeedStore } from "@/src/store/sns/snsFeedStore";

export default function CommentInput() {
  const fetchSelectedFeedComments = snsFeedStore(
    (s) => s.fetchSelectedFeedComments
  );
  const selectedPostId = snsFeedStore((s) => s.selectedPostId);
  const [content, setContent] = useState("");

  const submitComment = async () => {
    const res = await createComment(selectedPostId, {
      content,
      parentComentId: "0",
    });
    await apiProcess(res, async () => {
      fetchSelectedFeedComments(selectedPostId);
      setContent("");
    });
  };
  return (
    <View>
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
    </View>
  );
}

const styles = StyleSheet.create({
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
