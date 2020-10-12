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
	Image,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

export default class ic_extract_dependent extends React.Component {
	_isMounted = false;

	constructor() {
		super();
		this.state = {
			ic_uri: null, // store uri of ic captured
			full_name: null,
			ic_number: null,
			home_address: null,
			ic_width: null,
			ic_height: null,
			google_vision_api_key: "api_key",
			ic_number_x_position_right: null,
			ic_verified: false,
			ic_verify_progress: "0%",
			formDataObj: {
				ic_num: null,
				ic_fname: null,
				ic_address: null,
			},
		};
	}

	ocr_validation = async () => {
		// here start --------------------------------------------------------------------------------------------------
		let body_ocr = JSON.stringify({
			requests: [
				{
					features: [{ type: "TEXT_DETECTION", maxResults: 5 }],
					image: {
						content: this.props.navigation.state.params.ic_base64,
					},
				},
			],
		});
		let response_ocr = await fetch(
			"https://vision.googleapis.com/v1/images:annotate?key=" +
				this.state.google_vision_api_key,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				method: "POST",
				body: body_ocr,
			}
		);

		let responseJson_ocr = await response_ocr.json();
		var extracted_info = JSON.stringify(
			responseJson_ocr.responses[0].textAnnotations[0].description
		);

		try {
			var extracted_info_arr = extracted_info.split("\\n");
			var regex_ic_number = /^[0-9]{6}[-]{1}[0-9]{2}[-]{1}[0-9]{4}$/;
			var states_arr = [
				"KUALA LUMPUR",
				"LABUAN",
				"PUTRAJAYA",
				"JOHOR",
				"KEDAH",
				"KELANTAN",
				"MELAKA",
				"NEGERI SEMBILAN",
				"PAHANG",
				"PERAK",
				"PERLIS",
				"PULAU PINANG",
				"SABAH",
				"SARAWAK",
				"SELANGOR",
				"TERENGGANU",
			];
			var ic_number = null,
				home_address_firstline_position = null,
				home_address_lastline_position = null,
				full_name = "",
				home_address = "";
			for (var i = 0; i < extracted_info_arr.length; i++) {
				if (ic_number === null || home_address_firstline_position === null) {
					if (regex_ic_number.test(extracted_info_arr[i])) {
						ic_number = extracted_info_arr[i];
					} else if (/\d/.test(extracted_info_arr[i])) {
						home_address_firstline_position = i;
					}
				}
				for (var x = 0; x < states_arr.length; x++) {
					if (extracted_info_arr[i].includes(states_arr[x])) {
						home_address_lastline_position = i;
					}
				}
			}

			// if (ic_number === null || home_address_firstline_position === null) {
			// 	console.log(
			// 		"Cannot get ic number and home address first line position"
			// 	);
			// }

			for (
				var i = home_address_firstline_position;
				i <= home_address_lastline_position;
				i++
			) {
				if (home_address === "") {
					home_address += extracted_info_arr[i];
				} else {
					home_address = home_address + ", " + extracted_info_arr[i];
				}
			}

			var ic_number_x_position = null,
				ic_number_x_position_right = null,
				ic_number_y_position = null,
				home_address_x_position = null,
				home_address_y_position = null;
			responseJson_ocr.responses[0].textAnnotations.forEach(function (item) {
				if (ic_number_x_position === null || home_address_x_position === null) {
					if (item.description === ic_number) {
						ic_number_x_position = item.boundingPoly.vertices[0].x;
						ic_number_x_position_right = item.boundingPoly.vertices[1].x;
						ic_number_y_position = item.boundingPoly.vertices[0].y;
					} else if (home_address.split(", ")[0].includes(item.description)) {
						home_address_x_position = item.boundingPoly.vertices[0].x;
						home_address_y_position = item.boundingPoly.vertices[0].y;
					}
				}
			});

			this.setState({
				ic_number_x_position_right: ic_number_x_position_right,
			});

			var full_name_x_position = null,
				full_name_y_position = null;

			var ic_width = this.props.navigation.state.params.ic_width,
				ic_height = this.props.navigation.state.params.ic_height;
			var address_position_x_diff, fullname_position_y_diff;

			responseJson_ocr.responses[0].textAnnotations.forEach(function (item) {
				address_position_x_diff =
					Math.abs(home_address_x_position - item.boundingPoly.vertices[0].x) /
					ic_width;
				if (
					address_position_x_diff < 0.02 &&
					home_address_y_position > item.boundingPoly.vertices[0].y &&
					ic_number_y_position < item.boundingPoly.vertices[0].y
				) {
					full_name_x_position = item.boundingPoly.vertices[0].x;
					full_name_y_position = item.boundingPoly.vertices[0].y;
					// console.log("x diff: " + address_position_x_diff);
				}
				if (full_name_y_position != null) {
					fullname_position_y_diff =
						Math.abs(full_name_y_position - item.boundingPoly.vertices[0].y) /
						ic_height;
					if (
						fullname_position_y_diff < 0.02 &&
						item.boundingPoly.vertices[0].y > ic_number_y_position &&
						item.boundingPoly.vertices[0].y < home_address_y_position
					) {
						// console.log("y diff: " + fullname_position_y_diff);
						full_name = full_name + " " + item.description;
					}
				}
			});

			full_name = full_name.trim();

			var position_validation = true;
			var position_x_diff_1 =
				Math.abs(ic_number_x_position - full_name_x_position) / ic_width;
			var position_x_diff_2 =
				Math.abs(full_name_x_position - home_address_x_position) / ic_width;
			var position_x_diff_3 =
				Math.abs(ic_number_x_position - home_address_x_position) / ic_width;
			if (
				position_x_diff_1 > 0.02 ||
				position_x_diff_2 > 0.02 ||
				position_x_diff_3 > 0.02 ||
				ic_number_y_position >= full_name_y_position ||
				full_name_y_position >= home_address_y_position ||
				ic_number_y_position >= home_address_y_position
			) {
				position_validation = false;
			}
		} catch (error) {
			console.log(error);
			return false;
		}

		// console.log(position_x_diff_1 + " " + position_x_diff_2 + " " + position_x_diff_3);
		// console.log("text position: " + position_validation);

		this.setState({
			ic_number: ic_number,
			full_name: full_name,
			home_address: home_address,
		});

		console.log("text position: " + position_validation);
		return position_validation;
		// console.log(JSON.stringify(responseJson_ocr.responses[0].textAnnotations[0].description));
		// here end --------------------------------------------------------------------------------------------------
	};

	face_validation = async () => {
		// start here -----------------------------------------------------------------------------------------------
		let body_face = JSON.stringify({
			requests: [
				{
					features: [{ type: "FACE_DETECTION", maxResults: 5 }],
					image: {
						content: this.props.navigation.state.params.ic_base64,
					},
				},
			],
		});
		let response_face = await fetch(
			"https://vision.googleapis.com/v1/images:annotate?key=" +
				this.state.google_vision_api_key,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				method: "POST",
				body: body_face,
			}
		);
		let responseJson_face = await response_face.json();
		// console.log("nor px: " + JSON.stringify(responseJson_face));

		try {
			// if there is face result returned by API
			if ("faceAnnotations" in responseJson_face.responses[0]) {
				var number_of_faces =
					responseJson_face.responses[0].faceAnnotations.length;

				var last_face_index = number_of_faces - 1;

				var actual_x =
					responseJson_face.responses[0].faceAnnotations[last_face_index]
						.boundingPoly.vertices[0].x;

				var face_position = false;
				if (actual_x > this.state.ic_number_x_position_right) {
					face_position = true;
				} else {
					face_position = false;
				}
			} else {
				return false;
			}
		} catch (error) {
			return false;
		}

		console.log("face position: " + face_position);
		return face_position;
		// end here -----------------------------------------------------------------------------------------------
	};

	label_validation = async () => {
		// start here -----------------------------------------------------------------------------------------------
		let body_label = JSON.stringify({
			requests: [
				{
					features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
					image: {
						content: this.props.navigation.state.params.ic_base64,
					},
				},
			],
		});
		let response_label = await fetch(
			"https://vision.googleapis.com/v1/images:annotate?key=" +
				this.state.google_vision_api_key,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				method: "POST",
				body: body_label,
			}
		);
		let responseJson_label = await response_label.json();
		// console.log(JSON.stringify(responseJson_label));
		var label_verify = false;
		responseJson_label.responses[0].labelAnnotations.forEach(function (item) {
			if (item != "") {
				if (item.description === "Identity document") {
					label_verify = true;
				}
			}
		});

		console.log("label verify: " + label_verify);
		return label_verify;
		// end here -----------------------------------------------------------------------------------------------
	};

	color_validation = async () => {
		// start here -----------------------------------------------------------------------------------------------
		let body_color = JSON.stringify({
			requests: [
				{
					features: [{ type: "IMAGE_PROPERTIES", maxResults: 5 }],
					image: {
						content: this.props.navigation.state.params.ic_base64,
					},
				},
			],
		});
		let response_color = await fetch(
			"https://vision.googleapis.com/v1/images:annotate?key=" +
				this.state.google_vision_api_key,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				method: "POST",
				body: body_color,
			}
		);
		let responseJson_color = await response_color.json();
		// console.log(JSON.stringify(responseJson_color));
		var color_verify = false;
		var red =
			responseJson_color.responses[0].imagePropertiesAnnotation.dominantColors
				.colors[0].color.red;
		var green =
			responseJson_color.responses[0].imagePropertiesAnnotation.dominantColors
				.colors[0].color.green;
		var blue =
			responseJson_color.responses[0].imagePropertiesAnnotation.dominantColors
				.colors[0].color.blue;
		console.log("color: " + red + " " + green + " " + blue);
		if (
			Math.abs(red - green) <= 10 ||
			Math.abs(green - blue) <= 10 ||
			Math.abs(red - blue) <= 10
		) {
			// greyscale
			color_verify = false;
		} else {
			// colored
			color_verify = true;
		}

		console.log("color verify: " + color_verify);
		return color_verify;
		// end here -----------------------------------------------------------------------------------------------
	};

	process_ic = async () => {
		var ocr_result = await this.ocr_validation();
		// console.log("text position: " + ocr_result);
		if (ocr_result) {
			this.setState({ ic_verify_progress: "25%" });
			var face_result = await this.face_validation();
			if (face_result) {
				this.setState({ ic_verify_progress: "50%" });
				var color_result = await this.color_validation();
				if (color_result) {
					this.setState({ ic_verify_progress: "75%" });
					var label_result = await this.label_validation();
					if (label_result) {
						this.setState({ ic_verify_progress: "100%" });
						return true;
					} else {
						alert("Your IC is invalid! Please capture your original IC");
						return false;
					}
				} else {
					alert("Your IC is invalid! Please do not capture photostated IC");
					return false;
				}
			} else {
				alert("Your IC is invalid! Please capture your original IC");
				return false;
			}
		} else {
			alert("Your IC is invalid! Please capture your original IC");
			return false;
		}
	};

	save_formData = async () => {
		const { ic_number, full_name, home_address } = this.state;

		await fetch("http://192.168.0.131:5000/save_new_dependent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ic_number: ic_number,
				full_name: full_name,
				relationship: "Grandparent",
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData == "success") {
					return true;
				} else if (jsonData == "failed") {
					return false;
				} else {
					return false;
				}
				// console.log(this.state.qrcode_value);
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	confirm_ic_info = async () => {
		if (this.state.ic_verified) {
			// await this.save_session();
			const { ic_number, full_name, home_address } = this.state;

			await fetch("http://192.168.0.131:5000/save_new_dependent", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					ic_number: ic_number,
					full_name: full_name,
					relationship: this.props.navigation.state.params.dependent_relationship,
				}),
			})
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.text();
				})
				.then((jsonData) => {
					// alert(JSON.stringify(jsonData));
					if (jsonData == "success") {
						alert("New dependent has been saved");
						this.props.navigation.replace("manage_dependent");
					} else if (jsonData == "failed") {
						alert("Error occurred while saving new dependent");
					} else {
						alert("Error occurred while saving new dependent");
					}
					// console.log(this.state.qrcode_value);
				})
				.catch((error) => {
					alert("Error: " + error);
				});
			// let formDataSaved = await this.save_formData();
			// // alert(formDataSaved);
			// if (formDataSaved) {
			// 	alert("New dependent has been saved");
			// 	this.props.navigation.replace("manage_dependent");
			// } else {
			// 	alert("Error occurred while saving new dependent");
			// }
		}
	};

	componentDidMount = async () => {
		this._isMounted = true;

		// calculate ic image width and height
		const screenWidth = Dimensions.get("window").width;
		const scaleFactor =
			this.props.navigation.state.params.ic_width / screenWidth;
		const imageHeight =
			this.props.navigation.state.params.ic_height / scaleFactor;
		this.setState({
			ic_width: screenWidth,
			ic_height: imageHeight,
			ic_uri: this.props.navigation.state.params.ic_uri,
		});

		// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<VISION<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
		// alert(this.props.navigation.state.params.ic_width + " " + this.props.navigation.state.params.ic_height);
		// this.setState({  });
		var ic_validation_result = await this.process_ic();
		if (ic_validation_result) {
			let icNumExisted;
			(async () => {
				// used to check if there is same phone number saved in database
				icNumExisted = await fetch(
					"http://192.168.0.131:5000/getExistingIcNum",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							ic_num: this.state.ic_number,
						}),
					}
				)
					.then((res) => {
						// console.log(JSON.stringify(res.headers));
						return res.json();
					})
					.then((jsonData) => {
						// console.log(jsonData);
						if (jsonData) {
							return true;
						} else {
							return false;
						}
					})
					.catch((error) => {
						alert(error);
					});

				if (icNumExisted) {
					alert("This IC number has been registered before");
					this.props.navigation.replace("ic_capture_dependent");
				} else {
					alert("Your IC is valid!");
					this.setState({ ic_verified: true });
				}
			})();
		} else {
			this.props.navigation.replace("ic_capture_dependent");
		}
	};

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<Text style={[styles.content, styles.title]}>Preview IC</Text>
				<Image
					style={{
						width: this.state.ic_width,
						height: this.state.ic_height,
						// resizeMode: "contain",
						// marginHorizontal: 20,
					}}
					source={{
						uri: this.state.ic_uri,
					}}
				/>

				<View style={styles.content}>
					<Text style={styles.label}>IC number</Text>
					<Text style={styles.input}>
						{this.state.ic_verified ? this.state.ic_number : ""}
					</Text>
					<Text style={styles.label}>Full name</Text>
					<Text style={styles.input}>
						{this.state.ic_verified ? this.state.full_name : ""}
					</Text>
					<Text style={styles.label}>Home address</Text>
					<Text style={styles.input}>
						{this.state.ic_verified ? this.state.home_address : ""}
					</Text>

					<Text></Text>
					<Button
						title="Retake Image"
						disabled={this.state.ic_verified ? false : true}
						onPress={() =>
							this.props.navigation.replace("ic_capture_dependent")
						}
					></Button>

					<Text></Text>
					<Button
						title="Confirm"
						disabled={this.state.ic_verified ? false : true}
						// onPress={() => this.props.navigation.replace("phoneNo_verify")}
						onPress={() => this.confirm_ic_info()}
					></Button>

					{this.state.ic_verified ? (
						<View />
					) : (
						<View style={styles.loading}>
							<Text style={styles.verify_percent}>
								Verifying ... {this.state.ic_verify_progress}
							</Text>
							<ActivityIndicator size="large" />
						</View>
					)}
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		// alignItems: "center",
		// marginHorizontal: 20,
	},
	content: {
		marginVertical: 20,
		marginHorizontal: 20,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
	},
	flexRow: {
		flex: 0.2,
		flexDirection: "row",
	},
	flexCol: {
		width: 170,
		height: 40,
	},
	label: {
		fontSize: 18,
		padding: 10,
	},
	input: {
		fontSize: 18,
		color: "white",
		backgroundColor: "grey",
		paddingVertical: 10,
		paddingHorizontal: 10,
		flex: 1,
		flexWrap: "wrap",
		borderRadius: 5,
	},
	loading: {
		position: "absolute",
		left: 70,
		right: 0,
		top: -100,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
		width: 200,
		height: 100,
		borderColor: "#c0cbd3",
		borderWidth: 1,
	},
	verify_percent: {
		marginBottom: 10,
		fontSize: 16,
		fontWeight: "bold",
	},
});
