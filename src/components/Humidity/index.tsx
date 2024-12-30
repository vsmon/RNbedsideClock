import React from "react";
import { View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Fontisto } from "@expo/vector-icons";

type humidityIcon = {
  size: number;
};

export default function Humidity({ size }: humidityIcon) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 15,
      }}
    >
      <Ionicons
        style={{ zIndex: -5 }}
        name="water"
        size={size}
        color="#0278ff"
      />
      <Ionicons
        style={{ marginLeft: (-90 * size) / 80 }}
        name="water"
        size={size}
        color="#08fdf1"
      />
    </View>
  );
}
