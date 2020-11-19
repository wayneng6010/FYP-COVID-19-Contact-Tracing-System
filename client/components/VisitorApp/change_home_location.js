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
	ToastAndroid,
	Keyboard,
	TouchableHighlight,
} from "react-native";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default class change_home_location extends React.Component {
	constructor() {
		super();
		this.state = {
			region: {
				latitude: 37.78825,
				longitude: -122.4324,
				latitudeDelta: 0.002,
				longitudeDelta: 0.002,
			},
			search_prediction: [],
			search_prediction_selected: true,
			place_id: null,
			place_lat: null,
			place_lng: null,
			search_query: null,
			place_name: null,
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
				this.setState({ search_prediction_selected: false });
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
		this.setState({ search_query: value });
		if (value.length > 10) {
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
		let { status } = await Location.requestPermissionsAsync();
		if (status !== "granted") {
			setErrorMsg("Permission to access location was denied");
		}
		let location = await Location.getCurrentPositionAsync({});
		// alert(location.coords.longitude);
		this.setState({
			region: {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.002,
				longitudeDelta: 0.002,
			},
			place_lat: location.coords.latitude,
			place_lng: location.coords.longitude,
			// place_id: place_id,
		});
	};

	onPressResult = async (place_id, place_name) => {
		// alert(place_id);
		Keyboard.dismiss(); //hide keyboard
		this.setState({
			search_prediction_selected: true,
			search_query: "",
			place_name: place_name,
		});
		await this.getHomeLocation(place_id);
	};

	saveHomeLocation = async () => {
		const place_lat = this.state.place_lat,
			place_lng = this.state.place_lng,
			place_id = this.state.place_id;
		if (place_lat == null || place_lng == null || place_id == null) {
			ToastAndroid.show("Please select a location", ToastAndroid.SHORT);
			return;
		} else {
			await fetch("http://192.168.0.131:5000/update_home_location", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					place_lat: place_lat,
					place_lng: place_lng,
					place_id: place_id,
				}),
			})
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.text();
				})
				.then((jsonData) => {
					// alert(jsonData);
					if (jsonData == "success") {
						alert("Home location has been updated");
						this.props.navigation.pop();
					} else if (jsonData == "failed") {
						alert("Home location failed to update");
					}
				})
				.catch((error) => {
					alert(error);
				});
		}
	};

	render() {
		const { latitude, longitude } = this.state;
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.subtitle_bg}>Update Home Location</Text>

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
					<View
						style={
							this.state.search_prediction_selected
								? styles.dropdown_hidden
								: styles.dropdown
						}
					>
						{this.state.search_prediction.map((item) => (
							<Text
								style={{ paddingVertical: 10 }}
								key={item.place_id}
								onPress={() =>
									this.onPressResult(item.place_id, item.place_name)
								}
							>
								{item.place_name}
							</Text>
						))}
					</View>
				</View>

				<Text />
				{this.state.place_id == null ? (
					<Text style={styles.no_location_selected}>
						{" "}
						No location is selected
					</Text>
				) : (
					<Text style={styles.location_selected}>
						Location has been selected {"\n"}
						<Text style={{ ...styles.location_selected, fontWeight: "normal" }}>
							{this.state.place_name}
						</Text>
					</Text>
				)}

				<MapView
					style={styles.mapStyle}
					region={this.state.region}
					loadingEnabled={true}
					loadingIndicatorColor="#666666"
					loadingBackgroundColor="#eeeeee"
					moveOnMarkerPress={false}
					showsUserLocation={true}
					showsCompass={true}
					showsPointsOfInterest={false}
					provider="google"
				>
					{this.state.place_lat == null || this.state.place_lng == null ? (
						<Marker
							coordinate={{
								latitude: 9.343223,
								longitude: 5.12334,
							}}
						/>
					) : (
						<Marker
							coordinate={{
								latitude: this.state.place_lat,
								longitude: this.state.place_lng,
							}}
							title={this.state.place_name}
						/>
					)}
				</MapView>

				{/* <Button
					title="Save Home Location"
					onPress={() => this.saveHomeLocation()}
				></Button> */}
				<TouchableHighlight
					style={{
						...styles.openButton,
						backgroundColor: "#1e90ff",
					}}
					onPress={() => this.saveHomeLocation()}
				>
					<Text style={styles.textStyle}>Save Home Location</Text>
				</TouchableHighlight>
			</SafeAreaView>

			// 	{/* {news.map((data) => {
			// 			return <Text>{data.url}</Text>;
			// 		})} */}
		);
	}
}

const styles = StyleSheet.create({
	no_location_selected: {
		backgroundColor: "#cd5c5c",
		marginBottom: 10,
		color: "white",
		paddingHorizontal: 10,
		paddingVertical: 10,
		fontWeight: "bold",
	},
	location_selected: {
		backgroundColor: "#3cb371",
		marginBottom: 10,
		color: "white",
		paddingHorizontal: 10,
		paddingVertical: 10,
		fontWeight: "bold",
	},
	openButton: {
		backgroundColor: "#1e90ff",
		borderRadius: 5,
		paddingVertical: 10,
		width: 200,
		elevation: 2,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
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
	subtitle: {
		fontSize: 14,
		textAlign: "center",
		marginTop: 20,
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: "#F2F2F2",
	},
	mapStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height / 2.5,
		marginTop: 20,
		marginBottom: 20,
	},
	search_outer: {
		position: "relative",
	},
	dropdown: {
		position: "absolute",
		display: "flex",
		top: 30,
		zIndex: 100,
		backgroundColor: "white",
		borderColor: "#c0cbd3",
		borderWidth: 1,
		width: 300,
		marginBottom: 20,
		paddingHorizontal: 10,
	},
	dropdown_hidden: {
		display: "none",
	},
	subtitle_bg: {
		fontSize: 16,
		textAlign: "center",
		marginTop: 20,
		backgroundColor: "lightgrey",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
	},
});
