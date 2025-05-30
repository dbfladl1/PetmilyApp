import { snsFeedStore } from "@/src/store/sns/snsFeedStore";
import React from "react";
import CommentItem from "./CommentItem";
import { View } from "react-native";

export default function CommentList() {
    const comments = snsFeedStore((s) => s.comments);
    const selectedPostId = snsFeedStore((s) => s.selectedPostId);
    const fetchSelectedFeedComments = snsFeedStore((s) => s.fetchSelectedFeedComments);
  return (
    <View>
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          postId={selectedPostId}
          refresh={() => fetchSelectedFeedComments(selectedPostId)}
        />
      ))}
    </View>
  );
}
