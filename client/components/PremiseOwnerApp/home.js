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
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";

// import { createBottomTabNavigator } from "react-navigation";
// import { createBottomTabNavigator } from 'react-navigation-tabs';
// createBottomTabNavigator(RouteConfigs, TabNavigatorConfig);
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

// const Tab = createBottomTabNavigator();
// import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

export default class home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			visitor_confirmed_case_list: null,
			po_info: null,
			is_red_zone: null,
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

	componentDidMount = async () => {
		await fetch("http://192.168.0.131:5000/get_premise_owner_info", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData[0]));
				if (!jsonData) {
					this.setState({ po_info: "none" });
				} else {
					this.setState({ po_info: jsonData });
				}
			})
			.catch((error) => {
				alert(error);
			});

		await fetch("http://192.168.0.131:5000/get_premise_owner_hotspot", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(jsonData);
				if (jsonData) {
					this.setState({ is_red_zone: true });
				} else {
					this.setState({ is_red_zone: false });
				}
			})
			.catch((error) => {
				alert(error);
			});

		await fetch("http://192.168.0.131:5000/get_visitor_confirmed_case_list", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (!jsonData) {
					this.setState({ visitor_confirmed_case_list: "none" });
				} else {
					// alert(JSON.stringify(jsonData[0].check_in_record.date_created));
					// var counter = 0;
					var jsonDataReturned = new Array();
					jsonData.forEach(function (item, index, object) {
						// console.log(
						// 	counter +
						// 		" " +
						// 		item.check_in_record.date_created +
						// 		" " +
						// 		item.date_created
						// );
						// counter += 1;
						// item.check_in_record.date_created = item.check_in_record.date_created
						// 	.replace("T", " ")
						// 	.substring(0, item.check_in_record.date_created.indexOf(".") - 3);
						try {
							item.check_in_record.date_created = item.check_in_record.date_created
								.replace("T", " ")
								.substring(
									0,
									item.check_in_record.date_created.indexOf(".") - 3
								);
							item.date_created = item.date_created
								.replace("T", " ")
								.substring(0, item.date_created.indexOf(".") - 3);
							jsonDataReturned.push(item);
						} catch {
							// object.splice(index, 1);
						}
					});
					// console.log(counter);
					this.setState({ visitor_confirmed_case_list: jsonDataReturned });
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	render() {
		const {
			modalVisible,
			visitor_confirmed_case_list,
			po_info,
			is_red_zone,
		} = this.state;
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
									this.props.navigation.navigate("real_time_check_in_record");
								}}
							>
								Real Time Check In Record
							</Text>
							<Text
								style={styles.underline}
								onPress={() => {
									this.setModalVisible(!modalVisible);
									this.props.navigation.navigate("qrcode_checkIn_dependent");
								}}
							>
								Check In For Dependent
							</Text>
							<Text
								style={styles.underline}
								onPress={() => {
									this.setModalVisible(!modalVisible);
									this.props.navigation.navigate("qrcode_view");
								}}
							>
								View Check In QR code
							</Text>
							<Text
								style={styles.underline}
								onPress={() => {
									this.setModalVisible(!modalVisible);
									this.props.navigation.navigate("visitor_analytics");
								}}
							>
								Visitor Analytics
							</Text>

							<Text
								style={[styles.underline, styles.underline_logout]}
								onPress={() => this.confirm_logout()}
							>
								Logout
							</Text>
							<Text style={styles.underline_last}></Text>

							<TouchableHighlight
								style={{ ...styles.openButton, backgroundColor: "#7b8b96" }}
								onPress={() => {
									this.setModalVisible(!modalVisible);
								}}
							>
								<Text style={styles.cancelStyle}>Cancel</Text>
							</TouchableHighlight>
						</View>
					</View>
				</Modal>
				{/* <Text>Premise Owner Home page</Text> */}
				<View style={styles.nav_bar_bottom}>
					<TouchableHighlight
						style={{ ...styles.openButton_nav, backgroundColor: "#3cb371" }}
						onPress={() => {
							this.setModalVisible(true);
						}}
					>
						<Text style={styles.menu_text}>Menu</Text>
					</TouchableHighlight>
				</View>

				{po_info == null ? (
					<ActivityIndicator />
				) : po_info == "none" ? (
					<View />
				) : (
					<View>
						<Text style={styles.welcome}>
							Welcome,{" " + po_info.owner_fname + " !"}
						</Text>
						<Text style={styles.premise_name_outer}>
							<Text style={styles.welcome_1}>{po_info.premise_name}</Text>
						</Text>
					</View>
				)}

				{is_red_zone == null ? (
					<ActivityIndicator />
				) : is_red_zone == true ? (
					<Text style={styles.red_zone}>
						Your premise has been declared as hotspot
						{"\n"}Kindly view notification for more details
					</Text>
				) : (
					<Text style={styles.green_zone}>Your premise is safe</Text>
				)}

				<View
					style={{
						borderBottomColor: "black",
						borderBottomWidth: StyleSheet.hairlineWidth,
						width: "100%",
						marginVertical: 10,
					}}
				/>

				<Text style={styles.noti_title}>Notification</Text>
				{visitor_confirmed_case_list == null ? (
					<View style={{ height: 0 }}></View>
				) : visitor_confirmed_case_list == "none" ? (
					<Text style={styles.no_noti}>No notification at the moment</Text>
				) : (
					<View style={{ height: 0 }}></View>
				)}

				{visitor_confirmed_case_list == null ? (
					<ActivityIndicator />
				) : visitor_confirmed_case_list == "none" ? (
					<View />
				) : (
					<View style={styles.visitor_casual_contact_list}>
						<Text style={styles.list_title}>Confirmed Case Check In</Text>
						<ScrollView>
							<View>
								{visitor_confirmed_case_list.map((data) => {
									return (
										<View key={data._id} style={styles.flexRow2}>
											<TouchableOpacity
												style={styles.dependent_outer}
												key={data._id}
												onPress={() => {
													// this.setModalVisible_visitor(
													// 	true,
													// 	data.saved_confirmed_case_check_in.date_created,
													// 	data.check_in_record.date_created,
													// 	null,
													// 	data.check_in_record.user_premiseowner
													// );
												}}
											>
												{/* <Text style={styles.dependent_name}>
														{
															data.check_in_record.user_premiseowner
																.premise_name
														}
													</Text> */}
												{/* <Text style={styles.dependent_name}>
														{data.check_in_record.premise_qr_code.entry_point}
													</Text> */}
												<Text style={styles.dependent_relationship}>
													{"Checked in at " + data.check_in_record.date_created}
												</Text>
												<Text style={styles.dependent_relationship}>
													{"Entry point: " +
														data.check_in_record.premise_qr_code.entry_point}
												</Text>
												<Text style={styles.dependent_relationship}>
													{"Reported at " + data.date_created}
												</Text>
											</TouchableOpacity>
										</View>
									);
								})}
							</View>
						</ScrollView>
					</View>
				)}
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	red_zone: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 16,
		backgroundColor: "#cd5c5c",
		color: "white",
		marginVertical: 5,
		paddingVertical: 10,
	},
	green_zone: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 16,
		backgroundColor: "#3cb371",
		color: "white",
		marginVertical: 5,
		paddingVertical: 10,
	},
	no_noti: {
		textAlign: "center",
		fontWeight: "bold",
		fontStyle: "italic",
		fontSize: 16,
		marginTop: 10,
	},
	noti_title: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 18,
		backgroundColor: "#18296b",
		color: "white",
		marginHorizontal: "30%",
		marginVertical: 5,
		paddingVertical: 7,
		borderRadius: 20,
	},
	welcome: {
		textAlign: "center",
		marginTop: 20,
		marginBottom: 10,
		fontWeight: "bold",
		fontSize: 18,
	},
	premise_name_outer: {
		textAlign: "center",
		backgroundColor: "#363535",
		borderRadius: 10,
		marginBottom: 10,
		padding: 10,
		marginHorizontal: "20%",
	},
	welcome_1: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 18,
		color: "white",
	},
	nav_bar_bottom: {
		position: "absolute",
		bottom: 0,
		width: "100%",
	},
	container: {
		flex: 1,
		backgroundColor: "white",
		// alignItems: "center",
		// justifyContent: "center",
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
	visitor_casual_contact_list: {
		height: 250,
	},
	flexCol_wider: {
		width: 210,
	},
	flexCol_narrower: {
		width: 100,
	},
	flexCol: {
		marginHorizontal: 10,
		width: 110,
		height: 40,
		justifyContent: "center",
		paddingBottom: 15,
	},
	flexRow2: {
		flex: 0.1,
		flexDirection: "row",
		marginTop: 10,
		marginBottom: 5,
		paddingHorizontal: 20,
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	list_title: {
		marginTop: 15,
		paddingVertical: 10,
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
		backgroundColor: "#f3f3f3",
	},
});
