import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Button,
} from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons,
  Fontisto,
  FontAwesome6,
  FontAwesome,
} from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import ColorPicker from "../../components/ColorPicker";
import Slider from "@react-native-community/slider";

import { getStoredData, storeData } from "../../database";
import { Color, StoredData } from "../../Types";
import convertStringToTime from "../../Utils/convertStringToTime";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

interface SettingsModalProps {
  visible: boolean;
  onClose: any;
}
export default function SettingsModal({
  visible,
  onClose,
}: SettingsModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [visibleSettingsModal, setVisibleSettingsModal] =
    useState<boolean>(false);
  const [iniTime, setIniTime] = useState<string>("00:00:00");
  const [endTime, setEndTime] = useState<string>("10:00:00");
  const [shouldSave, setShouldSave] = useState<boolean>(false);
  const [settings, setSettings] = useState<StoredData>({
    settings: {
      iniTime: "10:00:00",
      endTime: "10:00:00",
      color: { dayColor: "#08fdf1", nightColor: "#ff0000" },
      brightness: 0,
    },
  });
  const [color, setColor] = useState<Color>({
    dayColor: "#08fdf1",
    nightColor: "#FF0000",
  });
  const [textInputID, setTextInputID] = useState<string>("");
  const [initialBrightness, setInitialBrightness] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(initialBrightness);
  const [isVisibleBrightnessModal, setIsVisibleBrightnessModal] =
    useState<boolean>(false);

  function onChangeTimePicker(
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) {
    const currentDate = selectedDate;

    if (event.type === "dismissed") {
      setShowTimePicker(false);
    }
    if (event.type === "set") {
      if (currentDate) {
        if (textInputID === "iniTime") {
          setIniTime(currentDate.toLocaleTimeString());
        } else if (textInputID === "endTime") {
          setEndTime(currentDate.toLocaleTimeString());
        }
        setShowTimePicker(false);
        setShouldSave(true);
      }
    }
  }

  useEffect(() => {
    if (shouldSave) {
      saveData();
    }
  }, [iniTime, endTime, brightness]);

  async function saveData() {
    const storedSettings = await getStoredData("settings");
    if (storedSettings.settings) {
      const updatedSettings: StoredData = {
        settings: {
          ...storedSettings.settings,
          iniTime: iniTime,
          endTime: endTime,
          brightness: brightness,
        },
      };
      await storeData("settings", updatedSettings);
    } else {
      await storeData("settings", settings);
    }
    setShouldSave(false);
  }

  async function handleGetSettings() {
    const data = await getStoredData("settings");
    if (data.settings) {
      const {
        iniTime,
        endTime,
        color = { dayColor: "", nightColor: "" },
        brightness,
      } = data.settings;
      setIniTime(iniTime);
      setEndTime(endTime);
      setColor(color);
      setBrightness(brightness!);
      setInitialBrightness(brightness!);
    }
  }

  function handleIniTime() {
    setTextInputID("iniTime");
    setDate(convertStringToTime(iniTime));
    setShowTimePicker(true);
  }
  function handleEndTime() {
    setTextInputID("endTime");
    setDate(convertStringToTime(endTime));
    setShowTimePicker(true);
  }

  function onCloseSettingsModal() {
    onClose(visible);
  }

  useEffect(() => {
    handleGetSettings();
  }, []);

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent={true}>
      {showTimePicker && (
        <DateTimePicker
          display="clock"
          testID="dateTimePicker"
          value={date}
          mode={"time"}
          is24Hour={true}
          onChange={onChangeTimePicker}
        />
      )}
      <View style={styles.modalContainer}>
        <MaterialCommunityIcons
          name="close"
          size={30}
          color={"white"}
          onPress={onCloseSettingsModal}
        />
        <Text style={{ color: "#FFF", fontSize: 30, marginBottom: 5 }}>
          Settings
        </Text>
        <View>
          <Text
            style={{
              color: "#FFF",
            }}
          >
            Night Time
          </Text>
          <Pressable onPress={handleIniTime}>
            <TextInput
              style={styles.textInput}
              value={iniTime}
              editable={false}
            />
          </Pressable>
        </View>
        <View>
          <Text style={{ color: "#FFF" }}>Day Time</Text>
          <Pressable onPress={handleEndTime}>
            <TextInput
              style={styles.textInput}
              value={endTime}
              editable={false}
            />
          </Pressable>
        </View>
        <Pressable
          style={styles.brightnessButtonOpen}
          onPress={() => setIsVisibleBrightnessModal(true)}
        >
          <Text style={styles.brightnessButtonOpenText}>Night Brightness</Text>
        </Pressable>
        <Modal visible={isVisibleBrightnessModal} transparent={true}>
          <View
            style={[
              styles.modalContainer,
              {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                //backgroundColor: "#5252520",
              },
            ]}
          >
            <View style={styles.modalBrightnessView}>
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                }}
              >
                {Math.round(initialBrightness * 100)}%
              </Text>
              <Slider
                style={{
                  width: 300,
                  height: 60,
                  /* backgroundColor: `rgba(247, 6, 6, ${brightness})`, */
                  borderRadius: 10,
                  marginBottom: 30,
                }}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#f8f7f7"
                value={brightness}
                onSlidingComplete={(value) => {
                  setBrightness(value);
                  setShouldSave(true);
                }}
                onValueChange={(value) => setInitialBrightness(value)}
              />
              <Pressable
                style={styles.brightnessButtonClose}
                onPress={() => setIsVisibleBrightnessModal(false)}
              >
                <Text style={{ color: "#707070", fontWeight: "bold" }}>
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <ColorPicker />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    width: 300,
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    backgroundColor: "#302f2f",
  },
  modalBrightnessView: {
    width: 400,
    //height: "100%",
    padding: 40,
    backgroundColor: "#5c5b5b",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  brightnessButtonOpen: {
    height: 40,
    width: 300,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: "#666363",
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
  brightnessButtonClose: {
    //position: "absolute",
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
  brightnessButtonOpenText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
