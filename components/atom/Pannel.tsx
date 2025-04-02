import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";

const { height } = Dimensions.get("window");
export default function Pannel({
  title,
  list,
  selectHandle,
}: {
  title: string;
  list: any[];
  selectHandle: (pet:any) => void;
}) {
  const [active, setActive] = useState(false);
  const activePannel = () => {
    setActive((pre) => !pre);
  };

  return (
    <View style={{ position: "absolute" }}>
      <TouchableOpacity style={styles.btn} onPress={activePannel}>
        <Image
          source={require("@/assets/images/icon/hambergur.png")}
          style={styles.hambergur}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={active ? styles.pannelActive : styles.pannelHide}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <View>
            <TouchableOpacity style={styles.backBtn} onPress={activePannel}>
              <Image
                source={require("@/assets/images/icon/back.png")}
                resizeMode="contain"
                style={styles.backBtn}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.pannelTitle}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{title}</Text>
          </View>
        </View>
        {list.length >= 1 &&
          list.map((pet: any, index) => (
            <TouchableOpacity style={styles.list} onPress={()=>selectHandle(pet)} key={index}>
              <Text>{pet.name}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    top: 19,
    left: 15,
    zIndex: 100,
    minHeight: 30,
    width: 32,
    borderRadius: 10,
  },
  hambergur: {
    width: 32,
  },
  pannelActive: {
    position: "absolute",
    zIndex: 100,
    left: 0,
    top: 0,
    width: 230,
    height: height,
    backgroundColor: "#fff",
    borderRightColor: "#eee",
    borderWidth: 1,
  },
  pannelHide: {
    position: "absolute",
    left: -200,
    top: 0,
    width: 200,
    borderRadius: 10,
  },
  backBtn: {
    width: 25,
    height: 30,
    marginTop: 15,
    marginLeft: 5,
  },

  pannelTitle: {
    marginVertical: 30,
    marginHorizontal: 15,
  },
  list: {
    padding: 15,
  },
});
