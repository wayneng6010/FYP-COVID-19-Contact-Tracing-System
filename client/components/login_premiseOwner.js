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
} from "react-native";

export default class login_premiseOwner extends React.Component {
	constructor() {
		super();
		this.state = {
			phone_no: null,
			email: null,
			password: null,
			login_with: "phone number",
			alternative_login_with: "email",
		};
	}

	verifyLogin = async () => {
		// var password_verified = false;
		if (this.state.login_with == "phone number") {
			const phone_no = this.state.phone_no,
				password = this.state.password;
			// check login credentials
			await fetch("http://192.168.0.131:5000/login_premiseOwner_phoneNo", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user: {
						phone_no: phone_no,
						password: password,
					},
				}),
			})
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.json();
				})
				.then((jsonData) => {
					// console.log(jsonData);
					if (jsonData) {
						alert("Login successful");
						this.props.navigation.navigate("premiseOwner_home");
					} else {
						alert("Phone number or password is incorrect");
					}
				})
				.catch((error) => {
					alert("Error: " + error);
				});
		} else if (this.state.login_with == "email") {
			const email = this.state.email,
				password = this.state.password;
			// check login credentials
			await fetch("http://192.168.0.131:5000/login_premiseOwner_email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user: {
						email: email,
						password: password,
					},
				}),
			})
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.json();
				})
				.then((jsonData) => {
					// console.log(jsonData);
					if (jsonData) {
						alert("Login successful");
						this.props.navigation.navigate("premiseOwner_home");
					} else {
						alert("Email or password is incorrect");
					}
				})
				.catch((error) => {
					alert("Error: " + error);
				});
		} else {
			alert("Error occurred while logging in");
		}

		// var password_verified = false;

		// if (password_verified) {
		// 	ToastAndroid.show("Password is verified", ToastAndroid.SHORT);
		// 	let formDataSaved = await this.save_formData();
		// 	if (formDataSaved) {
		// 		this.completeRegistration();
		// 		// this.props.navigation.replace("register");
		// 	}
		// } else {
		// 	alert("Phone number or password incorrect");
		// 	return;
		// }
	};

	// onChangePassword = (value) => {
	// 	this.setState({ password: value });
	// 	if (value.length == 20) {
	// 		ToastAndroid.show(
	// 			"Maximum 20 character for password",
	// 			ToastAndroid.SHORT
	// 		);
	// 	}
	// };

	componentDidMount = () => {};

	switchLoginMethod = () => {
		if (this.state.login_with == "phone number") {
			this.setState({
				login_with: "email",
				alternative_login_with: "phone number",
				phone_no: null,
				password: null,
			});
		} else if (this.state.login_with == "email") {
			this.setState({
				login_with: "phone number",
				alternative_login_with: "email",
				email: null,
				password: null,
			});
		} else {
			this.setState({
				login_with: "email",
				alternative_login_with: "phone number",
				phone_no: null,
				password: null,
			});
		}
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.flexRow}>
					<View style={styles.flexCol_1}>
						<Text style={styles.title_reg}>Login as Visitor :</Text>
					</View>
					<View style={styles.flexCol_2}>
						<Text
							style={{
								color: "blue",
								textDecorationLine: "underline",
							}}
							onPress={() =>
								this.props.navigation.navigate("login_visitor_phoneNo")
							}
						>
							Login here
						</Text>
					</View>
				</View>
				<Text style={[styles.subtitle, styles.subtitle_bg]}>
					Premise Owner Login
				</Text>
				{this.state.login_with == "phone number" ? (
					<View>
						<Text style={styles.subtitle}>Phone Number</Text>
						<TextInput
							name="phone_no"
							keyboardType="numeric"
							autoCompleteType="tel"
							maxLength={11}
							placeholder="e.g. 01112345678"
							onChangeText={(value) => this.setState({ phone_no: value })}
							value={this.state.phone_no}
							style={styles.input}
						/>
						<Text />
					</View>
				) : (
					<View>
						<Text style={styles.subtitle}>Email</Text>
						<TextInput
							name="email"
							keyboardType="email-address"
							autoCompleteType="email"
							autoCapitalize="words"
							maxLength={30}
							placeholder="e.g. username@gmail.com"
							onChangeText={(value) => this.setState({ email: value })}
							value={this.state.phone_no}
							style={styles.input}
						/>
						<Text />
					</View>
				)}

				<Text style={styles.subtitle}>Password</Text>
				<TextInput
					name="password"
					keyboardType="default"
					autoCompleteType="password"
					maxLength={20}
					secureTextEntry={true}
					onChangeText={(value) => this.setState({ password: value })}
					value={this.state.password}
					style={styles.input}
				/>

				<View style={styles.right_link}>
					<Text
						style={{
							color: "#113c62",
							textDecorationLine: "underline",
							fontWeight: "bold",
							textAlign: "right",
						}}
						onPress={() => this.switchLoginMethod()}
					>
						Login with {this.state.alternative_login_with}
					</Text>
				</View>
				<View style={styles.right_link}>
					<Text
						style={{
							color: "grey",
							textDecorationLine: "underline",
							fontWeight: "bold",
							textAlign: "right",
						}}
						onPress={() => this.props.navigation.navigate("forgot_password_po")}
					>
						Forgot password?
					</Text>
				</View>

				<Text />
				<View
					style={{
						width: 300,
					}}
				>
					<Button title="Login" onPress={() => this.verifyLogin()}></Button>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
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
	flexRow: {
		backgroundColor: "white",
		borderRadius: 5,
		width: "95%",
		flex: 0.1,
		flexDirection: "row",
		marginVertical: 20,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		paddingVertical: 10,
	},
	flexCol_1: {
		marginHorizontal: 10,
		width: 200,
		height: 40,
		// backgroundColor: "grey",
		alignItems: "center",
		justifyContent: "center",
	},
	flexCol_2: {
		width: 100,
		height: 40,
		// backgroundColor: "grey",
		alignItems: "center",
		justifyContent: "center",
	},
	right_link: {
		width: 300,
		marginTop: 20,
	},
});
