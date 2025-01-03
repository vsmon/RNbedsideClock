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

interface SettingsModalProps {
  visible: boolean;
  onClose: any;
}
export default function SettingsModal({
  visible: visibleSettingsModal,
  onClose,
}: SettingsModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [iniTime, setIniTime] = useState<string>("00:00:00");
  const [endTime, setEndTime] = useState<string>("10:00:00");
  const [teste, setTeste] = useState<string>("0");
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
          setTeste(currentDate.toLocaleTimeString());
        } else if (textInputID === "endTime") {
          setEndTime(currentDate.toLocaleTimeString());
        }
        setShowTimePicker(false);
      }
    }
  }

  function convertStringToTime(time: string) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date;
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

      if (textInputID === "iniTime") {
        setDate(convertStringToTime(iniTime));
      } else if (textInputID === "endTime") {
        setDate(convertStringToTime(endTime));
      }
    }
  }
  const handleColorChange = (newColor: Color) => {
    setColor(newColor);
  };

  function handleIniTime() {
    setTextInputID("iniTime");
    setDate(new Date(iniTime));
    setShowTimePicker(true);
  }
  function handleEndTime() {
    setTextInputID("endTime");
    setDate(new Date(endTime));
    setShowTimePicker(true);
  }

  useEffect(() => {
    //handleGetSettings();
  }, []);

  return (
    <Modal
      visible={visibleSettingsModal}
      //onRequestClose={onClose}
      transparent={true}
    >
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
          onPress={() => onClose({ iniTime, endTime, color })}
        />
        <Text style={{ color: "#FFF", fontSize: 30, marginBottom: 5 }}>
          Settings
        </Text>
        <Text style={{ color: "white" }}>{teste}</Text>
        <Pressable onPress={handleIniTime}>
          <TextInput
            style={styles.textInput}
            value={iniTime}
            editable={false}
          />
        </Pressable>

        <Text style={{ color: "white" }}>{endTime}</Text>
        <Pressable onPress={handleEndTime}>
          <TextInput
            style={styles.textInput}
            value={endTime}
            editable={false}
          />
        </Pressable>
        <ColorPicker onColorChange={handleColorChange} />
        <Button
          title="Test"
          onPress={() => console.log(iniTime, endTime, color)}
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
