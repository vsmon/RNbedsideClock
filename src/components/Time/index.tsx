import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import * as Brightness from "expo-brightness";
import { StoredData } from "../../Types";
import { getStoredData } from "../../database";

interface ChildComponentProps {
  onChangeTextColor: (textColor: string) => void;
  onUpdateData: (updateData: number) => void;
  updateSettings: (updateSettings: boolean) => void;
}

export default function Time({
  onChangeTextColor,
  onUpdateData,
  updateSettings,
}: ChildComponentProps) {
  const [time, setTime] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#08fdf1");
  const [updateData, setUpdateData] = useState<boolean>(false);
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

  async function Time() {
    setTime(new Date().toLocaleTimeString());
    if (new Date().toLocaleTimeString() === settings.settings?.iniTime) {
      setBrightness(0);
      setTextColor(settings.settings?.color?.nightColor!);
      onChangeTextColor(settings.settings?.color?.nightColor!);
    }
    if (new Date().toLocaleTimeString() === settings.settings?.endTime) {
      setBrightnessAutomatic();
      setTextColor(settings.settings?.color?.dayColor!);
      onChangeTextColor(settings.settings?.color?.dayColor!);
    }
  }

  async function handleSettings() {
    const settings = await getStoredData("settings");
    if (settings.settings) {
      setSettings(settings);
      onChangeTextColor(settings.settings?.color?.dayColor!);
      setTextColor(settings.settings?.color?.dayColor!);
    }
  }

  useEffect(() => {
    handleSettings();
  }, [updateSettings]);

  useEffect(() => {
    const oneSecInterval = setInterval(() => {
      Time();
    }, 1000);

    const fiveSecInvervalID = setInterval(() => {
      onUpdateData(Math.random());
      console.log(
        `${new Date().toLocaleString()} - Loop executed.............`
      );
    }, 300000);

    return () => {
      clearInterval(oneSecInterval);
      clearInterval(fiveSecInvervalID);
    };
  }, [updateSettings]);
  return <Text style={[styles.timeText, { color: textColor }]}>{time}</Text>;
}

const styles = StyleSheet.create({
  timeText: {
    fontSize: 150,
    fontFamily: "Digital-7-mono",
    color: "#08fdf1",
    marginTop: 5,
  },
});
