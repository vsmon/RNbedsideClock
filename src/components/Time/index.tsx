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

  const [settings, setSettings] = useState<StoredData | undefined>(undefined);

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

    if (
      new Date().toLocaleTimeString() >= iniTime &&
      new Date().toLocaleTimeString() <= endTime
    ) {
      setBrightness(brightness);
      setTimeTextColor(nightColor);
      changeColor(nightColor);
    } else {
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
    } else {
      return {
        settings: {
          iniTime: "10:00:00",
          endTime: "10:00:00",
          color: { dayColor: "#08fdf1", nightColor: "#ff0000" },
          brightness: 0,
        },
      };
    }
  }

  useEffect(() => {
    setTimeTextColor(textColor);
  }, [textColor]);

  useEffect(() => {
    let oneSecInterval: NodeJS.Timeout;
    loadSettings().then((settings) => {
      oneSecInterval = setInterval(() => {
        const {
          iniTime,
          endTime,
          color: { dayColor, nightColor },
          brightness,
        } = settings?.settings!;
        Time(iniTime, endTime, dayColor, nightColor, brightness);
      }, 1000);
    });

    return () => clearInterval(oneSecInterval);
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
