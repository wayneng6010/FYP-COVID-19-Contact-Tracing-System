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

	constructor() {
		super();
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
		if (this.state.tac_code == this.state.tac_code_correct) {
			alert("Phone number is verified");
		} else {
			alert("Incorrect TAC code");
		}
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Verify your phone number</Text>
				<Text>Phone Number</Text>
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
				<Button
					title="Send TAC code"
					onPress={() => this.sendTacCode()}
				></Button>

				<Text>TAC code</Text>
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
		justifyContent: "center",
		marginHorizontal: 20,
	},
});
