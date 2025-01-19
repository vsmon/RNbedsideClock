import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import * as Brightness from "expo-brightness";
import { StoredData } from "../../Types";
import { getStoredData } from "../../database";

interface ChildComponentProps {
  textColor: string;
  updateSettings: boolean;
  changeColor: (color: string) => void;
}

export default function Time({
  textColor = "#08fdf1",
  updateSettings,
  changeColor,
}: ChildComponentProps) {
  const [time, setTime] = useState<string>("");
  const [timeTextColor, setTimeTextColor] = useState<string>(textColor);

  const [settings, setSettings] = useState<StoredData>({
    settings: {
      iniTime: "10:00:00",
      endTime: "10:00:00",
      color: { dayColor: "", nightColor: "" },
    },
  });

  async function setBrightness(value: number) {
    const { status } = await Brightness.requestPermissionsAsync();
    if (status === "granted") {
      Brightness.setSystemBrightnessAsync(value);
    }
  }

  async function setBrightnessAutomatic() {
    Brightness.setSystemBrightnessModeAsync(
      Brightness.BrightnessMode.AUTOMATIC
    );
  }

  async function Time(
    iniTime: string,
    endTime: string,
    dayColor: string,
    nightColor: string,
    brightness: number
  ) {
    setTime(new Date().toLocaleTimeString());

    if (new Date().toLocaleTimeString() === iniTime) {
      setBrightness(brightness);
      setTimeTextColor(nightColor);
      changeColor(nightColor);
    }
    if (new Date().toLocaleTimeString() === endTime) {
      setBrightnessAutomatic();
      setTimeTextColor(dayColor);
      changeColor(dayColor);
    }
  }

  async function loadSettings() {
    const settings = await getStoredData("settings");
    if (settings.settings) {
      setSettings(settings);

      return settings;
    }
  }

  useEffect(() => {
    setTimeTextColor(textColor);
  }, [textColor]);

  useEffect(() => {
    loadSettings()
      .then((settings) => {
        const oneSecInterval = setInterval(() => {
          Time(
            settings?.settings.iniTime!,
            settings?.settings.endTime!,
            settings?.settings.color?.dayColor!,
            settings?.settings.color?.nightColor!,
            settings?.settings.brightness!
          );
        }, 1000);

        return () => {
          clearInterval(oneSecInterval);
        };
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, [updateSettings]);
  return (
    <View>
      <View>
        <Text style={[styles.timeText, { color: timeTextColor }]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeText: {
    fontSize: 150,
    fontFamily: "Digital-7-mono",
    color: "#08fdf1",
  },
});
