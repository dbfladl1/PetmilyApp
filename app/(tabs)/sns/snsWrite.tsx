import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import {
  ScrollView,
} from "react-native-gesture-handler";
import { alertDialog } from "@/components/atom/Alert";
import * as ImagePicker from "expo-image-picker";
import CBtn from "@/components/atom/RNTouchableOpacity";
import { uploadFeed } from "@/service/api/snsApi";

export default function SnsWriteScreen() {
  const router = useRouter();
  const [contents, setContents] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    const openGallery = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alertDialog("권한 필요", "갤러리에 접근하려면 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (result.canceled) {
        router.push("/sns/snsFeed");
      } else {
        const uris = result.assets.map((asset) => asset.uri);
        setSelectedImages(uris);
      }
    };

    openGallery();
  }, []);

  const uploadFeedHandler = async () => {
    const result = await uploadFeed(contents, selectedImages);

    if(result === 200){
      router.push("/sns/snsFeed");
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<string>) => {
    const index = selectedImages.findIndex((img) => img === item);

    return (
      <TouchableOpacity
        style={[styles.image, isActive && styles.activeImage]}
        onPress={() => setSelectedImageIndex(index)}
        onLongPress={drag}
        activeOpacity={0.8}
      >
        <View style={styles.index}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <Image
          source={{ uri: item }}
          resizeMode="cover"
          style={{ aspectRatio: 1, width: "100%" }}
        />
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Header />
        <View style={styles.screenHeader}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={1}
            onPress={() => router.push("/sns/snsFeed")}
          >
            <Image
              source={require("@/assets/images/icon/back.png")}
              style={{ width: "100%", height: "100%", position: "absolute" }}
            />
          </TouchableOpacity>
          <Text style={styles.screenHeaderText}>사진 올리기</Text>
        </View>
        <View style={{ height: 50 }} />
        <Image
          source={{ uri: selectedImages[selectedImageIndex] }}
          style={styles.bigImage}
          resizeMode="cover"
        />
        <DraggableFlatList
          data={selectedImages}
          renderItem={renderItem}
          keyExtractor={(item, index) => `image-${index}`}
          horizontal
          onDragEnd={({ data }) => setSelectedImages(data)}
          style={styles.imageContainer}
        />
        <View style={styles.textContainer}>
          <TextInput
            style={styles.inputBox}
            multiline={true}
            placeholder="내용을 입력해주세요"
            onChangeText={(text) => {
              setContents(text);
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CBtn style={styles.smallButton} onPress={uploadFeedHandler}>
            등록
          </CBtn>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  screenHeader: {
    position: "absolute",
    top: 58,
    height: 35,
    flexDirection: "row",
    width: "100%",
  },
  backButton: {
    width: 28,
    height: 30,
    marginVertical: 8,
    padding: 5,
    marginLeft: 10,
    marginRight: 20,
  },
  submitButton: {
    position: "absolute",
    top: 11,
    right: 12,
    fontWeight: "bold",
  },
  screenHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 40,
    color: "#444",
  },
  nextButton: {},
  bigImage: { width: "100%", aspectRatio: 1 },
  imageContainer: { flexDirection: "row", padding: 0 },
  image: { position: "relative", width: 75, marginRight: 5, marginTop: 5 },
  activeImage: { opacity: 0.8 },
  index: {
    position: "absolute",
    width: 18,
    height: 18,
    top: 3,
    left: 3,
    borderRadius: 10,
    backgroundColor: "#555",
    zIndex: 10,
  },
  indexText: {
    fontSize: 10,
    color: "#fff",
    textAlign: "center",
    lineHeight: 15,
  },
  inputBox: {
    borderBottomColor: "#555",
    borderBottomWidth: 0.5,
    width: "100%",
  },
  textContainer: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  smallButton: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
