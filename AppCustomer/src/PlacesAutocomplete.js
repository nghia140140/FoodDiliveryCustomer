import React, { Component } from "react";
import { View, Image, Dimensions, Text } from "react-native";
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { GOOGLE_MAPS_APIKEY } from "./Header";
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete";
// import Geolocation from '@react-native-community/geolocation';
// const homePlace = {
//   description: 'Home',
//   geometry: {location: {lat: 48.8152937, lng: 2.4597668}},
// };
// const workPlace = {
//   description: 'Work',
//   geometry: {location: {lat: 48.8496818, lng: 2.2940881}},
// };

var { height, width } = Dimensions.get("window");

export default class GooglePlacesInput extends Component {
  render() {
    // const GooglePlacesInput = () => {
    return (
      // <View style={{paddingTop: Constants.statusBarHeight, flex: 1}}>
      // <GooglePlacesAutocomplete
      //   placeholder="Search"
      //   minLength={2} // minimum length of text to search
      //   autoFocus={false}
      //   returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      //   listViewDisplayed="auto" // true/false/undefined
      //   fetchDetails={true}
      //   renderDescription={(row) => row.description} // custom description render
      //   onPress={(data, details = null) => {
      //     console.log(data);
      //     console.log(details);
      //   }}
      //   getDefaultValue={() => {
      //     return ''; // text input default value
      //   }}
      //   query={{
      //     // available options: https://developers.google.com/places/web-service/autocomplete
      //     key: 'AIzaSyCMkBU6QM6jEnGGBItURq2xXw-c_YUhuao',
      //     language: 'en', // language of the results
      //     types: '(cities)', // default: 'geocode'
      //   }}
      //   styles={{
      //     description: {
      //       fontWeight: 'bold',
      //     },
      //     predefinedPlacesDescription: {
      //       color: '#1faadb',
      //     },
      //   }}
      //   currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      //   currentLocationLabel="Current location"
      //   nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      //   GoogleReverseGeocodingQuery={
      //     {
      //       // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
      //     }
      //   }
      //   GooglePlacesSearchQuery={{
      //     // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
      //     rankby: 'distance',
      //     types: 'food',
      //   }}
      //   filterReverseGeocodingByTypes={[
      //     'locality',
      //     'administrative_area_level_3',
      //   ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      //   predefinedPlaces={[homePlace, workPlace]}
      //   debounce={200}
      // />
      // </View>
      <View
        style={{
          // flex: 1,
          zIndex: 1,
          position: "relative",
          // justifyContent: 'center',
          height: 300,
          width: width,
          backgroundColor: "red",
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
                backgroundColor: "#ededeb",
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
      </View>
    );
  }
}

// export default GooglePlacesInput;
