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

export default class real_time_check_in_record extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			check_in_records: null,
			health_risk: null,
			all_qrcode: null,
			selected_entry_point: null,
			selected_entry_point_id: "all_entry_point",
			result_date_time_from: null,
			loading: true,
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

	getCheckInRecords = async () => {
		// alert("2: " + this.state.selected_entry_point_id);
		var time_from = new Date();
		time_from.setMinutes(time_from.getMinutes() - 60);
		var time_from_iso = new Date(
			time_from.getTime() - time_from.getTimezoneOffset() * 60000
		).toISOString();
		this.setState({
			result_date_time_from: time_from_iso
				.replace("T", " ")
				.substring(0, time_from_iso.indexOf(".") - 3),
		});

		await fetch("http://192.168.0.131:5000/get_real_time_check_in_record", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				selected_entry_point_id: this.state.selected_entry_point_id,
				time_from: time_from_iso,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				if (!jsonData) {
					this.setState({ check_in_records: "none" });
					// alert("No record found");
				} else {
					// alert(JSON.stringify(jsonData));
					// jsonData.forEach(function (item) {
					// 	item.date_created = item.date_created
					// 		.replace("T", " ")
					// 		.substring(0, item.date_created.indexOf(".") - 3);
					// });

					jsonData.sort(function compare(a, b) {
						return new Date(b.date_created) - new Date(a.date_created);
					});
					this.setState({
						check_in_records: jsonData,
					});
				}
				this.setState({ loading: false });
				return;
				// console.log(jsonData);
			})
			.catch((error) => {
				alert(error);
			});
	};

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
					// premise_id: jsonData[0].user_premiseowner,
					selected_entry_point: jsonData[0].entry_point,
					// selected_entry_point_id: jsonData[0]._id,
				});

				// if (
				// 	this.state.selected_entry_point == null ||
				// 	this.state.selected_entry_point_id == null
				// ) {
				// 	this.setState({
				// 		selected_entry_point: jsonData[0].entry_point,
				// 		selected_entry_point_id: jsonData[0]._id,
				// 	});
				// }
				return;
				// console.log(this.state.qrcode_value);
			})
			.catch((error) => {
				alert(error);
			});
	};

	componentDidMount = async () => {
		await this.getAllQRCode();
		await this.getCheckInRecords();
		this._interval = setInterval(() => {
			this.getCheckInRecords();
		}, 5000);

		// const {check_in_records}  = this.state;
		// check_in_records.sort(function compare(a, b) {
		// 	return new Date(b.date_create) - new Date(a.date_create);
		// });
		// console.log(check_in_records);
		// this.setState({
		// 	check_in_records: check_in_records,
		// });
	};

	componentWillUnmount() {
		clearInterval(this._interval);
	}

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	render() {
		const {
			user_info,
			check_in_records,
			all_qrcode,
			loading,
			result_date_time_from,
		} = this.state;
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
			<SafeAreaView style={styles.container}>
				<View style={styles.reg_content}>
					<Text style={[styles.subtitle, styles.subtitle_bg]}>
						For Scan In Visitors Only (Within 1 hr)
					</Text>

					{/* <View style={[styles.subtitle_1]}>
						{user_info == null ? (
							<ActivityIndicator />
						) : (
							<View>
								<Text style={[styles.subtitle_2]}>{user_info.ic_fname}</Text>
								<Text style={[styles.subtitle_3]}>{user_info.ic_num}</Text>
							</View>
						)}
					</View> */}
					<View style={[styles.flexRow, styles.flexRow_bg]}>
						<View style={[styles.flexCol, styles.flexCol_narrower]}>
							<Text style={styles.branch_label}>Entry Point</Text>
						</View>
						<View style={[styles.flexCol, styles.flexCol_wider]}>
							<View style={styles.pickerBorder}>
								<Picker
									selectedValue={this.state.selected_entry_point_id}
									style={{ height: 50, width: 200 }}
									onValueChange={(itemValue, itemIndex) => {
										// alert(JSON.stringify(all_qrcode));
										// alert("1: " + itemValue);
										this.state.selected_entry_point_id = itemValue;
										if (itemValue !== null) {
											// alert(itemIndex);
											this.setState({
												// selected_entry_point_id: itemValue,
												selected_entry_point:
													all_qrcode[itemIndex - 1].entry_point,
												loading: true,
											});
										} else {
											this.setState({
												// selected_entry_point_id: itemValue,
												selected_entry_point: "all_entry_point",
												loading: true,
											});
										}

										this.getCheckInRecords();
									}}
								>
									<Picker.Item
										key={null}
										value={null}
										label="- All Entry Point -"
									/>
									{all_entry_points}
								</Picker>
							</View>
						</View>
					</View>
					{result_date_time_from == null ? (
						<Text />
					) : (
						<Text style={styles.onwards_subtitle}>
							{"Check ins of " + result_date_time_from + " onwards"}
						</Text>
					)}

					<ScrollView style={styles.dependent_view}>
						{check_in_records == null || loading == true ? (
							<ActivityIndicator />
						) : check_in_records == "none" ? (
							<Text style={styles.subtitle_4}>No check in record found</Text>
						) : (
							<SafeAreaView>
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
														}}
													>
														<Text style={styles.dependent_name}>
															#
															{" " +
																data._id
																	.slice(data._id.length - 2)
																	.toUpperCase()}
														</Text>
														<Text style={styles.dependent_relationship}>
															{data.date_created
																.replace("T", " ")
																.substring(
																	0,
																	data.date_created.indexOf(".") - 3
																)}
														</Text>
													</TouchableOpacity>
												</View>
												<View style={[styles.flexCol, styles.flexCol_narrower]}>
													{data.health_risk === false ? (
														<Text
															style={[
																styles.subtitle,
																styles.subtitle_bg_green,
															]}
														>
															Risk
														</Text>
													) : data.health_risk === true ? (
														<Text
															style={[styles.subtitle, styles.subtitle_bg_red]}
														>
															Risk
														</Text>
													) : (
														<Text
															style={[
																styles.subtitle,
																styles.subtitle_bg_unknown,
															]}
														>
															Risk
														</Text>
													)}
												</View>
											</View>
										);
									})}
								</ScrollView>
							</SafeAreaView>
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
	onwards_subtitle: {
		marginBottom: 20,
		marginTop: 10,
		fontStyle: "italic",
		fontWeight: "bold",
	},
	subtitle_bg_green: {
		backgroundColor: "#3cb371",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
		color: "white",
	},
	subtitle_bg_red: {
		backgroundColor: "#cd5c5c",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
		color: "white",
	},
	subtitle_bg_unknown: {
		backgroundColor: "grey",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
		color: "white",
	},
	flexRow_bg: {
		backgroundColor: "#f0f0f0",
		paddingTop: 40,
		paddingBottom: 25,
		paddingLeft: 20,
		width: "90%",
		marginHorizontal: "5%",
		marginTop: 10,
		marginHorizontal: 10,
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
		marginRight: 15,
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
		paddingTop: 10,
		paddingBottom: 20,
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
		marginTop: 20,
		marginBottom: 10,
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
