import { View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Fontisto } from "@expo/vector-icons";
import Humidity from "../Humidity";

type HumidityInside = {
  size: number;
};

export default function HumidityInside({ size }: HumidityInside) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: -12,
      }}
    >
      <MaterialCommunityIcons
        style={{ marginRight: (-110 * size) / 150 }}
        name="home-thermometer-outline"
        size={size}
        color="#08fdf1"
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          zIndex: 5,
        }}
      >
        <Humidity size={size / 2} />
      </View>
    </View>
  );
}
