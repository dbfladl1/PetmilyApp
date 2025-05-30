import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function BottomNav({
  onNavigate,
}: {
  onNavigate?: (path: string) => void;
}) {
  const router = useRouter();
  const fallbackRouter = useRouter(); // props 없으면 기본 router 사용

  const handlePress = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      fallbackRouter.push(path as any);
    }
  };
  return (
    <View style={styles.footer}>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handlePress("/sns/snsFeed")}
        >
          <Image
            source={require("@/assets/images/icon/camera.png")}
            resizeMode="cover"
            style={{ aspectRatio: 1, width: 24, height: 24 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handlePress("/map/FindingStore")}
        >
          <Image
            source={require("@/assets/images/icon/map.png")}
            resizeMode="cover"
            style={{
              aspectRatio: 1,
              width: 25,
              height: 23,
              transform: "translateY(-2px)",
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handlePress("/help/ChatMain")}
        >
          <Image
            source={require("@/assets/images/icon/idea.png")}
            resizeMode="cover"
            style={{
              aspectRatio: 1,
              width: 27,
              height: 26,
              transform: "translateY(-2x)",
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handlePress("/user/modify/ModifyMain")}
        >
          <Image
            source={require("@/assets/images/icon/user.png")}
            resizeMode="cover"
            style={{
              aspectRatio: 1,
              width: 23,
              height: 23,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    width: "100%",
    height: 50,
    backgroundColor: "#fcfcfc",
    flexDirection: "row",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
