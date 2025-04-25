import Constants from "expo-constants";
import axios from "axios";

const extra = Constants.expoConfig?.extra || {};

export const getAddressFromCoords = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await axios.get(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc`,
      {
        params: {
          coords: `${longitude},${latitude}`,
          orders: "roadaddr",
          output: "json",
        },
        headers: {
          "X-NCP-APIGW-API-KEY-ID": extra.NAVER_APIGW_ID,
          "X-NCP-APIGW-API-KEY": extra.NAVER_APIGW_KEY,
        },
      }
    );

    const region = response.data.results[0]?.region;
    const city = region?.area1?.name;
    const district = region?.area2?.name;
    return district ? district : city;
  } catch (error) {
    console.error("❌ [ERROR] 좌표 변환 실패:", error);
    return null;
  }
};

export const searchPlaces = async (
  query: string,
  latitude: number,
  longitude: number
) => {
  try {
    const address = await getAddressFromCoords(latitude, longitude);
    const searchQuery = address ? `${query} ${address}` : query;

    const response = await axios.get(
      "https://openapi.naver.com/v1/search/local.json",
      {
        params: {
          query: searchQuery,
          display: 50,
          start: 1,
          sort: "random",
        },
        headers: {
          "X-Naver-Client-Id": extra.NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": extra.NAVER_CLIENT_SECRET,
        },
      }
    );
    return response.data.items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ [ERROR] 네이버 검색 API 요청 실패:", error.message);
    } else {
      console.error("❌ [ERROR] 알 수 없는 오류 발생:", error);
    }
    return [];
  }
};
