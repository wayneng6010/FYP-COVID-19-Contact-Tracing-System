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
	TouchableOpacity,
} from "react-native";

export default class forgot_password_po extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};

	constructor() {
		super();
		this.state = {
			email: null,
			verification_code: null,
			verification_code_correct: null,
			email_sent: null,
			email_verified: false,
			password: null,
			cpassword: null,
			maxlength: false,
		};
		// alert(this.state.formDataObj.phone_no_sent);
	}

	componentDidMount = () => {};

	sendVerificationEmail = async (email) => {
		// alert(JSON.stringify(this.state.formDataObj));
		// alert(this.state.phone_no);

		const verification_code = Math.floor(100000 + Math.random() * 900000);
		this.setState({ verification_code_correct: verification_code });
		this.setState({ email_sent: email }); // move inside request

		// const query_send_tac = `http://192.168.0.131:5000/sendVerificationEmail?email=${email}&verification_code=${verification_code}`;
		console.log(verification_code);
		// axios
		// 	.post(query_send_tac)
		// 	.then((result) => {
		// 		// alert("Verification email sent");
		// 		ToastAndroid.show("Verification email sent", ToastAndroid.SHORT);
		// 	})
		// 	.catch((error) => {
		// 		alert(error);
		// 	});

		await fetch("http://192.168.0.131:5000/sendVerificationEmail_fp", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				item: {
					email: email,
					verification_code: verification_code,
				},
			}),
		})
			.then((response) => {
				if (response) {
					ToastAndroid.show("Verification email sent", ToastAndroid.SHORT);
				} else {
					ToastAndroid.show(
						"Verification email failed to send",
						ToastAndroid.SHORT
					);
				}
			})
			.catch((error) => {
				ToastAndroid.show(
					"Verification email failed to send",
					ToastAndroid.SHORT
				);
				alert(error);
			});
	};

	verifyEmail = async () => {
		if (this.state.email == null || this.state.email == "") {
			alert("Please enter your email address");
			return;
		} else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email) === false) {
			alert("Invalid email address");
			return;
		}
		const email = this.state.email.trim().replace(/\s/g, ""); // white space

		let emailExisted;
		(async () => {
			// used to check if there is same email saved in database
			emailExisted = await fetch("http://192.168.0.131:5000/getExistingEmail_PO", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
				}),
			})
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

			if (!emailExisted) {
				alert("This email is not registered. Please register a new account.");
				return;
			} else {
				this.sendVerificationEmail(email);
			}
		})();
	};

	checkVerificationCode = async () => {
		// alert(this.state.tac_code);
		// if (
		// 	this.state.verification_code !== null &&
		// 	this.state.verification_code_correct !== null
		// ) {
		if (
			this.state.verification_code == null ||
			this.state.verification_code == ""
		) {
			alert("Please enter verification code received");
			return;
		}
		if (this.state.verification_code == this.state.verification_code_correct) {
			// alert("Email is verified");
			ToastAndroid.show("Email is verified", ToastAndroid.SHORT);
			this.setState({ email_verified: true });
		} else {
			alert("Incorrect verification code");
		}
		// } else {
		// 	alert("Please insert verification code");
		// }
	};

	change_password = async () => {
		if (!this.state.email_verified) {
			return;
		}
		await fetch("http://192.168.0.131:5000/change_password_forgot_password_po", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				new_password: this.state.password,
				email: this.state.email_sent,
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
					this.props.navigation.pop();
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
		} else if (password.length > 20) {
			ToastAndroid.show(
				"Password should be maximum 20 characters",
				ToastAndroid.SHORT
			);
			return;
		} else {
			password_verified = true;
		}

		if (password_verified) {
			ToastAndroid.show("Password is verified", ToastAndroid.SHORT);
			this.change_password();
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

	render() {
		const { email_verified } = this.state;
		return (
			<SafeAreaView style={styles.container}>
				<Text style={[styles.subtitle, styles.subtitle_bg]}>
					Forgot Password (Premise Owner)
				</Text>
				{!email_verified ? (
					<View style={{ flex: 1, alignItems: "center" }}>
						<Text style={styles.subtitle}>Your Email</Text>
						<TextInput
							name="email"
							keyboardType="email-address"
							autoCompleteType="email"
							autoCapitalize="none"
							placeholder="e.g. username@gmail.com"
							maxLength={30}
							onChangeText={(value) => this.setState({ email: value })}
							value={this.state.email}
							style={styles.input}
						/>
						<Text />

						<TouchableHighlight
							style={{
								...styles.openButton,
								backgroundColor: "#3cb371",
							}}
							onPress={() => this.verifyEmail()}
						>
							<Text style={styles.textStyle}>Send Verification Email</Text>
						</TouchableHighlight>

						<Text />
						<Text />
						<Text style={styles.subtitle}>Verification code</Text>
						<TextInput
							name="verification_code"
							keyboardType="numeric"
							maxLength={6}
							editable={this.state.email_sent ? true : false}
							selectTextOnFocus={this.state.email_sent ? true : false}
							onChangeText={(value) =>
								this.setState({
									verification_code: value.replace(/[-,. ]/g, ""),
								})
							}
							value={this.state.verification_code}
							style={
								this.state.email_sent ? styles.input : styles.input_disabled
							}
						/>

						<Text />

						<TouchableOpacity
							disabled={this.state.email_sent ? false : true}
							style={
								this.state.email_sent
									? styles.openButton_active
									: styles.openButton_disabled
							}
							onPress={() => this.checkVerificationCode()}
						>
							<Text style={styles.textStyle}>Confirm</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View style={{ flex: 1, alignItems: "center" }}>
						<Text style={styles.subtitle}>New Password</Text>
						<TextInput
							name="password"
							keyboardType="default"
							autoCompleteType="password"
							maxLength={20}
							secureTextEntry={true}
							onChangeText={(value) => this.onChangePassword(value)}
							value={this.state.password}
							style={styles.input}
						/>
						<Text />

						<Text style={styles.subtitle}>Confirm New Password</Text>
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

						<TouchableHighlight
							style={{
								...styles.openButton,
								backgroundColor: "#1e90ff",
							}}
							onPress={() => this.verifyPassword()}
						>
							<Text style={styles.textStyle}>Change Password</Text>
						</TouchableHighlight>
					</View>
				)}
			</SafeAreaView>
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
	openButton_active: {
		backgroundColor: "#1e90ff",
		borderRadius: 5,
		paddingVertical: 10,
		width: 200,
		elevation: 2,
	},
	openButton_disabled: {
		backgroundColor: "lightgrey",
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
	input_disabled: {
		borderColor: "#c0cbd3",
		borderWidth: 2,
		width: 300,
		paddingVertical: 5,
		paddingHorizontal: 10,
		backgroundColor: "lightgrey",
	},
});
