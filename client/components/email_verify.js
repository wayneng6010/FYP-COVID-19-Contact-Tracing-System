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
} from "react-native";

export default class email_verify extends React.Component {
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
		};
	}

	sendVerificationEmail = () => {
		// alert(this.state.phone_no);
		const verification_code = Math.floor(100000 + Math.random() * 900000);
		this.setState({ verification_code_correct: verification_code });
		const query_send_tac = `http://192.168.0.131:5000/sendVerificationEmail?email=${this.state.email}&verification_code=${verification_code}`;
		console.log(query_send_tac);
		axios
			.get(query_send_tac)
			.then((result) => {
				if (result) {
					alert("Verification email sent");
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	checkVerificationCode = () => {
		// alert(this.state.tac_code);
		if (this.state.verification_code == this.state.verification_code_correct) {
			alert("Email is verified");
		} else {
			alert("Incorrect verification code");
		}
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Verify your email address</Text>
				<Text>Email</Text>
				<TextInput
					name="email"
					keyboardType="email-address"
					autoCompleteType="email"
					onChangeText={(value) => this.setState({ email: value })}
					value={this.state.email}
					style={{
						borderColor: "#c0cbd3",
						borderWidth: 2,
						width: 300,
					}}
				/>
				<Button
					title="Send Verification Email"
					onPress={() => this.sendVerificationEmail()}
				></Button>

				<Text>Verification code</Text>
				<TextInput
					name="verification_code"
					keyboardType="numeric"
					onChangeText={(value) => this.setState({ verification_code: value })}
					value={this.state.verification_code}
					style={{
						borderColor: "#c0cbd3",
						borderWidth: 2,
						width: 300,
					}}
				/>
				<Button title="Submit" onPress={() => this.checkVerificationCode()}></Button>
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
		justifyContent: "center",
		marginHorizontal: 20,
	},
});
