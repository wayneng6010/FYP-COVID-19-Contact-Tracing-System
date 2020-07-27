import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	StyleSheet,
	Text,
	SafeAreaView,
	Button,
	ScrollView,
	View,
	Dimensions,
	TextInput,
} from "react-native";

import MapView from "react-native-maps";

export default class map_findHomeLocation extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};
	constructor() {
		super();
		this.state = {
			// latitude: 0,
			// longitude: 0,
			// home_address:
			// 	"98-11-18, sinar bukit dumbar, jalan faraday, 11700 pulau pinang",
			region: {
				latitude: 37.78825,
				longitude: -122.4324,
				latitudeDelta: 0.002,
				longitudeDelta: 0.002,
			},
			search_prediction: [],
			place_id: null,
			place_lat: null,
			place_lng: null,
		};
	}

	searchHomeAddress = async (value) => {
		// alert("asd");
		const query_search_home_adress = `http://192.168.0.131:5000/searchHomeAddress?search_query=${value}`;
		console.log(query_search_home_adress);
		await axios
			.get(query_search_home_adress)
			.then((response) => {
				// console.log(response.data);
				// console.log(response.data.results[0].geometry.location.lng);
				var predicted_places = [];
				var predictions = response.data.predictions;
				// console.log("result: " + JSON.stringify(predictions));
				predictions.forEach(function (item) {
					predicted_places.push({
						place_name: item.description,
						place_id: item.place_id,
					});
					// console.log(item.structured_formatting.main_text);
				});

				this.setState({
					search_prediction: predicted_places,
				});
				console.log(this.state.search_prediction);
				// this.setState({ latitude: latitude, longitude: longitude });
			})
			.catch((error) => {
				alert(error);
			});
	};

	getHomeLocation = async (place_id) => {
		// alert("asd");

		const query_get_home_location = `http://192.168.0.131:5000/getHomeLocation?place_id=${place_id}`;
		console.log(query_get_home_location);
		await axios
			.get(query_get_home_location)
			.then((response) => {
				// console.log(response.data);
				// console.log(response.data.results[0].geometry.location.lat);
				// console.log(response.data.results[0].geometry.location.lng);
				var latitude_res = response.data.result.geometry.location.lat;
				var longitude_res = response.data.result.geometry.location.lng;
				this.setState({
					region: {
						latitude: latitude_res,
						longitude: longitude_res,
						latitudeDelta: 0.002,
						longitudeDelta: 0.002,
					},
					place_lat: latitude_res,
					place_lng: longitude_res,
					place_id: place_id,
				});

				// this.setState({ latitude: latitude, longitude: longitude });
			})
			.catch((error) => {
				alert(error);
			});
	};

	onChangeQuery = async (value) => {
		if (value.length > 15) {
			// this.setState({ search_query: value });
			await this.searchHomeAddress(value);
			// alert(value);
			// alert(this.state.search_query);
		} else {
			this.setState({
				search_prediction: [],
			});
		}
	};

	componentDidMount = async () => {
		// await this.searchHomeAddress();
	};

	onPressResult = async (place_id) => {
		// alert(place_id);
		await this.getHomeLocation(place_id);
	};

	saveHomeLocation = async () => {
		alert(
			"place id: " +
				this.state.place_id +
				"\nplace lat: " +
				this.state.place_lat +
				"\nplace long: " +
				this.state.place_lng
		);
	};

	render() {
		const { latitude, longitude } = this.state;
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.title}>Find Your Home Location</Text>
				<View style={styles.search_outer}>
					<TextInput
						// onChangeText={(value) => this.setState({ search_query: value })}
						onChangeText={(value) => this.onChangeQuery(value)}
						value={this.state.search_query}
						style={{
							borderColor: "#c0cbd3",
							borderWidth: 2,
							width: 300,
							paddingHorizontal: 10,
						}}
					></TextInput>
					{/* <Text>{this.state.search_prediction.place_name}</Text> */}
					<View style={styles.dropdown}>
						{this.state.search_prediction.map((item) => (
							<Text
								style={{ paddingVertical: 10 }}
								key={item.place_id}
								onPress={() => this.onPressResult(item.place_id)}
							>
								{item.place_name}
							</Text>
						))}
					</View>
				</View>
				<MapView
					style={styles.mapStyle}
					region={this.state.region}
					// initialRegion={{
					// 	latitude,
					// 	longitude,
					// 	latitudeDelta: 0.002,
					// 	longitudeDelta: 0.002,
					// }}
				/>

				<Button
					title="Save Home Location"
					onPress={() => this.saveHomeLocation()}
				></Button>
			</SafeAreaView>

			// 	{/* {news.map((data) => {
			// 			return <Text>{data.url}</Text>;
			// 		})} */}
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		alignItems: "center",
		// justifyContent: "center",
		// marginHorizontal: 20,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		marginVertical: 20,
	},
	mapStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height / 2,
		marginTop: 20,
		marginBottom: 20,
	},
	search_outer: {
		position: "relative",
	},
	dropdown: {
		position: "absolute",
		top: 30,
		zIndex: 100,
		backgroundColor: "white",
		borderColor: "#c0cbd3",
		borderWidth: 1,
		width: 300,
		marginBottom: 20,
		paddingHorizontal: 10,
	},
});
