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
	Modal,
	TouchableHighlight,
	Alert,
} from "react-native";

export default class sign_in extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
		};
	}

	logout = async () => {
		await fetch("http://192.168.0.131:5000/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(jsonData);
				if (jsonData == "success") {
					alert("Logout Successful");
					this.props.navigation.navigate("welcome");
				} else if (jsonData == "failed") {
					alert("Failed to logout");
				} else {
					alert("Error occured while saving qr code");
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	confirm_logout = async () => {
		Alert.alert("Hold on!", "Are you sure you want to logout?", [
			{
				text: "Cancel",
				onPress: () => null,
				style: "cancel",
			},
			{ text: "YES", onPress: () => this.logout() },
		]);
		return true;
	};

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	render() {
		const { modalVisible } = this.state;

		return (
			<SafeAreaView style={styles.container}>
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
							<Text style={styles.modalText}>Menu</Text>

							<Text
								style={styles.underline}
								onPress={() => {
									this.setModalVisible(!modalVisible);
									this.props.navigation.navigate("qrcode_checkIn");
								}}
							>
								Check In
							</Text>
							<Text
								style={styles.underline}
								onPress={() => {
									this.setModalVisible(!modalVisible);
									this.props.navigation.navigate("manage_dependent");
								}}
							>
								Manage Dependent
							</Text>
							<Text
								style={styles.underline}
								onPress={() => {
									this.setModalVisible(!modalVisible);
									this.props.navigation.navigate("view_check_in_history");
								}}
							>
								View Check In History
							</Text>
							<Text
								style={styles.underline}
								onPress={() => {
									this.setModalVisible(!modalVisible);
									this.props.navigation.navigate("view_health_risk");
								}}
							>
								Health Risk Assessment
							</Text>
							<Text
								style={styles.underline}
								onPress={() => {
									this.setModalVisible(!modalVisible);
									this.props.navigation.navigate("home_risk_assessment");
								}}
							>
								Residential Location Risk Assessment
							</Text>
							<Text
								style={[styles.underline, styles.underline_logout]}
								onPress={() => this.confirm_logout()}
							>
								Logout
							</Text>
							<Text style={styles.underline_last}></Text>

							<TouchableHighlight
								style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
								onPress={() => {
									this.setModalVisible(!modalVisible);
								}}
							>
								<Text style={styles.cancelStyle}>Cancel</Text>
							</TouchableHighlight>
						</View>
					</View>
				</Modal>
				<Text>Visitor Home page</Text>
				<View style={styles.nav_bar_bottom}>
					<TouchableHighlight
						style={{ ...styles.openButton_nav, backgroundColor: "#3cb371" }}
						onPress={() => {
							this.setModalVisible(true)
						}}
					>
						<Text style={styles.menu_text}>Menu</Text>
					</TouchableHighlight>
				</View>
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
		marginHorizontal: 10,
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
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		paddingVertical: 10,
		width: 120,
		elevation: 2,
	},
	openButton_nav: {
		backgroundColor: "#F194FF",
		width: "100%",
		elevation: 2,
		height: 50,
	},
	menu_text: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 20,
		paddingTop: 10,
	},
	nav_bar_bottom: {
		position: "absolute",
		bottom: 0,
		width: "100%",
	},
	cancelStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		width: 120,
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold",
	},
	underline: {
		borderTopColor: "lightgrey",
		borderTopWidth: 1,
		paddingVertical: 15,
		textAlign: "center",
		width: 300,
	},
	underline_last: {
		borderTopColor: "lightgrey",
		borderTopWidth: 1,
		width: 300,
	},
	underline_logout: {
		fontWeight: "bold",
		backgroundColor: "#e61c3e",
		color: "white",
	},
});
