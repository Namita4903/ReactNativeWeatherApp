import { fetchLocations, fetchWeatherForecast } from "@/api/weather";
import { weatherImages } from "@/constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import * as Progress from "react-native-progress";
import { theme } from "../theme";

export default function Index() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const storeLastLocation = async (cityName) => {
    try {
      await AsyncStorage.setItem('lastLocation', cityName);
      console.log('Stored location:', cityName);
    } catch (error) {
      console.log('Error storing location:', error);
    }
  };

  const getLastLocation = async () => {
    try {
      const location = await AsyncStorage.getItem('lastLocation');
      console.log('Retrieved stored location:', location);
      return location;
    } catch (error) {
      console.log('Error getting stored location:', error);
      return null;
    }
  };

  const fetchWeatherByLocation = async (latitude, longitude) => {
    try {
      console.log('Fetching weather for:', latitude, longitude);
      const data = await fetchWeatherForecast({
        cityName: `${latitude},${longitude}`,
        days: 7
      });
      console.log('Weather data received:', data ? 'yes' : 'no');
      if (data) {
        setWeather(data);
        // Store the location name when we get weather data
        if (data.location?.name) {
          storeLastLocation(data.location.name);
        }
        setLoading(false);
      } else {
        console.log('No weather data received');
        fetchLastLocationWeather();
      }
    } catch (error) {
      console.log('Error fetching weather by location:', error);
      fetchLastLocationWeather();
    }
  };

  const fetchLastLocationWeather = async () => {
    try {
      const lastLocation = await getLastLocation();
      if (lastLocation) {
        console.log('Fetching weather for last location:', lastLocation);
        const data = await fetchWeatherForecast({
          cityName: lastLocation,
          days: 7
        });
        setWeather(data);
      } else {
        console.log('No stored location, fetching default city weather');
        fetchDefaultCityWeather();
      }
    } catch (error) {
      console.log('Error fetching last location weather:', error);
      fetchDefaultCityWeather();
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultCityWeather = async () => {
    try {
      console.log('Fetching default city weather');
      const data = await fetchWeatherForecast({
        cityName: "Islamabad",
        days: 7
      });
      setWeather(data);
      if (data?.location?.name) {
        storeLastLocation(data.location.name);
      }
    } catch (error) {
      console.log('Error fetching default weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      // First check the current permission status
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'denied') {
        // If permission was previously denied, show an alert explaining why we need location
        Alert.alert(
          'Location Permission Required',
          'We need your location to show accurate weather information. Would you like to enable location access?',
          [
            {
              text: 'No Thanks',
              onPress: () => fetchLastLocationWeather(),
              style: 'cancel'
            },
            {
              text: 'Open Settings',
              onPress: async () => {
                // Open device settings based on platform
                if (Platform.OS === 'ios') {
                  await Linking.openURL('app-settings:');
                } else {
                  await Linking.openSettings();
                }
                fetchLastLocationWeather(); // Show last location while user might change settings
              }
            }
          ]
        );
        return;
      }

      // Request permission if not denied
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        await fetchWeatherByLocation(
          location.coords.latitude,
          location.coords.longitude
        );
      } else {
        Alert.alert(
          'Location Access Denied',
          'Showing weather for your last searched location',
          [{ text: 'OK' }]
        );
        await fetchLastLocationWeather();
      }
    } catch (error) {
      console.log('Error in location permission:', error);
      await fetchLastLocationWeather();
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const handleLocations = (loc) => {
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: 7,
    }).then((data) => {
      setWeather(data);
      // Store the location when user manually searches
      storeLastLocation(loc.name);
      setLoading(false);
    });
  };

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const { current, location } = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar barStyle="light-content" />
      <Image
        blurRadius={50}
        source={require("@/src/assets/images/Background.png")}
        className="absolute w-full h-full"
      />
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={15} size={140} color={"white"} />
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          {/* search section */}
          <View style={{ height: "10%" }} className="mx-4 relative z-50">
            <View
              className="flex-row justify-end items-center rounded-full mt-7"
              style={{
                backgroundColor: showSearch
                  ? theme.bgWhite(0.2)
                  : "transparent",
              }}
            >
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search City"
                  placeholderTextColor={"black"}
                  className="pl-6 h-10 pb-1 flex-1 text-base text-black"
                />
              ) : null}

              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                style={{ backgroundColor: theme.bgWhite(0.3) }}
                className="rounded-full p-3 m-1"
              >
                <MagnifyingGlassIcon size={25} color={"white"} />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View className="relative bg-gray-300 top-2 rounded-3xl">
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocations(loc)}
                      key={index}
                      className={
                        "flex-row items-center border-0 p-3 px-4 mb-1 " +
                        borderClass
                      }
                    >
                      <MapPinIcon size={20} color={"black"} />
                      <Text>
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* forecast section */}
          <View className="mx-4 flex justify-around flex-1 mb-2">
            {/* location */}
            <Text className="text-white text-center text-2xl font-bold">
              {location?.name},
              <Text className="text-lg font-semibold text-gray-300">
                {" " + location?.country}
              </Text>
            </Text>
            {/* weather image */}
            <View className="flex-row justify-center">
              {console.log("current condition text", current?.condition?.text)}
              <Image
                source={
                  weatherImages[current?.condition?.text] ||
                  weatherImages.other()
                }
                className="w-52 h-52"
              />
            </View>
            {/* degree celsius */}
            <View className="space-y-2">
              <Text className="text-white text-center text-6xl font-bold ml-5">
                {current?.temp_c}°
              </Text>
              <Text className="text-center text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            {/* other stats */}
            <View className="flex-row justify-between mx-4">
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("@/src/assets/images/wind.png")}
                  className="w-6 h-6"
                />
                <Text className="text-white text-base font-semibold">
                  {current?.wind_kph} km/h
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("@/src/assets/images/newDrop.png")}
                  className="w-6 h-6 bg-inherit"
                />
                <Text className="text-white text-base font-semibold">
                  {current?.humidity}%
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("@/src/assets/images/sun.png")}
                  className="w-6 h-6"
                />
                <Text className="text-white text-base font-semibold">
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>

          {/* forecast for next days */}
          <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size={22} color={"white"} />
              <Text className="text-white text-base">Daily Forecast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.map((item, index) => {
                let date = new Date(item.date);
                let options = {
                  weekday: "long",
                };
                let dayName = date.toLocaleDateString("en-US", options);
                dayName = dayName.split(",")[0];

                console.log("day image text", item?.day?.condition?.text);
                console.log(
                  "image exists?",
                  !!weatherImages[item?.day?.condition?.text]
                );

                return (
                  <View
                    key={index}
                    className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                    style={{ backgroundColor: theme.bgWhite(0.15) }}
                  >
                    <Image
                      source={
                        weatherImages[item?.day?.condition?.text] ||
                        weatherImages["other"]
                      }
                      className="w-11 h-11"
                    />
                    <Text className="text-white">{dayName}</Text>
                    <Text className="text-white text-xl font-semibold">
                      {item?.day?.avgtemp_c}°
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
