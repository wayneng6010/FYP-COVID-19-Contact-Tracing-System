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

export default class change_email extends React.Component {
	constructor() {
		super();
		this.state = {
			email: null,
			verification_code: null,
			verification_code_correct: null,
			email_sent: null,
		};
		// alert(this.state.formDataObj.phone_no_sent);
	}

	componentDidMount = () => {
		// alert(JSON.stringify(this.props.navigation.state.params.formData));
		// this.setState({
		// 	formDataObj: {
		// 		ic_num: this.props.navigation.state.params.formData.ic_num,
		// 		ic_fname: this.props.navigation.state.params.formData.ic_fname,
		// 		ic_address: this.props.navigation.state.params.formData.ic_address,
		// 		phone_no_sent: this.props.navigation.state.params.formData
		// 			.phone_no_sent,
		// 		email_sent: null,
		// 	},
		// });
	};

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

		await fetch("http://192.168.0.131:5000/sendVerificationEmail", {
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
			emailExisted = await fetch("http://192.168.0.131:5000/getExistingEmail", {
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

			if (emailExisted) {
				alert("This email has been registered before");
				return;
			} else {
				this.sendVerificationEmail(email);
			}
		})();
	};

	update_email = async () => {
		await fetch("http://192.168.0.131:5000/update_email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				new_email: this.state.email_sent,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(jsonData);
				if (jsonData == "success") {
					alert("Email address has been updated");
					this.props.navigation.pop();
				} else if (jsonData == "failed") {
					alert("Email address failed to update");
				}
			})
			.catch((error) => {
				alert(error);
			});
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
			this.update_email();
		} else {
			alert("Incorrect verification code");
		}
		// } else {
		// 	alert("Please insert verification code");
		// }
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={[styles.subtitle, styles.subtitle_bg]}>
					Update Email Address
				</Text>
				<Text style={styles.subtitle}>Your New Email</Text>
				<TextInput
					name="email"
					keyboardType="email-address"
					autoCompleteType="email"
					placeholder="e.g. username@gmail.com"
					autoCapitalize="none"
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
					editable={this.state.email_sent ? true : false}
					selectTextOnFocus={this.state.email_sent ? true : false}
					onChangeText={(value) => this.setState({ verification_code: value })}
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
					<Text style={styles.textStyle}>Update</Text>
				</TouchableOpacity>
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
