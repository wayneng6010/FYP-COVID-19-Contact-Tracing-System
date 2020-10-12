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
	TextInput,
	ToastAndroid,
	ActivityIndicator,
	TouchableHighlight,
	Picker,
} from "react-native";
import RadioForm, {
	RadioButton,
	RadioButtonInput,
	RadioButtonLabel,
} from "react-native-simple-radio-button";

export default class health_risk_assessment extends React.Component {
	constructor() {
		super();
		this.state = {
			q1_response: null,
			q2_response: null,
			q3_response: null,
			q4_response: null,
			q5_response: null,
			responses_arr: null,
			saved_responses: null,
			checked_saved_response: null,
			update_saved_response: false,
			result: null,
			user_role: null,
			dependent_id: null,
			dependent_fname: null,
		};
		// alert(this.state.formDataObj.phone_no_sent);
	}

	componentDidMount = () => {
		if (this.props.navigation.state.params.role == "visitor") {
			this.setState({ user_role: "visitor" });
			this.getSavedRecord("visitor", "");
		} else {
			this.setState({
				user_role: "dependent",
				dependent_id: this.props.navigation.state.params.dependent_id,
				dependent_fname: this.props.navigation.state.params.dependent_fname,
			});
			this.getSavedRecord(
				"dependent",
				this.props.navigation.state.params.dependent_id
			);
		}
	};

	getSavedRecord = async (role, dependent_id) => {
		await fetch("http://192.168.0.131:5000/get_health_risk_assessment_record", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ role: role, dependent_id: dependent_id }),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData === undefined || jsonData.length == 0) {
					// alert("No record found");
					this.setState({
						checked_saved_response: true,
					});
				} else {
					jsonData = JSON.parse(jsonData);
					var responses_arr = jsonData.responses;
					var responses_arr_length = responses_arr.length;
					for (var i = 0; i < responses_arr_length; i++) {
						if (responses_arr[i] === 1) {
							responses_arr[i] = "Yes";
						} else if (responses_arr[i] === 0) {
							responses_arr[i] = "No";
						}
					}
					if (jsonData.result == true) {
						jsonData.result = "Health Check Recommended for COVID-19";
					} else if (jsonData.result == false) {
						jsonData.result = "No Health Check Recommended for COVID-19";
					}

					jsonData.date_created = jsonData.date_created
						.replace("T", " ")
						.substring(0, jsonData.date_created.indexOf(".") - 3);
					this.setState({
						saved_responses: jsonData,
						checked_saved_response: true,
					});
					// alert(JSON.stringify(jsonData));
				}
				// console.log(this.state.qrcode_value);
			})
			.catch((error) => {
				alert(error);
			});
	};

	firstTestCriteria = () => {
		var { q1_response, q3_response, q4_response, q5_response } = this.state;

		var I1_set = [
			parseInt(q1_response),
			parseInt(q3_response),
			parseInt(q4_response),
			parseInt(q5_response),
		];

		var C1_set = [
			[1, 1, 1, 1],
			[1, 1, 1, 0],
			[1, 1, 0, 0],
			[1, 0, 1, 1],
			[1, 0, 0, 1],
			[1, 0, 1, 0],
			[1, 1, 0, 1],
		];

		var result = true;
		for (var i = 0; i < C1_set.length; i++) {
			var C1_set_item = C1_set[i];
			result = true;
			for (var j = 0; j < C1_set_item.length; j++) {
				if (C1_set[i][j] != I1_set[j]) {
					result = false;
					break;
				}
				if (j == C1_set_item.length - 1 && result == true) {
					return true;
				}
			}
		}
		return false;
	};

	secondTestCriteria = () => {
		var { q2_response, q3_response, q4_response, q5_response } = this.state;

		var I2_set = [
			parseInt(q2_response),
			parseInt(q3_response),
			parseInt(q4_response),
			parseInt(q5_response),
		];

		var C1_set = [
			[1, 1, 1, 1],
			[1, 1, 1, 0],
			[1, 1, 0, 0],
			[1, 0, 1, 1],
			[1, 0, 0, 1],
			[1, 0, 1, 0],
			[1, 1, 0, 1],
		];

		var result = true;
		for (var i = 0; i < C1_set.length; i++) {
			var C1_set_item = C1_set[i];
			result = true;
			for (var j = 0; j < C1_set_item.length; j++) {
				if (C1_set[i][j] != I2_set[j]) {
					result = false;
					break;
				}
				if (j == C1_set_item.length - 1 && result == true) {
					return true;
				}
			}
		}
		return false;
	};

	thirdTestCriteria = () => {
		var { q1_response, q3_response, q4_response, q5_response } = this.state;

		var I1_set = [
			parseInt(q1_response),
			parseInt(q3_response),
			parseInt(q4_response),
			parseInt(q5_response),
		];

		var C2_set = [
			[0, 1, 1, 1],
			[0, 1, 1, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 1],
			[0, 0, 0, 1],
			[0, 0, 1, 0],
			[0, 1, 0, 1],
		];

		var result = true;
		for (var i = 0; i < C2_set.length; i++) {
			var C2_set_item = C2_set[i];
			result = true;
			for (var j = 0; j < C2_set_item.length; j++) {
				if (C2_set[i][j] != I1_set[j]) {
					result = false;
					break;
				}
				if (j == C2_set_item.length - 1 && result == true) {
					return true;
				}
			}
		}
		return false;
	};

	fourthTestCriteria = () => {
		var { q2_response, q3_response, q4_response, q5_response } = this.state;

		var I2_set = [
			parseInt(q2_response),
			parseInt(q3_response),
			parseInt(q4_response),
			parseInt(q5_response),
		];

		var C2_set = [
			[0, 1, 1, 1],
			[0, 1, 1, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 1],
			[0, 0, 0, 1],
			[0, 0, 1, 0],
			[0, 1, 0, 1],
		];

		var result = true;
		for (var i = 0; i < C2_set.length; i++) {
			var C2_set_item = C2_set[i];
			result = true;
			for (var j = 0; j < C2_set_item.length; j++) {
				if (C2_set[i][j] != I2_set[j]) {
					result = false;
					break;
				}
				if (j == C2_set_item.length - 1 && result == true) {
					return true;
				}
			}
		}
		return false;
	};

	assessUserRisk = () => {
		var firstTestResult = this.firstTestCriteria();
		if (firstTestResult) {
			return true;
		} else {
			var secondTestResult = this.secondTestCriteria();
			if (secondTestResult) {
				return true;
			} else {
				var thirdTestResult = this.thirdTestCriteria();
				if (thirdTestResult) {
					return false;
				} else {
					var fourthTestResult = this.fourthTestCriteria();
					if (fourthTestResult) {
						return false;
					} else {
						return false;
					}
				}
			}
		}
	};

	save_result = async () => {
		if (this.state.update_saved_response == false) {
			await fetch(
				"http://192.168.0.131:5000/save_health_risk_assessment_result",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						responses: this.state.responses_arr,
						result: this.state.result,
						role: this.state.user_role,
						dependent_id: this.state.dependent_id,
					}),
				}
			)
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.text();
				})
				.then((jsonData) => {
					// alert(JSON.stringify(jsonData));
					if (jsonData == "success") {
						if (this.state.user_role == "visitor") {
							this.getSavedRecord("visitor", "");
						} else {
							this.getSavedRecord("dependent", this.state.dependent_id);
						}
					} else if (jsonData == "failed") {
						alert("Error occured while saving your responses");
					} else {
						alert("Error occured while saving your responses");
					}
					// console.log(this.state.qrcode_value);
				})
				.catch((error) => {
					alert(error);
				});
		} else if (this.state.update_saved_response == true) {
			await fetch(
				"http://192.168.0.131:5000/update_health_risk_assessment_result",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						response_record_id: this.state.saved_responses._id,
						responses: this.state.responses_arr,
						result: this.state.result,
					}),
				}
			)
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.text();
				})
				.then((jsonData) => {
					// alert(JSON.stringify(jsonData));
					if (jsonData == "success") {
						if (this.state.user_role == "visitor") {
							this.getSavedRecord("visitor", "");
						} else {
							this.getSavedRecord("dependent", this.state.dependent_id);
						}
					} else if (jsonData == "failed") {
						alert("Error occured while updating your responses");
					} else {
						alert("Error occured while updating your responses");
					}
					this.setState({
						update_saved_response: false,
					});
					// console.log(this.state.qrcode_value);
				})
				.catch((error) => {
					alert(error);
				});
		}
	};

	updateResponse = async () => {
		this.setState({
			// saved_responses: null,
			update_saved_response: true,
			// checked_saved_response: true,
		});
	};

	onSubmit = async () => {
		var {
			q1_response,
			q2_response,
			q3_response,
			q4_response,
			q5_response,
		} = this.state;

		var responses = [
			parseInt(q1_response),
			parseInt(q2_response),
			parseInt(q3_response),
			parseInt(q4_response),
			parseInt(q5_response),
		];

		this.setState({ responses_arr: responses });

		if (
			q1_response == null ||
			q2_response == null ||
			q3_response == null ||
			q4_response == null ||
			q5_response == null
		) {
			alert("Please response to all the questions");
			return;
		} else {
			var result = await this.assessUserRisk();
			this.setState({ result: result });
			if (result) {
				alert("Health Check Recommended for Coronavirus");
			} else {
				alert("No Health Check Recommended for Coronavirus");
			}
			this.save_result();
		}
	};

	render() {
		var radio_props = [
			{ label: "Yes", value: 1 },
			{ label: "No", value: 0 },
		];
		const {
			checked_saved_response,
			saved_responses,
			update_saved_response,
			dependent_fname,
		} = this.state;

		return (
			<ScrollView style={styles.container}>
				<View style={styles.flex_center}>
					<Text style={[styles.subtitle, styles.subtitle_bg]}>
						Health Risk Assessment
					</Text>
				</View>
				{checked_saved_response == null ? (
					<View style={styles.loading}>
						<ActivityIndicator size="large" />
					</View>
				) : (
					<View />
				)}

				{saved_responses == null || update_saved_response == true ? (
					<View />
				) : (
					<View
						style={
							saved_responses.result == "Health Check Recommended for COVID-19"
								? styles.saved_result_positive
								: styles.saved_result_negative
						}
					>
						<Text style={styles.saved_risk}>{saved_responses.result}</Text>
						<Text style={styles.submitted_date}>
							Submitted on {saved_responses.date_created}
						</Text>
					</View>
				)}
				<Text style={styles.subtitle}>
					1. Have {dependent_fname == null ? "you" : dependent_fname} traveled
					to (or living in) any of the COVID-19 affected areas/countries in the
					last 14 days?
				</Text>

				{saved_responses == null || update_saved_response == true ? (
					<RadioForm
						style={styles.radio_form}
						radio_props={radio_props}
						initial={-1}
						buttonSize={15}
						buttonOuterSize={25}
						animation={false}
						buttonColor={"#76b7fa"}
						onPress={(value) => {
							this.setState({ q1_response: value });
						}}
					/>
				) : (
					<Text style={styles.selected_response}>
						Selected Response:
						<Text style={{ fontWeight: "bold" }}>
							{" " + saved_responses.responses[0]}
						</Text>
					</Text>
				)}

				<Text />

				<Text style={styles.subtitle}>
					2. Have {dependent_fname == null ? "you" : dependent_fname} had any
					close contact with a person who is known to have COVID-19 during the
					last 14 days?
				</Text>
				{saved_responses == null || update_saved_response == true ? (
					<RadioForm
						style={styles.radio_form}
						radio_props={radio_props}
						initial={-1}
						buttonSize={15}
						buttonOuterSize={25}
						animation={false}
						buttonColor={"#76b7fa"}
						onPress={(value) => {
							this.setState({ q2_response: value });
						}}
					/>
				) : (
					<Text style={styles.selected_response}>
						Selected Response:
						<Text style={{ fontWeight: "bold" }}>
							{" " + saved_responses.responses[1]}
						</Text>
					</Text>
				)}

				<Text />

				<Text style={styles.subtitle}>
					3. Do {dependent_fname == null ? "you" : dependent_fname} have a
					fever?
				</Text>
				{saved_responses == null || update_saved_response == true ? (
					<RadioForm
						style={styles.radio_form}
						radio_props={radio_props}
						initial={-1}
						buttonSize={15}
						buttonOuterSize={25}
						animation={false}
						buttonColor={"#76b7fa"}
						onPress={(value) => {
							this.setState({ q3_response: value });
						}}
					/>
				) : (
					<Text style={styles.selected_response}>
						Selected Response:
						<Text style={{ fontWeight: "bold" }}>
							{" " + saved_responses.responses[2]}
						</Text>
					</Text>
				)}

				<Text />

				<Text style={styles.subtitle}>
					4. Do {dependent_fname == null ? "you" : dependent_fname} have a
					cough?
				</Text>
				{saved_responses == null || update_saved_response == true ? (
					<RadioForm
						style={styles.radio_form}
						radio_props={radio_props}
						initial={-1}
						buttonSize={15}
						buttonOuterSize={25}
						animation={false}
						buttonColor={"#76b7fa"}
						onPress={(value) => {
							this.setState({ q4_response: value });
						}}
					/>
				) : (
					<Text style={styles.selected_response}>
						Selected Response:
						<Text style={{ fontWeight: "bold" }}>
							{" " + saved_responses.responses[3]}
						</Text>
					</Text>
				)}

				<Text />

				<Text style={styles.subtitle}>
					5. Do {dependent_fname == null ? "you" : dependent_fname} have a
					shortness of breath?
				</Text>
				{saved_responses == null || update_saved_response == true ? (
					<RadioForm
						style={styles.radio_form}
						radio_props={radio_props}
						initial={-1}
						buttonSize={15}
						buttonOuterSize={25}
						animation={false}
						buttonColor={"#76b7fa"}
						onPress={(value) => {
							this.setState({ q5_response: value });
						}}
					/>
				) : (
					<Text style={styles.selected_response}>
						Selected Response:
						<Text style={{ fontWeight: "bold" }}>
							{" " + saved_responses.responses[4]}
						</Text>
					</Text>
				)}

				<Text />
				<Text />

				<View style={styles.flex_center}>
					{/* <Button title="Submit" onPress={() => this.onSubmit()}></Button> */}
					{saved_responses == null || update_saved_response == true ? (
						<TouchableHighlight
							style={{
								...styles.openButton,
								backgroundColor: "#1e90ff",
								width: 150,
							}}
							onPress={() => {
								this.onSubmit();
							}}
						>
							<Text style={styles.textStyle}>
								{update_saved_response == false ? "Submit" : "Update"}
							</Text>
						</TouchableHighlight>
					) : (
						<TouchableHighlight
							style={{
								...styles.openButton,
								backgroundColor: "grey",
								width: 200,
							}}
							onPress={() => {
								this.updateResponse();
							}}
						>
							<Text style={styles.textStyle}>Update Responses</Text>
						</TouchableHighlight>
					)}
				</View>

				<Text />
				<Text />
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		backgroundColor: "white",
		// alignItems: "center",
		// justifyContent: "center",
		marginHorizontal: 10,
	},
	flex_center: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		marginVertical: 20,
		fontWeight: "bold",
	},
	subtitle: {
		fontSize: 16,
		textAlign: "left",
		paddingHorizontal: 20,
		marginVertical: 10,
	},
	subtitle_bg: {
		marginVertical: 20,
		backgroundColor: "lightgrey",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
		textAlign: "center",
		width: 270,
	},
	input: {
		borderColor: "#c0cbd3",
		borderWidth: 2,
		width: 300,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	input_disabled: {
		borderColor: "#c0cbd3",
		borderWidth: 2,
		width: 300,
		paddingVertical: 5,
		paddingHorizontal: 10,
		backgroundColor: "lightgrey",
	},
	radio_form: {
		width: "100%",
		paddingHorizontal: 25,
		paddingVertical: 10,
		backgroundColor: "#f7f7f7",
		borderRadius: 20,
		marginHorizontal: "5%",
		width: "90%",
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
	selected_response: {
		marginHorizontal: "5%",
		backgroundColor: "#f7f7f7",
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	saved_result_positive: {
		backgroundColor: "#ed555c",
		paddingVertical: 15,
		marginTop: 5,
		marginBottom: 10,
	},
	saved_result_negative: {
		backgroundColor: "#3cb371",
		paddingVertical: 15,
		marginTop: 5,
		marginBottom: 10,
	},
	loading: {
		position: "absolute",
		left: 0,
		right: 0,
		top: -200,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
		elevation: 10,
		backgroundColor: "rgba(255,255,255,0.7)",
	},
	saved_risk: {
		fontWeight: "bold",
		textAlign: "center",
		color: "white",
		fontSize: 15,
	},
	submitted_date: {
		textAlign: "center",
		color: "white",
		fontStyle: "italic",
	},
});
