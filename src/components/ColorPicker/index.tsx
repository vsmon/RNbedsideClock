import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import ColorPicker, {
  Panel2,
  OpacitySlider,
  colorKit,
  InputWidget,
  SaturationSlider,
} from "reanimated-color-picker";
import type { returnedResults } from "reanimated-color-picker";
import { getStoredData, mergeData, storeData } from "../../database";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { Color, StoredData } from "../../Types";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

interface ChildComponentProps {
  onColorChange: (color: Color) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ColorPickerModal() {
  const [showModal, setShowModalColorPicker] = useState(false);
  const [buttonID, setButtonID] = useState("");
  const [dayColorState, setDayColorState] = useState<string>("red");
  const [nightColorState, setNightColorState] = useState<string>("blue");
  const [settings, setSettings] = useState<StoredData>({
    settings: {
      iniTime: "10:00:00",
      endTime: "10:00:00",
      color: { dayColor: "#08fdf1", nightColor: "#ff0000" },
    },
  });

  const initialColor =
    buttonID === "day"
      ? dayColorState
      : nightColorState; /* colorKit.randomRgbColor().hex(); */
  /* console.log(buttonID === "day" ? dayColorState : nightColorState); */
  const selectedColor = useSharedValue(initialColor);

  const backgroundColorStyle = useAnimatedStyle(() => ({
    backgroundColor: selectedColor.value,
  }));

  function onColorSelect(color: returnedResults) {
    selectedColor.value = color.hex;
    if (buttonID === "day") {
      setDayColorState(color.hex);
    } else if (buttonID === "night") {
      setNightColorState(color.hex);
    }
  }

  async function saveColors() {
    const storedSettings = await getStoredData("settings");

    if (storedSettings.settings) {
      const updatedSettings: StoredData = {
        settings: {
          ...storedSettings.settings,
          color: { dayColor: dayColorState, nightColor: nightColorState },
        },
      };
      await storeData("settings", updatedSettings);
    } else {
      await storeData("settings", settings);
    }
  }

  async function loadColors() {
    const settings = await getStoredData("settings");
    if (settings.settings?.color) {
      setDayColorState(settings.settings?.color?.dayColor);
      setNightColorState(settings.settings?.color?.nightColor);
    }
  }

  function handleButtonDay() {
    selectedColor.value = dayColorState;
    setButtonID("day");
    setShowModalColorPicker(true);
  }

  function handleButtonNight() {
    selectedColor.value = nightColorState;
    setButtonID("night");
    setShowModalColorPicker(true);
  }

  function handleCloseColorPicker() {
    saveColors();
    setShowModalColorPicker(false);
  }

  useEffect(() => {
    loadColors();
  }, []);

  return (
    <>
      <AnimatedPressable
        style={[styles.openButton, { backgroundColor: dayColorState }]}
        onPress={handleButtonDay}
      >
        <Text
          style={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}
        >
          Day Color
        </Text>
      </AnimatedPressable>
      <AnimatedPressable
        style={[styles.openButton, { backgroundColor: nightColorState }]}
        onPress={handleButtonNight}
      >
        <Text
          style={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}
        >
          Night Color
        </Text>
      </AnimatedPressable>

      <Modal
        onRequestClose={() => {
          setShowModalColorPicker(false);
        }}
        visible={showModal}
        animationType="slide"
      >
        <Animated.View style={[styles.container, backgroundColorStyle]}>
          <KeyboardAvoidingView behavior="position">
            <View style={styles.pickerContainer}>
              <ColorPicker
                value={selectedColor.value}
                sliderThickness={10}
                thumbSize={20}
                thumbShape="doubleTriangle"
                onChange={onColorSelect}
                adaptSpectrum
              >
                <Panel2
                  style={styles.panelStyle}
                  verticalChannel="brightness"
                  thumbShape="ring"
                  thumbSize={30}
                />

                <SaturationSlider
                  style={styles.sliderStyle}
                  thumbColor="#fff"
                />

                <OpacitySlider style={styles.sliderStyle} thumbColor="#fff" />

                <View style={styles.previewTxtContainer}>
                  <InputWidget
                    inputStyle={{
                      color: "#fff",
                      paddingVertical: 2,
                      borderColor: "#707070",
                      fontSize: 12,
                      marginLeft: 5,
                    }}
                    iconColor="#707070"
                  />
                </View>
              </ColorPicker>
            </View>
          </KeyboardAvoidingView>

          <Pressable
            style={styles.closeButton}
            onPress={handleCloseColorPicker}
          >
            <Text style={{ color: "#707070", fontWeight: "bold" }}>Close</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  pickerContainer: {
    alignSelf: "center",
    width: 300,
    backgroundColor: "#202124",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  panelStyle: {
    borderRadius: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,
    marginTop: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  previewTxtContainer: {
    paddingTop: 20,
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: "#bebdbe",
  },
  openButton: {
    height: 40,
    width: 300,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    bottom: 10,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignSelf: "center",
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
