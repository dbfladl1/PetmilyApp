import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import React from "react";

export const GlobalFontContext = React.createContext({ fontFamily: "Roboto" });

export default function RootLayout() {
  return (
    <GlobalFontContext.Provider value={{ fontFamily: "DMSans" }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
        </Stack>
      </GestureHandlerRootView>
    </GlobalFontContext.Provider>
  );
}
