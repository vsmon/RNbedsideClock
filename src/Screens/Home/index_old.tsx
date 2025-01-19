import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Fontisto,
  FontAwesome6,
  FontAwesome,
} from "@expo/vector-icons";

import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useNetInfo } from "@react-native-community/netinfo";

import Humidity from "../../components/Humidity";
import HumidityInside from "../../components/HumidityInside";
import openweathermap from "../../api/openweathermap";
import ExternalTempIcon from "../../components/ExternalTempIcon";
import getBitcoinPrice from "../../api/bitcoinPrice";
import getDollarPrice from "../../api/dollarPrice";
import SettingsModal from "../../components/SettingsModal";
import { deleteAllData, getStoredData, storeData } from "../../database";
import { StoredData } from "../../Types";
import Time from "../../components/Time";

const TOKEN_RASPBERRY = process.env.TOKEN_RASPBERRY;

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [internalTemperature, setInternalTemperature] = useState<string>("0");
  const [externalTemperature, setExternalTemperature] = useState<string>("0");
  const [externalTempMax, setExternalTempMax] = useState<string>("0");
  const [externalTempMin, setExternalTempMin] = useState<string>("0");
  const [rainProb, setRainyProb] = useState<string>("0");
  const [rainyProbNextHour, setRainyProbNextHour] = useState<string>("0");
  const [nextHour, setNextHour] = useState<string>("0");
  const [internalHumidity, setInternalHumidy] = useState<string>("0");
  const [externalHumidity, setExternalHumidy] = useState<string>("0");
  const [raspberryTemperature, setRaspberryTemperature] = useState<string>("0");
  const [idIcon, setIdIcon] = useState<{ id: number; icon: string }>({
    id: 800,
    icon: "01d",
  });
  const [externalWindSpeed, setExternalWindSpeed] = useState<string>("0");
  const [externalDescription, setExternalDescription] =
    useState<string>("none");
  const [btcPrice, setBtcPrice] = useState<string>("0");
  const [dollarPrice, setDollarPrice] = useState<string>("0");
  const [textColor, setTextColor] = useState<string>("#FFF");
  const [isVisibleSettings, setIsVisibleSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<StoredData>({
    settings: {
      iniTime: "10:00:00",
      endTime: "10:00:00",
      color: { dayColor: "#08fdf1", nightColor: "#ff0000" },
    },
  });

  const [loaded, error] = useFonts({
    "Digital-7": require("../../../assets/fonts/digital-7.ttf"),
    "Digital-7-mono": require("../../../assets/fonts/digital-7-mono.ttf"),
  });

  const netInfo = useNetInfo();

  async function getRaspberryTemperature() {
    const URL: string = `https://rodrigofm.com.br/temperature?token=${TOKEN_RASPBERRY}`;
    try {
      const resp = await fetch(URL);
      const json = await resp.json();
      const { temp } = json;
      const formattedTemp = temp.toFixed(0);
      setRaspberryTemperature(formattedTemp);
    } catch (error) {
      console.log("Error to get Temperature Raspberry!", error);
    }
  }
  async function geTemperature() {
    try {
      const data = await fetch("https://arduino.rodrigofm.com.br/data");
      const json = await data.json();
      const {
        temperature,
        external_temperature,
        external_rain_probability,
        external_rain_probability_next_hour,
        next_hour,
        humidity,
        external_humidity,
        external_id_weather,
        external_description_weather,
        external_icon_weather,
        external_wind_speed,
        external_temperature_min,
        external_temperature_max,
      } = json;

      const formattedInternalTemperature: string = temperature.toFixed(1);
      const formattedExternalTemperature: string =
        external_temperature.toFixed(1);
      const formattedInternalHumidity: string = humidity.toFixed(0);
      const formattedWindSpeed: string = external_wind_speed.toFixed(0);
      const formattedExternalTempMax: string =
        external_temperature_max.toFixed(0);
      const formattedExternalTempMin: string =
        external_temperature_min.toFixed(0);

      setInternalTemperature(formattedInternalTemperature);
      setExternalTemperature(formattedExternalTemperature);
      setRainyProb(external_rain_probability);
      setRainyProbNextHour(external_rain_probability_next_hour);
      setNextHour(next_hour);
      setInternalHumidy(formattedInternalHumidity);
      setExternalHumidy(external_humidity);
      setIdIcon({ id: external_id_weather, icon: external_icon_weather });
      setExternalDescription(external_description_weather);
      setExternalWindSpeed(formattedWindSpeed);
      setExternalTempMax(formattedExternalTempMax);
      setExternalTempMin(formattedExternalTempMin);

      //handleForecastData();
    } catch (error) {
      console.log("Error to get Temperature Data!", error);
    }
  }

  async function handleForecastData() {
    const forecast = await openweathermap();
    const {
      current: {
        temp,
        weather: [{ id, main, description, icon }],
      },
    } = forecast;
    const formattedTemp = temp.toFixed(1);
    setExternalTemperature(formattedTemp);
    setIdIcon(id);
  }

  async function handleBitcoinPrice() {
    const bitcoinPrice: number = await getBitcoinPrice();
    if (bitcoinPrice) {
      const formattedBitcoinPrice = Number(bitcoinPrice).toLocaleString(
        undefined,
        {
          maximumFractionDigits: 0,
        }
      );
      setBtcPrice(formattedBitcoinPrice);
    }
  }
  async function handleDollarPrice() {
    const dollarPrice: number = await getDollarPrice();
    if (dollarPrice) {
      const formattedDollarPrice = (
        Math.floor(dollarPrice * 100) / 100
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
      setDollarPrice(formattedDollarPrice);
    }
  }

  function onCloseSettingsModal() {
    setIsVisibleSettings(!isVisibleSettings);
  }

  async function loadSettings() {
    const settings = await getStoredData("settings");
    if (settings.settings) {
      setSettings(settings);
      return settings;
    }
  }

  function loadData() {
    geTemperature();
    getRaspberryTemperature();
    handleBitcoinPrice();
    handleDollarPrice();
  }

  useEffect(() => {
    loadSettings().then((settings) => {
      setTextColor(settings?.settings?.color?.dayColor!);
    });
  }, [isVisibleSettings]);

  useEffect(() => {
    loadSettings();
    loadData();
    const fiveSecInvervalID = setInterval(() => {
      loadData();
      console.log("LOOP EXECUTED..............");
    }, 300000);

    return () => clearInterval(fiveSecInvervalID);
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SettingsModal
        visible={isVisibleSettings}
        onClose={onCloseSettingsModal}
      />

      <View style={styles.temperaturesContainer}>
        <View style={styles.internalDataContainer}>
          <View style={styles.temperatureContainer}>
            <MaterialCommunityIcons
              name="home-thermometer-outline"
              size={45}
              color={textColor}
            />
            <Text style={[styles.temperatureText, { color: textColor }]}>
              {internalTemperature}°
            </Text>
          </View>
          <View style={styles.humidityContainer}>
            <HumidityInside size={45} color={textColor} />
            <Text style={[styles.temperatureText, { color: textColor }]}>
              {internalHumidity}%
            </Text>
          </View>
        </View>

        <View style={styles.rainProbContainer}>
          <Ionicons name="umbrella-outline" size={45} color={textColor} />
          <Text style={[styles.rainProbText, { color: textColor }]}>
            {rainProb}%
          </Text>
        </View>

        <View
          style={[
            styles.rainProbContainer,
            {
              borderLeftWidth: 1,
              borderRightWidth: 1,
              paddingLeft: 5,
              paddingRight: 5,
              borderColor: "#FFF9",
            },
          ]}
        >
          <Text
            style={[styles.rainProbText, { fontSize: 35, color: textColor }]}
          >
            {nextHour}h
          </Text>
          <Text style={[styles.rainProbText, { color: textColor }]}>
            {rainyProbNextHour}%
          </Text>
        </View>
        <View style={styles.windContainer}>
          <MaterialCommunityIcons
            name="weather-windy"
            size={45}
            color={textColor}
          />
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text
              style={[
                styles.windText,
                {
                  color: textColor,
                  fontSize: 40,
                },
              ]}
            >
              {externalWindSpeed}
            </Text>

            <Text
              style={[
                styles.windText,
                {
                  color: textColor,
                  fontWeight: "bold",
                  transform: [{ rotate: "270deg" }],
                  alignSelf: "center",
                  marginLeft: -5,
                },
              ]}
            >
              km/h
            </Text>
          </View>
        </View>

        <View style={styles.externalDataContainer}>
          <View style={styles.humidityContainer}>
            <Humidity size={45} color={textColor} />
            <Text style={[styles.temperatureText, { color: textColor }]}>
              {externalHumidity}%
            </Text>
          </View>

          <View style={styles.temperatureContainer}>
            <ExternalTempIcon idIcon={idIcon} size={45} color={textColor} />

            <Text style={[styles.temperatureText, { color: textColor }]}>
              {externalTemperature}°
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.dateContainer}>
          <Text style={[styles.dateText, { color: textColor }]}>
            {new Intl.DateTimeFormat(undefined, {
              //dateStyle: "full",
              day: "2-digit",
              weekday: "short",
              month: "short",
              year: "numeric",
              //timeStyle: "short",
              //timeZone: "America/Sao_Paulo",
            }).format(new Date())}
          </Text>
          <Text style={{ color: textColor, fontSize: 25 }}>{" - "}</Text>
          <Text style={[styles.dateText, { color: textColor }]}>
            {externalDescription}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={onCloseSettingsModal}>
            <Time
              textColor={textColor}
              updateSettings={isVisibleSettings}
              changeColor={(color) => {
                setTextColor(color);
              }}
            />
          </Pressable>
          <View style={styles.minMaxContainer}>
            <Text style={[styles.tempMinMaxtext, { color: textColor }]}>
              {externalTempMax}°
            </Text>
            <Text style={[styles.tempMinMaxtext, { color: textColor }]}>
              {externalTempMin}°
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Fontisto name="raspberry-pi" size={40} color="#E30B5C" />
          <FontAwesome6 name="temperature-half" size={40} color={textColor} />
          <Text style={[styles.raspberryTempText, { color: textColor }]}>
            {raspberryTemperature}°
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome name="bitcoin" size={40} color={"#F7931A"} />
          <Text
            style={[
              styles.btcPriceText,
              {
                color: textColor,
              },
            ]}
          >
            ${btcPrice}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome name="dollar" size={40} color={"#00be19"} />
          <Text
            style={[
              styles.dollarPriceText,
              {
                color: textColor,
              },
            ]}
          >
            {dollarPrice}
          </Text>
        </View>

        <View style={{ alignSelf: "flex-end" }}>
          <MaterialCommunityIcons
            name={netInfo.isConnected ? "wifi" : "wifi-off"}
            size={45}
            color={netInfo.isConnected ? "#00ac17" : "red"}
          />
        </View>
        {/* <Button
          title="Test"
          onPress={async () => {
            const dataStored = await getStoredData("settings");
            console.log("BUTTON============", dataStored);
          }}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  internalDataContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "blue",
  },
  externalDataContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  rainProbContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
  },
  windContainer: {
    alignItems: "center",
    //backgroundColor: "red",
  },
  temperatureContainer: {
    alignItems: "center",
  },
  humidityContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: "#FFF9",
    borderLeftWidth: 1,
    borderLeftColor: "#FFF9",
  },
  temperaturesContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "red",
  },
  timeText: {
    fontSize: 150,
    fontFamily: "Digital-7-mono",
    color: "#08fdf1",
    marginTop: 5,
  },
  dateText: {
    color: "#08fdf1",
    fontSize: 30,
    marginTop: 5,
    fontWeight: "bold",
  },
  temperatureText: {
    fontSize: 40,
    color: "#08fdf1",
  },
  rainProbText: {
    fontSize: 40,
    color: "#08fdf1",
  },
  windText: {
    fontSize: 15,
    color: "#08fdf1",
  },
  tempMinMaxtext: {
    fontSize: 30,
  },
  raspberryTempText: {
    color: "#08fdf1",
    fontSize: 40,
    alignSelf: "flex-end",
    marginLeft: 5,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  timeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  minMaxContainer: {
    flexDirection: "column",
    paddingLeft: 30,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 30,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  footerContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btcPriceText: {
    fontSize: 40,
    marginLeft: 5,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  dollarPriceText: {
    fontSize: 40,
    marginLeft: 5,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
});
