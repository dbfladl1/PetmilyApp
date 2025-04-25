// import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// interface AuthContextType {
//   accessToken: string | null;
//   setAccessToken: (token: string | null) => void;
// }
// interface AuthProviderProps {
//   children: ReactNode;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [accessToken, setAccessTokenState] = useState<string | null>(null);

//   // ✅ AsyncStorage에 accessToken 저장
//   const setAccessToken = async (token: string | null) => {
//     setAccessTokenState(token);
//     if (token) {
//       await AsyncStorage.setItem("accessToken", token);
//     } else {
//       await AsyncStorage.removeItem("accessToken");
//     }
//   };

//   // ✅ 앱 시작 시 저장된 토큰 불러오기
//   useEffect(() => {
//     const loadToken = async () => {
//       const storedToken = await AsyncStorage.getItem("accessToken");
//       console.log("🔵 [AuthProvider] AsyncStorage에서 불러온 accessToken:", storedToken);
//       setAccessTokenState(storedToken);
//     };
//     loadToken();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ accessToken, setAccessToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth는 AuthProvider 내에서 사용해야 합니다.");
//   }
//   return context;
// };
