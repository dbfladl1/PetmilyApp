import BottomNav from "@/components/ui/BottomNav";
import Header from "@/components/ui/Header";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from "@mj-studio/react-native-naver-map";
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import CPicker from "@/components/atom/RNPicker";
import { Picker } from "@react-native-picker/picker";
import CategoryList from "@/components/atom/CategoryList";
import { useRouter } from "expo-router";
import {
  getCurrentLocation,
  requestLocationPermission,
} from "@/service/api/locationService";

export default function FindingPetScreen() {
  const router = useRouter();

  const [location, setLocation] = useState({
    latitude: 37.5665,
    longitude: 126.978,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      const userLocation = await getCurrentLocation();
      if (userLocation) {
        setLocation(userLocation);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View>
        <View style={styles.navContainer}>
          <View
            style={{
              backgroundColor: "white",
              height: 48,
              transform: [{ translateY: -4 }],
            }}
          >
            <CPicker
              selectedValue={"/map/FindingPet"}
              onValueChange={(link) => router.push(link as any)}
            >
              <Picker.Item
                label="반려동물 동반 가능 업체 찾기"
                value="/map/FindingStore"
              />
              <Picker.Item
                label="반려동물 찾기 도움 서비스"
                value="/map/FindingPet"
              />
            </CPicker>
          </View>
        </View>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text>전체</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text>강아지</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text>고양이</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text>기타</Text>
          </TouchableOpacity>
        </View>
        <NaverMapView
          style={styles.map}
          camera={{
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 15,
          }}
        ></NaverMapView>
        <CategoryList
          categorys={[
            { category: "찾아요", color: "#6E37AB" },
            { category: "봤어요", color: "#F14C5C" },
          ]}
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/map/FindingPetRegister")}
      >
        <Image
          source={require("@/assets/images/icon/add.png")}
          style={styles.buttonImg}
        />
      </TouchableOpacity>
      <BottomNav />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 500,
  },
  navContainer: {
    position: "absolute",
    top: 10,
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    gap: 10,
    top: 63,
    left: "5%",
    zIndex: 200,
  },
  filterButton: {
    backgroundColor: "white",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  addButton: {
    position: "absolute",
    bottom: 70,
    right: 10,
    width: 40,
    height: 40,
    backgroundColor: "#6E37AB",
    borderRadius: 20,
    boxShadow: "0px 6px 6px -7px #888",
    borderWidth: 1,
    borderColor: "#bbb",
  },
  buttonImg: {
    width: 14,
    height: 14,
    margin: "auto",
  },
});
