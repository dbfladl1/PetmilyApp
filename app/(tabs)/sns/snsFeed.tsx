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
import { loadAllFeedContents } from "@/service/api/snsApi";

export type feedType = {
  id: string;
  content: string;
  imagePaths: string[] | null;
  createdAt: string;
  likeCount: number;
  feedsWriterName: string;
  isLiked: boolean | null;
  isWriter: boolean;
  memberProfilePicturePath: string;
};

export default function SnsFeedScreen() {
  const [feeds, setFeeds] = useState<feedType[]>([]);


  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const result = await loadAllFeedContents();

        if (result) {
          setFeeds(result || []);
        } else {
          setFeeds([]);
        }
        
      } catch (error) {
        console.error("❌ [ERROR] 피드 데이터를 불러오는 중 오류 발생:", error);
      }
    };

      fetchFeedData();
  }, []);

  const router = useRouter();

  const [comment, setComment] = useState({ state: false, list: [] });

  function openComment(id: string) {
    // const fetchCommentData = async () => {
    //   const result = await loadComment(id);
    //   setComment({ state: true, list: result });
    // };
    // fetchCommentData();
  }
  function closeComment() {
    setComment({ state: false, list: [] });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <Header />
      </View>
      <ScrollView
        style={{ flex: 1, flexDirection: "column" }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {feeds?.map((feed, i) => {
          return (
            <Feed
              content={feed}
              commentHandeler={() => openComment(feed.id)}
              key={i}
            />
          );
        })}
      </ScrollView>
      <View>
        <BottomNav />
      </View>
      {/* {comment.state && (
        <Comment comment={comment.list} closeComment={closeComment} />
      )} */}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/sns/snsWrite")}
      >
        <Image
          source={require("@/assets/images/icon/plus.png")}
          style={styles.buttonImg}
        />
      </TouchableOpacity>
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
