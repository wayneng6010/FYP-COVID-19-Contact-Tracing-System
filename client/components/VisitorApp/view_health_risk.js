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
} from "react-native";

export default class view_check_in_history extends React.Component {
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
			selected_relation: null,
		};
	}

	getAllDependent = async () => {
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
					// alert("No record found for dependent");
					this.setState({
						all_dependent: "none",
					});
				} else {
					// alert(jsonData);
					jsonData.sort(function compare(a, b) {
						return new Date(a.date_created) - new Date(b.date_created);
					});
					this.setState({
						all_dependent: jsonData,
					});
				}
				// console.log(jsonData);
			})
			.catch((error) => {
				alert(error);
			});
	};

	getUserInfo = async () => {
		await fetch("http://192.168.0.131:5000/get_user_info_health_risk", {
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

	componentDidMount = async () => {
		this.getAllDependent();
		this.getUserInfo();

		const { navigation } = this.props;
		this.focusListener = navigation.addListener("didFocus", () => {
			this.getAllDependent();
			this.getUserInfo();
		});
	};

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	render() {
		const { user_info, all_dependent } = this.state;

		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.reg_content}>
					<Text style={[styles.subtitle, styles.subtitle_bg]}>
						View Health Risk
					</Text>
					<Text />

					<Text style={[styles.subtitle_1]}>You</Text>
					<View style={styles.dependent_view}>
						{user_info == null ? (
							<ActivityIndicator />
						) : (
							// { all_dependent_item }
							// <View />
							<View>
								<View style={styles.flexRow1}>
									<View style={[styles.flexCol, styles.flexCol_wider]}>
										<TouchableOpacity
											style={styles.dependent_outer_1}
											key={user_info._id}
											onPress={() => {
												this.props.navigation.navigate(
													"health_risk_assessment",
													{
														role: "visitor",
													}
												);
											}}
										>
											<Text style={styles.dependent_name}>
												{user_info.ic_fname}
											</Text>
										</TouchableOpacity>
									</View>
									<View style={[styles.flexCol, styles.flexCol_narrower]}>
										<TouchableHighlight
											onPress={() => {
												this.props.navigation.navigate(
													"health_risk_assessment",
													{
														role: "visitor",
													}
												);
											}}
										>
											{user_info.health_risk === false ? (
												<Text style={styles.subtitle_bg_green}>Risk</Text>
											) : user_info.health_risk === true ? (
												<Text style={styles.subtitle_bg_red}>Risk</Text>
											) : (
												<Text style={styles.subtitle_bg_unknown}>Risk</Text>
											)}
										</TouchableHighlight>
									</View>
								</View>
							</View>
						)}
					</View>
					<Text />
					<Text />
					<Text style={[styles.subtitle_1]}>Your Dependent</Text>
					<ScrollView style={styles.dependent_view}>
						{all_dependent == null ? (
							<ActivityIndicator />
						) : // { all_dependent_item }
						// <View />
						all_dependent == "none" ? (
							<Text style={styles.no_record}>No dependent found</Text>
						) : (
							<View>
								{all_dependent.map((data) => {
									return (
										<View key={data._id} style={styles.flexRow2}>
											<View style={[styles.flexCol, styles.flexCol_wider]}>
												<TouchableOpacity
													style={styles.dependent_outer}
													key={data._id}
													onPress={() => {
														this.props.navigation.navigate(
															"health_risk_assessment",
															{
																role: "dependent",
																dependent_id: data._id,
																dependent_fname: data.ic_fname,
															}
														);
													}}
												>
													<Text style={styles.dependent_name}>
														{data.ic_fname}
													</Text>
													<Text style={styles.dependent_relationship}>
														{data.relationship}
													</Text>
												</TouchableOpacity>
											</View>
											<View style={[styles.flexCol, styles.flexCol_narrower]}>
												<TouchableHighlight
													onPress={() => {
														this.props.navigation.navigate(
															"health_risk_assessment",
															{
																role: "dependent",
																dependent_id: data._id,
																dependent_fname: data.ic_fname,
															}
														);
													}}
												>
													{data.health_risk === "Low" ? (
														<Text style={styles.subtitle_bg_green}>Risk</Text>
													) : data.health_risk === "High" ? (
														<Text style={styles.subtitle_bg_red}>Risk</Text>
													) : (
														<Text style={styles.subtitle_bg_unknown}>Risk</Text>
													)}
												</TouchableHighlight>
											</View>
										</View>
									);
								})}
							</View>
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
	no_record: {
		textAlign: "center",
		fontStyle: "italic",
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
		width: 200,
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
	},
	dependent_outer: {
		marginHorizontal: 10,
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
		paddingHorizontal: 10,
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
		maxHeight: "90%",
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
	subtitle_bg_green: {
		backgroundColor: "#3cb371",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
		color: "white",
		textAlign: "center",
	},
	subtitle_bg_red: {
		backgroundColor: "#cd5c5c",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
		color: "white",
		textAlign: "center",
	},
	subtitle_bg_unknown: {
		backgroundColor: "grey",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
		color: "white",
		textAlign: "center",
	},
	subtitle_2: {
		fontSize: 16,
		textAlign: "center",
		marginVertical: 5,
		backgroundColor: "#f7f7f7",
		width: "105%",
		paddingHorizontal: 15,
		paddingVertical: 10,
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
		marginBottom: 20,
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
