import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

var { height, width } = Dimensions.get("window");

export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoOpacity: new Animated.Value(0),
      titleMarginTop: new Animated.Value(height / 2),
      time: new Animated.Value(0),
    };
  }
  // state = {
  //   logoOpacity: new Animated.Value(0),
  //   titleMarginTop: new Animated.Value(height / 2),
  //   time: new Animated.Value(0),
  // };
  componentDidMount() {
    Animated.sequence([
      Animated.timing(this.state.logoOpacity, {
        toValue: 1,
        duration: 2000,
      }),
      Animated.timing(this.state.titleMarginTop, {
        toValue: 10,
        duration: 2000,
      }),
      Animated.timing(this.state.time, {
        toValue: 100,
        duration: 2000,
      }),
    ]).start(() => {
      this.props.navigation.navigate("login");
    });
  }
  render() {
    return (
      <View
        style={styles.container}
      >
        <Animated.Image
          source={require("./image/grab.png")}
          style={{
            ...styles.logo,
            opacity: this.state.logoOpacity,
          }}
        ></Animated.Image>

        <Animated.Text
          style={{ ...styles.title, marginTop: this.state.titleMarginTop }}
        >
          Foodbooking
        </Animated.Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
  },
  logo: {
    width: 130,
    height: 130,
  },
  title: {
    color: "blue",
    marginTop: 10,
    textAlign: "center",
    width: 400,
    fontSize: 25,
  },
});
