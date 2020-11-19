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
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

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
			selected_time_range: "day",
			loading: false,
			loading_demo: true,
			loading_demo_age: true,
			demo_counts: null,
			demo_age_counts: null,
		};
	}

	getCheckInCounts = async () => {
		const { selected_time_range } = this.state;
		if (selected_time_range == "day") {
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
			date_to = new Date(
				date_to.getTime() - date_to.getTimezoneOffset() * 60000
			); // utc +8
			date_to.setUTCHours(0, 0, 0, 0); // change time to midnight 00:00 of that day
			date_to.setDate(date_to.getDate() - 6);
			date_to.setMilliseconds(date_to.getMilliseconds() - 1);

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
		} else if (selected_time_range == "week") {
			var date_from = new Date();
			var date_to = new Date();
			date_from = new Date(
				date_from.getTime() - date_from.getTimezoneOffset() * 60000
			); // utc +8
			date_from.setUTCHours(0, 0, 0, 0); // change time to midnight 00:00 of that day
			// date_from.setDate(date_from.getDate() - 7);

			var date_from_arr = new Array();
			var date_to_arr = new Array();
			var date_from_simplified_arr = new Array();
			// var date_to_simplified_arr = new Array();
			for (var i = 0; i < 4; i++) {
				date_from.setDate(date_from.getDate() - date_from.getDay());
				date_to = date_from;
				date_to.setMilliseconds(date_to.getMilliseconds() - 1);
				date_to_arr.push(date_to.toISOString());
				// date_to_simplified_arr.push(
				// 	date_to.getDate() - 1 + "/" + (date_to.getMonth() + 1)
				// );

				date_from.setDate(date_from.getDate() - 7);
				date_from.setMilliseconds(date_from.getMilliseconds() + 1);
				date_from_arr.push(date_from.toISOString());
				date_from_simplified_arr.push(
					"Week " + date_from.getDate() + "/" + (date_from.getMonth() + 1)
				);
			}
			// console.log(date_from_simplified_arr);
			// console.log(date_to_simplified_arr);
			date_from_arr.reverse();
			date_to_arr.reverse();
			date_from_simplified_arr.reverse();
			this.setState({ date_from_simplified_arr: date_from_simplified_arr });

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
		} else if (selected_time_range == "month") {
			var date_from = new Date();
			var date_to = new Date();
			date_from = new Date(
				date_from.getTime() - date_from.getTimezoneOffset() * 60000
			); // utc +8
			date_from.setUTCHours(0, 0, 0, 0); // change time to midnight 00:00 of that day

			var date_from_arr = new Array();
			var date_to_arr = new Array();
			var date_from_simplified_arr = new Array();
			var months = new Array(
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			);
			// var date_to_simplified_arr = new Array();
			for (var i = 0; i < 2; i++) {
				date_from.setDate(1);
				date_to = date_from;
				date_to.setMilliseconds(date_to.getMilliseconds() - 1);
				date_to_arr.push(date_to.toISOString());

				date_from.setMonth(date_from.getMonth() - 1);
				date_from.setMilliseconds(date_from.getMilliseconds() + 1);
				date_from_arr.push(date_from.toISOString());
				date_from_simplified_arr.push(months[date_from.getMonth()]);
			}

			date_from_arr.reverse();
			date_to_arr.reverse();
			date_from_simplified_arr.reverse();
			// console.log(date_from_arr);
			// console.log(date_to_arr);
			this.setState({ date_from_simplified_arr: date_from_simplified_arr });

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
		}
	};

	getDemoCounts = async () => {
		await fetch("http://192.168.0.131:5000/get_demography_counts", {
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
				if (!jsonData) {
					this.setState({ demo_counts: [0, 0] });
				} else {
					// console.log(jsonData);
					// var total_count = jsonData[0] + jsonData[1];
					// var male_percentage = (jsonData[0] / total_count) * 100;
					// male_percentage = Math.round(male_percentage);
					// var female_percentage = (jsonData[1] / total_count) * 100;
					// female_percentage = Math.round(female_percentage);
					this.setState({
						demo_counts: jsonData,
					});
				}
				this.setState({ loading_demo: false });
			})
			.catch((error) => {
				alert(error);
			});
	};

	getDemoAgeCounts = async () => {
		await fetch("http://192.168.0.131:5000/get_demography_age_counts", {
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
				if (!jsonData) {
					this.setState({ demo_age_counts: [0, 0, 0, 0] });
				} else {
					// console.log(jsonData);
					var total_count =
						jsonData[0] + jsonData[1] + jsonData[2] + jsonData[3];
					var first_range = (jsonData[0] / total_count) * 100;
					first_range = Math.round(first_range);
					var second_range = (jsonData[1] / total_count) * 100;
					second_range = Math.round(second_range);
					var third_range = (jsonData[2] / total_count) * 100;
					third_range = Math.round(third_range);
					var forth_range = (jsonData[3] / total_count) * 100;
					forth_range = Math.round(forth_range);
					this.setState({
						demo_age_counts: new Array(
							first_range,
							second_range,
							third_range,
							forth_range
						),
					});
				}
				this.setState({ loading_demo_age: false });
			})
			.catch((error) => {
				alert(error);
			});
	};

	componentDidMount = async () => {
		this.getCheckInCounts();
		this.getDemoCounts();
		this.getDemoAgeCounts();
	};

	componentWillUnmount() {
		// clearInterval(this._interval);
	}

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	render() {
		const {
			check_in_counts,
			date_from_simplified_arr,
			selected_time_range,
			loading,
			loading_demo,
			loading_demo_age,
			demo_counts,
			demo_age_counts,
		} = this.state;

		var data;
		if (check_in_counts !== null && date_from_simplified_arr !== null) {
			data = {
				labels: date_from_simplified_arr,
				datasets: [
					{
						data: check_in_counts,
						color: (opacity = 0.8) => `rgba(91, 120, 235, ${opacity})`, // optional
						strokeWidth: 2, // optional
					},
				],
				legend: ["Number of Visitors"], // optional
			};
		}

		var data_demo;
		if (!loading_demo) {
			data_demo = [
				{
					name: "Male",
					population: demo_counts[0],
					color: "#127cee",
					legendFontColor: "#7F7F7F",
					legendFontSize: 15,
				},
				{
					name: "Female",
					population: demo_counts[1],
					color: "#f6749c",
					legendFontColor: "#7F7F7F",
					legendFontSize: 15,
				},
			];
		}

		var data_demo_age;
		if (!loading_demo_age) {
			data_demo_age = {
				labels: [
					"0-14 years",
					"15-24 years",
					"25-64 years",
					"> 64 years",
				],
				datasets: [
					{
						data: demo_age_counts,
					},
				],
			};
		}

		return (
			<ScrollView style={styles.container}>
				<View style={styles.reg_content}>
					{check_in_counts == null ? (
						<ActivityIndicator />
					) : (
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={styles.analytic_title}>
								Total Number of Visitors Checked In
							</Text>

							<View style={styles.pickerBorder}>
								<Picker
									selectedValue={selected_time_range}
									style={{ height: 40, width: 170 }}
									onValueChange={(itemValue, itemIndex) => {
										// alert(JSON.stringify(all_qrcode));
										this.setState({
											selected_time_range: itemValue,
											loading: true,
										});
										this.state.selected_time_range = itemValue;
										this.getCheckInCounts();
									}}
								>
									<Picker.Item value="day" label="Last 7 days" />
									<Picker.Item value="week" label="Last 4 weeks" />
									<Picker.Item value="month" label="Last 2 months" />
								</Picker>
							</View>

							{loading ? (
								<ActivityIndicator
									style={{
										width: Dimensions.get("window").width * 0.92,
										marginVertical: 20,
									}}
								/>
							) : (
								<LineChart
									data={data}
									width={Dimensions.get("window").width * 1}
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
										marginHorizontal: 0,
										marginLeft: -30,
									}}
								/>
							)}
						</View>
					)}
					<View
						style={{
							borderBottomColor: "black",
							borderBottomWidth: StyleSheet.hairlineWidth,
							width: "100%",
							marginVertical: 10,
						}}
					/>

					{loading_demo ? (
						<ActivityIndicator
							style={{
								width: Dimensions.get("window").width * 0.92,
								marginVertical: 20,
							}}
						/>
					) : (
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={styles.analytic_title}>Visitors Demographic</Text>
							<PieChart
								data={data_demo}
								width={Dimensions.get("window").width * 0.92}
								height={220}
								chartConfig={{
									backgroundColor: "#e26a00",
									backgroundGradientFrom: "#fb8c00",
									backgroundGradientTo: "#ffa726",
									color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
									style: {
										borderRadius: 16,
									},
								}}
								accessor="population"
								backgroundColor="transparent"
								paddingLeft="15"
							/>
						</View>
					)}

					{loading_demo_age ? (
						<ActivityIndicator
							style={{
								width: Dimensions.get("window").width * 0.92,
								marginVertical: 20,
							}}
						/>
					) : (
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text />
							<BarChart
								data={data_demo_age}
								width={Dimensions.get("window").width * 0.92}
								height={300}
								yAxisSuffix="%"
								chartConfig={{
									decimalPlaces: 0,
									backgroundColor: "#0091EA",
									backgroundGradientFrom: "#0091EA",
									backgroundGradientTo: "#0091EA",
									color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
									style: {
										borderRadius: 16,
									},
								}}
								verticalLabelRotation={30}
							/>
						</View>
					)}
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	analytic_title: {
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 15,
		marginBottom: 20,
		backgroundColor: "#363535",
		borderRadius: 10,
		color: "white",
		marginHorizontal: "5%",
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	flexRow_bg: {
		backgroundColor: "#f0f0f0",
		paddingTop: 40,
		paddingBottom: 25,
		paddingLeft: 20,
		width: "90%",
		marginHorizontal: "5%",
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
		borderColor: "grey",
		borderRadius: 5,
		width: 180,
		marginHorizontal: "5%",
		marginBottom: 5,
		paddingLeft: 10,
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
		// alignItems: "center",
		// justifyContent: "center",
		marginHorizontal: "3%",
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
		minWidth: "100%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		overflow: "hidden",
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
