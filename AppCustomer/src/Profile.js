import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Header from "./Header";
import { URL_API } from "./Header";
import { AsyncStorage } from "react-native";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";

var { width } = Dimensions.get("window");
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _idUser: "",
      user: {},
      name: "",
      phone: "",
      address: "",
      errorName: "",
      errorPhone: "",
      errorAddress: "",
    };
  }

  // TODO : Mount data
  componentDidMount() {
    AsyncStorage.getItem("User")
      .then((user) => {
        if (user !== null) {
          // We have data!!
          const userdata = JSON.parse(user);
          // TODO : Danger zone
          fetch(URL_API + "/api/access/user/" + userdata._id)
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                user: responseJson.data,

                name: responseJson.data.name,
                phone: responseJson.data.phone,
                address: responseJson.data.address,
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
    // TODO : Fetch Data User From DataBase
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 7 }}>
          {/* <Icon name="md-person-circle" size={20} color={"black"} /> */}
          <Text
            style={{
              fontSize: 25,
              color: "#283747",
              textAlign: "center",
              fontWeight: "bold",
              margin: 10,
            }}
          >
            Profile Customer
          </Text>
          <View style={styles.inputcomponent}>
            <Text style={styles.label}>Email: </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={this.state.user.email}
              editable={false}
            ></TextInput>
          </View>
          <View style={styles.inputcomponent}>
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
          </View>
          <View style={styles.inputcomponent}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.label}>Phone: </Text>
              <Text style={styles.textError}>{this.state.errorPhone}</Text>
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
              <Text style={styles.textError}>{this.state.errorAddress}</Text>
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
          </View>
        </View>
        <View style={{ flex: 3, justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => this._updateInfo()}
            style={{
              backgroundColor: "#27AE60",
              width: width - 60,
              alignItems: "center",
              textAlign: "center",
              padding: 10,
              height: 50,
              borderRadius: 25,
              marginLeft: 30,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Update
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
        </View>
      </View>
    );
  }
  // _thanhtoan(){

  // }
  _updateInfo() {
    this.setState({
      errorName: "",
      errorPhone: "",
      errorAddress: "",
    });
    if (
      this.state.name.trim().length < 6 ||
      this.state.name.trim().length > 50
    ) {
      this.setState({ errorName: "*Tên phải từ 6 - 50 ký tự*" });
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
    } else {
      fetch(URL_API + "/api/access/user:update/" + this.state.user._id, {
        method: "PUT",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
        },

        body: JSON.stringify({
          name: this.state.name,
          phone: this.state.phone,
          address: this.state.address,
        }),
      })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .done();
    }
    this.dropDownAlertRef.alertWithType(
      "success",
      "Success",
      "Update data success."
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    width: width,
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#fff",
  },
  label: {
    marginLeft: 10,
    // flex: 3,
    fontSize: 16,
    justifyContent: "center",
  },
  input: {
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    // flex: 9,
    height: 45,
    backgroundColor: "#F2F3F4",
    borderRadius: 5,
    marginBottom: 10,
  },
  textError: {
    marginLeft: 10,
    color: "red",
    fontStyle: "italic",
  },
});
