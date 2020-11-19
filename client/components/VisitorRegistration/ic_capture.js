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
	ToastAndroid,
	BackHandler,
	Alert,
	ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { FontAwesome } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";

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
		// 	capture_loading: false,
		// };
		// const { status } = await Permissions.askAsync(Permissions.CAMERA);
		//     // setHasPermission(status === "granted");
		//     this.setState({ hasPermission: status === "granted" });
		//     if (hasPermission === false) {
		//         alert("No access to camera");
		//     }
	}

	backAction = () => {
		Alert.alert("Hold on!", "Are you sure you want to exit registration?", [
			{
				text: "Cancel",
				onPress: () => null,
				style: "cancel",
			},
			{ text: "YES", onPress: () => this.props.navigation.goBack(null) },
		]);
		return true;
	};

	componentDidMount = async () => {
		// alert(this.props.navigation.state.params.name);
		this.state = {
			hasPermission: null,
		};
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		// setHasPermission(status === "granted");
		this.setState({ hasPermission: status === "granted" });
		if (this.state.hasPermission === null) {
			ToastAndroid.show("Requesting for camera permission", ToastAndroid.SHORT);
		}
		if (this.state.hasPermission === false) {
			alert("No access to camera");
		}

		this.backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			this.backAction
		);
	};

	componentWillUnmount() {
		this.backHandler.remove();
	}

	takePicture = async () => {
		if (this.camera) {
			// this.setState({ capture_loading: true });

			const options = {
				quality: 0.1,
				uri: true,
				width: true,
				height: true,
				base64: true,
				skipProcessing: true,
			};
			let photo = await this.camera.takePictureAsync(options);
			// alert(JSON.stringify(photo));
			// console.log(photo.uri);

			var crop_originy = photo.width * 0.35;
			var crop_height = photo.width * 0.3;
			var crop_originx = photo.height * 0.1;
			var crop_width = photo.height * 0.8;

			// image manipulator
			// const image = Asset.fromModule(require(this.props.navigation.state.params.ic_uri));
			// await image.downloadAsync();

			const manipResult = await ImageManipulator.manipulateAsync(
				photo.uri,
				[
					{
						crop: {
							originX: crop_originx,
							originY: crop_originy,
							width: crop_width,
							height: crop_height,
						},
					},
				],
				{ compress: 0.1, format: "jpeg", base64: true }
			);

			// console.log(manipResult);
			// setImage(manipResult);
			// console.log("width: " + manipResult.width);
			// console.log("height: " + manipResult.height);
			// this.setState({ capture_loading: false });

			this.props.navigation.replace("ic_extract", {
				ic_uri: manipResult.uri,
				ic_base64: manipResult.base64,
				ic_width: manipResult.width,
				ic_height: manipResult.height,
			});
		}
	};

	// const captureIC = () => {};
	render() {
		return (
			<View style={{ flex: 1 }}>
				{/* {this.state.capture_loading ? <ActivityIndicator /> : <View />} */}
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
						height: "35%",
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
						height: "35%",
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
