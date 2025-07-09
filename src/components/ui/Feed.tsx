import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import DotButton from "../atom/DotButton";
import Swiper from "react-native-swiper";
import { addLike, deleteFeed, loadPost } from "@/src/service/snsApi";
import { alertDialog } from "../atom/Alert";
import { useRouter } from "expo-router";
import { TapGestureHandler } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import { FeedProps } from "@/src/interface/post";
import { apiProcess } from "@/src/utils/handler/clientResHandler";
import { ApiResult } from "@/src/interface/api";
import { snsFeedStore } from "@/src/store/sns/snsFeedStore";
import { isPostWriter } from "@/src/utils/auth/authUtils";

export default function Feed({ content }: FeedProps) {
  const [innerContents, setInnerContents] = useState(content);
  const updateCount = snsFeedStore((s) => s.updateCount);
  const setShowComment = snsFeedStore((s) => s.setShowComment);
  const selectPost = snsFeedStore((s) => s.selectPost);
  const fetchSelectedFeedComments = snsFeedStore(
    (s) => s.fetchSelectedFeedComments
  );

  const likeHandler = async (postId: string) => {
    const res = await addLike({ postId });
    apiProcess(res, () => updateCount(postId));
  };

  const { width: screenWidth } = Dimensions.get("window");
  const aspectRatio = 3 / 3;
  const swiperHeight = screenWidth * (1 / aspectRatio);

  const router = useRouter();

  const handleDelete = async (postId: string, writerId: string) => {
    const isWriter = await isPostWriter(writerId);

    if (isWriter !== true) {
      return;
    }

    Alert.alert("삭제하시겠습니까?", "", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        onPress: async () => {
          const res: ApiResult = await deleteFeed(postId);
          apiProcess(res, async () => {
            alertDialog("삭제되었습니다.");
            router.replace("/sns/snsFeed");
          });
        },
      },
    ]);
  };

  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const today = new Date();

    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    if (isToday) {
      return (
        date.toISOString().split("T")[0] +
        " " +
        date.toTimeString().split(" ")[0]
      );
    } else {
      return date.toISOString().split("T")[0];
    }
  }
  function openComments(postId: string) {
    selectPost(postId);
    fetchSelectedFeedComments(postId);
    setShowComment(true);
  }

  return (
    <View>
      <View style={{ minHeight: 600 }}>
        <View style={styles.topCon}>
          <View style={styles.rowFlex}>
            <View style={styles.profileIcon}>
              {content.memberProfilePicturePath === null ? (
                <Image
                  source={require("@/assets/images/icon/foot-frint.png")}
                  style={styles.basicImage}
                />
              ) : (
                <Image
                  source={{ uri: content.memberProfilePicturePath }}
                  style={styles.profileImage}
                />
              )}
            </View>
            <Text style={styles.topId}>{content.feedsWriterName}</Text>
          </View>
          <DotButton
            callbackFx={() => handleDelete(content.id, content.feedsWriterName)}
          />
        </View>
        <TapGestureHandler
          numberOfTaps={2}
          onActivated={() => likeHandler(content.id)}
        >
          <View>
            <Swiper
              showsPagination={true}
              loop={false}
              height={swiperHeight}
              paginationStyle={{ bottom: 20 }}
              dotStyle={{
                backgroundColor: "#eee",
                width: 5,
                height: 5,
                borderRadius: 4,
              }}
              activeDotStyle={{
                backgroundColor: "#7D3DCF",
                width: 7,
                height: 7,
                borderRadius: 5,
              }}
            >
              {content.imagePaths?.map((url) => (
                <View style={styles.slide} key={url}>
                  <Image source={{ uri: url }} style={styles.image} />
                </View>
              ))}
            </Swiper>
          </View>
        </TapGestureHandler>
        <View style={styles.txtCon}>
          <View style={{ flexDirection: "row", gap: 5, marginBottom: 5 }}>
            <TouchableOpacity
              onPress={() => likeHandler(content.id)}
              activeOpacity={1}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Image
                source={
                  content.isLiked
                    ? require("@/assets/images/icon/heart-filled.png")
                    : require("@/assets/images/icon/heart.png")
                }
                style={{ width: 25, height: 25, marginLeft: 8 }}
              />
              <Text style={{ color: "#555", marginLeft: 5 }}>
                {content.likeCount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openComments(content.id)}
              activeOpacity={1}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("@/assets/images/icon/comment.png")}
                style={{ width: 25, height: 25, marginLeft: 8 }}
              />
              <Text style={{ color: "#555", marginTop: 1, marginLeft: 5 }}>
                {innerContents.totalCommentCount}
              </Text>
            </TouchableOpacity>
          </View>
          <Text>{content.content}</Text>
          <Text style={styles.wDate}>{formatDate(content.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topCon: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 58,
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  profileIcon: {
    height: 45,
    width: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  basicImage: {
    height: 29,
    width: 29,
    margin: 7,
  },
  profileImage: {
    height: 45,
    width: 45,
    borderRadius: 25,
  },
  rowFlex: {
    alignItems: "center",
    flexDirection: "row",
  },
  topId: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
  },
  rightFloat: {
    textAlign: "right",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  image: {
    width: "100%",
    resizeMode: "cover",
    aspectRatio: 3 / 3,
  },
  wDate: {
    color: "#888",
    fontSize: 13,
    marginBottom: 10,
    marginTop: 10,
  },
  txtCon: {
    padding: 10,
  },
});
