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
	ToastAndroid,
} from "react-native";

import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

export default class qrcode_create extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	constructor(props) {
		super(props);
		this.state = {
			busy: null,
			imageSaved: null,
			qrData: "",
			premiseName: "Hulala Sdn. Bhd.",
		};
	}

	saveQrCode = async () => {
		// this.svg.toDataURL((data) => {
		// 	RNFS.writeFile(
		// 		RNFS.CachesDirectoryPath + "/qr-code.png",
		// 		data,
		// 		"base64"
		// 	)
		// 		.then((success) => {
		// 			return CameraRoll.saveToCameraRoll(
		// 				RNFS.CachesDirectoryPath + "/qr-code.png",
		// 				"photo"
		// 			);
		// 		})
		// 		.then(() => {
		// 			this.setState({ busy: false, imageSaved: true });
		// 			ToastAndroid.show("Saved to gallery !!", ToastAndroid.SHORT);
		// 		});
		// });
	};

	saveFile = async (fileUri) => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (status === "granted") {
			const asset = await MediaLibrary.createAssetAsync(fileUri);
			alert("QR code has been saved in your device");
			Sharing.shareAsync(fileUri);
			// await MediaLibrary.saveToLibraryAsync(fileUri);
			// await MediaLibrary.createAlbumAsync("Download", asset, false);
			// alert(JSON.stringify(asset));
		}
	};

	getDataURL = () => {
		this.svg.toDataURL(this.callback);
	};

	callback = async (dataURL) => {
		this.setState({ qrData: dataURL });

		try {
			let filePath = await Print.printToFileAsync({
				html:
					'<div style = "margin-top: 10%;"><p style = "font-size: 24; font-weight: bold; text-align: center; font-size: 45px;">COVID-19 Contact Tracing System</p>' +
					'<p style = "font-size: 28; font-weight: bold; text-align: center; font-size: 45px;">Check in to ' + this.state.premiseName + '</p>' +
					'<p style="text-align: center; margin-top: -30px;"><img src="data:image;base64,' +
					dataURL +
					'"' +
					'alt="QR code" style="margin-top: 50px; width: 500px; height: 500px;" /></p>' +
					'<p style="font-size: 28; font-weight: bold; text-align: center; margin-top: 50px;">Scan the QR Code using COVID-19 Contact Tracing App</p>' +
					"</div>",
				width: 600,
				height: 800,
			});

			const pdfName = `${filePath.uri.slice(
				0,
				filePath.uri.lastIndexOf("/") + 1
			)}CheckIn-QRCode.pdf`;

			await FileSystem.moveAsync({
				from: filePath.uri,
				to: pdfName,
			});

			// FileSystem.writeAsStringAsync(pdfName, self.state.base64Code, {
			// 	encoding: FileSystem.EncodingType.Base64,
			// }).then(() => {
			// 	this.setState({ loading: false });
			// 	Sharing.shareAsync(uri);
			// });

			console.log("PDF Generated", pdfName);
			this.saveFile(pdfName);
			// alert("saved");
		} catch (error) {
			console.error(error);
		}

	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Create QR code</Text>
				<Button
					title="Generate QR code"
					// onPress={() => this.saveQrCode()}
				></Button>

				<QRCode
					value="{for:COVID-19_Contact_Tracing_App, pid:1}"
					getRef={(c) => (this.svg = c)}
				/>

				<Button title="Save QR code" onPress={() => this.getDataURL()}></Button>
			</SafeAreaView>

			// 	{/* {news.map((data) => {
			// 			return <Text>{data.url}</Text>;
			// 		})} */}
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
