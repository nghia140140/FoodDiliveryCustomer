import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
} from "react-native";
import Header from "./Header";
import { URL_API } from "./Header";

import { AsyncStorage } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import ValidationComponent from "react-native-form-validator";
import { GOOGLE_MAPS_APIKEY } from "./Header";
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete";

// import GooglePlacesInput from "./PlacesAutocomplete";

var { height, width } = Dimensions.get("window");
export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true,
      nameIcon: "md-eye",
      name: "",
      email: "",
      password: "",
      confirm: "",
      phone: "",
      address: "",
      errorName: "",
      errorEmail: "",
      errorPassword: "",
      errorPhone: "",
      errorAddress: "",
      errorConfirm: "",
    };
  }

  getGeocodeAsync = async (location) => {
    let geocodec = await Location.reverseGeocodeAsync(location);

    console.log(geocodec);
    console.log(geocodec[0].city);
    this.setState({ geocode: geocodec[0] });
  };
  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      alert("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    console.log(location);
    const { latitude, longitude } = location.coords;
    console.log(location.coords);
    console.log(location.coords.latitude);
    var coor = [
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      {
        latitude: 10.7703479,
        longitude: 106.6556217,
      },
    ];
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
    this.setState({ text: vitri });
    this.setState({
      latitudeCurent: location.coords.latitude,
      longitudeCurent: location.coords.longitude,
      coordinates: coor,
      address: vitri,
    });
    this.getGeocodeAsync({ latitude, longitude });
    console.log(this.state.geocode);
  };
  componentDidMount() {
    this.getLocationAsync();
  }
  _register() {
    this.setState({
      errorName: "",
      errorEmail: "",
      errorPassword: "",
      errorPhone: "",
      errorAddress: "",
      errorConfirm: "",
    });

    // TODO : Validation Zone
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (
      this.state.name.trim().length < 6 ||
      this.state.name.trim().length > 50
    ) {
      this.setState({ errorName: "*Tên phải từ 6 - 50 ký tự*" });
    } else if (
      this.state.email.trim().length < 6 ||
      this.state.email.trim().length > 20
    ) {
      this.setState({ errorEmail: "*Email phải từ 6 - 50 ký tự*" });
    } else if (reg.test(this.state.email) !== true) {
      this.setState({ errorEmail: "*Định dạng email không hợp lệ*" });
    } else if (
      this.state.password.trim().length < 6 ||
      this.state.password.trim().length > 20
    ) {
      this.setState({ errorPassword: "*Mật khẩu từ 6 - 20 ký tự*" });
    } else if (
      this.state.confirm.trim().length < 6 ||
      this.state.confirm.trim().length > 20
    ) {
      this.setState({ errorConfirm: "*Mật khẩu phải từ 6 - 20 ký tự*" });
    } else if (this.state.password != this.state.confirm) {
      this.setState({ errorConfirm: "*Mật khẩu không khớp*" });
    } else if (
      this.state.phone.trim().length < 6 ||
      this.state.phone.trim().length > 20
    ) {
      this.setState({ errorPhone: "*Số điện thoại phải từ 6 - 20 ký tự*" });
    } else if (isNaN(this.state.phone)) {
      this.setState({ errorPhone: "*Số điện thoại không hợp lệ*" });
    } else if (
      this.state.address.trim().length < 6 ||
      this.state.address.trim().length > 50
    ) {
      this.setState({ errorAddress: "*địa chỉ phải từ 6 - 50 ký tự*" });
    } else if (this.state.password != this.state.confirm) {
      this.setState({ errorConfirm: "*Mật khẩu không khớp*" });
    } else {
      fetch(URL_API + "/api/auth/register-mobile", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          phone: this.state.phone,
          address: this.state.address,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) alert("Đăng Ký Thành Công");
          // this.props.navigation.navigate("login");
        })
        .catch((error) => {
          alert("Error server:" + error);
        })
        .done();
    }
  }
  _kiemtra = () => {
    if (this.state.username == "a" && this.state.password == "a") {
      this.props.navigation.navigate("home");
    } else {
      alert("Tài Khoản Hoặc Mật Khẩu Sai");
    }
  };
  _hidePass() {
    var name = "";
    if (this.state.nameIcon == "md-eye") {
      name = "md-eye-off";
    } else {
      name = "md-eye";
    }
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
      nameIcon: name,
    });
  }

  render() {
    const Divider = (props) => {
      return (
        <View {...props}>
          <View style={styles.line}></View>
          <Text style={styles.textOr}>OR</Text>
          <View style={styles.line}></View>
        </View>
      );
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Header />
          <View style={styles.up}>
            <Text
              style={{
                fontSize: 25,
                color: "#333",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Registration
            </Text>
          </View>
          <View style={styles.down}>
            <View style={styles.inputcomponent}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.label}>Name: </Text>
                <Text style={styles.textError}>{this.state.errorName}</Text>
              </View>

              <TextInput
                ref="name"
                style={styles.input}
                placeholder="Enter your name"
                onChangeText={(text) => this.setState({ name: text })}
              ></TextInput>
            </View>

            <View style={styles.inputcomponent}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.label}>Email: </Text>
                <Text style={styles.textError}>{this.state.errorEmail}</Text>
              </View>
              <TextInput
                ref="email"
                style={styles.input}
                TextContentType="emaiAddress"
                keyboardType="email-address"
                placeholder="Enter your email"
                onChangeText={(text) => this.setState({ email: text })}
              ></TextInput>
            </View>
            <View
              style={{
                // flex: 1,
                zIndex: 1,
                position: "relative",
                // justifyContent: 'center',
                height: 280,
                width: width,
                // backgroundColor: "red",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  paddingLeft: 20,
                }}
              >
                <Text style={styles.label}>Address: </Text>
                <Text style={styles.textError}>{this.state.errorAddress}</Text>
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
                      backgroundColor: "#ededeb",
                      marginLeft: 20,
                      marginRight: 5,
                      width: width,
                      height: 40,
                      color: "#5d5d5d",
                      fontSize: 16,
                    },
                    predefinedPlacesDescription: {
                      backgroundColor: "#000",
                      color: "#1faadb",
                    },
                  }}
                  //   placeholder="Search"
                  onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    // console.log(data);
                    this.setState({ address: data.description });
                    console.log("hihi");
                    console.log(data.description);
                    // console.log(details);
                    // console.log("data log");
                    // console.log(details.geometry);
                    console.log(details.geometry.location);
                    // console.log(details.geometry.location.lat);

                    // console.log(data.main_text_matched_substrings);
                    // console.log(details.main_text_matched_substrings);
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
                  paddingLeft: 10,
                  heigth: 280,
                  justifyContent: "center",
                  top: 75,
                }}
              >
                <View style={{ ...styles.inputcomponent, paddingLeft: 10 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.label}>Phone: </Text>
                    <Text style={styles.textError}>
                      {this.state.errorPhone}
                    </Text>
                  </View>
                  <TextInput
                    ref="phone"
                    style={styles.input}
                    placeholder="Enter your phone"
                    onChangeText={(text) => this.setState({ phone: text })}
                  ></TextInput>
                </View>
                <View style={styles.inputcomponent}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ ...styles.label, left: 10 }}>
                      Password:{" "}
                    </Text>
                    <Text style={{ ...styles.textError, marginLeft: 10 }}>
                      {this.state.errorPassword}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      positon: "realative",
                      left: 10,
                    }}
                  >
                    <TextInput
                      ref="password"
                      style={styles.input}
                      placeholder="Enter your password"
                      secureTextEntry={this.state.secureTextEntry}
                      onChangeText={(text) => this.setState({ password: text })}
                    ></TextInput>
                    <TouchableOpacity
                      onPress={() => this._hidePass()}
                      style={{ positon: "absolute", right: 30, top: 10 }}
                    >
                      <Icon
                        name={this.state.nameIcon}
                        size={20}
                        color={"black"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.inputcomponent}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ ...styles.label, left: 10 }}>
                      Confirm password:{" "}
                    </Text>
                    <Text style={styles.textError}>
                      {this.state.errorConfirm}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      positon: "realative",
                      left: 10,
                    }}
                  >
                    <TextInput
                      ref="confirm"
                      style={styles.input}
                      placeholder="Enter your password"
                      secureTextEntry={this.state.secureTextEntry}
                      onChangeText={(text) => this.setState({ confirm: text })}
                    ></TextInput>
                    <TouchableOpacity
                      onPress={() => this._hidePass()}
                      style={{ positon: "absolute", right: 30, top: 10 }}
                    >
                      <Icon
                        name={this.state.nameIcon}
                        size={20}
                        color={"black"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {/* <View style={styles.inputcomponent}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...styles.label, left: 10 }}>Password: </Text>
                <Text style={{ ...styles.textError, marginLeft: 10 }}>
                  {this.state.errorPassword}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", positon: "realative", left: 10 }}
              >
                <TextInput
                  ref="password"
                  style={styles.input}
                  placeholder="Enter your password"
                  secureTextEntry={this.state.secureTextEntry}
                  onChangeText={(text) => this.setState({ password: text })}
                ></TextInput>
                <TouchableOpacity
                  onPress={() => this._hidePass()}
                  style={{ positon: "absolute", right: 30, top: 10 }}
                >
                  <Icon name={this.state.nameIcon} size={20} color={"black"} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputcomponent}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...styles.label, left: 10 }}>
                  Confirm password:{" "}
                </Text>
                <Text style={styles.textError}>{this.state.errorConfirm}</Text>
              </View>
              <View
                style={{ flexDirection: "row", positon: "realative", left: 10 }}
              >
                <TextInput
                  ref="confirm"
                  style={styles.input}
                  placeholder="Enter your password"
                  secureTextEntry={this.state.secureTextEntry}
                  onChangeText={(text) => this.setState({ confirm: text })}
                ></TextInput>
                <TouchableOpacity
                  onPress={() => this._hidePass()}
                  style={{ positon: "absolute", right: 30, top: 10 }}
                >
                  <Icon name={this.state.nameIcon} size={20} color={"black"} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputcomponent}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.label}>Phone: </Text>
                <Text style={styles.textError}>{this.state.errorPhone}</Text>
              </View>
              <TextInput
                ref="phone"
                style={styles.input}
                placeholder="Enter your phone"
                onChangeText={(text) => this.setState({ phone: text })}
              ></TextInput>
            </View>

            <View style={styles.inputcomponent}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.label}>Address: </Text>
                <Text style={styles.textError}>{this.state.errorAddress}</Text>
              </View>
              <TextInput
                ref="address"
                style={styles.input}
                placeholder="Enter your address"
                onChangeText={(text) => this.setState({ address: text })}
              ></TextInput>
            </View> */}
            {/* <View
              style={{
                // flex: 1,
                zIndex: 1,
                position: "relative",
                // justifyContent: 'center',
                height: 300,
                width: width,
                // backgroundColor: "#fff",
              }}
            >
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
                      backgroundColor: '#ededeb',
                      marginLeft: 20,
                      marginRight: 20,
                      width: width,
                      height: 38,
                      color: "#5d5d5d",
                      fontSize: 16,
                    },
                    predefinedPlacesDescription: {
                      backgroundColor: "#000",
                      color: "#1faadb",
                    },
                  }}
                  //   placeholder="Search"
                  onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    // console.log(data);
                    console.log("hihi");
                    console.log(data.description);
                    // console.log(details);
                    // console.log("data log");
                    // console.log(details.geometry);
                    console.log(details.geometry.location);
                    // console.log(details.geometry.location.lat);

                    // console.log(data.main_text_matched_substrings);
                    // console.log(details.main_text_matched_substrings);
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
                  backgroundColor: "blue",
                  heigth: 300,
                  justifyContent: "center",
                  top: 230,
                }}
              >
                <Text>nghĩa nè</Text>
              </View>
            </View> */}
            <TouchableOpacity
              style={{
                ...styles.btnLogin,
                backgroundColor: "#0450c2",
              }}
              onPress={() => this._register()}
            >
              <Text style={styles.login}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.btnLogin, marginTop: 10 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={styles.login}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 5,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "white",
  },
  banner: {
    width: width,
    alignItems: "center",
  },
  image: {
    height: 100,
    width: width,
    margin: 5,
  },
  up: {
    paddingTop: 50,
    flex: 1,
  },
  down: {
    flex: 15,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    justifyContent: "center",
  },
  input: {
    paddingLeft: 10,
    width: width - 40,
    height: 40,
    backgroundColor: "#ededeb",
    marginBottom: 10,
    borderRadius: 2,
  },
  titleLogin: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 5,
  },
  login: {
    fontSize: 18,
    color: "#fff",
  },
  btnLogin: {
    fontWeight: "bold",
    width: 280,
    height: 45,
    backgroundColor: "#1094b5",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  facebook: {
    width: 280,
    height: 45,
    justifyContent: "center",
    borderRadius: 10,
  },
  btnFB: {
    color: "#fff",
  },
  line: {
    flex: 2,
    height: 1,
    backgroundColor: "#000",
  },
  textOr: {
    textAlign: "center",
    flex: 1,
  },
  devider: {
    width: 280,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textError: {
    marginLeft: 10,
    color: "red",
    fontStyle: "italic",
  },
});
