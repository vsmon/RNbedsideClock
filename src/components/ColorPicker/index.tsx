import React, { useState } from "react";
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

export default function ColorPickerModal({
  onColorChange,
}: ChildComponentProps) {
  const [showModal, setShowModal] = useState(false);
  const [buttonID, setButtonID] = useState("");
  const [dayColor, setDayColor] = useState("day");
  const [nightColor, setNightColor] = useState("night");

  const initialColor = colorKit.randomRgbColor().hex();

  const selectedColor = useSharedValue(initialColor);
  const backgroundColorStyle = useAnimatedStyle(() => ({
    backgroundColor: selectedColor.value,
  }));

  const onColorSelect = (color: returnedResults) => {
    "worklet";
    selectedColor.value = color.hex;
    //console.log(selectedColor.value);
  };

  async function handleChangeColor(selectedColor: string) {
    /*const settings = await getStoredData("settings");
     let dayColor: string = settings.settings?.color?.dayColor || "", //"#08fdf1",
      nightColor: string = settings.settings?.color?.nightColor || ""; //"#FF0000"; */

    if (buttonID === "day") {
      console.log("passei day", selectedColor);
      setDayColor(selectedColor);
    } else if (buttonID === "night") {
      console.log("passei night", selectedColor);
      setNightColor(selectedColor);
    }

    /* const newSettings: StoredData = {
      settings: {
        ...settings.settings!,
        color: { dayColor: dayColor, nightColor: nightColor },
      },
    };
 */
    /* await mergeData("settings", newSettings.settings); */
    console.log("COLOR PICKER======", dayColor, nightColor);
    onColorChange({ dayColor, nightColor });
  }

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <>
      <AnimatedPressable
        style={[styles.openButton, backgroundColorStyle]}
        onPress={() => {
          setButtonID("day");
          setShowModal(true);
        }}
      >
        <Text
          style={{ color: "#707070", fontWeight: "bold", textAlign: "center" }}
        >
          Day Color
        </Text>
      </AnimatedPressable>
      <AnimatedPressable
        style={[styles.openButton, backgroundColorStyle]}
        onPress={() => {
          setButtonID("night");
          setShowModal(true);
        }}
      >
        <Text
          style={{ color: "#707070", fontWeight: "bold", textAlign: "center" }}
        >
          Night Color
        </Text>
      </AnimatedPressable>
      {/* <Animated.View
        style={[{ height: 100, width: 100 }, backgroundColorStyle]}
      ></Animated.View> */}
      <Modal
        onRequestClose={() => {
          setShowModal(false);
        }}
        visible={showModal}
        animationType="slide"
      >
        <Animated.View style={[styles.container, backgroundColorStyle]}>
          <KeyboardAvoidingView behavior="position">
            <View style={styles.pickerContainer}>
              <ColorPicker
                value={selectedColor.value}
                sliderThickness={25}
                thumbSize={20}
                thumbShape="doubleTriangle"
                onChange={onColorSelect}
                adaptSpectrum
                onComplete={() => {}}
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
            onPress={() => {
              handleChangeColor(selectedColor.value);
              setShowModal(false);
            }}
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
    marginTop: 20,
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
