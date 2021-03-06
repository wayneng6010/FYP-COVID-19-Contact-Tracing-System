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
	TouchableHighlight,
	TouchableOpacity,
} from "react-native";

export default class change_phone_no extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			phone_no: "",
			tac_code: null,
			tac_code_correct: null,
			phone_no_sent: null,
		};
	}

	sendTacCode = async (phone_no) => {
		const tac_code = Math.floor(100000 + Math.random() * 900000),
			phone_no_sent = phone_no;
		this.setState({ tac_code_correct: tac_code });
		this.setState({ phone_no_sent: phone_no_sent }); // move this line inside query

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
		var phone_no = this.state.phone_no;
		this.setState({ phone_no: phone_no });
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
		phone_no = this.state.phone_no.trim().replace(/\s/g, "");

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

	update_phone_no = async () => {
		await fetch("http://192.168.0.131:5000/update_phone_no_po", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				new_phone_no: this.state.phone_no_sent,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(jsonData);
				if (jsonData == "success") {
					alert("Phone number has been updated");
					this.props.navigation.pop();
				} else if (jsonData == "failed") {
					alert("Phone number failed to update");
				}
			})
			.catch((error) => {
				alert(error);
			});
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
			ToastAndroid.show("Phone number is verified", ToastAndroid.SHORT);
			this.update_phone_no();
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
					Update Phone Number
				</Text>
				<Text style={styles.subtitle}>Your New Phone Number</Text>
				<TextInput
					name="phone_no"
					keyboardType="numeric"
					autoCompleteType="tel"
					maxLength={11}
					onChangeText={(value) =>
						this.setState({ phone_no: value.replace(/[-,. ]/g, "") })
					}
					value={this.state.phone_no}
					style={styles.input}
					placeholder="e.g. 01612345678"
				/>
				<Text />
				{/* <Button
					title="Send TAC code"
					onPress={() => this.verifyPhoneNo()}
				></Button> */}
				<TouchableHighlight
					style={{
						...styles.openButton,
						backgroundColor: "#3cb371",
					}}
					onPress={() => this.verifyPhoneNo()}
				>
					<Text style={styles.textStyle}>Send TAC code</Text>
				</TouchableHighlight>

				<Text />
				<Text />
				<Text style={styles.subtitle}>TAC code</Text>
				<TextInput
					name="tac_code"
					keyboardType="numeric"
					onChangeText={(value) =>
						this.setState({ tac_code: value.replace(/[-,. ]/g, "") })
					}
					maxLength={6}
					editable={this.state.phone_no_sent ? true : false}
					selectTextOnFocus={this.state.phone_no_sent ? true : false}
					value={this.state.tac_code}
					style={
						this.state.phone_no_sent ? styles.input : styles.input_disabled
					}
					placeholder="Six digit TAC code received by SMS"
				/>
				<Text />
				{/* <Button
					disabled={this.state.phone_no_sent ? false : true}
					title="Submit"
					onPress={() => this.checkTacCode()}
				></Button> */}
				<TouchableOpacity
					disabled={this.state.phone_no_sent ? false : true}
					style={
						this.state.phone_no_sent
							? styles.openButton_active
							: styles.openButton_disabled
					}
					onPress={() => this.checkTacCode()}
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
