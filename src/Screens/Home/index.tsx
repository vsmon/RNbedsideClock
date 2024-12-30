import { useEffect, useState } from "react";
import {
  Button,
  PermissionsAndroid,
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

import { Image } from "expo-image";

import { mainColor, secondColor } from "../../constants/colors";
import * as Brightness from "expo-brightness";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useNetInfo } from "@react-native-community/netinfo";

import DisplayOff from "../../components/DisplayOff";
import Humidity from "../../components/Humidity";
import HumidityInside from "../../components/HumidityInside";
import openweathermap from "../../api/openweathermap";
import ExternalTempIcon from "../../components/ExternalTempIcon";
import getBitcoinPrice from "../../api/bitcoinPrice";
import getDollarPrice from "../../api/dollarPrice";

const TOKEN_RASPBERRY = process.env.TOKEN_RASPBERRY;

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [time, setTime] = useState<string>("");
  const [internalTemperature, setInternalTemperature] = useState<string>("0");
  const [externalTemperature, setExternalTemperature] = useState<string>("0");
  const [tunoffDisplay, setTurnoffDisplay] = useState<boolean>(false);
  const [rainyProb, setRainyProb] = useState<string>("0");
  const [rainyProbNextHour, setRainyProbNextHour] = useState<string>("0");
  const [nextHour, setNextHour] = useState<string>("0");
  const [internalHumidity, setInternalHumidy] = useState<string>("0");
  const [externalHumidity, setExternalHumidy] = useState<string>("0");
  const [raspberryTemperature, setRaspberryTemperature] = useState<string>("0");
  const [idIcon, setIdIcon] = useState<{ id: number; icon: string }>({
    id: 800,
    icon: "01d",
  });
  const [externalDescription, setExternalDescription] = useState<string>("");
  const [btcPrice, setBtcPrice] = useState<string>("0");
  const [dollarPrice, setDollarPrice] = useState<string>("0");

  const [loaded, error] = useFonts({
    "Digital-7": require("../../../assets/fonts/digital-7.ttf"),
    "Digital-7-mono": require("../../../assets/fonts/digital-7-mono.ttf"),
  });

  const netInfo = useNetInfo();

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

  function Time() {
    setInterval(() => {
      setTime(new Date().toLocaleTimeString());

      if (new Date().toLocaleTimeString() === "01:00:00") {
        //setTurnoffDisplay(true);
        setBrightness(0);
      }
      if (new Date().toLocaleTimeString() === "07:00:00") {
        //setTurnoffDisplay(false);
        setBrightnessAutomatic();
      }
    }, 1000);

    setInterval(() => {
      geTemperature();
      getRaspberryTemperature();
      handleBitcoinPrice();
      handleDollarPrice();
      console.log(
        `${new Date().toLocaleString()} - Loop executed.............`
      );
    }, 300000);
  }
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
      } = json;

      const formattedInternalTemperature: string = temperature.toFixed(1);
      const formattedExternalTemperature: string =
        external_temperature.toFixed(1);
      const formattedInternalHumidity: string = humidity.toFixed(0);

      setInternalTemperature(formattedInternalTemperature);
      setExternalTemperature(formattedExternalTemperature);
      setRainyProb(external_rain_probability);
      setRainyProbNextHour(external_rain_probability_next_hour);
      setNextHour(next_hour);
      setInternalHumidy(formattedInternalHumidity);
      setExternalHumidy(external_humidity);
      setIdIcon({ id: external_id_weather, icon: external_icon_weather });
      setExternalDescription(external_description_weather);

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

  async function requestWriteSettingsPermissoin() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_SETTINGS
        /* {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        } */
      );
      console.log(granted);
    } catch (error) {
      console.log("Error request Permission", error);
    }
  }

  useEffect(() => {
    setBrightnessAutomatic();
    Time();
    geTemperature();
    getRaspberryTemperature();
    handleBitcoinPrice();
    handleDollarPrice();
    //requestWriteSettingsPermissoin();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return tunoffDisplay ? (
    <DisplayOff />
  ) : (
    <View style={styles.container}>
      <View style={styles.temperaturesContainer}>
        <View style={styles.internalDataContainer}>
          <View style={styles.temperatureContainer}>
            <MaterialCommunityIcons
              name="home-thermometer-outline"
              size={45}
              color="#08fdf1"
            />
            <Text style={styles.temperatureText}>{internalTemperature}°</Text>
          </View>

          <View style={styles.humidityContainer}>
            <HumidityInside size={45} />
            <Text style={styles.temperatureText}>{internalHumidity}%</Text>
          </View>
        </View>

        <View style={styles.rainyProbContainer}>
          <Ionicons name="umbrella-outline" size={45} color="#08fdf1" />
          <Text style={styles.rainyProbText}>{rainyProb}%</Text>
        </View>

        <View style={styles.rainyProbContainer}>
          <Text style={[styles.rainyProbText, { fontSize: 35 }]}>
            {nextHour}h
          </Text>
          <Text style={styles.rainyProbText}>{rainyProbNextHour}%</Text>
        </View>

        <View style={styles.externalDataContainer}>
          <View style={styles.humidityContainer}>
            <Humidity size={45} />
            <Text style={styles.temperatureText}>{externalHumidity}%</Text>
          </View>

          <View style={styles.temperatureContainer}>
            <ExternalTempIcon idIcon={idIcon} size={45} />

            <Text style={styles.temperatureText}>{externalTemperature}°</Text>
          </View>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
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
          <Text style={{ color: "#08fdf1", fontSize: 25 }}>{" - "}</Text>
          <Text style={styles.dateText}>{externalDescription}</Text>
        </View>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      <View style={styles.footerContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Fontisto name="raspberry-pi" size={40} color="#E30B5C" />
          <FontAwesome6 name="temperature-half" size={40} color="#08fdf1" />
          <Text style={styles.raspberryTempText}>{raspberryTemperature}°</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome name="bitcoin" size={40} color={"#F7931A"} />
          <Text
            style={{
              color: "#08fdf1",
              fontSize: 40,
              marginLeft: 5,
              fontFamily: "Roboto",
              fontWeight: "bold",
            }}
          >
            ${btcPrice}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome name="dollar" size={40} color={"#00be19"} />
          <Text
            style={{
              color: "#08fdf1",
              fontSize: 40,
              marginLeft: 5,
              fontFamily: "Roboto",
              fontWeight: "bold",
            }}
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
  },
  externalDataContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  rainyProbContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  temperatureContainer: {
    alignItems: "center",
  },
  humidityContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
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
  rainyProbText: {
    fontSize: 40,
    color: "#08fdf1",
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
    alignSelf: "stretch",
    //paddingBottom: 30,
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
});
