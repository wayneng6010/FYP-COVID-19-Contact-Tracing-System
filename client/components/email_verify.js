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
			.post(query_send_tac)
			.then((result) => {
				alert("Verification email sent");
			})
			.catch((error) => {
				alert(error);
			});
	};

	checkVerificationCode = () => {
		// alert(this.state.tac_code);
		// if (
		// 	this.state.verification_code !== null &&
		// 	this.state.verification_code_correct !== null
		// ) {
		if (this.state.verification_code == this.state.verification_code_correct) {
			alert("Email is verified");
			this.props.navigation.replace("map_findHomeLocation");
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
					Step 3/4: Verify your Email Address
				</Text>
				<Text style={styles.subtitle}>Email</Text>
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
				<Text />
				<Button
					title="Send Verification Email"
					onPress={() => this.sendVerificationEmail()}
				></Button>

				<Text />
				<Text style={styles.subtitle}>Verification code</Text>
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

				<Text />
				<Button
					title="Submit"
					onPress={() => this.checkVerificationCode()}
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
});
