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

export default class change_password extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};

	constructor() {
		super();
		this.state = {
			password: null,
			npassword: null,
			cpassword: null,
			maxlength: false,
		};
	}

	logout = async () => {
		await fetch("http://192.168.0.131:5000/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(jsonData);
				if (jsonData == "success") {
					// alert("Logout Successful");
					this.props.navigation.navigate("login_premiseOwner");
				} else if (jsonData == "failed") {
					alert("Failed to logout");
				} else {
					alert("Error occured while logout");
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	change_password = async () => {
		await fetch("http://192.168.0.131:5000/change_password_po", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				new_password: this.state.npassword,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(jsonData);
				if (jsonData == "success") {
					alert("Password has been updated");
					this.logout();
				} else if (jsonData == "failed") {
					alert("Password failed to update");
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	verifyPassword = async () => {
		const password = this.state.password,
			npassword = this.state.npassword,
			cpassword = this.state.cpassword;

		var password_verified = false;
		if (
			password == null ||
			password == "" ||
			npassword == null ||
			npassword == "" ||
			cpassword == null ||
			cpassword == ""
		) {
			ToastAndroid.show("Please fill in all the input", ToastAndroid.SHORT);
			return;
		}

		let current_password_correct;
		(async () => {
			// used to check if there is same email saved in database
			current_password_correct = await fetch(
				"http://192.168.0.131:5000/check_current_password_po",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						current_password: password,
					}),
				}
			)
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.json();
				})
				.then((jsonData) => {
					// console.log(jsonData);
					if (jsonData) {
						return true;
					} else {
						return false;
					}
				})
				.catch((error) => {
					alert(error);
				});

			if (!current_password_correct) {
				alert("Current password is incorrect");
				return;
			} else {
				if (npassword !== cpassword) {
					ToastAndroid.show(
						"Password and confirm password does not match",
						ToastAndroid.SHORT
					);
					return;
				} else if (npassword.length < 8) {
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
				this.change_password();
			}
		})();
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

	componentDidMount = () => {};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={[styles.subtitle, styles.subtitle_bg]}>
					Change Password
				</Text>
				<Text style={styles.subtitle}>Current Password</Text>
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

				<Text style={styles.subtitle}>New Password</Text>
				<TextInput
					name="npassword"
					keyboardType="default"
					autoCompleteType="password"
					maxLength={20}
					secureTextEntry={true}
					onChangeText={(value) => this.setState({ npassword: value })}
					value={this.state.npassword}
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
					<Text style={styles.textStyle}>Change Password</Text>
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
