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
	Dimensions,
} from "react-native";
import {
	LineChart,
	BarChart,
	PieChart,
	ProgressChart,
	ContributionGraph,
	StackedBarChart,
} from "react-native-chart-kit";

export default class visitor_analytics extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			check_in_counts: null,
			date_from_simplified_arr: null,
			selected_time_range: null,
		};
	}

	getCheckInRecords = async () => {
		// alert("2: " + this.state.selected_entry_point_id);
		var time_from = new Date();
		time_from.setMinutes(time_from.getMinutes() - 60);
		var time_from_iso = new Date(
			time_from.getTime() - time_from.getTimezoneOffset() * 60000
		).toISOString();
		// alert(time_from_iso);
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
					selected_entry_point_id: jsonData[0]._id,
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

	getCheckInCounts = async () => {
		var date_from = new Date();
		date_from = new Date(
			date_from.getTime() - date_from.getTimezoneOffset() * 60000
		); // utc +8
		date_from.setUTCHours(0, 0, 0, 0); // change time to midnight 00:00 of that day
		date_from.setDate(date_from.getDate() - 7);

		var date_from_arr = new Array();
		var date_from_simplified_arr = new Array();
		for (var i = 0; i < 7; i++) {
			date_from_arr.push(date_from.toISOString());
			date_from_simplified_arr.push(
				date_from.getDate() + "/" + (date_from.getMonth() + 1)
			);
			date_from.setDate(date_from.getDate() + 1);
			// console.log(date_from_arr);
			// console.log(date_from_simplified_arr);
		}
		this.setState({ date_from_simplified_arr: date_from_simplified_arr });

		var date_to = new Date();
		date_to = new Date(date_to.getTime() - date_to.getTimezoneOffset() * 60000); // utc +8
		date_to.setUTCHours(0, 0, 0, 0); // change time to midnight 00:00 of that day
		date_to.setDate(date_to.getDate() - 6);

		var date_to_arr = new Array();
		for (var i = 0; i < 7; i++) {
			date_to_arr.push(date_to.toISOString());
			date_to.setDate(date_to.getDate() + 1);
		}

		// alert(date_from_arr);

		await fetch("http://192.168.0.131:5000/get_check_in_counts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				date_from_arr: date_from_arr,
				date_to_arr: date_to_arr,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				if (!jsonData) {
					this.setState({ check_in_counts: "none" });
				} else {
					// console.log(jsonData);
					this.setState({ check_in_counts: jsonData });
				}
				this.setState({ loading: false });
			})
			.catch((error) => {
				alert(error);
			});
	};

	componentDidMount = async () => {
		// await this.getAllQRCode();
		// await this.getCheckInRecords();
		this.getCheckInCounts();
	};

	componentWillUnmount() {
		// clearInterval(this._interval);
	}

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	render() {
		const { check_in_counts, date_from_simplified_arr } = this.state;
		var data;
		if (check_in_counts !== null || date_from_simplified_arr !== null) {
			data = {
				labels: date_from_simplified_arr,
				datasets: [
					{
						data: check_in_counts,
						color: (opacity = 0.8) => `rgba(91, 120, 235, ${opacity})`, // optional
						strokeWidth: 2, // optional
					},
				],
				legend: ["Visitors"], // optional
			};
		}

		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.reg_content}>
					{check_in_counts == null ? (
						<ActivityIndicator />
					) : (
						<View>
							<View style={styles.pickerBorder}>
								<Picker
									selectedValue={this.state.selected_time_range}
									style={{ height: 50, width: 180 }}
									onValueChange={(itemValue, itemIndex) => {
										// alert(JSON.stringify(all_qrcode));
										this.setState({
											selected_time_range: itemValue,
										});
									}}
								>
									<Picker.Item value="day" label="Last 7 days" />
									<Picker.Item value="week" label="Last 4 weeks" />
									<Picker.Item value="month" label="Last 6 months" />
								</Picker>
							</View>
							<LineChart
								data={data}
								width={Dimensions.get("window").width * 0.9}
								height={220}
								chartConfig={{
									backgroundColor: "#ffffff",
									backgroundGradientFrom: "#ffffff",
									backgroundGradientTo: "#ffffff",
									decimalPlaces: 0, // optional, defaults to 2dp
									color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
									labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
									style: {
										borderRadius: 16,
									},
									propsForDots: {
										r: "6",
										strokeWidth: "2",
										stroke: "#d9d9d9",
									},
								}}
								style={{
									marginVertical: 8,
									borderRadius: 16,
									borderColor: "#d9d9d9",
									borderWidth: 1,
								}}
							/>
						</View>
					)}
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
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
		borderColor: "grey",
		borderRadius: 5,
		width: "30%",
		marginVertical: 5,
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
