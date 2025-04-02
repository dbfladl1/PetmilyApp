import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";

export const requestLocationPermission = async () => {
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


export const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.warn("위치 권한이 없습니다.");
      return null;
    }
  
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("위치 가져오기 실패:", error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };