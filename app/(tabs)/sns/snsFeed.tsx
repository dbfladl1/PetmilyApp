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
import { apiProcess } from "@/src/utils/clientResHandler";
import { ApiSuccess } from "@/interface/api";
import { feedType } from "@/interface/post";

export default function SnsFeedScreen() {
  const [feeds, setFeeds] = useState<feedType[]>([]);

  const [comment, setComment] = useState({ state: false, list: [] });
  const [selectedPostId, setSelectedPostId] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchFeedData();
  }, []);

  async function fetchFeedData() {
    const res = await loadAllFeedContents();
    apiProcess(res, async (res: ApiSuccess) => {
      res ? setFeeds(res.response.data || []) : setFeeds([]);
    });
  }

  const updateCount = async (postId: string) => {
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
  };

  const handleLikeToggle = async (postId: string) => {
    const res = await addLike({ postId });
    apiProcess(res, () => updateCount(postId));
  };

  function handleOpenComment(id: string) {
    setSelectedPostId(id);
    fetchComment(id);
  }

  const fetchComment = async (selectedPostId: string) => {
    const res = await loadComment(selectedPostId);
    apiProcess(res, async (res: ApiSuccess) => {
      setComment({ state: true, list: res.response.data });
    });
  };

  function handleCloseComment() {
    setComment({ state: false, list: [] });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1, flexDirection: "column" }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Header />
        {feeds.map((feed) => {
          return (
            <Feed
              key={feed.id}
              content={feed}
              likeHandler={() => handleLikeToggle(feed.id)}
              handleComment={() => handleOpenComment(feed.id)}
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
          closeComment={handleCloseComment}
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
