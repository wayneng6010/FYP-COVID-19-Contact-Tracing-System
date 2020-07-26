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
} from "react-native";

export default class ic_extract extends React.Component {
	_isMounted = false;
	
	// set an initial state
	// const [hasPermission, setHasPermission] = useState(null);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// constructor => () => {
	// 	(async () => {
	// 		const { status } = await Permissions.askAsync(Permissions.CAMERA);
	// 		setHasPermission(status === "granted");
	// 	})();

	// 	if (hasPermission === false) {
	// 		alert("No access to camera");
	// 	}
	// }, []);

	constructor() {
		super();
		this.state = {
			ic_uri: null,
			full_name: null,
			ic_number: null,
			home_address: null,
		};

		// const { status } = await Permissions.askAsync(Permissions.CAMERA);
		//     // setHasPermission(status === "granted");
		//     this.setState({ hasPermission: status === "granted" });
		//     if (hasPermission === false) {
		//         alert("No access to camera");
		//     }
	}

	componentDidMount = async () => {
		this._isMounted = true;
		// alert(this.props.navigation.state.params.ic_width + " " + this.props.navigation.state.params.ic_height);
		this.setState({ ic_uri: this.props.navigation.state.params.ic_uri });
		const google_vision_api_key = "google_vision_api_key";
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
		// 	"https://vision.googleapis.com/v1/images:annotate?key=" + google_vision_api_key,
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
		// 	ic_number_y_position = null,
		// 	home_address_x_position = null,
		// 	home_address_y_position = null;
		// responseJson_ocr.responses[0].textAnnotations.forEach(function (item) {
		// 	// console.log(item);
		// 	if (ic_number_x_position === null || home_address_x_position === null) {
		// 		if (item.description === ic_number) {
		// 			ic_number_x_position = item.boundingPoly.vertices[0].x;
		// 			ic_number_y_position = item.boundingPoly.vertices[0].y;
		// 			console.log("ic x: " + ic_number_x_position);
		// 			console.log("ic y: " + ic_number_y_position);
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
		// 			console.log("address x: " + home_address_x_position);
		// 			console.log("address y: " + home_address_y_position);
		// 		}
		// 	}
		// });

		// var full_name_x_position = null,
		// 	full_name_y_position = null;

		// responseJson_ocr.responses[0].textAnnotations.forEach(function (item) {
		// 	if (
		// 		Math.abs(home_address_x_position - item.boundingPoly.vertices[0].x) <
		// 			20 &&
		// 		home_address_y_position > item.boundingPoly.vertices[0].y &&
		// 		item.boundingPoly.vertices[0].y > ic_number_y_position
		// 	) {
		// 		full_name_x_position = item.boundingPoly.vertices[0].x;
		// 		full_name_y_position = item.boundingPoly.vertices[0].y;
		// 		// full_name += item.description;
		// 	}
		// 	if (full_name_y_position != null) {
		// 		if (
		// 			Math.abs(full_name_y_position - item.boundingPoly.vertices[0].y) <
		// 				20 &&
		// 			item.boundingPoly.vertices[0].y > ic_number_y_position &&
		// 			item.boundingPoly.vertices[0].y < home_address_y_position
		// 		) {
		// 			full_name = full_name + " " + item.description;
		// 		}
		// 	}
		// });

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

		// console.log("position: " + position_validation);

		// this.setState({
		// 	ic_number: ic_number,
		// 	full_name: full_name,
		// 	home_address: home_address,
		// });
		// // console.log(JSON.stringify(responseJson_ocr.responses[0].textAnnotations[0].description));
		// here end --------------------------------------------------------------------------------------------------

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
		// // console.log("nor px: " + JSON.stringify(responseJson.responses[0].localizedObjectAnnotations[0].boundingPoly.normalizedVertices[0].x));
		// var normalized_x = responseJson_object.responses[0].localizedObjectAnnotations[0].boundingPoly.normalizedVertices[0].x;
		// // var nor_y= responseJson.responses[0].localizedObjectAnnotations[0].boundingPoly.normalizedVertices[0].y;
		// var actual_x = normalized_x * this.props.navigation.state.params.ic_width;
		// // var act_y = nor_y * this.props.navigation.state.params.ic_height;
		// // console.log("actual px:" + normalized_x + " " + actual_x);
		// if(actual_x > ic_number_x_position){
		// 	console.log("IC position correct");
		// }
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
		// console.log(JSON.stringify(responseJson_label));
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
		// 	"https://vision.googleapis.com/v1/images:annotate?key=" + google_vision_api_key,
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
		// console.log(JSON.stringify(responseJson_color));
		// var color_verify = false;
		// var red = responseJson_color.responses[0].imagePropertiesAnnotation.dominantColors.colors[0].color.red;
		// var green = responseJson_color.responses[0].imagePropertiesAnnotation.dominantColors.colors[0].color.green;
		// var blue = responseJson_color.responses[0].imagePropertiesAnnotation.dominantColors.colors[0].color.blue;
		// console.log("color: " + red + " " + green + " " + blue);
		// end here -----------------------------------------------------------------------------------------------

	};

	componentWillUnmount() {
		this._isMounted = false;
	}

	// const captureIC = () => {};
	render() {
		return (
			<View style={styles.container}>
				<Image
					style={{ width: 400, height: 280 }}
					source={{
						uri: this.state.ic_uri,
					}}
				/>
				<Text>IC number: {this.state.ic_number}</Text>
				<Text>Full name: {this.state.full_name}</Text>
				<Text>Home address: {this.state.home_address}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 20,
	},
});
