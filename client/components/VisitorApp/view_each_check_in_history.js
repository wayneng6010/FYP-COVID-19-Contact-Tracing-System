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
	ActivityIndicator,
	TouchableOpacity,
	Picker,
	Image,
	Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default class view_each_check_in_history extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			all_dependent: null,
			user_info: null,
			user_role: null,
			visitor_id: null,
			dependent_id: null,
			check_in_records: null,
			selected_check_in: null,
			region: {
				latitude: 4.2105,
				longitude: 101.9758,
				latitudeDelta: 6,
				longitudeDelta: 6,
			},
		};
	}

	getVisitorInfo = async () => {
		await fetch("http://192.168.0.131:5000/get_user_info", {
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
					alert("No record found for user");
				} else {
					// alert(jsonData);
					this.setState({
						user_info: jsonData,
					});
				}
				// console.log(jsonData);
			})
			.catch((error) => {
				alert(error);
			});
	};

	getDependentInfo = async () => {
		await fetch("http://192.168.0.131:5000/get_dependent_info", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				dependent_id: this.props.navigation.state.params.dependent_id,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData === undefined || jsonData.length == 0) {
					alert("No record found for dependent");
				} else {
					// alert(jsonData);
					this.setState({
						user_info: jsonData,
					});
				}
				// console.log(jsonData);
			})
			.catch((error) => {
				alert(error);
			});
	};

	getCheckInRecordsVisitor = async () => {
		await fetch("http://192.168.0.131:5000/get_check_in_records_visitor", {
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
					this.setState({
						check_in_records: "none",
					});
				} else {
					// alert(jsonData);
					jsonData.forEach(function (item) {
						item.date_created = item.date_created
							.replace("T", " ")
							.substring(0, item.date_created.indexOf(".") - 3);
					});

					this.setState({
						check_in_records: jsonData,
					});
				}
				// console.log(jsonData);
			})
			.catch((error) => {
				alert(error);
			});
	};

	getCheckInRecordsDependent = async () => {
		await fetch("http://192.168.0.131:5000/get_check_in_records_dependent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				dependent_id: this.props.navigation.state.params.dependent_id,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData === undefined || jsonData.length == 0) {
					this.setState({
						check_in_records: "none",
					});
				} else {
					// alert(jsonData);
					jsonData.forEach(function (item) {
						item.date_created = item.date_created
							.replace("T", " ")
							.substring(0, item.date_created.indexOf(".") - 3);
					});

					this.setState({
						check_in_records: jsonData,
					});
				}
				// console.log(jsonData);
			})
			.catch((error) => {
				alert(error);
			});
	};

	componentDidMount = async () => {
		if (this.props.navigation.state.params.dependent_id == null) {
			this.setState({
				user_role: "visitor",
				visitor_id: this.props.navigation.state.params.user_id,
			});
			this.getCheckInRecordsVisitor();
			this.getVisitorInfo();
		} else {
			this.setState({
				user_role: "dependent",
				dependent_id: this.props.navigation.state.params.dependent_id,
			});
			this.getCheckInRecordsDependent();
			this.getDependentInfo();
		}
	};

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	render() {
		const {
			modalVisible,
			user_info,
			check_in_records,
			selected_check_in,
		} = this.state;

		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.reg_content}>
					{selected_check_in == null ? (
						<View />
					) : (
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
									<Text style={styles.modalText}>Check In Details</Text>

									<Text style={styles.subtitle}>
										<Text style={{ fontWeight: "bold" }}>
											{"Checked in at\n"}
										</Text>
										{selected_check_in.date_created}
									</Text>
									<Text style={{ height: 5 }} />

									<Text style={styles.subtitle}>
										<Text style={{ fontWeight: "bold" }}>
											{"Premise name\n"}
										</Text>
										{selected_check_in.user_premiseowner.premise_name +
											"\n(Entry point: " +
											selected_check_in.premise_qr_code.entry_point +
											")"}
									</Text>
									<MapView
										style={styles.mapStyle}
										// customMapStyle={mapStyle}
										region={{
											latitude: selected_check_in.user_premiseowner.premise_lat,
											longitude:
												selected_check_in.user_premiseowner.premise_lng,
											latitudeDelta: 0.002,
											longitudeDelta: 0.002,
										}}
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
												latitude:
													selected_check_in.user_premiseowner.premise_lat,
												longitude:
													selected_check_in.user_premiseowner.premise_lng,
											}}
											title="Premise Location"
											description={
												selected_check_in.user_premiseowner.premise_name
											}
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
												`https://www.google.com/maps/search/?api=1&query=<address>&query_place_id=${selected_check_in.user_premiseowner.premise_id}`
											)
										}
									>
										<Text style={styles.textStyle}>Open in Google Maps</Text>
									</TouchableHighlight>
									<Text />
									<TouchableHighlight
										style={{ ...styles.openButton_ok, backgroundColor: "grey" }}
										onPress={() => {
											this.setModalVisible(!modalVisible);
										}}
									>
										<Text style={styles.textStyle}>OK</Text>
									</TouchableHighlight>
								</View>
							</View>
						</Modal>
					)}

					<Text style={[styles.subtitle, styles.subtitle_bg]}>
						View Check In History
					</Text>
					<Text />
					<View style={[styles.subtitle_1]}>
						{user_info == null ? (
							<ActivityIndicator />
						) : (
							<View>
								<Text style={[styles.subtitle_2]}>{user_info.ic_fname}</Text>
								<Text style={[styles.subtitle_3]}>{user_info.ic_num}</Text>
							</View>
						)}
					</View>
					<Text />
					<ScrollView style={styles.dependent_view}>
						{check_in_records == null ? (
							<ActivityIndicator />
						) : // { all_dependent_item }
						// <View />
						check_in_records == "none" ? (
							<Text style={styles.subtitle_4}>No check in record found</Text>
						) : (
							<ScrollView>
								{check_in_records.map((data) => {
									return (
										<View key={data._id} style={styles.flexRow2}>
											<View style={[styles.flexCol, styles.flexCol_wider]}>
												<TouchableOpacity
													style={styles.dependent_outer}
													key={data._id}
													onPress={() => {
														// this.props.navigation.navigate(
														// 	"view_dependent_qrcode",
														// 	{
														// 		dependent_id: data._id,
														// 		dependent_name: data.ic_fname,
														// 		dependent_relationship: data.relationship,
														// 	}
														// );
														this.state.selected_check_in = data;
														this.setModalVisible(true);
													}}
												>
													<Text style={styles.dependent_name}>
														{data.user_premiseowner.premise_name}
													</Text>
													<Text style={styles.dependent_relationship}>
														{data.date_created}
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
														this.state.selected_check_in = data;
														this.setModalVisible(true);
													}}
												>
													<Text style={styles.textStyle}>Details</Text>
												</TouchableHighlight>
											</View>
										</View>
									);
								})}
							</ScrollView>
						)}
					</ScrollView>
				</View>
			</SafeAreaView>

			// 	{/* {news.map((data) => {
			// 			return <Text>{data.url}</Text>;
			// 		})} */}
		);
	}
}

const styles = StyleSheet.create({
	openButton_ok: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		paddingVertical: 10,
		width: 200,
		elevation: 2,
	},
	mapStyle: {
		width: 320,
		height: 300,
		marginTop: 20,
		marginBottom: 20,
	},
	flexRow_bg: {
		backgroundColor: "#f0f0f0",
		paddingTop: 40,
		paddingBottom: 25,
		paddingLeft: 20,
		marginTop: 10,
		borderRadius: 10,
	},
	branch_label: {
		fontWeight: "bold",
		fontSize: 16,
	},
	flexCol_wider: {
		width: 210,
	},
	flexCol_narrower: {
		width: 100,
	},
	pickerBorder: {
		borderWidth: 1,
		borderColor: "black",
		borderRadius: 5,
	},
	dependent_view: {
		width: 350,
		marginHorizontal: 0,
	},
	dependent_outer: {
		marginHorizontal: 0,
		paddingVertical: 15,
		// borderBottomColor: "grey",
		// borderBottomWidth: StyleSheet.hairlineWidth,
	},
	dependent_outer_1: {
		marginHorizontal: 10,
		paddingVertical: 15,
	},
	dependent_name: {
		fontWeight: "bold",
		paddingHorizontal: 10,
	},
	dependent_relationship: {
		paddingHorizontal: 10,
		color: "grey",
	},
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		alignItems: "center",
		// justifyContent: "center",
		// marginHorizontal: 20,
	},
	reg_content: {
		backgroundColor: "white",
		// marginTop: 10,
		// borderRadius: 5,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 0,
		paddingVertical: 20,
		width: "95%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		maxHeight: "100%",
	},
	add_dependent: {
		position: "absolute",
		bottom: 0,
		backgroundColor: "white",
		width: "100%",
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		fontWeight: "bold",
		// marginTop: 20,
		marginBottom: 15,
		// backgroundColor: "#0f52ba",
		// color: "white",
		// borderRadius: 5,
		width: "80%",
		// paddingHorizontal: 15,
		// paddingVertical: 5,
	},
	subtitle: {
		fontSize: 16,
		textAlign: "center",
		marginVertical: 5,
	},
	subtitle_4: {
		textAlign: "center",
		width: "100%",
		fontSize: 16,
		fontStyle: "italic",
	},
	subtitle_3: {
		textAlign: "center",
		width: "100%",
		fontSize: 16,
		fontStyle: "italic",
	},
	subtitle_2: {
		textAlign: "center",
		width: "100%",
		fontWeight: "bold",
		fontSize: 16,
	},
	subtitle_1: {
		textAlign: "center",
		paddingHorizontal: 15,
		paddingVertical: 10,
		width: "100%",
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 10,
		backgroundColor: "#f6f6f6",
	},
	subtitle_bg: {
		backgroundColor: "lightgrey",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
	},
	title_reg: {
		fontSize: 16,
		textAlign: "center",
		marginVertical: 20,
	},
	flexRow: {
		backgroundColor: "white",
		borderRadius: 5,
		width: "95%",
		flex: 0.1,
		flexDirection: "row",
		marginVertical: 20,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
	},
	flexCol_1: {
		marginHorizontal: 10,
		width: 200,
		height: 40,
		// backgroundColor: "grey",
		alignItems: "center",
		justifyContent: "center",
	},
	flexCol_2: {
		width: 100,
		height: 40,
		// backgroundColor: "grey",
		alignItems: "center",
		justifyContent: "center",
	},
	flexRow1: {
		flex: 0.1,
		flexDirection: "row",
		marginTop: 20,
		marginBottom: 20,
	},
	flexRow2: {
		flex: 0.1,
		flexDirection: "row",
		marginTop: 20,
		marginBottom: 10,
	},
	flexCol: {
		marginHorizontal: 10,
		width: 110,
		height: 40,
		justifyContent: "center",
		paddingBottom: 15,
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
		paddingVertical: 35,
		paddingHorizontal: 15,
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
});
