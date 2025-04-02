import {
  Linking,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import { View, Text } from "react-native";
import React from "react";
import RNTouchableOpacity from "./RNTouchableOpacity";
import { Place } from "@/interface/map";

export default function InfoLayer({ place, closeLayer }: { place: Place, closeLayer: () => void }) {
  console.log(place)
    const handlePress = (type: "phone" | "link", value: string) => {
    if (type === "phone") {
      Linking.openURL(`tel:${value}`); 
    } else if (type === "link") {
      Linking.openURL(value); 
    }
  };
  return (
    <ScrollView style={styles.selectedPlaceContainer}>
      <RNTouchableOpacity
        activeOpacity={1}
        style={{
          width: 30,
          height: 40,
          backgroundColor: "#fff",
          position: "absolute",
          top: -10,
          left: -30,
        }}
        onPress={() => closeLayer()}
      >
        <Image
          source={require("@/assets/images/icon/back.png")}
          style={{ width: 15, height: 20 }}
        />
      </RNTouchableOpacity>
      <View style={{ paddingTop: 40 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", lineHeight: 30 }}>
          {place.title}
        </Text>
        <Text style={{ fontSize: 14, color: "#666", marginBottom: 15, lineHeight: 30 }}>
          {place.category}
        </Text>
        <Text style={{ fontSize: 14, lineHeight: 30 }}>{place.address}</Text>
        {place.roadAddress && (
          <Text style={{ fontSize: 14, lineHeight: 30 }}>
            도로명주소 : {place.roadAddress}
          </Text>
        )}
        {place.telephone && (
          <TouchableOpacity
            onPress={() => handlePress("phone", place.telephone)}
          >
            <Text style={{ lineHeight: 30 }}>
              전화번호 : {place.telephone}
            </Text>
          </TouchableOpacity>
        )}
        {place.link && (
          <TouchableOpacity
            onPress={() => handlePress("link", place.link)}
          >
            <Text style={{ lineHeight: 30 }}>사이트 : {place.link}
            </Text>
          </TouchableOpacity>
        )}
        {place.description && (
          <Text>설명 : {place.description}</Text>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 500,
  },
  filterContainer: {
    position: "absolute",
    top: 60,
    left: "5%",
    zIndex: 200,
    width: "90%",
    overflow: "hidden",
    height: 46,
    backgroundColor: "white",
    borderRadius: 3,
    padding: 0,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  selectedPlaceContainer: {
    position: "absolute",
    top: 140,
    left: 0,
    right: 0,
    width: "90%",
    marginHorizontal: "5%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    paddingBottom:30,
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.2)",
  },
});
