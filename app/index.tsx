import {
  View,
  Text,
  StatusBar,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { theme } from "../theme";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { useState } from "react";
import { ScrollView } from "react-native";
import { debounce } from "lodash";
import { useCallback } from "react";
import { fetchLocations } from "@/api/weather";

export default function Index() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);


  const handleLocations = (loc) => {
    console.log("location", loc);
  };

  const handleSearch= value=>{
    if(value.length>2){
      fetchLocations({cityName:value}).then(data=>{
      setLocations(data);
      })
    }
  }

    const handleTextDebounce= useCallback(debounce(handleSearch, 1200), [])

  return (
    <View className="flex-1 relative">
      <StatusBar barStyle="light-content" />
      <Image
        blurRadius={50}
        source={require("@/src/assets/images/Background.png")}
        className="absolute w-full h-full"
      />
      <SafeAreaView className="flex flex-1">
        <View style={{ height: "10%" }} className="mx-4 relative z-50">
          <View
            className="flex-row justify-end items-center rounded-full mt-7"
            style={{
              backgroundColor: showSearch ? theme.bgWhite(0.2) : "transparent",
            }}
          >
            {showSearch ? (
              <TextInput
              onChangeText={handleTextDebounce}
                placeholder="Search City"
                placeholderTextColor={"black"}
                className=" pl-6 h-10 pb-1 flex-1 text-base  text-white"
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
            <View className="relative bg-gray-300  top-2 rounded-3xl  ">
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
                    <Text>{loc?.name}, {loc?.country}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
        {/*forecast section*/}
        <View className="mx-4 flex justify-around flex-1 mb-2">
          {/* location */}
          <Text className="text-white text-center text-2xl font-bold">
            London,
            <Text className="text-lg font-semibold text-gray-300">
              United Kingdom
            </Text>
          </Text>
          {/* weather image */}
          <View className="flex-row justify-center ">
            <Image
              source={require("@/src/assets/images/partlycloudy.png")}
              className="w-52 h-52"
            />
          </View>
          {/* degree celcius */}
          <View className="space-y-2">
            <Text className="text-white text-center text-6xl font-bold ml-5">
              18°
            </Text>
            <Text className="text-center text-white text-xl tracking-widest">
              Partly Cloudy
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
                {" "}
                22 Km/hr
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("@/src/assets/images/newDrop.png")}
                className="w-6 h-6 bg-inherit"
              />
              <Text className="text-white text-base font-semibold"> 22 %</Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("@/src/assets/images/sun.png")}
                className="w-6 h-6"
              />
              <Text className="text-white text-base font-semibold">
                {" "}
                6:05 AM
              </Text>
            </View>
          </View>
        </View>

        {/* forecast for next days */}
        <View className="mb-2 space-y-3">
          <View className="flex-row items-center mx-5 space-x-2">
            <CalendarDaysIcon size={22} color={"white"} />
            <Text className="text-white text-base"> Daily Forecast</Text>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsHorizontalScrollIndicator={false}
          >
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("@/src/assets/images/heavyrain.png")}
                className="w-11 h-11"
              />
              <Text className="text-white ">Monday</Text>
              <Text className="text-white text-xl font-semibold">20°</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("@/src/assets/images/heavyrain.png")}
                className="w-11 h-11"
              />
              <Text className="text-white ">Tuesday</Text>
              <Text className="text-white text-xl font-semibold">21°</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("@/src/assets/images/heavyrain.png")}
                className="w-11 h-11"
              />
              <Text className="text-white ">Wednesday</Text>
              <Text className="text-white text-xl font-semibold">19°</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("@/src/assets/images/heavyrain.png")}
                className="w-11 h-11"
              />
              <Text className="text-white ">Thursday</Text>
              <Text className="text-white text-xl font-semibold">22°</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("@/src/assets/images/heavyrain.png")}
                className="w-11 h-11"
              />
              <Text className="text-white ">Friday</Text>
              <Text className="text-white text-xl font-semibold">21°</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("@/src/assets/images/heavyrain.png")}
                className="w-11 h-11"
              />
              <Text className="text-white ">Saturday</Text>
              <Text className="text-white text-xl font-semibold">18°</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("@/src/assets/images/heavyrain.png")}
                className="w-11 h-11"
              />
              <Text className="text-white ">Sunday</Text>
              <Text className="text-white text-xl font-semibold">19°</Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
