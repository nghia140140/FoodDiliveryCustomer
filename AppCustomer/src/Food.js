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
import { URL_API, addressSocket } from "./Header";
import io from "socket.io-client";
import Swiper from "react-native-swiper";
import Icon from "react-native-vector-icons/Ionicons";
import { AsyncStorage } from "react-native";
import {ketnoi} from "./Login";

var { height, width } = Dimensions.get("window");

export default class Food extends Component {
  constructor(props) {
    super(props);
    this.socket = ketnoi;
    this.state = {
      dataBanner: [],
      categories: [],
      foods: [],
      selectedCategory: 0,
      screen: 1,
      pathImage: "",
      name: "",
      price: "",
      description: "",
      itemFood: {},
    };
  }


  _fetchBannerPromotion() {
    const urlExternal = "https://tutofox.com/foodapp/api.json";
    return fetch(urlExternal)
      .then((responseExternal) => responseExternal.json())
      .then((responseExternalJson) => {
        this.setState({
          dataBanner: responseExternalJson.banner
        });
      })
      .catch((error) => {console.log(error);});
  }

  fetchCategogyData() {
    const urlCategorys = URL_API + "/api/access/categorys";
    return fetch(urlCategorys)
      .then((responseCategorys) => responseCategorys.json())
      .then((responseCategorysJson) => {
        this.setState({
          categories: responseCategorysJson.data
        });
        console.log(responseCategorysJson.data);
      })
      .catch((error) => {console.log(error);});
  }

  fetchFoodData() {
    const url = URL_API + "/api/access/foods";
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          foods: responseJson.data,
        });
      })
      .catch((error) => {console.log(error);});
  }


  componentDidMount() {
    this._fetchBannerPromotion();
    this.fetchCategogyData();
    this.fetchFoodData();
    this.socket.emit("abc");

  }

  // TODO : Render Display
  render() {
    return (
      <View style={{ flex: 1 }}>
            <Header />
        {this.state.screen == 1 ? (
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.banner}>
                <Image
                  style={styles.image}
                  resizeMode="contain"
                  source={require("../image/grab.png")}
                />
                <View style={{ flex: 1 }}>
                  <Swiper style={{ height: width / 2 }} showsButtons={false} autoplay={true} autoplayTimeout={1}>
                    {
                      this.state.dataBanner.map((itembann, index) => {
                        return (
                          <Image style={styles.imageBanner} resizeMode="contain" source={{ uri: itembann }} />
                        )
                      })
                    }
                  </Swiper>
                </View>
                <View style={{ height: 20 }} />
              </View>

              <View
                style={{
                  width: width,
                  borderRadius: 20,
                  paddingVertical: 20,
                  backgroundColor: "white",
                }}
              >
                <View style={{ height: 5 }} />
                <Text style={styles.titleCategory}>Danh Mục</Text>
                <FlatList
                  horizontal={true}
                  data={this.state.categories}
                  renderItem={({ item }) => this._renderItemCategories(item)}
                  keyExtractor={(item, index) => index.toString()}
                />

                <Text style={styles.titleCategory}>Danh Sách Thực Đơn</Text>
                <FlatList
                  data={this.state.foods}
                  numColumns={2}
                  renderItem={({ item }) => this._renderItemFoods(item)}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </ScrollView>
        ) : (
            <View>
              <TouchableOpacity
                onPress={() => this._back()}
                style={{
                  width: width / 4 - 10,
                  backgroundColor: "#333",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 3,
                  padding: 4,
                  marginTop: 45,
                }}
              >
                <Icon name="md-arrow-back" size={20} color={"#fff"} />
                <Text
                  style={{ fontSize: 18, color: "#ffff66", fontWeight: "bold" }}
                >
                  Back
              </Text>
              </TouchableOpacity>
              <Image
                style={styles.imageDetail}
                resizeMode="contain"
                source={{ uri: this.state.pathImage }}
              />
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 30, marginTop: 20 }}>
                  {this.state.name}
                </Text>
                <Text style={{ fontSize: 30, marginTop: 20 }}>
                  $ {this.state.price}
                </Text>

                <Text>{this.state.description}</Text>
                {/* <Text style={{ fontSize: 30, marginTop: 20 }}>
                Price: {this.state.price}
              </Text> */}
                <TouchableOpacity
                  onPress={() => this.onClickAddCart(this.state.itemFood)}
                  style={{
                    width: width - 40,
                    backgroundColor: "#2ed17c",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    padding: 4,
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{ fontSize: 25, color: "white", fontWeight: "bold" }}
                  >
                    Add Cart
                </Text>
                  <View style={{ width: 10 }} />
                  <Icon name="md-add-circle" size={40} color={"#191c1a"} />
                </TouchableOpacity>
              </View>
            </View>
          )}
      </View>
    );
  }
  // ===================================== METHOD ================================== //
  _back() {
    this.setState({
      screen: 1,
      name: "",
      pathImage: "",
      price: "",
      description: "",
    });
  }
  _detail(item) {
    this.setState({
      screen: 0,
      name: item.name,
      pathImage: item.pathImage,
      price: item.price,
      itemFood: item,
      description: item.description,
    });
  }

  _renderItemFoods(item) {
    let cate = this.state.selectedCategory;
    if (cate == 0 || cate == item.categoryId) {
      return (
        <TouchableOpacity
          onPress={() => this._detail(item)}
          style={styles.divFood}
        >
          <Image
            style={styles.imageFood}
            resizeMode="contain"
            source={{ uri: item.pathImage }}
          />
          <View
            style={{
              height: width / 2 - 20 - 200,
              backgroundColor: "transparent",
              width: width / 2 - 20 - 10,
            }}
          />
          <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
            {item.name}
          </Text>
          <Text>{item.description}</Text>
          <Text style={{ fontSize: 18, color: "green" }}>${item.price}</Text>

          <TouchableOpacity
            onPress={() => this.onClickAddCart(item)}
            style={{
              width: width / 2 - 40,
              backgroundColor: "#33c37d",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              padding: 4,
            }}
          >
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
              Add Cart
          </Text>
            <View style={{ width: 10 }} />
            <Icon name="ios-add-circle" size={30} color={"black"} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }
  }

  _renderFoodByCategory(idCategory) {
    const url = URL_API + "/api/access/food:byCategory/" + idCategory;
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          foods: responseJson.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

        // onPress={() => this._renderFoodByCategory(item._id)}
  _renderItemCategories(item) {
    return (
      <TouchableOpacity
        style={[styles.divCategory, { backgroundColor: "#e1faed" }]}
        onPress={() => this.setState({ selectedCategory: item._id})}
      >
        <Image
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
          source={{ uri: item.pathImage }}
        />
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  onClickAddCart(data) {
    const itemcart = {
      food: data,
      quantity: 1,
      price: data.price,
    };

    var valid = true;
    AsyncStorage.getItem("cart")
      .then((datacart) => {
        if (datacart !== null) {
          // We have data!!
          const cart = JSON.parse(datacart);
          cart.map((element) => {
            if (element.food._id == data._id) {
              element.quantity = element.quantity + 1;
              valid = false;
            }
          });

          if (valid == true) {
            cart.push(itemcart);
          }

          AsyncStorage.setItem("cart", JSON.stringify(cart));
        } else {
          const cart = [];
          cart.push(itemcart);
          AsyncStorage.setItem("cart", JSON.stringify(cart));
        }
        alert("Add Cart");
      })
      .catch((err) => {
        alert(err);
      });
  }
} // END CLASS

// =============== STYLE =============== //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
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
  titleCategory: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 2,
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
    height: width / 2 - 20 - 30,
    backgroundColor: "transparent",
  },
  divFood: {
    width: width / 2 - 20,
    // height:(width/2),
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 0,
    marginLeft: 12,
    alignItems: "center",
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 50,
    backgroundColor: "white",
  },
  imageDetail: {
    height: width - 40,
    width: width,
  },
});
