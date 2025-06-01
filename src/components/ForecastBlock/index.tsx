import { View, StyleSheet } from "react-native";
import ExternalTempIcon from "../ExternalTempIcon";

import React, { ReactNode } from "react";

type ForecastBlockProps = {
  children: ReactNode;
};

export default function ForecastBlock({ children }: ForecastBlockProps) {
  return (
    <View style={styles.container}>
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  childrenContainer: {
    alignItems: "center",
  },
  temperatureText: {
    fontSize: 40,
    color: "#08fdf1",
  },
});
