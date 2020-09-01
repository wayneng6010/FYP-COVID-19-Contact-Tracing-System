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
	Form,
	Item,
	Input,
	Label,
	TextInput,
	ToastAndroid,
} from "react-native";

export default class phoneNo_verify extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			phone_no: "",
			tac_code: null,
			tac_code_correct: null,
			phone_no_sent: null,
			formDataObj: {
				phone_no_sent: null,
			},
		};
	}

	sendTacCode = async (phone_no) => {
		const tac_code = Math.floor(100000 + Math.random() * 900000),
			phone_no_sent = phone_no;
		this.setState({ tac_code_correct: tac_code });
		this.setState({ phone_no_sent: phone_no_sent }); // move this line inside query

		// const query_send_tac = `http://192.168.0.131:5000/sendTacCode?phone_no=${phone_no}&tac_code=${tac_code}`;
		// console.log(query_send_tac);
		// axios
		// 	.get(query_send_tac)
		// 	.then((result) => {
		// 		if (result) {
		// 			// alert("Tac code sent");
		// 			ToastAndroid.show("Tac code sent", ToastAndroid.SHORT);
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		ToastAndroid.show("Tac code failed to sent", ToastAndroid.SHORT);
		// 		alert(error);
		// 	});

		console.log(tac_code);
		await fetch("http://192.168.0.131:5000/sendTacCode", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				item: {
					phone_no: phone_no,
					tac_code: tac_code,
				},
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(jsonData);
				if (jsonData == "success") {
					ToastAndroid.show("Tac code sent", ToastAndroid.SHORT);
				} else if (jsonData == "failed") {
					ToastAndroid.show("Tac code failed to sent", ToastAndroid.SHORT);
				}
			})
			.catch((error) => {
				ToastAndroid.show("Tac code failed to sent", ToastAndroid.SHORT);
				alert(error);
			});
	};

	verifyPhoneNo = async () => {
		const phone_no = this.state.phone_no.trim().replace(/\s/g, "");
		if (phone_no == null || phone_no == "") {
			alert("Please enter your phone number");
			return;
		} else if (/\D/.test(phone_no)) {
			// if contains non-digit character
			alert("Please enter number only");
			return;
		} else if (phone_no.substring(0, 1) !== "0") {
			alert("Invalid phone number");
			return;
		} else if (
			phone_no.substring(0, 2) == "04" &&
			(phone_no.length < 9 || phone_no.length > 10)
		) {
			alert("Invalid phone number");
			return;
		} else if (
			phone_no.substring(0, 2) == "01" &&
			(phone_no.length < 10 || phone_no.length > 11)
		) {
			alert("Invalid phone number");
			return;
		}

		let phoneNoExisted;
		(async () => {
			// used to check if there is same phone number saved in database
			phoneNoExisted = await fetch(
				"http://192.168.0.131:5000/getExistingPhoneNo_PO",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						phone_no: phone_no,
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

			if (phoneNoExisted) {
				alert("This phone number has been registered before");
				return;
			} else {
				this.sendTacCode(phone_no);
			}
		})();
	};

	componentDidMount = () => {};

	save_formData = async () => {
		this.setState({
			formDataObj: {
				phone_no_sent: this.state.phone_no_sent,
			},
		});
		return true;
	};

	checkTacCode = async () => {
		// alert(this.state.tac_code);
		// if (this.state.tac_code !== null && this.state.tac_code_correct !== null) {
		if (this.state.tac_code == null || this.state.tac_code == "") {
			alert("Please enter TAC code received");
			return;
		}
		if (this.state.tac_code == this.state.tac_code_correct) {
			// await this.save_session();
			// alert("Phone number is verified");
			let formDataSaved = await this.save_formData();
			ToastAndroid.show("Phone number is verified", ToastAndroid.SHORT);
			if (formDataSaved) {
				this.props.navigation.replace("email_verify_po", {
					formData: this.state.formDataObj,
				});
			}
		} else {
			alert("Incorrect TAC code");
		}
		// } else {
		// alert("Please insert TAC code")
		// }
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={[styles.subtitle, styles.subtitle_bg]}>
					Step 1/5: Verify your Phone Number
				</Text>
				<Text style={styles.subtitle}>Your Phone Number</Text>
				<TextInput
					name="phone_no"
					keyboardType="numeric"
					autoCompleteType="tel"
					onChangeText={(value) => this.setState({ phone_no: value })}
					value={this.state.phone_no}
					style={styles.input}
					placeholder="e.g. 01612345678"
				/>
				<Text />
				<Button
					title="Send TAC code"
					onPress={() => this.verifyPhoneNo()}
				></Button>

				<Text />
				<Text />
				<Text style={styles.subtitle}>TAC code</Text>
				<TextInput
					name="tac_code"
					keyboardType="numeric"
					onChangeText={(value) => this.setState({ tac_code: value })}
					editable={this.state.phone_no_sent ? true : false}
					selectTextOnFocus={this.state.phone_no_sent ? true : false}
					value={this.state.tac_code}
					style={
						this.state.phone_no_sent ? styles.input : styles.input_disabled
					}
					placeholder="Six digit TAC code received by SMS"
				/>
				<Text />
				<Button
					disabled={this.state.phone_no_sent ? false : true}
					title="Submit"
					onPress={() => this.checkTacCode()}
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
