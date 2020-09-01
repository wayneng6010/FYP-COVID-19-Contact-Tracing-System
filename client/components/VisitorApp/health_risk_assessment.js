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
		};
		// alert(this.state.formDataObj.phone_no_sent);
	}

	componentDidMount = () => {};

	save_formData = async () => {
		this.setState({
			premise_name: this.state.premise_name,
		});
		return true;
	};

	onSubmit = async () => {
		if (
			this.state.q1_response == null ||
			this.state.q2_response == null ||
			this.state.q3_response == null ||
			this.state.q4_response == null ||
			this.state.q5_response == null
		) {
			alert("Please answer all the questions");
			return;
		} else {
			alert("Submitted");
		}
	};

	render() {
		var radio_props = [
			{ label: "Yes", value: 1 },
			{ label: "No", value: 0 },
		];
		return (
			<ScrollView style={styles.container}>
				<View style={styles.flex_center}>
					<Text style={[styles.subtitle, styles.subtitle_bg]}>
						Health Risk Assessment
					</Text>
				</View>

				<Text style={styles.subtitle}>
					1. Have you traveled to (or living in) any of the COVID-19 affected
					areas/countries in the last 14 days?
				</Text>
				<RadioForm
					style={styles.radio_form}
					radio_props={radio_props}
					initial={-1}
					buttonSize={15}
					buttonOuterSize={25}
					animation={false}
					buttonColor={"#87ceeb"}
					onPress={(value) => {
						this.setState({ q1_response: value });
					}}
				/>
				<Text />

				<Text style={styles.subtitle}>
					2. Have you had any close contact with a person who is known to have
					COVID-19 during the last 14 days?
				</Text>
				<RadioForm
					style={styles.radio_form}
					radio_props={radio_props}
					initial={-1}
					buttonSize={15}
					buttonOuterSize={25}
					animation={false}
					buttonColor={"#87ceeb"}
					onPress={(value) => {
						this.setState({ q2_response: value });
					}}
				/>
				<Text />

				<Text style={styles.subtitle}>3. Do you have a fever?</Text>
				<RadioForm
					style={styles.radio_form}
					radio_props={radio_props}
					initial={-1}
					buttonSize={15}
					buttonOuterSize={25}
					animation={false}
					buttonColor={"#87ceeb"}
					onPress={(value) => {
						this.setState({ q3_response: value });
					}}
				/>
				<Text />

				<Text style={styles.subtitle}>4. Do you have a cough?</Text>
				<RadioForm
					style={styles.radio_form}
					radio_props={radio_props}
					initial={-1}
					buttonSize={15}
					buttonOuterSize={25}
					animation={false}
					buttonColor={"#87ceeb"}
					onPress={(value) => {
						this.setState({ q4_response: value });
					}}
				/>
				<Text />

				<Text style={styles.subtitle}>
					5. Do you have a shortness of breath?
				</Text>
				<RadioForm
					style={styles.radio_form}
					radio_props={radio_props}
					initial={-1}
					buttonSize={15}
					buttonOuterSize={25}
					animation={false}
					buttonColor={"#87ceeb"}
					onPress={(value) => {
						this.setState({ q5_response: value });
					}}
				/>
				<Text />

				<View style={styles.flex_center}>
					{/* <Button title="Submit" onPress={() => this.onSubmit()}></Button> */}
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
						<Text style={styles.textStyle}>Submit</Text>
					</TouchableHighlight>
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
		marginHorizontal: 20,
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
		paddingHorizontal: 20,
		paddingVertical: 10,
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
});
