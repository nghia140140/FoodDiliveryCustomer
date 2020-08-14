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
import Order from "./Order";
import Cart from "./Cart";
import Food from "./Food";
import Profile from "./Profile";
import Header from "./Header";

import { AsyncStorage } from "react-native";
var { width } = Dimensions.get("window");
console.disableYellowBox = true;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      module: 1,
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.module == 1 ? (
          <Food />
        ) : this.state.module == 2 ? (
          <Cart />
        ) : this.state.module == 3 ? (
          <Order />
        ) : (
          <View style={{ flex: 1 }}>
            <Header />
            <Profile />
            <View style={{backgroundColor: "#fff"}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{
                  marginTop: 5,
                  backgroundColor: "#333",
                  height: 40,
                  width: width - 40,
                  marginLeft: 20,
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  padding: 5,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Icon name="md-power" size={30} color="red" />
                  <Text style={{ marginLeft: 10, fontSize: 25, color: "#fff" }}>
                    LOGOUT
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.bottomTab}>
          <TouchableOpacity
            style={styles.itemTab}
            onPress={() => this.setState({ module: 1 })}
          >
            <Icon
              name="md-restaurant"
              size={20}
              color={this.state.module == 1 ? "#1654b8" : "gray"}
            />
            <Text>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemTab}
            onPress={() => this.setState({ module: 2 })}
          >
            <Icon
              name="md-basket"
              size={20}
              color={this.state.module == 2 ? "#1654b8" : "gray"}
            />
            <Text>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemTab}
            onPress={() => this.setState({ module: 3 })}
          >
            <Icon
              name="md-locate"
              size={20}
              color={this.state.module == 3 ? "#1654b8" : "gray"}
            />
            <Text>Order History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemTab}
            onPress={() => this.setState({ module: 4 })}
          >
            <Icon
              name="md-contact"
              size={20}
              color={this.state.module == 4 ? "#1654b8" : "gray"}
            />
            <Text>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomTab: {
    height: 55,
    width: width,
    backgroundColor: "#c6cfc8",
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 50,
  },
  itemTab: {
    width: width / 4,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
