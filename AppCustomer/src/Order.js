import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "./Header";
import { URL_API } from "./Header";
import Swiper from "react-native-swiper";
import Icon from "react-native-vector-icons/Ionicons";
import { AsyncStorage } from "react-native";

var { height, width } = Dimensions.get("window");

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idUser: "",
      don: [],
      chitiets: [],
      lastList: 1,
    };
  }
  componentDidMount() {
    AsyncStorage.getItem("User")
      .then((user) => {
        if (user !== null) {
          const userdata = JSON.parse(user);

          return fetch(URL_API + "/api/access/order:fetchByUserId/" +userdata._id)
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                don: responseJson.data,
              });
              console.log(responseJson.data);
            })
            .catch((error) => {console.log(error);});
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
  _datafood(item) {
    return fetch(URL_API + "/api/access/order:fetchDetail/" + item._id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          chitiets: responseJson.data,
        });
        this.setState({
          lastList: 0,
        });
        console.log("data" + responseJson.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  _renderSingleItem(item) {
    return (
      <TouchableOpacity
        style={styles.divFood}
      >
        <Image
          style={styles.imageFood}
          resizeMode="contain"
          source={{ uri: item.food.pathImage }}
        />
        <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
          {item.name}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
          {item.description}
          </Text>
        <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
          Quantity: {item.quantity}
          </Text>
        {/* <Text>{item.description}</Text> */}
        <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>Price: ${item.food.price}</Text>

        
      </TouchableOpacity>
    );
  }
  _renderItem(item) {
    return (
      <TouchableOpacity
        onPress={() => this._datafood(item)}
        style={styles.divBill}
      >
        <View
          style={{
            height: width / 2 - 20 - 200,
            backgroundColor: "transparent",
            width: width - 20,
          }}
        />
        <Icon name="md-clipboard" size={30} color={"#2843bd"} />
        <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
        
          ID: {item._id}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
          Ngày: {item.timeOrder}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
            <Header />
        {this.state.lastList == 1 ? (
          <View style={styles.container}>
            <View style={{ height: 20 }} />
            <Text style={styles.titleOrderHistory}>Order History</Text>
            <FlatList
              data={this.state.don}
              numColumns={1}
              renderItem={({ item }) => this._renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )
        
        : // Separated
        
        (
          <View style={styles.container}>
            <View style={{ height: 20 }} />
            <TouchableOpacity
              style={styles.itemSingle}
              onPress={() =>
                this.setState({
                  lastList: 1,
                })
              }
              style={{
                width: width / 4 - 10,
                backgroundColor: "black",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 5,
                padding: 4,
                marginTop: 20,
              }}
            >
              <Icon name="md-arrow-back" size={20} color={"white"} />
              <Text
                style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
              >
                Back
              </Text>
            </TouchableOpacity>
            <Text style={styles.titleOrderHistory}>Mặt hàng đã mua</Text>
            <FlatList
              data={this.state.chitiets}
              numColumns={1}
              renderItem={({ item }) => this._renderSingleItem(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
      </View>
    );
  }
}

// =============== STYLE =============== //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
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
  imageBanner: {
    height: width / 2,
    width: width - 40,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  titleOrderHistory: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  divCategory: {
    backgroundColor: "red",
    margin: 5,
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
  },
  imageFood: {
    width: width / 2 - 20 - 10,
    height: 100,
    backgroundColor: "transparent",
  },
  divBill: {
    justifyContent: "flex-start",
    width: width - 20,
    padding: 10,
    borderRadius: 1,
    marginTop: 20,
    marginBottom: 0,
    alignItems: "center",
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 50,
    backgroundColor: "#f0faf3",
  },
  divFood : {
    justifyContent: "flex-start",
    width: width - 20,
    padding: 5,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 0,
    alignItems: "center",
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 100,
    backgroundColor: "#e3faeb",
  },

  imageDetail: {
    height: width - 40,
    width: width,
  },

  itemSingle : {
    justifyContent: "center",
    flexDirection: "row",
    marginLeft: 10,
    width: 100,
    backgroundColor: "#d5eddd",
    padding: 5,
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
});
