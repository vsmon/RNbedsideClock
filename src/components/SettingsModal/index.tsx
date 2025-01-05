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

import { getStoredData, storeData } from "../../database";
import { Color, StoredData } from "../../Types";
import convertStringToTime from "../../Utils/convertStringToTime";

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
  const [color, setColor] = useState<Color>({
    dayColor: "#08fdf1",
    nightColor: "#FF0000",
  });
  const [textInputID, setTextInputID] = useState<string>("");

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
      saveTime();
    }
  }, [iniTime, endTime]);

  async function saveTime() {
    const settings = await getStoredData("settings");
    if (settings.settings) {
      const updatedSettings: StoredData = {
        settings: {
          ...settings.settings,
          iniTime: iniTime,
          endTime: endTime,
        },
      };
      await storeData("settings", updatedSettings);
      setShouldSave(false);
    }
  }

  async function handleGetSettings() {
    const data = await getStoredData("settings");
    if (data.settings) {
      const {
        iniTime,
        endTime,
        color = { dayColor: "", nightColor: "" },
      } = data.settings;
      setIniTime(iniTime);
      setEndTime(endTime);
      setColor(color);
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
        {/* <Text style={{ color: "white" }}>{teste}</Text> */}
        <Pressable onPress={handleIniTime}>
          <TextInput
            style={styles.textInput}
            value={iniTime}
            editable={false}
          />
        </Pressable>

        {/* <Text style={{ color: "white" }}>{endTime}</Text> */}
        <Pressable onPress={handleEndTime}>
          <TextInput
            style={styles.textInput}
            value={endTime}
            editable={false}
          />
        </Pressable>
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
    borderRadius: 5,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //width: 500,
    borderRadius: 35,
    //height: 500,
    backgroundColor: "#302f2f",
  },
});
