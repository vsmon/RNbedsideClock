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

interface SettingsModalProps {
  visible: boolean;
  onClose: any;
}
export default function SettingsModal({
  visible: visibleModal,
  onClose,
}: SettingsModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [iniTime, setIniTime] = useState<string>("00:00:00");
  const [endTime, setEndTime] = useState<string>("10:00:00");
  const [color, setColor] = useState<Color>({
    dayColor: "#08fdf1",
    nightColor: "#FF0000",
  });
  const [textInputID, setTextInputID] = useState<string>("");

  function onChangeTimePicker(
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) {
    if (event.type === "dismissed") {
      return;
    }
    if (event.type === "set") {
      if (!selectedDate) {
        return;
      }
      //setDate(selectedDate);
      if (textInputID === "iniTime") {
        setIniTime(new Date(selectedDate).toLocaleTimeString());
      } else if (textInputID === "endTime") {
        setEndTime(new Date(selectedDate).toLocaleTimeString());
      }
      setShowTimePicker(false);
    }
  }

  async function handleSave() {
    const values = { settings: { iniTime, endTime, color } };
    await storeData("settings", values);
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
  const handleColorChange = (newColor: Color) => {
    const { dayColor, nightColor } = newColor;
    //setColor(newColor);
    console.log("CALLBACK=========", newColor);
  };

  useEffect(() => {
    handleGetSettings();
  }, [visibleModal]);

  useEffect(() => {
    handleGetSettings();
  }, [showTimePicker]);

  useEffect(() => {
    handleSave();
    handleGetSettings();
  }, [iniTime, endTime]);

  return (
    <Modal visible={visibleModal} onRequestClose={onClose} transparent={false}>
      {showTimePicker && (
        <DateTimePicker
          display="spinner"
          testID="dateTimePicker"
          value={date}
          mode={"time"}
          is24Hour={true}
          onChange={onChangeTimePicker}
        />
      )}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          /* width: 500,
            height: 500, */
          backgroundColor: "#302f2f",
        }}
      >
        <MaterialCommunityIcons
          name="close"
          size={30}
          color={"white"}
          onPress={onClose}
        />
        <Text style={{ color: "#FFF", fontSize: 30 }}>Settings</Text>
        <Pressable
          onPress={() => {
            setDate(new Date(iniTime));
            setShowTimePicker(true);

            setTextInputID("iniTime");
          }}
        >
          <TextInput
            style={styles.textInput}
            value={iniTime}
            editable={false}
          />
        </Pressable>

        <Pressable
          onPress={() => {
            setDate(new Date(endTime));
            setShowTimePicker(true);
            setTextInputID("endTime");
          }}
        >
          <TextInput
            style={styles.textInput}
            value={endTime}
            editable={false}
          />
        </Pressable>
        <ColorPicker onColorChange={handleColorChange} />
        <MaterialCommunityIcons
          name="content-save-all"
          size={45}
          onPress={() => {}}
        />
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
});
