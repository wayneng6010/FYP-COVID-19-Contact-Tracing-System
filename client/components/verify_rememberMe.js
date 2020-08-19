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

	verify_login = async() => {
		if (this.state.isLogin) {
			if(this.state.role == "visitor"){
				this.props.navigation.navigate('visitor_home');
			} else if (this.state.role == "premiseowner"){
				this.props.navigation.navigate('premiseOwner_home');
			}
		} else {
			this.props.navigation.navigate('Auth');
		}
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Verifying sign in</Text>
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
