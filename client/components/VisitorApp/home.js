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
	Image,
	Dimensions,
	Linking,
} from "react-native";
// import { json } from "express";
import MapView, { Marker } from "react-native-maps";

export default class home extends React.Component {
	constructor(props) {
		super(props);
		// this.verifyToken();
		this.state = {
			modalVisible: false,
			modalVisible_visitor: false,
			visitor_casual_contact_list: null,
			dependent_casual_contact_list: null,
			confirmed_case_check_in_time: null,
			visitor_check_in_time: null,
			dependent_info: null,
			region: {
				latitude: 4.2105,
				longitude: 101.9758,
				latitudeDelta: 6,
				longitudeDelta: 6,
			},
			premise_info: null,
			visitor_info: null,
			is_casual_contact_visitor: null,
			is_casual_contact_dependent: null,
			reported_time: null,
			check_in_entry_point: null,
			all_dependent: null,
		};
	}

	componentDidMount = async () => {
		await fetch("http://192.168.0.131:5000/get_user_info", {
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
					this.setState({ visitor_info: "none" });
				} else {
					this.setState({ visitor_info: jsonData });
				}
			})
			.catch((error) => {
				alert(error);
			});

		await fetch("http://192.168.0.131:5000/get_visitor_casual_contact_list", {
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
					this.setState({
						visitor_casual_contact_list: "none",
						is_casual_contact_visitor: false,
					});
				} else {
					// alert(
					// 	JSON.stringify(
					// 		jsonData[0].check_in_record.premise_qr_code.entry_point
					// 	)
					// );
					jsonData.sort(function compare(a, b) {
						return new Date(b.date_created) - new Date(a.date_created);
					});

					jsonData.forEach(function (item) {
						item.check_in_record.date_created = item.check_in_record.date_created
							.replace("T", " ")
							.substring(0, item.check_in_record.date_created.indexOf(".") - 3);
						item.saved_confirmed_case_check_in.date_created = item.saved_confirmed_case_check_in.date_created
							.replace("T", " ")
							.substring(
								0,
								item.saved_confirmed_case_check_in.date_created.indexOf(".") - 3
							);
						item.date_created = item.date_created
							.replace("T", " ")
							.substring(0, item.date_created.indexOf(".") - 3);
					});				

					this.setState({
						visitor_casual_contact_list: jsonData,
						is_casual_contact_visitor: true,
					});
				}
			})
			.catch((error) => {
				alert(error);
			});

		await fetch("http://192.168.0.131:5000/get_user_dependent", {
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
				if (jsonData === undefined || jsonData.length == 0) {
					// alert("No record found");
					this.setState({
						all_dependent: "none",
					});
				} else {
					this.setState({
						all_dependent: "yes",
					});
				}
				// console.log(jsonData);
			})
			.catch((error) => {
				alert(error);
			});

		await fetch("http://192.168.0.131:5000/get_dependent_casual_contact_list", {
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
				// alert(jsonData);

				if (!jsonData) {
					this.setState({
						dependent_casual_contact_list: "none",
						is_casual_contact_dependent: false,
					});
				} else {
					// alert(jsonData);
					jsonData.sort(function compare(a, b) {
						return new Date(b.date_created) - new Date(a.date_created);
					});
					
					jsonData.forEach(function (item) {
						item.check_in_record.date_created = item.check_in_record.date_created
							.replace("T", " ")
							.substring(0, item.check_in_record.date_created.indexOf(".") - 3);
						item.saved_confirmed_case_check_in.date_created = item.saved_confirmed_case_check_in.date_created
							.replace("T", " ")
							.substring(
								0,
								item.saved_confirmed_case_check_in.date_created.indexOf(".") - 3
							);
						item.date_created = item.date_created
							.replace("T", " ")
							.substring(0, item.date_created.indexOf(".") - 3);
					});

					this.setState({
						dependent_casual_contact_list: jsonData,
						is_casual_contact_dependent: true,
					});
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

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
					alert("Error occured while logout");
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

	setModalVisible_visitor = (
		visible,
		confirmed_case_check_in_time,
		visitor_check_in_time,
		dependent_info,
		premise_info,
		reported_time,
		check_in_entry_point
	) => {
		if (visible) {
			this.setState({
				confirmed_case_check_in_time: confirmed_case_check_in_time,
				visitor_check_in_time: visitor_check_in_time,
				dependent_info: dependent_info,
				premise_info: premise_info,
				region: {
					latitude: premise_info.premise_lat,
					longitude: premise_info.premise_lng,
					latitudeDelta: 0.002,
					longitudeDelta: 0.002,
				},
				reported_time: reported_time,
				check_in_entry_point: check_in_entry_point,
			});
		}
		this.setState({
			modalVisible_visitor: visible,
		});
	};

	render() {
		const {
			modalVisible,
			modalVisible_visitor,
			visitor_casual_contact_list,
			dependent_casual_contact_list,
			confirmed_case_check_in_time,
			visitor_check_in_time,
			dependent_info,
			premise_info,
			visitor_info,
			is_casual_contact_visitor,
			is_casual_contact_dependent,
			reported_time,
			check_in_entry_point,
			all_dependent,
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
						<View style={styles.modalView_menu}>
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
								style={styles.underline}
								onPress={() => {
									this.setModalVisible(!modalVisible);
									this.props.navigation.navigate("manage_profile");
								}}
							>
								Manage Profile
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
				{premise_info == null ? (
					<View />
				) : (
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible_visitor}
						onRequestClose={() => {
							this.setModalVisible_visitor(!modalVisible_visitor);
						}}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text style={styles.modalText}>Check In Details</Text>
								{dependent_info == null ? (
									<View style={{ height: 0 }} />
								) : (
									<View>
										<Text style={styles.subtitle}>
											<Text style={{ fontWeight: "bold" }}>
												{"Checked in by\n"}
											</Text>
											{dependent_info.ic_fname +
												" (" +
												dependent_info.ic_num +
												")"}
										</Text>
										<Text style={{ height: 5 }} />
									</View>
								)}

								<Text style={styles.subtitle}>
									<Text style={{ fontWeight: "bold" }}>
										{dependent_info == null ? "You" : "Dependent"}
										{" checked in at\n"}
									</Text>
									{visitor_check_in_time}
								</Text>
								<Text style={{ height: 5 }} />

								<Text style={styles.subtitle}>
									<Text style={{ fontWeight: "bold" }}>
										{"Confirmed case checked in at\n"}
									</Text>
									{confirmed_case_check_in_time}
								</Text>
								<Text style={{ height: 5 }} />

								<Text style={styles.subtitle}>
									<Text style={{ fontWeight: "bold" }}>{"Reported at\n"}</Text>
									{reported_time}
								</Text>
								<Text style={{ height: 5 }} />

								<Text style={styles.subtitle}>
									<Text style={{ fontWeight: "bold" }}>{"Premise name\n"}</Text>
									{premise_info.premise_name +
										" (Entry point: " +
										check_in_entry_point +
										")"}
								</Text>
								<MapView
									style={styles.mapStyle}
									// customMapStyle={mapStyle}
									region={this.state.region}
									loadingEnabled={true}
									loadingIndicatorColor="#666666"
									loadingBackgroundColor="#eeeeee"
									moveOnMarkerPress={false}
									// showsUserLocation={true}
									showsCompass={true}
									showsPointsOfInterest={false}
									provider="google"
								>
									<Marker
										// onLoad={() => this.forceUpdate()}
										// key={1}
										coordinate={{
											latitude: premise_info.premise_lat,
											longitude: premise_info.premise_lng,
										}}
										title="Premise Location"
										description={premise_info.premise_name}
									>
										<Image
											source={require("../../assets/marker_icon.png")}
											style={{ height: 35, width: 35 }}
										/>
									</Marker>
								</MapView>
								<TouchableHighlight
									style={{
										...styles.openButton_ok,
										backgroundColor: "#3cb371",
									}}
									onPress={() =>
										Linking.openURL(
											`https://www.google.com/maps/search/?api=1&query=<address>&query_place_id=${premise_info.premise_id}`
										)
									}
								>
									<Text style={styles.textStyle}>Open in Google Maps</Text>
								</TouchableHighlight>
								<Text />
								<TouchableHighlight
									style={{ ...styles.openButton_ok, backgroundColor: "grey" }}
									onPress={() => {
										this.setModalVisible_visitor(!modalVisible_visitor);
									}}
								>
									<Text style={styles.textStyle}>OK</Text>
								</TouchableHighlight>
							</View>
						</View>
					</Modal>
				)}

				{/* <Text>Visitor Home page</Text> */}
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

				{visitor_info == null ? (
					<ActivityIndicator />
				) : visitor_info == "none" ? (
					<View />
				) : (
					<View>
						<Text style={styles.welcome}>
							Welcome,{" " + visitor_info.ic_fname + " !"}
						</Text>
					</View>
				)}

				{is_casual_contact_visitor == null ? (
					<ActivityIndicator />
				) : is_casual_contact_visitor == true ? (
					<Text style={styles.red_zone}>
						You have had casual contact with COVID-19 infected person
					</Text>
				) : (
					<Text style={styles.green_zone}>
						You have no casual contact with COVID-19 infected person
					</Text>
				)}

				{is_casual_contact_dependent == null || all_dependent == null ? (
					<ActivityIndicator />
				) : all_dependent == "none" ? (
					<Text></Text>
				) : is_casual_contact_dependent == true ? (
					<Text style={styles.red_zone}>
						Your dependent have had casual contact with COVID-19 infected person
					</Text>
				) : (
					<Text style={styles.green_zone}>
						Your dependent have no casual contact with COVID-19 infected person
					</Text>
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
				{visitor_casual_contact_list == null &&
				dependent_casual_contact_list == null ? (
					<View style={{ height: 0 }}></View>
				) : visitor_casual_contact_list == "none" &&
				  dependent_casual_contact_list == "none" ? (
					<Text style={styles.no_noti}>No notification at the moment</Text>
				) : (
					<View style={{ height: 0 }}></View>
				)}

				{visitor_casual_contact_list == null ? (
					<ActivityIndicator />
				) : visitor_casual_contact_list == "none" ? (
					<View />
				) : (
					<View style={styles.visitor_casual_contact_list}>
						<Text style={styles.list_title}>
							Your Check Ins (Casual Contact)
						</Text>
						<ScrollView>
							<View>
								{visitor_casual_contact_list.map((data) => {
									return (
										<View key={data._id} style={styles.flexRow2}>
											<View style={[styles.flexCol, styles.flexCol_wider]}>
												<TouchableOpacity
													style={styles.dependent_outer}
													key={data._id}
													onPress={() => {
														this.setModalVisible_visitor(
															true,
															data.saved_confirmed_case_check_in.date_created,
															data.check_in_record.date_created,
															null,
															data.check_in_record.user_premiseowner,
															data.date_created,
															data.check_in_record.premise_qr_code.entry_point
														);
													}}
												>
													<Text style={styles.dependent_name}>
														{
															data.check_in_record.user_premiseowner
																.premise_name
														}
													</Text>
													{/* <Text style={styles.dependent_name}>
														{data.check_in_record.premise_qr_code.entry_point}
													</Text> */}
													{/* <Text style={styles.dependent_relationship}>
														{data.saved_confirmed_case_check_in.date_created}
													</Text> */}
													<Text style={styles.dependent_relationship}>
														{data.check_in_record.date_created}
													</Text>
												</TouchableOpacity>
											</View>
											<View style={[styles.flexCol, styles.flexCol_narrower]}>
												<TouchableHighlight
													style={{
														...styles.openButton,
														backgroundColor: "grey",
													}}
													onPress={() => {
														this.setModalVisible_visitor(
															true,
															data.saved_confirmed_case_check_in.date_created,
															data.check_in_record.date_created,
															null,
															data.check_in_record.user_premiseowner,
															data.date_created,
															data.check_in_record.premise_qr_code.entry_point
														);
													}}
												>
													<Text style={styles.textStyle}>Details</Text>
												</TouchableHighlight>
											</View>
										</View>
									);
								})}
							</View>
						</ScrollView>
					</View>
				)}
				<View style={{ height: 0 }} />
				{dependent_casual_contact_list == null ? (
					<ActivityIndicator />
				) : dependent_casual_contact_list == "none" ? (
					<View />
				) : (
					<View style={styles.visitor_casual_contact_list}>
						<Text style={styles.list_title}>
							Your Dependent Check Ins (Casual Contact)
						</Text>
						<ScrollView>
							<View>
								{dependent_casual_contact_list.map((data) => {
									return (
										<View key={data._id} style={styles.flexRow2}>
											<View style={[styles.flexCol, styles.flexCol_wider]}>
												<TouchableOpacity
													style={styles.dependent_outer}
													key={data._id}
													onPress={() => {
														this.setModalVisible_visitor(
															true,
															data.saved_confirmed_case_check_in.date_created,
															data.check_in_record.date_created,
															data.visitor_dependent,
															data.check_in_record.user_premiseowner,
															data.date_created,
															data.check_in_record.premise_qr_code.entry_point
														);
													}}
												>
													<Text style={styles.dependent_name}>
														{
															data.check_in_record.user_premiseowner
																.premise_name
														}
													</Text>
													{/* <Text style={styles.dependent_name}>
														{data.check_in_record.premise_qr_code.entry_point}
													</Text> */}
													{/* <Text style={styles.dependent_relationship}>
														{data.saved_confirmed_case_check_in.date_created}
													</Text> */}
													<Text style={styles.dependent_relationship}>
														{data.check_in_record.date_created}
													</Text>
												</TouchableOpacity>
											</View>
											<View style={[styles.flexCol, styles.flexCol_narrower]}>
												<TouchableHighlight
													style={{
														...styles.openButton,
														backgroundColor: "grey",
													}}
													onPress={() => {
														this.setModalVisible_visitor(
															true,
															data.saved_confirmed_case_check_in.date_created,
															data.check_in_record.date_created,
															data.visitor_dependent,
															data.check_in_record.user_premiseowner,
															data.date_created,
															data.check_in_record.premise_qr_code.entry_point
														);
													}}
												>
													<Text style={styles.textStyle}>Details</Text>
												</TouchableHighlight>
											</View>
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
		paddingHorizontal: 5,
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
		backgroundColor: "#365c93",
		color: "white",
		marginHorizontal: "20%",
		marginVertical: 5,
		paddingVertical: 5,
		borderRadius: 5,
	},
	welcome: {
		textAlign: "center",
		marginTop: 20,
		marginBottom: 10,
		fontWeight: "bold",
		fontSize: 18,
	},
	openButton_2: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		marginVertical: 10,
	},
	mapStyle: {
		width: 350,
		height: 300,
		marginTop: 20,
		marginBottom: 20,
	},
	subtitle: {
		width: 300,
		textAlign: "left",
	},
	visitor_casual_contact_list: {
		height: 200,
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
		paddingHorizontal: 10,
		paddingVertical: 30,
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
	modalView_menu: {
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
	openButton_ok: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		paddingVertical: 10,
		width: 200,
		elevation: 2,
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
	list_title: {
		marginTop: 15,
		paddingVertical: 10,
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
		backgroundColor: "#f3f3f3",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold",
		paddingHorizontal: 10,
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
		marginTop: 20,
		marginBottom: 10,
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
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold",
	},
	dependent_name: {
		fontWeight: "bold",
		paddingHorizontal: 10,
	},
	dependent_relationship: {
		paddingHorizontal: 10,
		color: "grey",
	},
});
