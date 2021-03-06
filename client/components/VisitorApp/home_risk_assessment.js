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
	Image,
	TouchableHighlight,
	Modal,
	Linking,
	ActivityIndicator,
} from "react-native";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default class home_risk_assessment extends React.Component {
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
				latitude: 4.2105,
				longitude: 101.9758,
				latitudeDelta: 6,
				longitudeDelta: 6,
			},
			search_prediction: [],
			search_prediction_selected: true,
			place_id: null,
			place_lat: null,
			place_lng: null,
			search_query: null,
			place_name: null,
			hotspot: null,
			hotspot_data: null,
			saved_home_location: null,
			home_location_risk: null,
			hotspot_nearby: null,
			modalVisible_selected_hotspot: false,
			modalVisible_nearby_hotspot: false,
			current_hotspot_data: null,
			current_hotspot_place_details: null,
			current_hotspot_photo_reference: null,
			hotspot_nearby_with_name: null,
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

	getSearchLocation = async (place_id) => {
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
		if (value.length == 15) {
			await this.searchHomeAddress(value);
			// alert(value);
			// alert(this.state.search_query);
		} else {
			this.setState({
				search_prediction: [],
			});
		}
	};

	getAllHotspot = async () => {
		await fetch("http://192.168.0.131:5000/get_all_hotspot", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				// console.log(this.state.qrcode_value);
				if (jsonData === undefined || jsonData.length == 0) {
					alert("No record found");
					this.setState({
						hotspot_data: "none",
					});
				} else {
					var hotspot_data = new Array();
					jsonData.forEach(function (item) {
						if (item.type == "premise") {
							var premise_full_address =
								item.user_premiseowner.premise_address +
								", " +
								item.user_premiseowner.premise_postcode +
								", " +
								item.user_premiseowner.premise_state;
							var check_in_datetime = item.check_in_record.date_created
								.replace(/-/g, "/")
								.substring(0, 10);
							hotspot_data.push({
								_id: item._id,
								premise_name: item.user_premiseowner.premise_name,
								premise_address: premise_full_address,
								check_in_datetime: check_in_datetime,
								type: item.type,
								place_id: item.place_id,
								place_lat: parseFloat(item.place_lat),
								place_lng: parseFloat(item.place_lng),
							});
						} else if (item.type == "residential") {
							hotspot_data.push({
								_id: item._id,
								// premise_name: item.user_premiseowner.premise_name,
								// premise_address: premise_full_address,
								// check_in_datetime: check_in_datetime,
								type: item.type,
								place_id: item.place_id,
								place_lat: parseFloat(item.place_lat),
								place_lng: parseFloat(item.place_lng),
							});
						} else if (item.type == "manual_added") {
							hotspot_data.push({
								_id: item._id,
								type: item.type,
								description: item.description,
								place_id: item.place_id,
								place_lat: parseFloat(item.place_lat),
								place_lng: parseFloat(item.place_lng),
							});
						}
					});
					this.setState({
						hotspot_data: hotspot_data,
					});
					// alert(JSON.stringify(hotspot_data));
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	getUserHomeLocation = async () => {
		await fetch("http://192.168.0.131:5000/get_saved_home_location", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				// console.log(this.state.qrcode_value);
				if (jsonData === undefined || jsonData.length == 0) {
					alert("No record found");
					this.setState({
						saved_home_location: "none",
					});
				} else {
					// jsonData.forEach(function (item) {

					// });
					// this.setState({
					// 	saved_home_location: jsonData,
					// });
					// alert(JSON.stringify(jsonData));
					this.setState({
						region: {
							latitude: jsonData.home_lat,
							longitude: jsonData.home_lng,
							latitudeDelta: 0.04,
							longitudeDelta: 0.04,
						},
						// place_lat: jsonData.home_lat,
						// place_lng: jsonData.home_lng,
						saved_home_location: jsonData,
					});
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	getHotspotNearbyName = async () => {
		await fetch("http://192.168.0.131:5000/get_hotspot_nearby_name", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ hotspot_nearby: this.state.hotspot_nearby }),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				// console.log(jsonData);
				if (jsonData === undefined || jsonData.length == 0) {
					alert("No record found");
					this.setState({
						hotspot_nearby_with_name: "none",
					});
				} else {
					jsonData.sort(function compare(a, b) {
						return a.straight_distance - b.straight_distance;
					});
					this.setState({
						hotspot_nearby_with_name: jsonData,
					});
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	// rad = (x) => {
	// 	return (x * Math.PI) / 180;
	// };

	// getDistanceBetween = (p1, p2) => {
	// 	// haversine formula
	// 	var R = 6378137; // Earth’s mean radius in meter
	// 	var dLat = this.rad(p2.lat - p1.lat);
	// 	var dLong = this.rad(p2.lng - p1.lng);
	// 	var a =
	// 		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	// 		Math.cos(this.rad(p1.lat)) *
	// 			Math.cos(this.rad(p2.lat)) *
	// 			Math.sin(dLong / 2) *
	// 			Math.sin(dLong / 2);
	// 	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	// 	var d = R * c;
	// 	return d;
	// };

	getHomeLocationRisk = async () => {
		const { saved_home_location, hotspot_data } = this.state;
		var p1 = {
			lat: saved_home_location.home_lat,
			lng: saved_home_location.home_lng,
		};
		// alert(JSON.stringify(hotspot_data));
		var home_risk = false;
		var hotspot_nearby = new Array();

		hotspot_data.forEach(function (item) {
			var p2 = {
				lat: parseFloat(item.place_lat),
				lng: parseFloat(item.place_lng),
			};

			// haversine formula
			var R = 6378137; // earth’s mean radius in meter
			// calculate difference between latitude of 2 places
			var diff_lat = ((p2.lat - p1.lat) * Math.PI) / 180;
			// calculate difference between longitude of 2 places 
			var diff_lng = ((p2.lng - p1.lng) * Math.PI) / 180;
			// calculate the straight-line distance
			var a =
				Math.sin(diff_lat / 2) * Math.sin(diff_lat / 2) +
				Math.cos((p1.lat * Math.PI) / 180) *
					Math.cos((p2.lat * Math.PI) / 180) *
					Math.sin(diff_lng / 2) *
					Math.sin(diff_lng / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c;

			if (d / 1000 <= 1) {
				home_risk = true;
				item.straight_distance = Math.round(d);
				hotspot_nearby.push({
					place_id: item.place_id,
					straight_distance: item.straight_distance,
				});
			}
		});

		if (hotspot_nearby === undefined || hotspot_nearby.length == 0) {
			this.setState({
				hotspot_nearby_with_name: [],
				home_location_risk: home_risk,
			});
		} else {
			this.setState({
				hotspot_nearby: hotspot_nearby,
				home_location_risk: home_risk,
			});
			await this.getHotspotNearbyName();
		}

		// alert(JSON.stringify(this.state.hotspot_nearby));
	};

	componentDidMount = async () => {
		// await this.searchHomeAddress();

		// let { status } = await Location.requestPermissionsAsync();
		// if (status !== "granted") {
		// 	setErrorMsg("Permission to access location was denied");
		// 	this.props.navigation.pop();
		// }
		// let location = await Location.getCurrentPositionAsync({});

		// this.setState({
		// 	region: {
		// 		latitude: location.coords.latitude,
		// 		longitude: location.coords.longitude,
		// 		latitudeDelta: 0.002,
		// 		longitudeDelta: 0.002,
		// 	},
		// 	place_lat: location.coords.latitude,
		// 	place_lng: location.coords.longitude,
		// });
		await this.getUserHomeLocation();
		await this.getAllHotspot();
		await this.getHomeLocationRisk();
	};

	onPressResult = async (place_id, place_name) => {
		// alert(place_id);
		Keyboard.dismiss(); //hide keyboard
		this.setState({
			search_prediction_selected: true,
			search_query: "",
			place_name: place_name,
		});
		await this.getSearchLocation(place_id);
	};

	getHotspotDetails = async (item) => {
		var hotspot_place_id = item.place_id;
		// alert(hotspot_place_id);
		const query_get_hotspot_details = `http://192.168.0.131:5000/getHotspotDetails?place_id=${hotspot_place_id}`;
		console.log(query_get_hotspot_details);
		await axios
			.get(query_get_hotspot_details)
			.then((response) => {
				this.setState({
					current_hotspot_place_details: {
						place_name: response.data.result.name,
						place_address: response.data.result.formatted_address,
						types: response.data.result.types,
						url: response.data.result.url,
						// website: response.data.result.website,
						photo_reference: response.data.result.photos[0].photo_reference,
					},
				});
				// console.log(this.state.current_hotspot_place_details);
			})
			.catch((error) => {
				alert(error);
			});

		var photo_reference = this.state.current_hotspot_place_details
			.photo_reference;
		// alert(photo_reference);
		// const query_get_photo_reference = `http://192.168.0.131:5000/getPhotoReference?photo_reference=${photo_reference}`;
		// await axios
		// 	.get(query_get_photo_reference)
		// 	.then((response) => {
		// 		this.setState({
		// 			current_hotspot_photo_reference: response,
		// 		});
		// 		alert(JSON.stringify(response));
		// 	})
		// 	.catch((error) => {
		// 		alert(error);
		// 	});

		const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=tempapikey`;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onload = () => {
			// alert(xhr.responseURL);
			this.setState({ current_hotspot_photo_reference: xhr.responseURL });
		};
		xhr.send(null);
	};

	setModalVisible_selected_hotspot = (visible, item) => {
		this.setState({ modalVisible_selected_hotspot: visible });
		if (visible) {
			this.getHotspotDetails(item);
		}
	};

	setModalVisible_nearby_hotspot = (visible) => {
		this.setState({ modalVisible_nearby_hotspot: visible });
	};

	render() {
		const {
			latitude,
			longitude,
			saved_home_location,
			hotspot_data,
			home_location_risk,
			modalVisible_selected_hotspot,
			modalVisible_nearby_hotspot,
			current_hotspot_data,
			current_hotspot_place_details,
			current_hotspot_photo_reference,
			hotspot_nearby,
			hotspot_nearby_with_name,
			region,
		} = this.state;

		const mapStyle = [
			{
				featureType: "landscape.man_made",
				elementType: "geometry",
				stylers: [
					{
						color: "#f7f1df",
					},
				],
			},
			{
				featureType: "landscape.natural",
				elementType: "geometry",
				stylers: [
					{
						color: "#d0e3b4",
					},
				],
			},
			{
				featureType: "landscape.natural.terrain",
				elementType: "geometry",
				stylers: [
					{
						visibility: "off",
					},
				],
			},
			// {
			// 	featureType: "poi",
			// 	elementType: "labels",
			// 	stylers: [
			// 		{
			// 			visibility: "off",
			// 		},
			// 	],
			// },
			// {
			// 	featureType: "poi.business",
			// 	elementType: "all",
			// 	stylers: [
			// 		{
			// 			visibility: "off",
			// 		},
			// 	],
			// },
			{
				featureType: "poi.medical",
				elementType: "geometry",
				stylers: [
					{
						color: "#fbd3da",
					},
				],
			},
			{
				featureType: "poi.park",
				elementType: "geometry",
				stylers: [
					{
						color: "#bde6ab",
					},
				],
			},
			// {
			// 	featureType: "road",
			// 	elementType: "geometry.stroke",
			// 	stylers: [
			// 		{
			// 			visibility: "off",
			// 		},
			// 	],
			// },
			// {
			// 	featureType: "road",
			// 	elementType: "labels",
			// 	stylers: [
			// 		{
			// 			visibility: "off",
			// 		},
			// 	],
			// },
			{
				featureType: "road.highway",
				elementType: "geometry.fill",
				stylers: [
					{
						color: "#ffe15f",
					},
				],
			},
			// {
			// 	featureType: "road.highway",
			// 	elementType: "geometry.stroke",
			// 	stylers: [
			// 		{
			// 			color: "#efd151",
			// 		},
			// 	],
			// },
			{
				featureType: "road.arterial",
				elementType: "geometry.fill",
				stylers: [
					{
						color: "#ffffff",
					},
				],
			},
			{
				featureType: "road.local",
				elementType: "geometry.fill",
				stylers: [
					{
						color: "black",
					},
				],
			},
			{
				featureType: "transit.station.airport",
				elementType: "geometry.fill",
				stylers: [
					{
						color: "#cfb2db",
					},
				],
			},
			{
				featureType: "water",
				elementType: "geometry",
				stylers: [
					{
						color: "#a2daf2",
					},
				],
			},
		];
		return (
			<SafeAreaView style={styles.container}>
				{/* <Text style={styles.subtitle_bg}>Home Risk Assessment</Text> */}
				{current_hotspot_data == null ||
				current_hotspot_photo_reference == null ||
				current_hotspot_place_details == null ? (
					<View />
				) : (
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible_selected_hotspot}
						onRequestClose={() => {
							this.setModalVisible_selected_hotspot(
								!modalVisible_selected_hotspot
							);
						}}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								{current_hotspot_data.type == "premise" ? (
									<Text style={styles.check_in_datetime}>
										{"A COVID-19 infected person have checked in to this premise on " +
											current_hotspot_data.check_in_datetime}
									</Text>
								) : current_hotspot_data.type == "residential" ? (
									<Text style={styles.check_in_datetime}>
										{"A COVID-19 infected person lives in this residence"}
									</Text>
								) : (
									<Text style={styles.check_in_datetime}>
										{current_hotspot_data.description}
									</Text>
								)}
								<Image
									style={{ width: 200, height: 200 }}
									source={{
										uri: current_hotspot_photo_reference,
									}}
								/>
								{/* <Text style={styles.premise_name}>
									{current_hotspot_data.premise_name}
								</Text>
								<Text style={styles.premise_address}>
									{current_hotspot_data.premise_address}
								</Text> */}
								<Text style={styles.premise_name}>
									{current_hotspot_place_details.place_name}
								</Text>
								<Text style={styles.premise_address}>
									{current_hotspot_place_details.place_address}
								</Text>
								<Text style={styles.premise_address}>
									{"Types: " + current_hotspot_place_details.types.join(" | ")}
								</Text>
								<TouchableHighlight
									style={{ ...styles.openButton_2, backgroundColor: "grey" }}
									onPress={() =>
										Linking.openURL(current_hotspot_place_details.url)
									}
								>
									<Text style={styles.textStyle}>Open in Google Maps</Text>
								</TouchableHighlight>

								{/* <Text style={styles.modalText}>
									{current_hotspot_data.place_id}
								</Text> */}

								{/* <Text style={styles.modalText}>
									{current_hotspot_place_details.photos_reference}
								</Text> */}

								{/* <Image
									style={{ width: 200, height: 200 }}
									source={{
										uri: current_hotspot_photo_reference,
									}}
								/>
								<Text style={styles.modalText}>
									{"Types: " + current_hotspot_place_details.types.join(", ")}
								</Text>
								<TouchableHighlight
									style={{ ...styles.openButton_2, backgroundColor: "grey" }}
									onPress={() =>
										Linking.openURL(current_hotspot_place_details.url)
									}
								>
									<Text style={styles.textStyle}>Open In Google Maps</Text>
								</TouchableHighlight> */}

								{/* <Text style={styles.modalText}>
									{current_hotspot_place_details.website}
								</Text> */}

								{/* <Text /> */}
								<TouchableHighlight
									style={{
										...styles.openButton_1,
										backgroundColor: "#3cb371",
										width: 150,
									}}
									onPress={() => {
										this.setModalVisible_selected_hotspot(
											!modalVisible_selected_hotspot
										);
									}}
								>
									<Text style={styles.textStyle_1}>OK</Text>
								</TouchableHighlight>
							</View>
						</View>
					</Modal>
				)}

				{hotspot_nearby_with_name == null ? (
					<View />
				) : (
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible_nearby_hotspot}
						onRequestClose={() => {
							this.setModalVisible_nearby_hotspot(!modalVisible_nearby_hotspot);
						}}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text style={styles.modalText}>Nearby Hotspots</Text>
								<View style={styles.flexRow3}>
									<View style={[styles.flexCol, styles.flexCol_wider]}>
										<Text style={styles.premise_name_1}>Premise Name</Text>
									</View>
									<View style={[styles.flexCol, styles.flexCol_narrower]}>
										<Text style={styles.premise_name_1}>Distance</Text>
									</View>
									<View style={[styles.flexCol, styles.flexCol_narrower]}>
										<Text style={styles.premise_name_1}>Map</Text>
									</View>
								</View>
								<ScrollView
									style={{ width: Dimensions.get("window").width * 0.9 }}
								>
									{hotspot_nearby_with_name.map((data) => {
										return (
											<View key={data._id} style={styles.flexRow2}>
												<View style={[styles.flexCol, styles.flexCol_wider]}>
													<Text style={styles.premise_name}>
														{data.returned_name.length > 30
															? data.returned_name.substring(0, 30) + "..."
															: data.returned_name}
													</Text>
												</View>
												<View style={[styles.flexCol, styles.flexCol_narrower]}>
													<Text style={styles.premise_name}>
														{data.straight_distance + " m"}
													</Text>
												</View>
												<View style={[styles.flexCol, styles.flexCol_narrower]}>
													<TouchableHighlight
														style={{
															...styles.openButton_3,
															backgroundColor: "grey",
														}}
														onPress={() =>
															Linking.openURL(
																`https://www.google.com/maps/search/?api=1&query=<address>&query_place_id=${data.place_id}`
															)
														}
													>
														<Text style={styles.textStyle}>Map</Text>
													</TouchableHighlight>
												</View>
											</View>
										);
									})}
								</ScrollView>
								<Text />
								<TouchableHighlight
									style={{
										...styles.openButton_1,
										backgroundColor: "#3cb371",
										width: 150,
									}}
									onPress={() => {
										this.setModalVisible_nearby_hotspot(
											!modalVisible_nearby_hotspot
										);
									}}
								>
									<Text style={styles.textStyle_1}>OK</Text>
								</TouchableHighlight>
							</View>
						</View>
					</Modal>
				)}

				<Text style={styles.title}>Your Home Location</Text>
				<View style={styles.mapOuter}>
					<MapView
						style={styles.mapStyle}
						customMapStyle={mapStyle}
						region={this.state.region}
						loadingEnabled={true}
						loadingIndicatorColor="#666666"
						loadingBackgroundColor="#eeeeee"
						moveOnMarkerPress={false}
						// showsUserLocation={true}
						showsCompass={true}
						showsPointsOfInterest={false}
						provider="google"
					>
						{saved_home_location == null || saved_home_location == "none" ? (
							<View />
						) : (
							<Marker
								// onLoad={() => this.forceUpdate()}
								// key={1}
								coordinate={{
									latitude: saved_home_location.home_lat,
									longitude: saved_home_location.home_lng,
								}}
								title="Your Home Location"
								description={saved_home_location.ic_address}
							>
								<Image
									source={require("../../assets/home_icon.png")}
									style={{ height: 35, width: 35 }}
								/>
							</Marker>
						)}

						{hotspot_data == null || hotspot_data == "none" ? (
							<View />
						) : (
							hotspot_data.map((item) => (
								<Marker
									key={item._id}
									coordinate={{
										latitude: item.place_lat,
										longitude: item.place_lng,
									}}
									// title={item.premise_name}
									// description={item.place_id}
									// description={item.premise_address}
									onPress={() => {
										this.setState({
											current_hotspot_data: item,
											region: {
												latitude: item.place_lat,
												longitude: item.place_lng,
												latitudeDelta: 0.04,
												longitudeDelta: 0.04,
											},
										});
										this.setModalVisible_selected_hotspot(true, item);
									}}
								>
									<Image
										source={require("../../assets/hotspot_icon.png")}
										style={{ height: 35, width: 35 }}
									/>
								</Marker>
							))
						)}
					</MapView>
					<TouchableHighlight
						style={{
							...styles.openButton_refocus,
							backgroundColor: "#6c757d",
						}}
						onPress={() => {
							this.setState({ region: region });
						}}
					>
						<Image
							source={require("../../assets/refocus_icon.png")}
							style={{ height: 20, width: 20 }}
						/>
					</TouchableHighlight>
				</View>

				{home_location_risk == null || hotspot_nearby_with_name == null ? (
					<ActivityIndicator />
				) : home_location_risk === true ? (
					<View style={styles.home_risk_outer_danger}>
						<Text style={styles.subtitle}>
							COVID-19 hotspot have been found within a 1km radius from your
							home location.
						</Text>
						<TouchableHighlight
							style={{
								...styles.openButton,
								backgroundColor: "#1e90ff",
								width: 200,
							}}
							onPress={() => {
								// this.updateResponse();
								this.setModalVisible_nearby_hotspot(true);
							}}
						>
							<Text style={styles.textStyle}>View Nearby Hotspot</Text>
						</TouchableHighlight>
					</View>
				) : (
					<View style={styles.home_risk_outer_safe}>
						<Text style={styles.subtitle_no}>
							No COVID-19 hotspot have been found within a 1km radius from your
							home location.
						</Text>
					</View>
				)}
			</SafeAreaView>

			// 	{/* {news.map((data) => {
			// 			return <Text>{data.url}</Text>;
			// 		})} */}
		);
	}
}

const styles = StyleSheet.create({
	openButton_refocus: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		paddingVertical: 10,
		width: 50,
		elevation: 2,
		position: "absolute",
		top: 30,
		left: 10,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	mapOuter: {
		position: "relative",
	},
	modalText: {
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 16,
		marginBottom: 10,
	},
	flexRow2: {
		flex: 0.1,
		flexDirection: "row",
		marginTop: 10,
		marginBottom: 10,
	},
	flexRow3: {
		flex: 0.1,
		flexDirection: "row",
		marginTop: 20,
		marginBottom: 20,
		width: Dimensions.get("window").width * 0.9,
	},
	flexCol: {
		marginHorizontal: 10,
		width: 110,
		height: 40,
		justifyContent: "center",
		paddingBottom: 15,
	},
	flexCol_wider: {
		width: 170,
	},
	flexCol_narrower: {
		width: 60,
	},
	container: {
		flex: 1,
		backgroundColor: "white",
		alignItems: "center",
		// justifyContent: "center",
		// marginHorizontal: 20,
	},
	title: {
		fontSize: 18,
		textAlign: "center",
		fontWeight: "bold",
		marginTop: 20,
		marginBottom: 5,
		backgroundColor: "lightgrey",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
	},
	check_in_datetime: {
		backgroundColor: "#ff534f",
		width: 300,
		fontSize: 14,
		textAlign: "center",
		marginVertical: 10,
		padding: 10,
		color: "white",
		borderRadius: 10,
	},
	premise_name: {
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 15,
		marginBottom: 10,
	},
	premise_name_1: {
		fontSize: 14,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 15,
	},
	premise_address: {
		fontSize: 14,
		textAlign: "center",
		marginBottom: 10,
	},
	home_risk_outer_danger: {
		borderColor: "#cd5c5c",
		borderWidth: 2,
		backgroundColor: "white",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 20,
		borderRadius: 20,
	},
	home_risk_outer_safe: {
		borderColor: "#5cb55c",
		borderWidth: 2,
		backgroundColor: "white",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 20,
		borderRadius: 20,
	},
	subtitle: {
		fontSize: 15,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 20,
		paddingHorizontal: 20,
		// color: "white",
		// paddingVertical: 10,
	},
	subtitle_no: {
		fontSize: 15,
		fontWeight: "bold",
		textAlign: "center",
		// marginTop: 5,
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	mapStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height / 1.85,
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
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		marginVertical: 20,
	},
	openButton_2: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		marginVertical: 10,
	},
	openButton_3: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		padding: 10,
		elevation: 2,
		marginVertical: 10,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	textStyle_1: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		paddingVertical: 30,
		paddingHorizontal: 10,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton_1: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
});
