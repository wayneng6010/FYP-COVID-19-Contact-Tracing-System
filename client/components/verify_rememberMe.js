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
	ActivityIndicator,
} from "react-native";

export default class verify_rememberMe extends React.Component {
	// const captureIC = () => {};
	constructor(props) {
		super(props);
		this.state = {
			isLogin: false,
			role: "visitor",
		};

		this.verify_login();
	}

	verify_login = async () => {
		// check remember me credentials
		await fetch("http://192.168.0.131:5000/verify_rememberMe", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: null,
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// console.log(jsonData);
				// alert(jsonData);
				if (jsonData == "visitor") {
					// alert("visitor");
					this.props.navigation.navigate("visitor_home");
					// this.props.navigation.navigate("register_visitor");
				} else if (jsonData == "premise owner") {
					// alert("premise owner");
					// this.props.navigation.navigate("register_visitor");
					this.props.navigation.navigate("premiseOwner_home");
				} else if (jsonData == "not logged in") {
					this.props.navigation.navigate("welcome");
				} else {
					this.props.navigation.navigate("welcome");
					alert("Please log in");
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
		// if (this.state.isLogin) {
		// 	if (this.state.role == "visitor") {
		// 		this.props.navigation.navigate("visitor_home");
		// 	} else if (this.state.role == "premise owner") {
		// 		this.props.navigation.navigate("premiseOwner_home");
		// 	}
		// } else {
		// 	this.props.navigation.navigate("Auth");
		// }
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Please wait ...</Text>
				<ActivityIndicator />
				{/* <Button
					title="Go home page"
					onPress={() => this.props.navigation.navigate("Auth")}
				></Button> */}
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
