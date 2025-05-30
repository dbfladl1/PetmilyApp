import { View, Text, StyleSheet } from "react-native";
import React from "react";

interface CategoryProps {
  categorys: Array<{
    category: string;
    color: string;
  }>;
}

export default function CategoryList({ categorys }: CategoryProps) {
  return (
    <View style={styles.container}>
      {categorys.map((category, index) => (
        <View key={index} style={styles.categoryItem}>
          <View style={[styles.circle, { backgroundColor: category.color }]}></View>
          <Text>{category.category}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    zIndex: 200,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    gap: 10,
    padding: 5,
  },
  categoryItem: {
    flexDirection: "row",
  },
  circle: {
    width: 10,
    height: 10,
    margin: "auto",
    marginLeft: 10,
    marginRight: 5,
    borderRadius: 15,
  },
  purpleCircle: {
    backgroundColor: "#6E37AB",
  },
  redCircle: {
    backgroundColor: "#F14C5C",
  },
  yellowCircle: {
    backgroundColor: "#F69F20",
  },
});
