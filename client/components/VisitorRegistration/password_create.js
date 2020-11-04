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
} from "react-native";

export default class password_create extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.132:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};

	constructor() {
		super();
		this.state = {
			password: null,
			cpassword: null,
			maxlength: false,
			formDataObj: {
				ic_num: null,
				ic_fname: null,
				ic_address: null,
				phone_no_sent: null,
				email_sent: null,
				place_id: null,
				place_lat: null,
				place_lng: null,
				password: null,
			},
		};
	}

	// save_session = async () => {
	// 	const query_save_email = `http://192.168.0.132:5000/save_email?email=${this.state.email}`;
	// 	console.log(query_save_email);
	// 	await axios
	// 		.post(query_save_email)
	// 		.then((response) => {
	// 			console.log("password session saved");
	// 		})
	// 		.catch((error) => {
	// 			alert(error);
	// 		});
	// };

	completeRegistration = async () => {
		// const query_save_registration = `http://192.168.0.132:5000/save_registration?password=${this.state.password}`;
		// console.log(query_save_registration);
		// await axios
		// 	.post(query_save_registration)
		// alert(JSON.stringify(this.state.formDataObj));
		await fetch("http://192.168.0.132:5000/save_registration", {
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

	save_formData = async () => {
		const ic_num = this.props.navigation.state.params.formData.ic_num,
			ic_fname = this.props.navigation.state.params.formData.ic_fname,
			ic_address = this.props.navigation.state.params.formData.ic_address,
			phone_no_sent = this.props.navigation.state.params.formData.phone_no_sent,
			email_sent = this.props.navigation.state.params.formData.email_sent,
			place_id = this.props.navigation.state.params.formData.place_id,
			place_lat = this.props.navigation.state.params.formData.place_lat,
			place_lng = this.props.navigation.state.params.formData.place_lng;
		this.setState({
			formDataObj: {
				ic_num: ic_num,
				ic_fname: ic_fname,
				ic_address: ic_address,
				phone_no_sent: phone_no_sent,
				email_sent: email_sent,
				place_id: place_id,
				place_lat: place_lat,
				place_lng: place_lng,
				password: this.state.password,
			},
		});
		return true;
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
			let formDataSaved = await this.save_formData();
			if (formDataSaved) {
				this.completeRegistration();
				this.props.navigation.replace("welcome");
			}
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

	componentDidMount = () => {
		// alert(JSON.stringify(this.props.navigation.state.params.formData));
		// this.setState({
		// 	formDataObj: {
		// 		ic_num: this.props.navigation.state.params.formData.ic_num,
		// 		ic_fname: this.props.navigation.state.params.formData.ic_fname,
		// 		ic_address: this.props.navigation.state.params.formData.ic_address,
		// 		phone_no_sent: this.props.navigation.state.params.formData
		// 			.phone_no_sent,
		// 		email_sent: this.props.navigation.state.params.formData.email_sent,
		// 		place_id: this.props.navigation.state.params.formData.place_id,
		// 		place_lat: this.props.navigation.state.params.formData.place_lat,
		// 		place_lng: this.props.navigation.state.params.formData.place_lng,
		// 		password: null,
		// 	},
		// });
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={[styles.subtitle, styles.subtitle_bg]}>
					Step 5/5: Create a Password
				</Text>
				<Text style={styles.subtitle}>Password</Text>
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
				<Text />

				{/* <Button
					title="Complete Registration"
					onPress={() => this.verifyPassword()}
				></Button> */}

				<TouchableHighlight
					style={{
						...styles.openButton,
						backgroundColor: "#1e90ff",
					}}
					onPress={() => this.verifyPassword()}
				>
					<Text style={styles.textStyle}>Complete Registration</Text>
				</TouchableHighlight>
			</SafeAreaView>

			// 	{/* {news.map((data) => {
			// 			return <Text>{data.url}</Text>;
			// 		})} */}
		);
	}
}

const styles = StyleSheet.create({
	openButton: {
		backgroundColor: "#F194FF",
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
		marginVertical: 10,
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
});
