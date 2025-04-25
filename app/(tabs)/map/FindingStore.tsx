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
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import CPicker from "@/components/atom/RNPicker";
import { Picker } from "@react-native-picker/picker";
import CategoryList from "@/components/atom/CategoryList";
import { useRouter } from "expo-router";

import InfoLayer from "@/components/atom/InfoLayer";
import { Place } from "@/interface/map";
import { searchPlaces as searchPetFriendlyPlaces } from "@/service/api/mapApi";

export default function FindingStoreScreen() {
  const router = useRouter();

  const [location, setLocation] = useState({
    latitude: 37.5665,
    longitude: 126.978,
  });

  const fetchPlaces = async (latitude:number, longitude:number) => {
    try {
      const [cafes, restaurants, parks] = await Promise.all([
        searchPetFriendlyPlaces(
          "애견 동반 카페",
          latitude,
          longitude
        ),
        searchPetFriendlyPlaces(
          "애견 동반 식당",
          latitude,
          longitude
        ),
        searchPetFriendlyPlaces(
          "반려견놀이터",
          latitude,
          longitude
        ),
      ]);

      const categorizedCafes = cafes.map((place: Place) => ({
        ...place,
        type: "카페",
      }));
      const categorizedRestaurants = restaurants.map((place: Place) => ({
        ...place,
        type: "식당",
      }));
      const categorizedParks = parks.map((place: Place) => ({
        ...place,
        type: "공원",
      }));

      setPlaces([
        ...categorizedCafes,
        ...categorizedRestaurants,
        ...categorizedParks,
      ]);
    } catch (error) {
      console.error("❌ [ERROR] 장소 검색 실패:", error);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "위치 권한 요청",
          message: "이 앱은 사용자의 위치 정보를 필요로 합니다.",
          buttonNeutral: "나중에",
          buttonNegative: "거부",
          buttonPositive: "허용",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        fetchPlaces(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("위치 가져오기 실패:", error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const [places, setPlaces] = useState<Place[]>([]);

  const [mapCenter, setMapCenter] = useState(location);

  useEffect(() => {
    if (!location) return;

    const fetchPlaces = async () => {
      try {
        const [cafes, restaurants, parks] = await Promise.all([
          searchPetFriendlyPlaces(
            "애견 동반 카페",
            location.latitude,
            location.longitude
          ),
          searchPetFriendlyPlaces(
            "애견 동반 식당",
            location.latitude,
            location.longitude
          ),
          searchPetFriendlyPlaces(
            "반려견놀이터",
            location.latitude,
            location.longitude
          ),
        ]);

        const categorizedCafes = cafes.map((place: Place) => ({
          ...place,
          type: "카페",
        }));
        const categorizedRestaurants = restaurants.map((place: Place) => ({
          ...place,
          type: "식당",
        }));
        const categorizedParks = parks.map((place: Place) => ({
          ...place,
          type: "공원",
        }));

        setPlaces([
          ...categorizedCafes,
          ...categorizedRestaurants,
          ...categorizedParks,
        ]);
      } catch (error) {
        console.error("❌ [ERROR] 장소 검색 실패:", error);
      }
    };

    fetchPlaces();
  }, [location]);

  const processedPlaces = places.map((place: Place) => {
    const parsedMapX = parseFloat(place.mapx.toString());
    const parsedMapY = parseFloat(place.mapy.toString());

    return {
      ...place,
      latitude: parsedMapY / 10 ** 7,
      longitude: parsedMapX / 10 ** 7,
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.filterContainer}>
        <View
          style={{
            backgroundColor: "white",
            height: 48,
            transform: [{ translateY: -4 }],
          }}
        >
          <CPicker
            selectedValue={"map/FindingStore"}
            onValueChange={(link) => router.push(link as any)}
          >
            <Picker.Item
              label="근처 반려동물 동반 가능 장소 찾기"
              value="/map/FindingStore"
            />
            {/* <Picker.Item
              label="반려동물 찾기 도움 서비스"
              value="/map/FindingPet"
            /> */}
          </CPicker>
        </View>
      </View>
      <NaverMapView
        style={styles.map}
        camera={{
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 15,
        }}
        onCameraIdle={(e) => {
          setMapCenter({
            latitude: e.latitude,
            longitude: e.longitude,
          });
        }}
      >
        {processedPlaces.length > 0 &&
          processedPlaces.map((place: Place, index) => {
            return (
              <NaverMapMarkerOverlay
                key={index}
                latitude={place.latitude}
                longitude={place.longitude}
                image={
                  place.type === "카페"
                    ? require("@/assets/images/icon/cafe.png")
                    : place.type === "식당"
                    ? require("@/assets/images/icon/res.png")
                    : require("@/assets/images/icon/park.png")
                }
                width={40}
                height={40}
                onTap={() => setSelectedPlace(place)}
              />
            );
          })}
      </NaverMapView>
      <View
        style={{
          position: "absolute",
          top: 120,
          width: "100%",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => fetchPlaces(mapCenter.latitude, mapCenter.longitude)}
          style={{
            backgroundColor: "#FFF",
            paddingVertical: 5,
            paddingHorizontal: 15,
            borderRadius: 20,
            flexDirection: "row",
          }}
        >
          <Image
            source={require("@/assets/images/icon/refresh.png")}
            style={{ width: 15, height: 15, marginTop: 3 }}
          ></Image>
          <Text style={{ marginLeft: 5 }}>이 지역에서 재검색</Text>
        </TouchableOpacity>
      </View>
      {selectedPlace && (
        <InfoLayer
          place={selectedPlace}
          closeLayer={() => setSelectedPlace(null)}
        />
      )}
      <CategoryList
        categorys={[
          { category: "식당", color: "#6E37AB" },
          { category: "카페", color: "#F14C5C" },
          { category: "공원", color: "#F69F20" },
        ]}
      />
      <BottomNav />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 500,
  },
  filterContainer: {
    position: "absolute",
    top: 62,
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
    top: 120,
    left: 0,
    right: 0,
    width: "90%",
    marginHorizontal: "5%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
});
