import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Modal, StyleSheet } from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons,
  Fontisto,
  FontAwesome6,
  FontAwesome,
} from "@expo/vector-icons";

import { getStoredData, storeData } from "../../database";
import { StoredData, ErrorList } from "../../Types";

interface ErrorListModalProps {
  visible: boolean;
  onClose: any;
}
export default function ErrorListModal({
  visible,
  onClose,
}: ErrorListModalProps) {
  const [errorList, setErrorList] = useState<ErrorList[]>([]);

  function onCloseSettingsModal() {
    onClose(visible);
  }

  async function getErrorList() {
    const data = await getStoredData("errorList");
    const errorList = data.errorList ? data.errorList : [];
    setErrorList(errorList);
  }
  useEffect(() => {
    getErrorList();
  }, [visible]);
  return (
    <Modal visible={visible} onRequestClose={onClose} transparent={true}>
      <View style={styles.modalContainer}>
        <MaterialCommunityIcons
          name="close"
          size={30}
          color={"white"}
          onPress={onCloseSettingsModal}
        />
        <Text style={{ color: "white" }}>Error List</Text>

        <FlatList
          data={errorList}
          renderItem={({ item }) => (
            <View
              style={{
                margin: 10,
                padding: 10,
                borderRadius: 5,
                backgroundColor: "#949494",
                flexDirection: "column",
              }}
            >
              <Text style={{ color: "white" }}>
                Date: {new Date(item.date).toLocaleString()}
              </Text>

              <Text style={{ color: "white" }}>Message: {item.message}</Text>
            </View>
          )}
          keyExtractor={(item) => String(item.date)}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    backgroundColor: "#302f2f",
  },
});
