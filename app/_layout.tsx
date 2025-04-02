import { AuthProvider } from "@/src/context/AuthContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";

export const GlobalFontContext = React.createContext({ fontFamily: "Roboto" });

export default function RootLayout() {
  return (
    <AuthProvider>
      <GlobalFontContext.Provider value={{ fontFamily: "DMSans" }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#f4511e",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen name="/" />
            <Stack.Screen name="details" />
            <Stack.Screen name="/user/login" />
            <Stack.Screen name="/sns/snsWrite" />
            <Stack.Screen name="/map/FindingPet" />
            <Stack.Screen name="/map/FindingPetRegister" />
            <Stack.Screen name="/map/FindingStore" />
            <Stack.Screen name="/user/modify/ModifyInfo" />
            <Stack.Screen name="/help/ChatAi" />
            <Stack.Screen name="/help/AddPet" />
            <Stack.Screen name="/sns/snsFeed" />
          </Stack>
        </GestureHandlerRootView>
      </GlobalFontContext.Provider>
    </AuthProvider>
  );
}
