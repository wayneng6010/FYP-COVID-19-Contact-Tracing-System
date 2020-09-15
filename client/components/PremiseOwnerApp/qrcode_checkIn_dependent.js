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
	Picker,
} from "react-native";

import { BarCodeScanner } from "expo-barcode-scanner";

export default class sign_in extends React.Component {
	constructor() {
		super();
		this.state = {
			hasPermission: null,
			scanned: false,
			modalVisible: false,
			selected_entry_point_id: null,
			all_qrcode: null,
			checkInData: null,
		};
	}

	getAllQRCode = async () => {
		await fetch("http://192.168.0.131:5000/get_all_premise_qrcode", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				this.setState({
					all_qrcode: jsonData,
				});
				// console.log(this.state.qrcode_value);
			})
			.catch((error) => {
				alert(error);
			});
	};

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

		this.getAllQRCode();
	};

	saveCheckIn = async () => {
		// alert("ok");
		const checkInData = this.state.checkInData;
		await fetch("http://192.168.0.131:5000/check_in_premise_dependent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				for: checkInData.for,
				role: checkInData.role,
				did: checkInData.did,
				uid: checkInData.uid,
				selected_entry_point_id: this.state.selected_entry_point_id,
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
	};

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	handleBarCodeScanned = async ({ type, data }) => {
		this.setState({ scanned: true });
		// alert(`Bar code with type ${type} and data ${data} has been scanned!`);
		try {
			var checkInData = JSON.parse(data);
			if (
				checkInData.hasOwnProperty("for") &&
				checkInData.hasOwnProperty("role") &&
				checkInData.hasOwnProperty("did") &&
				checkInData.hasOwnProperty("uid")
			) {
				if (checkInData.for == "COVID-19_Contact_Tracing_App") {
					if (checkInData.role == "dependent") {
						this.setState({ checkInData: checkInData });
						this.setModalVisible(true);
						// alert("did " + checkInData.did);
						// alert("uid " + checkInData.uid);
						// alert(checkInData.pid);
					} else {
						alert("Invalid check in QR code");
						return;
					}
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
		const { modalVisible, all_qrcode } = this.state;
		let all_entry_points = null;
		if (this.state.all_qrcode !== null) {
			all_entry_points = this.state.all_qrcode.map((data) => {
				return (
					<Picker.Item
						key={data._id}
						value={data._id}
						label={data.entry_point}
					/>
				);
			});
		}
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
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>
								Select entry point to check in
							</Text>
							<View style={styles.pickerBorder}>
								<Picker
									selectedValue={this.state.selected_entry_point_id}
									style={{ height: 50, width: 180 }}
									onValueChange={(itemValue, itemIndex) => {
										// alert(JSON.stringify(all_qrcode));
										this.setState({
											selected_entry_point_id: itemValue,
										});
										// alert(itemValue);
									}}
								>
									{all_entry_points}
								</Picker>
							</View>
							<View style={styles.flexRow1}>
								<View style={styles.flexCol}>
									<TouchableHighlight
										style={{ ...styles.openButton_1, backgroundColor: "grey" }}
										onPress={() => {
											this.setModalVisible(!modalVisible);
										}}
									>
										<Text style={styles.textStyle_1}>Cancel</Text>
									</TouchableHighlight>
								</View>
								<View style={styles.flexCol}>
									<TouchableHighlight
										style={{
											...styles.openButton_1,
											backgroundColor: "#5cb85c",
										}}
										onPress={() => {
											this.saveCheckIn();
										}}
									>
										<Text style={styles.textStyle_1}>Check In</Text>
									</TouchableHighlight>
								</View>
							</View>
						</View>
					</View>
				</Modal>
				{/* if scanned state is true, means data is successfully retrieved */}
				{/* Passing undefined will result in no scanning */}
				<BarCodeScanner
					onBarCodeScanned={
						this.state.scanned ? undefined : this.handleBarCodeScanned
					}
					style={StyleSheet.absoluteFillObject}
				/>

				<Text style={styles.title}>Scan dependent QR code</Text>

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
	flexRow1: {
		flex: 0.1,
		flexDirection: "row",
		marginTop: 30,
		marginBottom: -20,
	},
	flexCol: {
		marginHorizontal: 10,
		width: 100,
		height: 40,
		justifyContent: "center",
		paddingBottom: 15,
	},
	pickerBorder: {
		borderWidth: 1,
		borderColor: "black",
		borderRadius: 5,
	},
});
