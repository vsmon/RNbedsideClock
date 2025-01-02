import { View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Fontisto } from "@expo/vector-icons";
import Humidity from "../Humidity";

type HumidityInside = {
  size: number;
  color: string;
};

export default function HumidityInside({ size, color }: HumidityInside) {
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
        color={color}
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          zIndex: 5,
        }}
      >
        <Humidity size={size / 2} color={color} />
      </View>
    </View>
  );
}
