import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// TODO : Import Component
import Login from "./src/Login";
import Home from "./src/Home";
import Cart from "./src/Cart";
import Food from "./src/Food";
import Order from "./src/Order";
import Profile from "./src/Profile";
import Register from "./src/Register";
import Splash from "./src/Splash";
import GooglePlacesInput from "./src/PlacesAutocomplete";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

var { width } = Dimensions.get("window");
console.disableYellowBox = true;
export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="splash">
        
          <Stack.Screen
            style={{ backgroundColor: "black" }}
            name="splash"
            component={Splash}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            style={{ backgroundColor: "black" }}
            name="login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="map"
            component={GooglePlacesInput}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
