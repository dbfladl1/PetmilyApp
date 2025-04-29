import Header from "@/components/ui/Header";
import Feed from "@/components/ui/Feed";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import BottomNav from "@/components/ui/BottomNav";
import Comment from "@/components/ui/Comment";
import { useRouter } from "expo-router";
import {
  addLike,
  loadAllFeedContents,
  loadComment,
} from "@/service/api/snsApi";
import { alertDialog } from "@/components/atom/Alert";

export type feedType = {
  id: string;
  content: string;
  imagePaths: string[] | null;
  createdAt: string;
  likeCount: number;
  totalCommentCount: number;
  feedsWriterName: string;
  isLiked: boolean | null;
  isWriter: boolean;
  memberProfilePicturePath: string;
};

export default function SnsFeedScreen() {
  const router = useRouter();
  const [feeds, setFeeds] = useState<feedType[]>([]);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const result = await loadAllFeedContents();
        result ? setFeeds(result || []) : setFeeds([]);
      } catch (error) {
        console.error("❌ [ERROR] 피드 데이터를 불러오는 중 오류 발생:", error);
        alertDialog("[ERROR] 피드 데이터를 불러오는 중 오류 발생:");
      }
    };

    fetchFeedData();
  }, []);

  function likeOrDislike(postId: string) {
    setFeeds((feed) => {
      const index = feed.findIndex((item) => item.id === postId);
      if (index === -1) return feed;

      const targetFeed = feed[index];
      const updatedFeed = {
        ...targetFeed,
        isLiked: !targetFeed.isLiked,
        likeCount: targetFeed.isLiked
          ? targetFeed.likeCount - 1
          : targetFeed.likeCount + 1,
      };

      const newFeeds = [...feed];
      newFeeds[index] = updatedFeed;

      return newFeeds;
    });
    addLike({ postId });
  }

  const [comment, setComment] = useState({ state: false, list: [] });
  const [selectedPostId, setSelectedPostId] = useState("");

  function openComment(id: string) {
    setSelectedPostId(id);
    fetchComment(id);
  }

  async function fetchComment(selectedPostId: string) {
    const result = await loadComment(selectedPostId);
    setComment({ state: true, list: result });
  }

  function closeComment() {
    setComment({ state: false, list: [] });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1, flexDirection: "column" }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Header />
        {feeds?.map((feed, i) => {
          return (
            <Feed
              content={feed}
              likeHandler={() => likeOrDislike(feed.id)}
              commentHandeler={() => openComment(feed.id)}
              key={i}
            />
          );
        })}
      </ScrollView>
      <View>
        <BottomNav />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/sns/snsWrite")}
      >
        <Image
          source={require("@/assets/images/icon/plus.png")}
          style={styles.buttonImg}
        />
      </TouchableOpacity>
      {comment.state && (
        <Comment
          comments={comment.list}
          postId={selectedPostId}
          closeComment={closeComment}
          getComment={() => fetchComment(selectedPostId)}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    bottom: 70,
    right: 10,
    width: 35,
    height: 35,
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0px 6px 6px -7px #888",
  },
  buttonImg: {
    width: 24,
    height: 24,
    margin: "auto",
  },
});
