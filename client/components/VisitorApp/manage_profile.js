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
	TextInput,
	ToastAndroid,
	TouchableHighlight,
	ActivityIndicator,
	Image,
	Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default class manage_profile extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};

	constructor() {
		super();
		this.state = {
			password: null,
			cpassword: null,
			user_info: null,
			region: null,
		};
	}

	completeRegistration = async () => {
		// const query_save_registration = `http://192.168.0.131:5000/save_registration?password=${this.state.password}`;
		// console.log(query_save_registration);
		// await axios
		// 	.post(query_save_registration)
		// alert(JSON.stringify(this.state.formDataObj));
		await fetch("http://192.168.0.131:5000/save_registration", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				formData: this.state.formDataObj,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// console.log(jsonData);
				if (jsonData == "success") {
					alert("Registration Complete");
					// this.props.navigation.navigate("visitor_home");
				} else {
					alert("Registration Failed");
				}
			})
			// .then((response) => {
			// 	if (response) {
			// 		alert("Registration Complete");
			// 	} else {
			// 		alert("Registration Failed");
			// 	}
			// })
			.catch((error) => {
				alert(error);
			});
	};

	verifyPassword = async () => {
		const password = this.state.password,
			cpassword = this.state.cpassword;
		var password_verified = false;
		if (
			password == null ||
			password == "" ||
			cpassword == null ||
			cpassword == ""
		) {
			ToastAndroid.show(
				"Please enter both password and confirm password",
				ToastAndroid.SHORT
			);
			return;
		} else if (password !== cpassword) {
			ToastAndroid.show(
				"Password and confirm password does not match",
				ToastAndroid.SHORT
			);
			return;
		} else if (password.length < 8) {
			ToastAndroid.show(
				"Password should be at least 8 characters",
				ToastAndroid.SHORT
			);
			return;
		} else {
			password_verified = true;
		}

		if (password_verified) {
			ToastAndroid.show("Password is verified", ToastAndroid.SHORT);
		} else {
			alert("Password not verified");
			return;
		}
	};

	onChangePassword = (value) => {
		this.setState({ password: value });
		if (value.length == 20) {
			ToastAndroid.show(
				"Maximum 20 character for password",
				ToastAndroid.SHORT
			);
		}
	};

	getUserInfo = async () => {
		await fetch("http://192.168.0.131:5000/get_user_info", {
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
				// console.log(jsonData);
				if (!jsonData) {
					this.setState({ user_info: "none" });
				} else {
					this.setState({
						user_info: jsonData,
						region: {
							latitude: jsonData.home_lat,
							longitude: jsonData.home_lng,
							latitudeDelta: 0.002,
							longitudeDelta: 0.002,
						},
					});
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	componentDidMount = async () => {
		this.getUserInfo();
		const { navigation } = this.props;
		this.focusListener = navigation.addListener("didFocus", () => {
			this.getUserInfo();
		});
	};

	render() {
		const { user_info, region } = this.state;
		return (
			<SafeAreaView style={styles.container}>
				{/* <Text style={[styles.subtitle, styles.subtitle_bg]}>
					Manage Profile
				</Text> */}
				<Text style={styles.subtitle_lightbg}>
					IC number, full name and residential address are not editable as it
					has been verified
				</Text>
				<Text />
				{user_info == null ? (
					<ActivityIndicator />
				) : (
					<ScrollView style={styles.user_info_outer}>
						<Text style={styles.user_info_subtitle}>IC No.</Text>
						<Text style={styles.user_info}>{user_info.ic_num}</Text>
						<Text />

						<Text style={styles.user_info_subtitle}>Full Name</Text>
						<Text style={styles.user_info}>{user_info.ic_fname}</Text>
						<Text />

						<Text style={styles.user_info_subtitle}>Residential Address</Text>
						<Text style={styles.user_info}>{user_info.ic_address}</Text>
						<Text />

						<View
							style={{
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<Text
								style={{
									...styles.user_info_subtitle,
									flex: 0.35,
								}}
							>
								Phone No.
							</Text>
							<TouchableHighlight
								style={{
									...styles.edit_btn,
									flex: 0.15,
									backgroundColor: "#3cb371",
								}}
								onPress={() => {
									this.props.navigation.navigate("change_phone_no");
								}}
							>
								<Image
									source={require("../../assets/edit_icon.png")}
									style={{ height: 15, width: 15 }}
								/>
							</TouchableHighlight>
						</View>
						<Text style={styles.user_info}>{user_info.phone_no}</Text>
						<Text />

						<View
							style={{
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<Text style={{ ...styles.user_info_subtitle, flex: 0.2 }}>
								Email
							</Text>
							<TouchableHighlight
								style={{
									...styles.edit_btn,
									flex: 0.15,
									backgroundColor: "#3cb371",
								}}
								onPress={() => {
									this.props.navigation.navigate("change_email");
								}}
							>
								<Image
									source={require("../../assets/edit_icon.png")}
									style={{ height: 15, width: 15 }}
								/>
							</TouchableHighlight>
						</View>
						<Text style={styles.user_info}>{user_info.email}</Text>
						<Text />

						<Text style={styles.user_info_subtitle}>Password</Text>
						<TouchableHighlight
							style={{
								...styles.openButton,
								width: 200,
								backgroundColor: "#1e90ff",
							}}
							onPress={() => {
								this.props.navigation.navigate("change_password");
							}}
						>
							<Text style={styles.textStyle}>Change Password</Text>
						</TouchableHighlight>
						<Text />

						<View
							style={{
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<Text
								style={{
									...styles.user_info_subtitle,
									flex: 0.45,
								}}
							>
								Home Location
							</Text>
							<TouchableHighlight
								style={{
									...styles.edit_btn,
									flex: 0.15,
									backgroundColor: "#3cb371",
								}}
								onPress={() => {
									this.props.navigation.navigate("change_home_location");
								}}
							>
								<Image
									source={require("../../assets/edit_icon.png")}
									style={{ height: 15, width: 15 }}
								/>
							</TouchableHighlight>
						</View>
						<View style={styles.mapOuter}>
							<MapView
								style={styles.mapStyle}
								// customMapStyle={mapStyle}
								region={region}
								loadingEnabled={true}
								loadingIndicatorColor="#666666"
								loadingBackgroundColor="#eeeeee"
								moveOnMarkerPress={false}
								// showsUserLocation={true}
								showsCompass={true}
								showsPointsOfInterest={false}
								provider="google"
							>
								<Marker
									coordinate={{
										latitude: user_info.home_lat,
										longitude: user_info.home_lng,
									}}
									title="Your Home Location"
									description={user_info.ic_address}
								>
									<Image
										source={require("../../assets/home_icon.png")}
										style={{ height: 35, width: 35 }}
									/>
								</Marker>
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
						<Text />
						{/* <Text style={styles.subtitle}>Password</Text>
						<TextInput
							name="password"
							keyboardType="default"
							autoCompleteType="password"
							maxLength={20}
							secureTextEntry={true}
							// onChangeText={(value) => this.setState({ password: value })}
							onChangeText={(value) => this.onChangePassword(value)}
							value={this.state.password}
							style={styles.input}
						/>
						<Text />

						<Text style={styles.subtitle}>Confirm Password</Text>
						<TextInput
							name="cpassword"
							keyboardType="default"
							autoCompleteType="password"
							maxLength={20}
							secureTextEntry={true}
							onChangeText={(value) => this.setState({ cpassword: value })}
							value={this.state.cpassword}
							style={styles.input}
						/>
						<Text />
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<TouchableHighlight
								style={{ ...styles.openButton, backgroundColor: "#3cb371" }}
								onPress={() => {
									this.onSubmit();
								}}
							>
								<Text style={styles.textStyle}>Update</Text>
							</TouchableHighlight>
						</View>
						<Text /> */}
					</ScrollView>
				)}
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	subtitle_lightbg: {
		fontSize: 14,
		textAlign: "center",
		marginTop: 10,
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: "#F2F2F2",
	},
	mapOuter: {
		position: "relative",
	},
	mapStyle: {
		width: "100%",
		height: 300,
		marginTop: 10,
		marginBottom: 20,
	},
	container: {
		flex: 1,
		backgroundColor: "white",
		alignItems: "center",
		// justifyContent: "center",
		marginHorizontal: 20,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		marginVertical: 20,
		fontWeight: "bold",
	},
	subtitle: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 10,
	},
	user_info_outer: {
		width: "100%",
		paddingHorizontal: "10%",
	},
	user_info_subtitle: {
		fontSize: 16,
		marginBottom: 5,
		fontWeight: "bold",
	},
	user_info: {
		fontSize: 16,
		color: "grey",
	},
	subtitle_bg: {
		marginVertical: 20,
		backgroundColor: "lightgrey",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
	},
	input: {
		borderColor: "#c0cbd3",
		borderWidth: 2,
		width: 300,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		paddingVertical: 10,
		width: 120,
		elevation: 2,
	},
	edit_btn: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		paddingVertical: 10,
		width: 50,
		elevation: 2,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	openButton_refocus: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		paddingVertical: 10,
		width: 50,
		elevation: 2,
		position: "absolute",
		top: 15,
		left: 5,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
});
