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

	handleBarCodeScanned = async ({ type, data }) => {
		this.setState({ scanned: true });
		// alert(`Bar code with type ${type} and data ${data} has been scanned!`);
		try {
			var checkInData = JSON.parse(data);
			if (
				checkInData.hasOwnProperty("for") &&
				checkInData.hasOwnProperty("qrid") &&
				checkInData.hasOwnProperty("pid")
			) {
				if (checkInData.for == "COVID-19_Contact_Tracing_App") {
					// alert("pid " + checkInData.pid);
					// alert(checkInData.pid);

					await fetch("http://192.168.0.131:5000/check_in_premise", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							for: checkInData.for,
							qrid: checkInData.qrid,
							pid: checkInData.pid,
						}),
					})
						.then((res) => {
							// console.log(JSON.stringify(res.headers));
							return res.text();
						})
						.then((jsonData) => {
							// alert(JSON.stringify(jsonData));
							if (jsonData == "success") {
								alert("Check in successful");
							} else if (jsonData == "failed") {
								alert("Check in unsuccessful");
							} else {
								alert(JSON.stringify(jsonData));
							}
						})
						.catch((error) => {
							alert(error);
						});
				}
			} else {
				alert("Invalid check in QR code");
				return;
			}
		} catch (error) {
			alert("Error! Invalid check in QR code");
		}
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
