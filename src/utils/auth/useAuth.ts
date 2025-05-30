import * as SecureStore from "expo-secure-store";

export class TokenStorage {
  static keys = {
    access: "accessToken",
    refresh: "refreshToken",
  };

  static async set(type: "access" | "refresh", token: string) {
    await SecureStore.setItemAsync(this.keys[type], token);
  }

  static async get(type: "access" | "refresh"): Promise<string | null> {
    return await SecureStore.getItemAsync(this.keys[type]);
  }

  static async remove(type: "access" | "refresh") {
    await SecureStore.deleteItemAsync(this.keys[type]);
  }

  static async clearAll() {
    await Promise.all([
      SecureStore.deleteItemAsync(this.keys.access),
      SecureStore.deleteItemAsync(this.keys.refresh),
    ]);
  }
}
