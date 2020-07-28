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
} from "react-native";

export default class phoneNo_verify extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	constructor(props) {
		super(props);
		this.state = {
			phone_no: null,
			tac_code: null,
			tac_code_correct: null,
		};
	}

	sendTacCode = () => {
		// alert(this.state.phone_no);
		const tac_code = Math.floor(100000 + Math.random() * 900000);
		this.setState({ tac_code_correct: tac_code });
		const query_send_tac = `http://192.168.0.131:5000/sendTacCode?phone_number=${this.state.phone_no}&tac_code=${tac_code}`;
		console.log(query_send_tac);
		axios
			.get(query_send_tac)
			.then((result) => {
				if (result) {
					alert("Tac code sent");
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	checkTacCode = () => {
		// alert(this.state.tac_code);
		// if (this.state.tac_code !== null && this.state.tac_code_correct !== null) {
		if (this.state.tac_code == this.state.tac_code_correct) {
			alert("Phone number is verified");
			this.props.navigation.replace("email_verify");
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
					Step 2/4: Verify your Phone Number
				</Text>
				<Text style={styles.subtitle}>Phone Number</Text>
				<TextInput
					name="phone_no"
					keyboardType="numeric"
					autoCompleteType="tel"
					onChangeText={(value) => this.setState({ phone_no: value })}
					value={this.state.phone_no}
					style={{
						borderColor: "#c0cbd3",
						borderWidth: 2,
						width: 300,
					}}
				/>
				<Text></Text>
				<Button
					title="Send TAC code"
					onPress={() => this.sendTacCode()}
				></Button>

				<Text></Text>
				<Text style={styles.subtitle}>TAC code</Text>
				<TextInput
					name="tac_code"
					keyboardType="numeric"
					onChangeText={(value) => this.setState({ tac_code: value })}
					value={this.state.tac_code}
					style={{
						borderColor: "#c0cbd3",
						borderWidth: 2,
						width: 300,
					}}
				/>
				<Text></Text>
				<Button title="Submit" onPress={() => this.checkTacCode()}></Button>
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
