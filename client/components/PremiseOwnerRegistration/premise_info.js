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
	Picker,
	TouchableHighlight,
} from "react-native";

export default class premise_info extends React.Component {
	constructor() {
		super();
		this.state = {
			premise_name: "",
			premise_address: "",
			premise_postcode: "",
			premise_state: "",
			owner_fname: "",
			formDataObj: {
				phone_no_sent: null,
				email_sent: null,
			},
		};
		// alert(this.state.formDataObj.phone_no_sent);
	}

	componentDidMount = () => {};

	save_formData = async () => {
		const phone_no_sent = this.props.navigation.state.params.formData
				.phone_no_sent,
			email_sent = this.props.navigation.state.params.formData.email_sent;
		this.setState({
			formDataObj: {
				phone_no_sent: phone_no_sent,
				email_sent: email_sent,
				owner_fname: this.state.owner_fname,
				premise_name: this.state.premise_name,
				premise_address: this.state.premise_address,
				premise_postcode: this.state.premise_postcode,
				premise_state: this.state.premise_state,
			},
		});
		return true;
	};

	onSubmit = async () => {
		const owner_fname = this.state.owner_fname.trim(),
			premise_name = this.state.premise_name.trim(),
			premise_address = this.state.premise_address.trim(),
			premise_postcode = this.state.premise_postcode.trim(),
			premise_state = this.state.premise_state.trim();
		if (owner_fname == null || owner_fname == "") {
			alert("Please enter your full name");
			return;
		} else if (/\d/.test(owner_fname)) {
			alert("Full name should not contain number");
			return;
		} else if (premise_name == null || premise_name == "") {
			alert("Please enter premise name");
			return;
		} else if (premise_address == null || premise_address == "") {
			alert("Please enter premise address");
			return;
		} else if (premise_postcode == null || premise_postcode == "") {
			alert("Please enter premise postcode");
			return;
		} else if (/\D/.test(premise_postcode)) {
			// if contains non-digit character
			alert("Please enter number only for postcode");
			return;
		} else if (premise_postcode.length !== 5) {
			alert("Premise postcode should be in 5 digits");
			return;
		} else if (
			premise_state == null ||
			premise_state == "" ||
			premise_state == "empty"
		) {
			alert("Please select premise state");
			return;
		}

		let formDataSaved = await this.save_formData();
		ToastAndroid.show("Premise profile info is saved", ToastAndroid.SHORT);
		if (formDataSaved) {
			// alert(JSON.stringify(this.state.formDataObj));
			this.props.navigation.replace("map_findPremiseLocation_po", {
				formData: this.state.formDataObj,
			});
		}
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={[styles.subtitle, styles.subtitle_bg]}>
					Step 3/5: Premise Profile
				</Text>
				<Text style={styles.subtitle}>Your Full Name</Text>
				<TextInput
					name="owner_fname"
					keyboardType="default"
					placeholder="e.g. Ng Yuan Shen"
					maxLength={40}
					autoCapitalize="words"
					onChangeText={(value) => this.setState({ owner_fname: value })}
					value={this.state.owner_fname}
					style={styles.input}
				/>

				<Text />
				<Text style={styles.subtitle}>Premise Name</Text>
				<TextInput
					name="premise_name"
					keyboardType="default"
					placeholder="e.g. Wayne Enterprise"
					maxLength={40}
					autoCapitalize="words"
					onChangeText={(value) => this.setState({ premise_name: value })}
					value={this.state.premise_name}
					style={styles.input}
				/>

				<Text />
				<Text style={styles.subtitle}>Premise Address</Text>
				<TextInput
					name="premise_address"
					keyboardType="default"
					placeholder="e.g. 26, Lebuh Ampang"
					maxLength={80}
					autoCapitalize="words"
					onChangeText={(value) => this.setState({ premise_address: value })}
					value={this.state.premise_address}
					style={styles.input}
				/>

				<Text />
				<Text style={styles.subtitle}>Premise Postcode</Text>
				<TextInput
					name="premise_postcode"
					keyboardType="numeric"
					placeholder="e.g. 11700"
					maxLength={5}
					onChangeText={(value) =>
						this.setState({ premise_postcode: value.trim() })
					}
					value={this.state.premise_postcode}
					style={styles.input}
				/>

				<Text />
				<Text style={styles.subtitle}>Premise State</Text>
				<View style={{ borderColor: "#c0cbd3", borderWidth: 2 }}>
					<Picker
						selectedValue={this.state.premise_state}
						style={{
							height: 35,
							width: 300,
						}}
						onValueChange={(itemValue, itemIndex) =>
							this.setState({ premise_state: itemValue })
						}
					>
						<Picker.Item label="- Select Premise State -" value="empty" />
						<Picker.Item label="Kuala Lumpur" value="Kuala Lumpur" />
						<Picker.Item label="Labuan" value="Labuan" />
						<Picker.Item label="Putrajaya" value="Putrajaya" />
						<Picker.Item label="Johor" value="Johor" />
						<Picker.Item label="Kedah" value="Kedah" />
						<Picker.Item label="Kelantan" value="Kelantan" />
						<Picker.Item label="Melaka" value="Melaka" />
						<Picker.Item label="Negeri Sembilan" value="Negeri Sembilan" />
						<Picker.Item label="Pahang" value="Pahang" />
						<Picker.Item label="Perak" value="Perak" />
						<Picker.Item label="Perlis" value="Perlis" />
						<Picker.Item label="Pulau Pinang" value="Pulau Pinang" />
						<Picker.Item label="Sabah" value="Sabah" />
						<Picker.Item label="Sarawak" value="Sarawak" />
						<Picker.Item label="Selangor" value="Selangor" />
						<Picker.Item label="Terengganu" value="Terengganu" />
					</Picker>
				</View>

				<Text />
				{/* <Button title="Submit" onPress={() => this.onSubmit()}></Button> */}
				<TouchableHighlight
					style={{
						...styles.openButton,
						backgroundColor: "#3cb371",
					}}
					onPress={() => this.onSubmit()}
				>
					<Text style={styles.textStyle}>Proceed</Text>
				</TouchableHighlight>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		paddingVertical: 10,
		width: 200,
		elevation: 2,
		marginTop: 10,
	},
	openButton_active: {
		backgroundColor: "#1e90ff",
		borderRadius: 5,
		paddingVertical: 10,
		width: 200,
		elevation: 2,
	},
	openButton_disabled: {
		backgroundColor: "lightgrey",
		borderRadius: 5,
		paddingVertical: 10,
		width: 200,
		elevation: 2,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	container: {
		flex: 1,
		backgroundColor: "white",
		alignItems: "center",
		// justifyContent: "center",
		marginHorizontal: 20,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		marginVertical: 20,
		fontWeight: "bold",
	},
	subtitle: {
		fontSize: 16,
		textAlign: "center",
		marginVertical: 10,
	},
	subtitle_bg: {
		marginVertical: 20,
		backgroundColor: "lightgrey",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
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
});
