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
	ToastAndroid,
} from "react-native";

import { BarCodeScanner } from "expo-barcode-scanner";

export default class sign_in extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};
	constructor() {
		super();
		this.state = {
			hasPermission: null,
			scanned: false,
		};
	}

	componentDidMount = async () => {
		const { status } = await BarCodeScanner.requestPermissionsAsync();
		// setHasPermission(status === "granted");
		this.setState({ hasPermission: status === "granted" });
		if (this.state.hasPermission === null) {
			ToastAndroid.show("Requesting for camera permission", ToastAndroid.SHORT);
		}
		if (this.state.hasPermission === false) {
			alert("No access to camera");
		}
	};

	handleBarCodeScanned = ({ type, data }) => {
		this.setState({ scanned: true });
		alert(`Bar code with type ${type} and data ${data} has been scanned!`);
	};

	render() {
		return (
			<View style={styles.container}>
				{/* if scanned state is true, means data is successfully retrieved */}
				{/* Passing undefined will result in no scanning */}
				<BarCodeScanner
					onBarCodeScanned={
						this.state.scanned ? undefined : this.handleBarCodeScanned
					}
					style={StyleSheet.absoluteFillObject}
				/>

				{this.state.scanned && (
					<Button
						title={"Tap to Scan Again"}
						onPress={() => this.setState({ scanned: false })}
					/>
				)}
			</View>
			// <SafeAreaView style={styles.container}>
			// 	<Text>Visitor check in page</Text>

			// </SafeAreaView>

			// 	{/* {news.map((data) => {
			// 			return <Text>{data.url}</Text>;
			// 		})} */}
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "flex-end",
	},
});
