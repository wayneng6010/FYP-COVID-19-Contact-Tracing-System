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
	TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { FontAwesome } from "@expo/vector-icons";

export default class ic_capture extends React.Component {
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
		// this.state = {
		// 	hasPermission: null,
		// };
		// const { status } = await Permissions.askAsync(Permissions.CAMERA);
		//     // setHasPermission(status === "granted");
		//     this.setState({ hasPermission: status === "granted" });
		//     if (hasPermission === false) {
		//         alert("No access to camera");
		//     }
	}

	componentDidMount = async () => {
		// alert(this.props.navigation.state.params.name);
		this.state = {
			hasPermission: null,
		};
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		// setHasPermission(status === "granted");
		this.setState({ hasPermission: status === "granted" });
		if (this.state.hasPermission === false) {
			alert("No access to camera");
		}
	};

	takePicture = async () => {
		if (this.camera) {
			const options = {
				quality: 0.1,
                uri: true,
                base64: true,
                skipProcessing: true,
            };
            let photo = await this.camera.takePictureAsync(options);
			// alert(JSON.stringify(photo));
			// console.log(photo.uri);
			this.props.navigation.navigate("ic_extract", {ic_uri: photo.uri, ic_base64: photo.base64});
		}
	};

	// const captureIC = () => {};
	render() {
		return (
			<View style={{ flex: 1 }}>
				<Camera
					style={{ flex: 1 }}
					type={Camera.Constants.Type.back}
					ratio={"16:9"}
					ref={(ref) => {
						this.camera = ref;
					}}
				>
					<View
						style={{
							flex: 1,
							backgroundColor: "transparent",
							flexDirection: "row",
						}}
					></View>
				</Camera>
				{/* upper shade */}
				<View
					style={{
						position: "absolute",
						width: "100%",
						height: "30%",
						top: 0,
						flex: 1,
						backgroundColor: "rgba(0,0,0,.5)",
					}}
				></View>
				{/* lower shade */}
				<View
					style={{
						position: "absolute",
						width: "100%",
						height: "30%",
						bottom: 0,
						flex: 1,
						paddingTop: 20,
						backgroundColor: "blue",
						backgroundColor: "rgba(0,0,0,.5)",
					}}
				></View>
				{/* capture button */}
				<View
					style={{
						position: "absolute",
						width: "100%",
						bottom: 0,
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
						paddingBottom: 20,
					}}
				>
					<TouchableOpacity
						style={{
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "transparent",
						}}
						onPress={() => this.takePicture()}
					>
						<FontAwesome
							name="camera"
							style={{ color: "#fff", fontSize: 70 }}
						/>
					</TouchableOpacity>
				</View>
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
