import React, { Component } from "react";
import { Text, View, Dimensions } from "react-native";
const IS_ANDROID = Platform.OS == "android";
const IS_IOS = Platform.OS == "ios";

var { height, width } = Dimensions.get("window");
export const URL_API = "http://192.168.1.78:8080";
export const GOOGLE_MAPS_APIKEY = 'AIzaSyCMkBU6QM6jEnGGBItURq2xXw-c_YUhuao';

export const addressSocket = "http://192.168.1.78:3000";
export default class Header extends Component {
  render() {
    return (
      <View>
        {IS_ANDROID ? (
          <View
            style={{ height: 18, width: width, backgroundColor: "black" }}
          ></View>
        ) : (
          <View style={{ height: 18, width: width }}></View>
        )}
      </View>
    );
  }
}
