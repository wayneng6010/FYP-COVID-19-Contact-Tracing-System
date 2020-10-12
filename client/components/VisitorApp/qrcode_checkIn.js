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
	TouchableHighlight,
	Dimensions,
	Modal,
	ActivityIndicator,
} from "react-native";

import { BarCodeScanner } from "expo-barcode-scanner";

export default class sign_in extends React.Component {
	constructor() {
		super();
		this.state = {
			hasPermission: null,
			scanned: false,
			modalVisible: false,
			check_in_data: null,
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

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
		if (!visible) {
			this.setState({ check_in_data: null });
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
							return res.json();
						})
						.then((jsonData) => {
							// alert(jsonData);
							if (jsonData !== []) {
								this.setState({ check_in_data: jsonData });
								this.setModalVisible(true);
							} else {
								this.setModalVisible(!modalVisible);
								alert("Check in unsuccessful");
							}
							// if (jsonData == "success") {
							// 	alert("Check in successful");
							// } else if (jsonData == "failed") {
							// 	alert("Check in unsuccessful");
							// } else {
							// 	alert(JSON.stringify(jsonData));
							// }
							return;
						})
						.catch((error) => {
							alert(error);
						});
				} else {
					alert("Invalid check in QR code");
					return;
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
		const { modalVisible, check_in_data } = this.state;
		return (
			<View style={styles.container}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						this.setModalVisible(!modalVisible);
					}}
				>
					{check_in_data == null ? (
						<View style={styles.centeredView}>
							<ActivityIndicator />
						</View>
					) : (
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text style={styles.modalText}>Check In Successful</Text>
								<View style={styles.flexRow1}>
									<View style={styles.flexCol}>
										<Text style={styles.subtitle}>
											#
											{" " +
												check_in_data._id
													.slice(check_in_data._id.length - 2)
													.toUpperCase()}
										</Text>
										<Text style={styles.subtitle}>
											{check_in_data.premise_name}
										</Text>
										<Text style={styles.subtitle}>
											{check_in_data.entry_point}
										</Text>
										<Text style={styles.subtitle}>
											{check_in_data.health_risk_result === "?" ? (
												<Text>Unknown Risk</Text>
											) : check_in_data.health_risk_result === true ? (
												<Text>High Risk</Text>
											) : (
												<Text>Low Risk</Text>
											)}
										</Text>
										<Text style={styles.subtitle}>
											{check_in_data.date_created
												.replace("T", " ")
												.substring(
													0,
													check_in_data.date_created.indexOf(".") - 3
												)}
										</Text>
									</View>
									<View style={styles.flexCol}>
										{/* <Text style={styles.subtitle}>Risk</Text> */}
									</View>
								</View>
								<Text />
								<TouchableHighlight
									style={{
										...styles.openButton_1,
										backgroundColor: "#3cb371",
										width: 150,
									}}
									onPress={() => {
										this.setModalVisible(!modalVisible);
									}}
								>
									<Text style={styles.textStyle_1}>OK</Text>
								</TouchableHighlight>
							</View>
						</View>
					)}
				</Modal>

				{/* if scanned state is true, means data is successfully retrieved */}
				{/* Passing undefined will result in no scanning */}
				<BarCodeScanner
					onBarCodeScanned={
						this.state.scanned ? undefined : this.handleBarCodeScanned
					}
					style={StyleSheet.absoluteFillObject}
				/>

				<Text style={styles.title}>Scan premise QR code to check in</Text>

				{this.state.scanned && (
					// <Button
					// 	style={styles.scan_again_btn}
					// 	title={"Tap to Scan Again"}
					// 	onPress={() => this.setState({ scanned: false })}
					// />
					<TouchableHighlight
						style={{
							...styles.openButton,
							backgroundColor: "rgba(30, 144, 255, .9)",
							width: "100%",
							paddingVertical: 50,
							marginBottom: "2%",
						}}
						onPress={() => {
							this.setState({ scanned: false });
						}}
					>
						<Text style={styles.textStyle}>Tap to Scan Again</Text>
					</TouchableHighlight>
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
	title: {
		textAlign: "center",
		fontSize: 24,
		backgroundColor: "rgba(0,0,0,.8)",
		transform: [{ translateY: -Dimensions.get("window").height * 0.8 }],
		color: "white",
		fontWeight: "bold",
		paddingVertical: Dimensions.get("window").height * 0.04,
	},
	textStyle: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 24,
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton_1: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	textStyle_1: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold",
	},
	subtitle: {
		fontSize: 16,
		textAlign: "center",
		marginVertical: 5,
	},
});
