export default {
    expo: {
      name: "petmily-app",
      slug: "petmily-app",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "petmily",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        supportsTablet: true,
        infoPlist: {
          NSDocumentsUsageDescription: "앱에서 문서를 선택하려면 사용자의 권한이 필요합니다.",
          NSPhotoLibraryUsageDescription: "사진 라이브러리에 접근하려면 사용자의 권한이 필요합니다.",
          NSPhotoLibraryAddUsageDescription: "사진을 저장하려면 사용자의 권한이 필요합니다."
        }
      },
      android: {
        adaptiveIcon: {
          backgroundColor: "#ffffff"
        },
        package: "com.anonymous.petmilyapp"
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png"
      },
      plugins: [
        [
          "@mj-studio/react-native-naver-map",
          {
            client_id: `${process.env.NAVER_CLIENT_ID}`,
            android: {
              ACCESS_FINE_LOCATION: true,
              ACCESS_COARSE_LOCATION: true,
              ACCESS_BACKGROUND_LOCATION: true
            },
            ios: {
              NSLocationAlwaysAndWhenInUseUsageDescription: "이 앱은 사용자의 위치를 기반으로 반려동물 동반 가능 장소를 안내합니다.",
              NSLocationWhenInUseUsageDescription: "이 앱은 사용자의 위치를 기반으로 반려동물 동반 가능 장소를 안내합니다.",
              NSLocationTemporaryUsageDescriptionDictionary: {
                purposeKey: "위치 기반 서비스 제공",
                usageDescription: "이 앱은 사용자의 위치를 기반으로 반려동물 동반 가능 장소를 안내합니다."
              }
            }
          }
        ],
        "expo-router",
        "expo-secure-store",
        "expo-build-properties"
      ],
      experiments: {
        typedRoutes: true
      },
      extra: {
        NAVER_CLIENT_ID: `${process.env.NAVER_CLIENT_ID}`,
        NAVER_CLIENT_SECRET: `${process.env.NAVER_CLIENT_SECRET}`,
        NAVER_APIGW_ID: `${process.env.NAVER_APIGW_ID}`,
        NAVER_APIGW_KEY: `${process.env.NAVER_APIGW_KEY}`,
        OPENAI_API_KEY: `${process.env.OPENAI_API_KEY}`,
      }
    }
  };
  