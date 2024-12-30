import React, { useEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons, Fontisto } from "@expo/vector-icons";

type ExternalTempIcon = {
  idIcon: { id: number; icon: string };
  size: number;
};

export default function ExternalTempIcon({ idIcon, size }: ExternalTempIcon) {
  const [iconName, setIconName] =
    useState<React.ComponentProps<typeof MaterialCommunityIcons>["name"]>(
      "weather-cloudy"
    );

  useEffect(() => {
    handleIconName();
  }, [idIcon.icon, idIcon.id]);

  function handleIconName() {
    try {
      const weatherConditions = [
        { id: 200, icon: "11d", name: "weather-lightning-rainy" },
        { id: 201, icon: "11d", name: "weather-lightning-rainy" },
        { id: 202, icon: "11d", name: "weather-lightning-rainy" },
        { id: 210, icon: "11d", name: "weather-lightning-rainy" },
        { id: 211, icon: "11d", name: "weather-lightning-rainy" },
        { id: 212, icon: "11d", name: "weather-lightning-rainy" },
        { id: 221, icon: "11d", name: "weather-lightning-rainy" },
        { id: 230, icon: "11d", name: "weather-lightning-rainy" },
        { id: 231, icon: "11d", name: "weather-lightning-rainy" },
        { id: 232, icon: "11d", name: "weather-lightning-rainy" },
        { id: 300, icon: "09d", name: "weather-pouring" },
        { id: 301, icon: "09d", name: "weather-pouring" },
        { id: 302, icon: "09d", name: "weather-pouring" },
        { id: 310, icon: "09d", name: "weather-pouring" },
        { id: 311, icon: "09d", name: "weather-pouring" },
        { id: 312, icon: "09d", name: "weather-pouring" },
        { id: 313, icon: "09d", name: "weather-pouring" },
        { id: 314, icon: "09d", name: "weather-pouring" },
        { id: 321, icon: "09d", name: "weather-pouring" },
        { id: 500, icon: "10d", name: "weather-pouring" },
        { id: 501, icon: "10d", name: "weather-pouring" },
        { id: 502, icon: "10d", name: "weather-pouring" },
        { id: 503, icon: "10d", name: "weather-pouring" },
        { id: 504, icon: "10d", name: "weather-pouring" },
        { id: 511, icon: "13d", name: "weather-pouring" },
        { id: 520, icon: "09d", name: "weather-pouring" },
        { id: 521, icon: "09d", name: "weather-pouring" },
        { id: 522, icon: "09d", name: "weather-pouring" },
        { id: 531, icon: "09d", name: "weather-pouring" },
        { id: 600, icon: "13d", name: "weather-snowy-heavy" },
        { id: 601, icon: "13d", name: "weather-snowy-heavy" },
        { id: 602, icon: "13d", name: "weather-snowy-heavy" },
        { id: 611, icon: "13d", name: "weather-snowy-heavy" },
        { id: 612, icon: "13d", name: "weather-snowy-heavy" },
        { id: 613, icon: "13d", name: "weather-snowy-heavy" },
        { id: 615, icon: "13d", name: "weather-snowy-heavy" },
        { id: 616, icon: "13d", name: "weather-snowy-heavy" },
        { id: 620, icon: "13d", name: "weather-snowy-heavy" },
        { id: 621, icon: "13d", name: "weather-snowy-heavy" },
        { id: 622, icon: "13d", name: "weather-snowy-heavy" },
        { id: 701, icon: "50d", name: "weather-tornado" },
        { id: 711, icon: "50d", name: "weather-tornado" },
        { id: 721, icon: "50d", name: "weather-tornado" },
        { id: 731, icon: "50d", name: "weather-tornado" },
        { id: 741, icon: "50d", name: "weather-tornado" },
        { id: 751, icon: "50d", name: "weather-tornado" },
        { id: 761, icon: "50d", name: "weather-tornado" },
        { id: 762, icon: "50d", name: "weather-tornado" },
        { id: 771, icon: "50d", name: "weather-tornado" },
        { id: 781, icon: "50d", name: "weather-tornado" },
        { id: 800, icon: "01d", name: "weather-sunny" },
        { id: 800, icon: "01n", name: "weather-night" },
        { id: 801, icon: "02d", name: "weather-partly-cloudy" },
        { id: 801, icon: "02n", name: "weather-night-partly-cloudy" },
        { id: 802, icon: "03d", name: "weather-cloudy" },
        { id: 803, icon: "04d", name: "weather-cloudy" },
        { id: 804, icon: "04d", name: "weather-cloudy" },
      ];

      console.log("FILTER===========", idIcon.id, idIcon.icon);

      const indexNameByIcon = weatherConditions.findIndex(
        (item) => item.id === idIcon.id && item.icon === idIcon.icon
      );

      const indexNameById = weatherConditions.findIndex(
        (item) => item.id === idIcon.id
      );

      console.log("INDEX indexNameByIcon========", indexNameByIcon);
      console.log("INDEX indexNameById========", indexNameById);

      const name:
        | React.ComponentProps<typeof MaterialCommunityIcons>["name"]
        | any =
        indexNameByIcon !== -1
          ? weatherConditions[indexNameByIcon].name
          : weatherConditions[indexNameById].name;

      console.log("ICON NAME===============", name);
      setIconName(name);
    } catch (error) {
      console.log("Error get icon name", error);
    }
  }

  return <MaterialCommunityIcons name={iconName} size={size} color="#08fdf1" />;
}
