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

export default class ic_extract extends React.Component {
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
			google_vision_api_key: "tempapikey",
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

		try {
			let responseJson_ocr = await response_ocr.json();
			var extracted_info = JSON.stringify(
				responseJson_ocr.responses[0].textAnnotations[0].description
			);
			var extracted_info_arr = extracted_info.split("\\n");
			extracted_info_arr[0] = extracted_info_arr[0].toString().replace(/"/g, '');
			// console.log(extracted_info_arr[0]);
			// console.log("asdasddddddddddddddddd");
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
					console.log(extracted_info_arr[i]);
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
						ic_number_y_position = item.boundingPoly.vertices[3].y;
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
					address_position_x_diff < 0.01 &&
					home_address_y_position > item.boundingPoly.vertices[0].y &&
					ic_number_y_position < item.boundingPoly.vertices[0].y
				) {
					full_name_x_position = item.boundingPoly.vertices[0].x;
					full_name_y_position = item.boundingPoly.vertices[0].y;
				}
				if (full_name_y_position != null) {
					fullname_position_y_diff =
						Math.abs(full_name_y_position - item.boundingPoly.vertices[0].y) /
						ic_height;
					if (
						fullname_position_y_diff < 0.01 &&
						item.boundingPoly.vertices[0].y > ic_number_y_position &&
						item.boundingPoly.vertices[0].y < home_address_y_position
					) {
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

		this.setState({
			ic_number: ic_number,
			full_name: full_name,
			home_address: home_address,
		});

		console.log("\n\ntext position IC: " + ic_number_y_position);
		console.log("text position full name: " + full_name_y_position);
		console.log("text position address: " + home_address_y_position);

		console.log("text position: " + position_validation);
		return position_validation;
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
				console.log("face position: " + false);
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
		// responseJson_label.responses[0].labelAnnotations.forEach(function (item) {
		// 	console.log(item);
		// 	if (item != "") {
		// 		if (item.description === "Identity document") {
		// 			label_verify = true;
		// 		}
		// 	}
		// });
		console.log(
			responseJson_label.responses[0].labelAnnotations[0].description
		);

		try {
			if (
				responseJson_label.responses[0].labelAnnotations[0].description ===
				"Identity document"
			) {
				label_verify = true;
			}
		} catch (error) {
			return false;
		}

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
		// console.log("color: " + red + " " + green + " " + blue);
		if (
			Math.abs(red - green) <= 10 ||
			Math.abs(green - blue) <= 10 ||
			Math.abs(red - blue) <= 10
		) {
			if (
				Math.abs(red - green) >= 100 ||
				Math.abs(green - blue) >= 100 ||
				Math.abs(red - blue) >= 100
			) {
				// colored
				color_verify = true;
			} else {
				// greyscale
				color_verify = false;
			}
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
						alert(
							"Your IC is invalid! Please do not capture printed IC, make sure all part of IC is clearly captured"
						);
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
			alert(
				"Your IC is invalid! Please make sure the IC is placed straight and all the text on IC is clear"
			);
			return false;
		}
	};

	save_formData = async () => {
		// const query_save_ic_info = `http://192.168.0.131:5000/save_ic_info?ic_num=${this.state.ic_number}&ic_fname=${this.state.full_name}&ic_address=${this.state.home_address}`;
		// console.log(query_save_ic_info);
		// await axios
		// 	.post(query_save_ic_info)
		// 	.then((response) => {
		// 		console.log("ic session saved");
		// 	})
		// 	.catch((error) => {
		// 		alert(error);
		// 		return false;
		// 	});
		this.setState({
			formDataObj: {
				ic_num: this.state.ic_number,
				ic_fname: this.state.full_name,
				ic_address: this.state.home_address,
			},
		});

		return true;
	};

	confirm_ic_info = async () => {
		if (this.state.ic_verified) {
			// await this.save_session();
			let formDataSaved = await this.save_formData();
			// alert(formDataSaved);
			if (formDataSaved) {
				this.props.navigation.replace("phoneNo_verify", {
					formData: this.state.formDataObj,
				});
			}
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
					this.props.navigation.replace("ic_capture");
				} else {
					alert("Your IC is valid!");
					this.setState({ ic_verified: true });
				}
			})();
		} else {
			this.props.navigation.replace("ic_capture");
		}
		// const google_vision_api_key = "google_vision_api_key";
		// here start --------------------------------------------------------------------------------------------------
		// let body_ocr = JSON.stringify({
		// 	requests: [
		// 		{
		// 			features: [{ type: "TEXT_DETECTION", maxResults: 5 }],
		// 			image: {
		// 				content: this.props.navigation.state.params.ic_base64,
		// 			},
		// 		},
		// 	],
		// });
		// let response_ocr = await fetch(
		// 	"https://vision.googleapis.com/v1/images:annotate?key=" +
		// 		google_vision_api_key,
		// 	{
		// 		headers: {
		// 			Accept: "application/json",
		// 			"Content-Type": "application/json",
		// 		},
		// 		method: "POST",
		// 		body: body_ocr,
		// 	}
		// );
		// let responseJson_ocr = await response_ocr.json();
		// // console.log(JSON.stringify(responseJson_ocr));
		// var extracted_info = JSON.stringify(
		// 	responseJson_ocr.responses[0].textAnnotations[0].description
		// );
		// var extracted_info_arr = extracted_info.split("\\n");
		// var regex_ic_number = /^[0-9]{6}[-]{1}[0-9]{2}[-]{1}[0-9]{4}$/;
		// var states_arr = [
		// 	"KUALA LUMPUR",
		// 	"LABUAN",
		// 	"PUTRAJAYA",
		// 	"JOHOR",
		// 	"KEDAH",
		// 	"KELANTAN",
		// 	"MELAKA",
		// 	"NEGERI SEMBILAN",
		// 	"PAHANG",
		// 	"PERAK",
		// 	"PERLIS",
		// 	"PULAU PINANG",
		// 	"SABAH",
		// 	"SARAWAK",
		// 	"SELANGOR",
		// 	"TERENGGANU",
		// ];
		// var ic_number = null,
		// 	home_address_firstline_position = null,
		// 	home_address_lastline_position = null,
		// 	full_name = "",
		// 	home_address = "";
		// for (var i = 0; i < extracted_info_arr.length; i++) {
		// 	if (ic_number === null || home_address_firstline_position === null) {
		// 		if (regex_ic_number.test(extracted_info_arr[i])) {
		// 			ic_number = extracted_info_arr[i];
		// 			// console.log("ic number: " + ic_number);
		// 		} else if (/\d/.test(extracted_info_arr[i])) {
		// 			home_address_firstline_position = i;
		// 			// full_name = extracted_info_arr[i - 1];
		// 			// console.log("full name: " + full_name);
		// 			// console.log("first line address: " + home_address_firstline_position);
		// 		}
		// 	}
		// 	for (var x = 0; x < states_arr.length; x++) {
		// 		if (extracted_info_arr[i].includes(states_arr[x])) {
		// 			home_address_lastline_position = i;
		// 			// console.log("last line address: " + home_address_lastline_position);
		// 		}
		// 	}
		// 	// console.log(extracted_info_arr[i]);
		// }

		// if (ic_number === null || home_address_firstline_position === null) {
		// 	console.log("Cannot get ic number and home address first line position");
		// }

		// for (
		// 	var i = home_address_firstline_position;
		// 	i <= home_address_lastline_position;
		// 	i++
		// ) {
		// 	if (home_address === "") {
		// 		home_address += extracted_info_arr[i];
		// 	} else {
		// 		home_address = home_address + ", " + extracted_info_arr[i];
		// 	}
		// }

		// // console.log("ic number: " + ic_number);
		// // console.log("full name: " + full_name);
		// // console.log("home address: " + home_address);

		// var ic_number_x_position = null,
		// 	ic_number_x_position_right = null,
		// 	ic_number_y_position = null,
		// 	home_address_x_position = null,
		// 	home_address_y_position = null;
		// responseJson_ocr.responses[0].textAnnotations.forEach(function (item) {
		// 	// console.log(item);
		// 	if (ic_number_x_position === null || home_address_x_position === null) {
		// 		if (item.description === ic_number) {
		// 			ic_number_x_position = item.boundingPoly.vertices[0].x;
		// 			ic_number_x_position_right = item.boundingPoly.vertices[1].x;
		// 			ic_number_y_position = item.boundingPoly.vertices[0].y;
		// 			// console.log("ic x: " + ic_number_x_position);
		// 			// console.log("ic y: " + ic_number_y_position);
		// 		}
		// 		// else if (item.description === full_name.split(" ")[0]) {
		// 		// 	full_name_x_position = item.boundingPoly.vertices[0].x;
		// 		// 	full_name_y_position = item.boundingPoly.vertices[0].y;
		// 		// 	console.log("name x: " + full_name_x_position);
		// 		// 	console.log("name y: " + full_name_y_position);
		// 		// }
		// 		else if (home_address.split(", ")[0].includes(item.description)) {
		// 			home_address_x_position = item.boundingPoly.vertices[0].x;
		// 			home_address_y_position = item.boundingPoly.vertices[0].y;
		// 			// console.log("address x: " + home_address_x_position);
		// 			// console.log("address y: " + home_address_y_position);
		// 		}
		// 	}
		// });

		// var full_name_x_position = null,
		// 	full_name_y_position = null;

		// var ic_width = this.props.navigation.state.params.ic_width,
		// 	ic_height = this.props.navigation.state.params.ic_height;
		// var address_position_x_diff, fullname_position_y_diff;

		// responseJson_ocr.responses[0].textAnnotations.forEach(function (item) {
		// 	address_position_x_diff =
		// 		Math.abs(home_address_x_position - item.boundingPoly.vertices[0].x) /
		// 		ic_width;
		// 	if (
		// 		address_position_x_diff < 0.02 &&
		// 		home_address_y_position > item.boundingPoly.vertices[0].y &&
		// 		ic_number_y_position < item.boundingPoly.vertices[0].y
		// 	) {
		// 		full_name_x_position = item.boundingPoly.vertices[0].x;
		// 		full_name_y_position = item.boundingPoly.vertices[0].y;
		// 		// console.log("x diff: " + address_position_x_diff);
		// 	}
		// 	if (full_name_y_position != null) {
		// 		fullname_position_y_diff =
		// 			Math.abs(full_name_y_position - item.boundingPoly.vertices[0].y) /
		// 			ic_height;
		// 		if (
		// 			fullname_position_y_diff < 0.02 &&
		// 			item.boundingPoly.vertices[0].y > ic_number_y_position &&
		// 			item.boundingPoly.vertices[0].y < home_address_y_position
		// 		) {
		// 			// console.log("y diff: " + fullname_position_y_diff);
		// 			full_name = full_name + " " + item.description;
		// 		}
		// 	}
		// });

		// full_name = full_name.trim();

		// var position_validation = true;

		// if (
		// 	Math.abs(ic_number_x_position - full_name_x_position) > 100 ||
		// 	Math.abs(full_name_x_position - home_address_x_position) > 100 ||
		// 	Math.abs(ic_number_x_position - home_address_x_position) > 100 ||
		// 	ic_number_y_position >= full_name_y_position ||
		// 	full_name_y_position >= home_address_y_position ||
		// 	ic_number_y_position >= home_address_y_position
		// ) {
		// 	position_validation = false;
		// }

		// console.log("text position: " + position_validation);

		// this.setState({
		// 	ic_number: ic_number,
		// 	full_name: full_name,
		// 	home_address: home_address,
		// });
		// // console.log(JSON.stringify(responseJson_ocr.responses[0].textAnnotations[0].description));
		// here end --------------------------------------------------------------------------------------------------

		// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
		// start here -----------------------------------------------------------------------------------------------
		// let body_object = JSON.stringify({
		// 	requests: [
		// 		{
		// 			features: [{ type: "OBJECT_LOCALIZATION", maxResults: 5 }],
		// 			image: {
		// 				content: this.props.navigation.state.params.ic_base64,
		// 			},
		// 		},
		// 	],
		// });
		// let response_object = await fetch(
		// 	"https://vision.googleapis.com/v1/images:annotate?key=" + google_vision_api_key,
		// 	{
		// 		headers: {
		// 			Accept: "application/json",
		// 			"Content-Type": "application/json",
		// 		},
		// 		method: "POST",
		// 		body: body_object,
		// 	}
		// );
		// let responseJson_object = await response_object.json();
		// // console.log(JSON.stringify(responseJson));
		// console.log("nor px: " + JSON.stringify(responseJson_object));
		// var normalized_x = responseJson_object.responses[0].localizedObjectAnnotations[0].boundingPoly.normalizedVertices[0].x;
		// // var nor_y= responseJson.responses[0].localizedObjectAnnotations[0].boundingPoly.normalizedVertices[0].y;
		// // var actual_x = normalized_x * this.props.navigation.state.params.ic_width;
		// console.log("width: " + this.props.navigation.state.params.ic_width + "normalized x: " + normalized_x);
		// //1398
		// // alert("vision: " + this.props.navigation.state.params.ic_width + " " + this.props.navigation.state.params.ic_height);
		// // alert("actual x: " + actual_x);
		// //786
		// // var act_y = nor_y * this.props.navigation.state.params.ic_height;
		// // console.log("actual px:" + normalized_x + " " + actual_x);
		// // console.log("actual x: " + actual_x + " ic_number_x_position_right: " + ic_number_x_position_right);

		// // var face_position = false;
		// // if(actual_x > ic_number_x_position_right){
		// // 	face_position = true;
		// // } else {
		// // 	face_position = false;
		// // }
		// // console.log("face position: " + face_position);
		// end here -----------------------------------------------------------------------------------------------
		// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

		// start here -----------------------------------------------------------------------------------------------
		// let body_face = JSON.stringify({
		// 	requests: [
		// 		{
		// 			features: [{ type: "FACE_DETECTION", maxResults: 5 }],
		// 			image: {
		// 				content: this.props.navigation.state.params.ic_base64,
		// 			},
		// 		},
		// 	],
		// });
		// let response_face = await fetch(
		// 	"https://vision.googleapis.com/v1/images:annotate?key=" +
		// 		google_vision_api_key,
		// 	{
		// 		headers: {
		// 			Accept: "application/json",
		// 			"Content-Type": "application/json",
		// 		},
		// 		method: "POST",
		// 		body: body_face,
		// 	}
		// );
		// let responseJson_face = await response_face.json();
		// // console.log(JSON.stringify(responseJson));
		// // console.log("nor px: " + JSON.stringify(responseJson_face));
		// var number_of_faces =
		// 	responseJson_face.responses[0].faceAnnotations.length - 1;
		// var actual_x =
		// 	responseJson_face.responses[0].faceAnnotations[number_of_faces]
		// 		.boundingPoly.vertices[0].x;
		// // var nor_y= responseJson.responses[0].localizedObjectAnnotations[0].boundingPoly.normalizedVertices[0].y;
		// // var actual_x = normalized_x * this.props.navigation.state.params.ic_width;
		// // console.log("number of faces: " + number_of_faces);
		// // console.log("width: " + this.props.navigation.state.params.ic_width + "normalized x: " + normalized_x);
		// //1398
		// // alert("vision: " + this.props.navigation.state.params.ic_width + " " + this.props.navigation.state.params.ic_height);
		// // alert("actual x: " + actual_x);
		// //786
		// // var act_y = nor_y * this.props.navigation.state.params.ic_height;
		// // console.log("actual px:" + normalized_x + " " + actual_x);
		// // console.log("actual x: " + actual_x + " ic_number_x_position_right: " + ic_number_x_position_right);
		// // console.log("ic x position right: " + ic_number_x_position_right);
		// // console.log("actual_x face:  " + actual_x);
		// var face_position = false;
		// if (actual_x > ic_number_x_position_right) {
		// 	face_position = true;
		// } else {
		// 	face_position = false;
		// }
		// console.log("face position: " + face_position);
		// end here -----------------------------------------------------------------------------------------------

		// start here -----------------------------------------------------------------------------------------------
		// let body_label = JSON.stringify({
		// 	requests: [
		// 		{
		// 			features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
		// 			image: {
		// 				content: this.props.navigation.state.params.ic_base64,
		// 			},
		// 		},
		// 	],
		// });
		// let response_label = await fetch(
		// 	"https://vision.googleapis.com/v1/images:annotate?key=" + google_vision_api_key,
		// 	{
		// 		headers: {
		// 			Accept: "application/json",
		// 			"Content-Type": "application/json",
		// 		},
		// 		method: "POST",
		// 		body: body_label,
		// 	}
		// );
		// let responseJson_label = await response_label.json();
		// // console.log(JSON.stringify(responseJson_label));
		// var label_verify = false;
		// responseJson_label.responses[0].labelAnnotations.forEach(function (item) {
		// 	if(item != ""){
		// 		if (item.description === "Identity document") {
		// 			label_verify = true;
		// 		}
		// 	}
		// });
		// console.log("label verify: " + label_verify);
		// end here -----------------------------------------------------------------------------------------------

		// start here -----------------------------------------------------------------------------------------------
		// let body_color = JSON.stringify({
		// 	requests: [
		// 		{
		// 			features: [{ type: "IMAGE_PROPERTIES", maxResults: 5 }],
		// 			image: {
		// 				content: this.props.navigation.state.params.ic_base64,
		// 			},
		// 		},
		// 	],
		// });
		// let response_color = await fetch(
		// 	"https://vision.googleapis.com/v1/images:annotate?key=" +
		// 		google_vision_api_key,
		// 	{
		// 		headers: {
		// 			Accept: "application/json",
		// 			"Content-Type": "application/json",
		// 		},
		// 		method: "POST",
		// 		body: body_color,
		// 	}
		// );
		// let responseJson_color = await response_color.json();
		// // console.log(JSON.stringify(responseJson_color));
		// var color_verify = false;
		// var red =
		// 	responseJson_color.responses[0].imagePropertiesAnnotation.dominantColors
		// 		.colors[0].color.red;
		// var green =
		// 	responseJson_color.responses[0].imagePropertiesAnnotation.dominantColors
		// 		.colors[0].color.green;
		// var blue =
		// 	responseJson_color.responses[0].imagePropertiesAnnotation.dominantColors
		// 		.colors[0].color.blue;
		// // console.log("color: " + red + " " + green + " " + blue);
		// if (
		// 	Math.abs(red - green) <= 10 ||
		// 	Math.abs(green - blue) <= 10 ||
		// 	Math.abs(red - blue) <= 10
		// ) {
		// 	// greyscale
		// 	color_verify = false;
		// } else {
		// 	// colored
		// 	color_verify = true;
		// }
		// console.log("color verify: " + color_verify);
		// end here -----------------------------------------------------------------------------------------------
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
					{/* <View style={styles.flexRow}>
						<View style={styles.flexCol}>
							<Text style={styles.label}>IC number</Text>
						</View>
						<View style={styles.flexCol}>
							<Text style={styles.input}>991004-07-5721{this.state.ic_number}</Text>
						</View>
					</View>

					<View style={styles.flexRow}>
						<View style={styles.flexCol}>
							<Text style={styles.label}>Full name</Text>
						</View>
						<View style={styles.flexCol}>
							<Text style={styles.input}>Sinar buer aasdaasdasda{this.state.full_name}</Text>
						</View>
					</View>
					
					<View style={styles.flexRow}>
						<View style={styles.flexCol}>
							<Text style={styles.label}>Home address</Text>
						</View>
						<View style={styles.flexCol}>
							<Text style={styles.input}>Sinar buer adasd, asdasd,dasda{this.state.home_address}</Text>
						</View>
					</View> */}
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
						onPress={() => this.props.navigation.replace("ic_capture")}
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
