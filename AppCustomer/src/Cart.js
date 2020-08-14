import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AsyncStorage } from "react-native";
import Header from "./Header";
import { URL_API } from "./Header";

import Icon from "react-native-vector-icons/Ionicons";
import DropdownAlert from "react-native-dropdownalert";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { GOOGLE_MAPS_APIKEY } from "./Header";
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete";
import {ketnoi} from "./Login";

var { width } = Dimensions.get("window");

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.socket = ketnoi;
    this.state = {
      // TODO : Display data cart
      dataCart: [],
      // TODO : list item in cart
      listItem: [],
      // TODO : Data confirm checkout
      _idUser: "",
      user: {},

      name: "",
      phone: "",
      address: "",
      myaddress: "",
      latitude: 0,
      longitude: 0,
      // TODO : Error message
      errorName: "",
      errorPhone: "",
      errorAddress: "",
      // TODO : Support process
      totalCost: 0,
      screen: 1,
      isEmptyCart: true,
    };
  }

  getGeocodeAsync = async (location) => {
    let geocodec = await Location.reverseGeocodeAsync(location);
    console.log(geocodec);
    let vitri =
      geocodec[0].name +
      ", " +
      geocodec[0].street +
      ", " +
      geocodec[0].city +
      ", " +
      geocodec[0].region +
      ", " +
      geocodec[0].country;
    console.log(vitri);
    this.setState({ address: vitri });
  };
  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      alert("Permission to access location was denied");
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    const { latitude, longitude } = location.coords;
    this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    this.getGeocodeAsync({ latitude, longitude });
    console.log(this.state.geocode);
  };
  componentDidMount() {
    this.getLocationAsync();
    // TODO : ============================================================== <User Process>
    AsyncStorage.getItem("User")
      .then((user) => {
        if (user !== null) {
          // We have data!!
          const userdata = JSON.parse(user);
          // TODO : Fetch Data User From DataBase
          fetch(URL_API + "/api/access/user/" + userdata._id)
            .then((response) => response.json())
            .then((responseJson) => {
              // TODO: State zone
              this.setState({
                _idUser: userdata._id,
                user: responseJson.data,
                // TODO : field display
                name: responseJson.data.name,
                phone: responseJson.data.phone,
                myaddress: responseJson.data.address,

                isLoading: false,
              });
            })
            .catch((error) => {
              console.log(error);
            });
          console.log(this.state.userData);
        }
      })
      .catch((err) => {
        alert(err);
      });
    this._getCart();
  }
  _getCart() {
    // TODO : ============================================================== <Cart Process>
    AsyncStorage.getItem("cart")
      .then((cart) => {
        if (cart !== null) {
          const cartfood = JSON.parse(cart);
          console.log(cartfood);
          this.setState({
            dataCart: cartfood,
          });

          console.log(
            "=========================== CART ASYNC STORAGE ========================="
          );
          console.log(cartfood);
          console.log(
            "=========================== CART ASYNC STORAGE ========================="
          );

          cartfood.map((element) => {
            var item = {
              idFood: element.food._id,
              quantity: element.quantity,
            };
            this.state.listItem.push(item);
          });

          console.log(
            "=========================== CART PAYLOAD DATA ==========================="
          );
          console.log(this.state.listItem);
          console.log(
            "=========================== CART PAYLOAD DATA ==========================="
          );

          this.state.isEmptyCart = false;
        } else {
          this.state.isEmptyCart = true;
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
  // TODO : =========================================================== METHOD
  onChangeQual(i, type) {
    const dataCar = this.state.dataCart;
    let cantd = dataCar[i].quantity;

    if (type) {
      // true
      dataCar[i].quantity = cantd + 1;
    } else if (type == false && cantd >= 2) {
      dataCar[i].quantity = cantd - 1;
    } else if (type == false && cantd == 1) {
      dataCar.splice(i, 1);
    }

    this.setState({ dataCart: dataCar });

    // Check is empty cart
    if (dataCar.length > 0) {
      this.state.isEmptyCart = false;
    } else {
      this.state.isEmptyCart = true;
    }

    AsyncStorage.setItem("cart", JSON.stringify(dataCar));
  }

  _checkOut() {
    var tong = 0;
    this.state.dataCart.forEach(function (i) {
      tong += i.price * i.quantity;
    });

    if (tong > 0) {
      this.setState({
        screen: 0,
        totalCost: tong,
      });
    } else {
      this.dropDownAlertRef.alertWithType(
        "warnwarn",
        "Checkout invalid",
        "Cart is empty"
      );
    }
  }
  _Cart() {
    this.componentDidMount();
    this.setState({
      screen: 1,
    });
  }
  _confirmPayment() {
    this.setState({
      errorName: "",
      errorPhone: "",
      errorAddress: "",
    });
    // if (
    //   this.state.name.trim().length < 6 ||
    //   this.state.name.trim().length > 50
    // ) {
    //   this.setState({ errorName: "*Tên phải từ 6 - 50 ký tự*" });
    // } else if (
    //   this.state.phone.trim().length < 6 ||
    //   this.state.phone.trim().length > 20
    // ) {
    //   this.setState({ errorPhone: "*Số điện thoại phải từ 6 - 20 ký tự*" });
    // } else if (isNaN(this.state.phone)) {
    //   this.setState({ errorPhone: "*Số điện thoại không hợp lệ*" });
    // } else if (
    //   this.state.address.trim().length < 6 ||
    //   this.state.address.trim().length > 50
    // ) {
    //   this.setState({ errorAddress: "*địa chỉ phải từ 6 - 50 ký tự*" });
    // } else {
    fetch(URL_API + "/api/access/order:create", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        userId: this.state._idUser,
        itemFoods: this.state.listItem,
        totalCost: this.state.totalCost,
        address: this.state.address,
        phone: this.state.phone,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        agentId: "",
        status: 0,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        AsyncStorage.removeItem("cart");
        this._getCart();
        this.setState({
          screen: 2,
        });
        let dataOrder = {
          userId: this.state._idUser,
          itemFoods: this.state.listItem,
          totalCost: this.state.totalCost,
          address: this.state.address,
          phone: this.state.phone,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          agentId: "",
          status: 0,
        };
        this.socket.emit("user-order", dataOrder);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .done();
    // }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <View style={styles.container}>
          <View>
            <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
          </View>

          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {this.state.screen == 1 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ height: 20 }} />
                <Text
                  style={{
                    fontSize: 32,
                    paddingTop: 25,
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Cart
                </Text>
                <View style={{ height: 10 }} />

                <View style={{ flex: 1 }}>
                  <ScrollView>
                    {this.state.dataCart.map((item, i) => {
                      return (
                        <View
                          style={{
                            width: width - 20,
                            margin: 10,
                            backgroundColor: "transparent",
                            flexDirection: "row",
                            borderBottomWidth: 2,
                            borderColor: "#cccccc",
                            paddingBottom: 10,
                          }}
                        >
                          <Image
                            resizeMode={"contain"}
                            style={{ width: width / 3, height: width / 3 }}
                            source={{ uri: item.food.pathImage }}
                          />
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: "trangraysparent",
                              padding: 10,
                              justifyContent: "space-between",
                            }}
                          >
                            <View>
                              <Text
                                style={{ fontWeight: "bold", fontSize: 20 }}
                              >
                                {item.food.name}
                              </Text>
                              <Text>{item.food.description}</Text>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={{
                                  fontWeight: "bold",
                                  color: "#282f7d",
                                  fontSize: 20,
                                }}
                              >
                                ${item.price * item.quantity}
                              </Text>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() => this.onChangeQual(i, false)}
                                >
                                  <Icon
                                    name="ios-remove-circle"
                                    size={35}
                                    color={"#33c37d"}
                                  />
                                </TouchableOpacity>
                                <Text
                                  style={{
                                    paddingHorizontal: 8,
                                    fontWeight: "bold",
                                    fontSize: 18,
                                  }}
                                >
                                  {item.quantity}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => this.onChangeQual(i, true)}
                                >
                                  <Icon
                                    name="ios-add-circle"
                                    size={35}
                                    color={"#33c37d"}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}

                    <View style={{ height: 10 }} />
                    {/* {buttonCheckout} */}
                    <TouchableOpacity
                      onPress={() => this._checkOut()}
                      style={{
                        backgroundColor: "#33c37d",
                        width: width - 40,
                        alignItems: "center",
                        padding: 10,
                        borderRadius: 2,
                        margin: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        Check Out
                      </Text>
                    </TouchableOpacity>
                    <View style={{ height: 10 }} />
                  </ScrollView>
                </View>
              </View>
            ) : this.state.screen == 0 ? (
              <View style={{ ...styles.container, paddingTop: 0 }}>
                <TouchableOpacity
                  style={{ ...styles.buttonBack, flex: 1 }}
                  onPress={() => this._Cart()}
                >
                  <Icon name="md-arrow-back" size={25} color={"#333"} />
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 1,
                    // paddingTop: 20,
                    textAlign: "center",
                    alignItems: "center",
                    fontSize: 25,
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Comfirm Info Checkout
                </Text>
                {/* <View style={styles.inputcomponent}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.label}>Name: </Text>
                    <Text style={styles.textError}>{this.state.errorName}</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    onChangeText={(text) => this.setState({ name: text })}
                    value={this.state.name}
                    onSubmitEditing={() => {
                      this.secondTextInput.focus();
                    }}
                    // blurOnSubmit={false}
                  ></TextInput>
                </View> */}
                {/* <View style={styles.inputcomponent}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.label}>Phone: </Text>
                    <Text style={styles.textError}>
                      {this.state.errorPhone}
                    </Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your phone"
                    onChangeText={(text) => this.setState({ phone: text })}
                    value={this.state.phone}
                    ref={(input) => {
                      this.secondTextInput = input;
                    }}
                    onSubmitEditing={() => {
                      this.thirdTextInput.focus();
                    }}
                    // blurOnSubmit={false}
                  ></TextInput>
                </View>
                <View style={styles.inputcomponent}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.label}>Address: </Text>
                    <Text style={styles.textError}>
                      {this.state.errorAddress}
                    </Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your address"
                    onChangeText={(text) => this.setState({ address: text })}
                    value={this.state.address}
                    ref={(input) => {
                      this.thirdTextInput = input;
                    }}
                  ></TextInput>
                </View> */}
                <View style={{ flex: 8, justifyContent: "space-between" }}>
                  <View
                    style={{
                      // flex: 1,
                      zIndex: 1,
                      position: "relative",
                      // justifyContent: 'center',
                      height: 280,
                      width: width,
                      backgroundColor: "#D7DBDD",
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.label}>Address: </Text>
                      <Text style={styles.textError}>
                        {this.state.errorAddress}
                      </Text>
                    </View>
                    <View style={{ height: 300, zIndex: 2, wigth: width }}>
                      <GooglePlacesAutocomplete
                        placeholder="Enter Location"
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={"default"}
                        fetchDetails={true}
                        styles={{
                          textInputContainer: {
                            backgroundColor: "rgba(0,0,0,0)",

                            // backgroundColor: '#000',
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                          },
                          textInput: {
                            backgroundColor: "#fff",
                            marginLeft: 10,
                            marginRight: -3,
                            width: width,
                            height: 45,
                            color: "#5d5d5d",
                            fontSize: 16,
                          },
                          predefinedPlacesDescription: {
                            backgroundColor: "#000",
                            color: "#1faadb",
                          },
                        }}
                        onPress={(data, details = null) => {
                          this.setState({
                            address: data.description,
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                          });
                          console.log("hihi");
                          console.log(data.description);
                          console.log(details.geometry.location);
                        }}
                        query={{
                          key: GOOGLE_MAPS_APIKEY,
                          language: "vi",
                        }}
                      />
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        zIndex: 1,
                        // backgroundColor: "blue",
                        heigth: 280,
                        justifyContent: "center",
                        top: 75,
                      }}
                    >
                      {/* <Text>nghĩa nè</Text> */}
                      <View style={styles.inputcomponent}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.label}>Phone: </Text>
                          <Text style={styles.textError}>
                            {this.state.errorPhone}
                          </Text>
                        </View>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your phone"
                          onChangeText={(text) =>
                            this.setState({ phone: text })
                          }
                          value={this.state.phone}
                          ref={(input) => {
                            this.secondTextInput = input;
                          }}
                          onSubmitEditing={() => {
                            this.thirdTextInput.focus();
                          }}
                          // blurOnSubmit={false}
                        ></TextInput>
                      </View>
                    </View>
                  </View>
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 30,
                      textAlign: "center",
                      color: "#1F618D",
                    }}
                  >
                    Total Payment: ${this.state.totalCost}
                  </Text>
                  <TouchableOpacity
                    onPress={() => this._confirmPayment()}
                    style={{
                      backgroundColor: "#1cbd9a",
                      width: width - 40,
                      marginLeft: 20,
                      justifyContent: "center",
                      textAlign: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 10,
                      marginBottom: 20,
                    }}
                  >
                    <Text
                      style={{ marginLeft: 10, fontSize: 20, color: "#333" }}
                    >
                      Place Order
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ justifyContent: "center" }}>
                <Text style={{ fontSize: 20 }}>
                  Đặt hàng thành công, vui lòng chờ...
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({ screen: 1 })}
                  style={{
                    backgroundColor: "#c8fadb",
                    width: width - 40,
                    justifyContent: "center",
                    textAlign: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    padding: 5,
                  }}
                >
                  <Text
                    style={{ marginLeft: 10, fontSize: 30, color: "#344038" }}
                  >
                    Order Food Successfully
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    width: width,
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#D7DBDD",
  },

  buttonBack: {
    justifyContent: "center",
    flexDirection: "row",
    // margin: 15,
    width: 50,
    // backgroundColor: "#2471A3",
    // paddingTop: 10,
    borderRadius: 2,
  },

  cart: {
    justifyContent: "center",
    flexDirection: "row",
    marginLeft: 10,
    width: 100,
    backgroundColor: "#ffff99",
    padding: 7,
    borderRadius: 5,
  },
  label: {
    marginLeft: 10,
    fontSize: 20,
    justifyContent: "center",
  },
  input: {
    marginLeft: 10,
    marginRight: 10,
    width: width - 20,
    padding: 10,
    height: 45,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
  },
  textError: {
    marginLeft: 10,
    color: "red",
    fontStyle: "italic",
  },
});
