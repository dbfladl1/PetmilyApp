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
import { addLike, deleteFeed } from "@/service/api/snsApi";
import { alertDialog } from "../atom/Alert";
import { useRouter } from "expo-router";

type FeedProps = {
  content: feedType;
  commentHandeler: () => void;
};

export default function Feed({ content, commentHandeler }: FeedProps) {
  useEffect(() => {
    console.log(content);
  }, []);

  const [feed, setFeed] = useState([]);

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

              router.replace("/sns/snsWrite");
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

  const likedToggle = () => {
    // setFeed((prev) => ({
    //   ...prev,
    //   isLiked: !prev.isLiked,
    // }));
    addLike({ postId: content.id });
  };

  const [comment, setComment] = useState({
    active: false,
    comment: [],
  });

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
        <View style={styles.txtCon}>
          <View style={{ flexDirection: "row", gap: 5, marginBottom: 5 }}>
            {content.isLiked === true ? (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={likedToggle} activeOpacity={1}>
                  <Image
                    source={require("@/assets/images/icon/heart-filled.png")}
                    style={{ width: 27, height: 27 }}
                  />
                </TouchableOpacity>

                <Text style={{ color: "#555", marginTop: 1, marginLeft: 5 }}>
                  {content.likeCount}
                </Text>
              </View>
            ) : (
              <View>
                <TouchableOpacity onPress={likedToggle} activeOpacity={1}>
                  <Image
                    source={require("@/assets/images/icon/heart.png")}
                    style={{ width: 25, height: 25, marginLeft: 8 }}
                  />
                </TouchableOpacity>
              </View>
            )}
            {/* <TouchableOpacity onPress={openComment} activeOpacity={1}>
              <Image
                source={require("@/assets/images/icon/comment.png")}
                style={{ width: 25, height: 25, marginLeft: 8 }}
              />
            </TouchableOpacity>
            <Text style={{ color: "#555", marginTop: 1, marginLeft: 2 }}>
              {content.likeCount}
            </Text> */}
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
    height: "100%", // 슬라이드 높이 설정
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // 이미지 비율 유지
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
