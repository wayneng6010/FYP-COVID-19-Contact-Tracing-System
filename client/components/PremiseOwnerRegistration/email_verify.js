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

export default class email_verify extends React.Component {
	constructor() {
		super();
		this.state = {
			email: null,
			verification_code: null,
			verification_code_correct: null,
			email_sent: null,
			formDataObj: {
				phone_no_sent: null,
				email_sent: null,
			},
		};
		// alert(this.state.formDataObj.phone_no_sent);
	}

	componentDidMount = () => {};

	sendVerificationEmail = async (email) => {
		const verification_code = Math.floor(100000 + Math.random() * 900000);
		this.setState({ verification_code_correct: verification_code });
		this.setState({ email_sent: email }); // move inside request
		console.log(verification_code);

		await fetch("http://192.168.0.132:5000/sendVerificationEmail", {
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
		const email = this.state.email.trim().replace(/\s/g, "");
		let emailExisted;
		(async () => {
			// used to check if there is same email saved in database
			emailExisted = await fetch(
				"http://192.168.0.132:5000/getExistingEmail_PO",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: email,
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

			if (emailExisted) {
				alert("This email has been registered before");
				return;
			} else {
				this.sendVerificationEmail(email);
			}
		})();
	};

	save_formData = async () => {
		const phone_no_sent = this.props.navigation.state.params.formData
			.phone_no_sent;
		this.setState({
			formDataObj: {
				phone_no_sent: phone_no_sent,
				email_sent: this.state.email_sent,
			},
		});

		return true;
	};

	checkVerificationCode = async () => {
		if (
			this.state.verification_code == null ||
			this.state.verification_code == ""
		) {
			alert("Please enter verification code received");
			return;
		}
		if (this.state.verification_code == this.state.verification_code_correct) {
			// alert("Email is verified");
			let formDataSaved = await this.save_formData();
			ToastAndroid.show("Email is verified", ToastAndroid.SHORT);
			if (formDataSaved) {
				// alert(JSON.stringify(this.state.formDataObj));
				this.props.navigation.replace("premise_info_po", {
					formData: this.state.formDataObj,
				});
			}
		} else {
			alert("Incorrect verification code");
		}
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={[styles.subtitle, styles.subtitle_bg]}>
					Step 2/5: Verify your Email Address
				</Text>
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
				{/* <Button
					title="Send Verification Email"
					onPress={() => this.verifyEmail()}
				></Button> */}
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
						this.setState({ verification_code: value.replace(/[-,. ]/g, "") })
					}
					value={this.state.verification_code}
					style={this.state.email_sent ? styles.input : styles.input_disabled}
				/>

				<Text />
				{/* <Button
					disabled={this.state.email_sent ? false : true}
					title="Submit"
					onPress={() => this.checkVerificationCode()}
				></Button> */}
				<TouchableOpacity
					disabled={this.state.email_sent ? false : true}
					style={
						this.state.email_sent
							? styles.openButton_active
							: styles.openButton_disabled
					}
					onPress={() => this.checkVerificationCode()}
				>
					<Text style={styles.textStyle}>Submit</Text>
				</TouchableOpacity>
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
