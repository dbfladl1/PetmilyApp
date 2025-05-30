import Header from "@/src/components/ui/Header";
import Feed from "@/src/components/ui/Feed";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import BottomNav from "@/src/components/ui/BottomNav";
import Comment from "@/src/components/ui/comment/Comment";
import { useRouter } from "expo-router";
import { snsFeedStore } from "@/src/store/sns/snsFeedStore";

export default function SnsFeedScreen() {
  const feeds = snsFeedStore((s) => s.feeds);
  const fetchFeedData = snsFeedStore((s) => s.fetchFeedData);
  const showComments = snsFeedStore((s) => s.showComments);

  const router = useRouter();

  useEffect(() => {
    fetchFeedData();
  }, []);


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1, flexDirection: "column" }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Header />
        {feeds.map((feed) => {
          return <Feed key={feed.id} content={feed} />;
        })}
      </ScrollView>
      <View style={{height:30}}></View>
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
      {showComments && <Comment />}
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
