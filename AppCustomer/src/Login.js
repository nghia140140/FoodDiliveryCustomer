import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Keyboard,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import Header from "./Header";
import { URL_API, addressSocket } from "./Header";

import FontAwesome from "react-native-vector-icons/FontAwesome5";
import ValidationComponent from "react-native-form-validator";
import { AsyncStorage } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DropdownAlert from "react-native-dropdownalert";
import io from "socket.io-client";
export const ketnoi = io(addressSocket, {jsonp: false});
var { height, width } = Dimensions.get("window");
export default class login extends ValidationComponent {
  constructor(props) {
    super(props);
    this.socket = ketnoi;
    this.state = {
      email: "",
      password: "",
      error: "",
      backgroundColorError: "",
      secureTextEntry: true,
      nameIcon: "md-eye",
      foodbooking: new Animated.Value(0),
    };
  }
  async componentDidMount() {
    Animated.sequence([
      Animated.timing(this.state.foodbooking, {
        toValue: 15,
        duration: 500,
      }),
    ]).start(() => {});
  }
  login() {
    AsyncStorage.clear();
    this.setState({
      errorEmail: "",
      errorPassword: "",
    });
    // const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // if (this.state.email.trim().length < 10) {
    //   this.setState({
    //     error: "*Email phải lớn hơn 10 ký tự*",
    //   });
    // } else if (reg.test(this.state.email) !== true) {
    //   this.setState({
    //     error: "*Định dạng email không hợp lệ*",
    //   });
    // } else if (
    //   this.state.password.trim().length < 6 ||
    //   this.state.password.trim().length > 20
    // ) {
    //   this.setState({
    //     error: "*Mật khẩu từ 6 - 20 ký tự*",
    //   });
    // } else {
    fetch(URL_API + "/api/auth/login-mobile", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },

      body: JSON.stringify({
        username: "r@gmail.com",
        password: "444777",
        // username: this.state.email,
        // password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const user = data.data;
        if (data.data.name.trim().length != 0) {
          AsyncStorage.setItem("User", JSON.stringify(user));
          console.log(user);
          this.socket.emit("user-login",{_id: user._id, username: user.email});
          this.props.navigation.navigate("home");
        } else {
          console.log("data is not exist");
          // this.dropDownAlertRef.alertWithType('error', 'Authentication invalid ', 'Wrong username or password');
        }
      })
      .catch((error) => {
        console.log(error);
        this.dropDownAlertRef.alertWithType(
          "error",
          "Authentication invalid ",
          "Wrong username or password"
        );
        this.setState({
          error: "Tài khoản hoặc mật khẩu không đúng",
        });
      })
      .done();
    // }
  }
  _kiemtra = () => {
    this.props.navigation.navigate("home");
  };
  _register() {
    this.props.navigation.navigate("register");
    // this.props.navigation.navigate("map");
  }
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
          {/* <ImageBackground
            // resizeMode="contain"
            source={require("./image/food2.png")}
            style={styles.imageNen}
          > */}

          <View>
            <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
          </View>

          <View style={styles.up}>
            <Image
              style={styles.image}
              // resizeMode="contain"
              source={require("./image/grab.png")}
            />
            <Animated.Text
              style={{ ...styles.title}}
            >
              Sign in
            </Animated.Text>
          </View>
          <View style={styles.down}>
            <View>
              <Text
                style={{
                  color: "#9e0e39",
                  fontStyle: "italic",
                  fontSize: 12,
                  marginBottom: 10,
                  padding: 5,
                  paddingLeft: 15,
                  paddingRight: 15,
                  borderRadius: 20,
                }}
              >
                {this.state.error}
              </Text>
            </View>
            <View style={styles.inputcomponent}>
              <TextInput
                style={styles.input}
                TextContentType="emaiAddress"
                keyboardType="email-address"
                placeholder="Nhập email"
                onChangeText={(text) => this.setState({ email: text })}
              ></TextInput>
            </View>
            <View style={styles.inputcomponent}>
              <View
                style={{
                  ...styles.input,
                  flexDirection: "row",
                }}
              >
                <TextInput
                  style={{ flex: 9 }}
                  placeholder="Nhập mật khẩu"
                  secureTextEntry={this.state.secureTextEntry}
                  onChangeText={(text) => this.setState({ password: text })}
                ></TextInput>
                <TouchableOpacity
                  onPress={() => this._hidePass()}
                  style={{ flex: 1, top: 10 }}
                >
                  <Icon name={this.state.nameIcon} size={20} color={"black"} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.btnLogin}
              onPress={() => this.login()}
            >
              <Text style={styles.login}>Login</Text>
            </TouchableOpacity>
            <Divider style={styles.devider}></Divider>
            <FontAwesome.Button
              name="facebook"
              backgroundColor="#3b5998"
              style={styles.facebook}
            >
              <Text style={styles.btnFB}>Login with Facebook</Text>
            </FontAwesome.Button>
            <TouchableOpacity
              style={{
                ...styles.btnLogin,
                backgroundColor: "#333",
              }}
              onPress={() => this._register()}
            >
              <Text style={styles.login}>Register</Text>
            </TouchableOpacity>
          </View>
          {/* </ImageBackground> */}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "#e9ebee",
  },
  banner: {
    width: width,
    alignItems: "center",
  },
  image: {
    backgroundColor: "#fff",
    marginTop: 100,
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  imageNen: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  title: {
    color: "#333",
    marginTop: 10,
    fontSize: 25,
  },
  up: {
    flex: 4,
    alignItems: "center",
  },
  down: {
    flex: 6,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  inputcomponent: {
    flexDirection: "row",
    marginLeft: 10,
  },
  label: {
    padding: 10,
    flex: 3,
    fontSize: 15,
    textAlign: "right",
  },
  input: {
    paddingLeft: 10,
    width: width - 40,
    height: 45,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 3,
    marginRight: 15,
  },
  titleLogin: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 1,
    marginBottom: 2,
  },
  login: {
    fontSize: 18,
    color: "#fff",
  },
  btnLogin: {
    marginTop: 15,
    width: 280,
    height: 45,
    backgroundColor: "#27AE60",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  facebook: {
    width: 280,
    height: 45,
    justifyContent: "center",
    borderRadius: 5,
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
});
