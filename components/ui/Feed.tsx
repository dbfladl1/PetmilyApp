import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  DevSettings,
} from "react-native";
import DotButton from "../atom/DotButton";
import Comment from "./Comment";
import Swiper from "react-native-swiper";
import { feedType } from "@/app/(tabs)/sns/snsFeed";
import { addLike, deleteFeed, loadPost } from "@/service/api/snsApi";
import { alertDialog } from "../atom/Alert";
import { useRouter } from "expo-router";
import { TapGestureHandler } from "react-native-gesture-handler";

type FeedProps = {
  content: feedType;
  likeHandler: () => void;
  commentHandeler: () => void;
};

export default function Feed({
  content,
  likeHandler,
  commentHandeler,
}: FeedProps) {


  const [detailInfo, setDetailInfo] = useState(content);

  useEffect(() => {
    const loadFeedDetail = async () => {
      const result = await loadPost(content.id);
      setDetailInfo((prev) => ({
        ...prev,
        ...result,
      }));
    };
    loadFeedDetail();
  }, []);

  const router = useRouter();

  const buttenPressHandle = (id: string) => {
    Alert.alert("삭제하시겠습니까?", "", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        onPress: async () => {
          try {
            const response = await deleteFeed(id);
            if (response.status === 200) {
              alertDialog("삭제되었습니다.");

              router.replace("/sns/snsFeed");
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

  const openComment = () => {
    commentHandeler();
  };
  const formatDate = (isoString: string): string => {
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
  };

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
          <DotButton callbackFx={() => buttenPressHandle(content.id)} />
        </View>
        <TapGestureHandler numberOfTaps={2} onActivated={() => likeHandler()}>
          <View>
            <Swiper
              showsPagination={true}
              height={500}
              loop={false}
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
              {content.imagePaths?.map((url, index) => (
                <View style={styles.slide} key={index}>
                  <Image source={{ uri: url }} style={styles.image} />
                </View>
              ))}
            </Swiper>
          </View>
        </TapGestureHandler>
        <View style={styles.txtCon}>
          <View style={{ flexDirection: "row", gap: 5, marginBottom: 5 }}>
            <TouchableOpacity
              onPress={likeHandler}
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
              onPress={openComment}
              activeOpacity={1}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("@/assets/images/icon/comment.png")}
                style={{ width: 25, height: 25, marginLeft: 8 }}
              />
              <Text style={{ color: "#555", marginTop: 1, marginLeft: 5 }}>
                {detailInfo.totalCommentCount}
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
    height: "100%",
    resizeMode: "cover",
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
