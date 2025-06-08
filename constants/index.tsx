export const apiKey = "f971f1d872764f7ba2d202716250706";

const partlycloudy = require("@/src/assets/images/partlycloudy.png");
const sun = require("@/src/assets/images/sun.png");
const cloud = require("@/src/assets/images/cloud.png");
const heavyrain = require("@/src/assets/images/heavyrain.png");
const mist = require("@/src/assets/images/mist.png");
const moderaterain = require("@/src/assets/images/moderaterain.png");

// For debugging
console.log("Image modules loaded:", {
  partlycloudy,
  sun,
  cloud,
  heavyrain,
  mist,
  moderaterain
});

export const weatherImages = {
    "Partly cloudy": partlycloudy,
    "Partly Cloudy": partlycloudy,
    "Sunny": sun,
    "Clear": sun,
    "Cloudy": cloud,
    "Rain": heavyrain,
    "Mist": mist,
    "Moderate rain": moderaterain,
    "Heavy rain": heavyrain,
    "Light rain": moderaterain,
    "Patchy rain nearby": moderaterain,
    "Overcast": cloud,
    "Moderate rain at times": moderaterain,
    "Heavy rain at times": heavyrain,
    "Moderate or heavy freezing rain": heavyrain,
    "Moderate or heavy rain shower": heavyrain,
    "Moderate or heavy rain with thunder": heavyrain,
    "other": moderaterain
}
