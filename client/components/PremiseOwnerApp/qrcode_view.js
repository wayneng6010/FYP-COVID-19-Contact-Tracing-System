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
	Picker,
	ActivityIndicator,
} from "react-native";

import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

export default class qrcode_view extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// busy: null,
			// imageSaved: null,
			premiseName: "Hulala Sdn. Bhd.",
			qrcode_value: null,
			qrcode_options: null,
			selected_branch: "main",
		};
	}

	componentDidMount = async () => {
		this.setState({
			qrcode_value: "{for:COVID-19_Contact_Tracing_App, pid:1}",
		});
	};

	saveFile = async (file_path_updated) => {
		if (this.state.qrcode_options === "download") {
			try {
				const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
				if (status === "granted") {
					const asset = await MediaLibrary.createAssetAsync(file_path_updated);
					alert(
						"QR code has been downloaded\nRetrieve the PDF file via File Manager -> DCIM"
					);
					// await MediaLibrary.saveToLibraryAsync(fileUri);
					// await MediaLibrary.createAlbumAsync("Download", asset, false);
				}
			} catch (error) {
				console.error(error);
				alert("Error occurred while downloading the QR code");
			}
		} else if (this.state.qrcode_options === "share") {
			try {
				Sharing.shareAsync(file_path_updated);
			} catch (error) {
				console.error(error);
				alert("Error occurred while sharing the QR code");
			}
		}
	};

	download = async (dataURL) => {
		try {
			let file_path = await Print.printToFileAsync({
				html:
					'<div style = "margin-top: 10%;"><p style = "font-size: 24; font-weight: bold; text-align: center; font-size: 45px;">COVID-19 Contact Tracing System</p>' +
					'<p style = "font-size: 28; font-weight: bold; text-align: center; font-size: 45px;">Check in to ' +
					this.state.premiseName +
					"</p>" +
					'<p style="text-align: center; margin-top: -30px;"><img src="data:image;base64,' +
					dataURL +
					'"' +
					'alt="QR code" style="margin-top: 50px; width: 300px; height: 300px;" /></p>' +
					'<p style="font-size: 28; font-weight: bold; text-align: center; margin-top: 50px;">Scan the QR Code using COVID-19 Contact Tracing App</p>' +
					"</div>",
				width: 600,
				height: 800,
			});

			// to change file name, file path remain unchanged
			const file_path_updated = `${file_path.uri.slice(
				0,
				file_path.uri.lastIndexOf("/") + 1
			)}CheckIn-QRCode.pdf`;

			await FileSystem.moveAsync({
				from: file_path.uri,
				to: file_path_updated,
			});

			this.saveFile(file_path_updated);
		} catch (error) {
			console.error(error);
			alert("Error occurred while downloading the QR code");
		}
	};

	getBase64 = (options) => {
		this.svg.toDataURL(this.download);
		this.setState({ qrcode_options: options });
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.title}>Check in QR code of your premise</Text>

				<View style={[styles.flexRow, styles.flexRow_bg]}>
					<View style={[styles.flexCol, styles.flexCol_narrower]}>
						<Text style={styles.branch_label}>Branch</Text>
					</View>
					<View style={[styles.flexCol, styles.flexCol_wider]}>
						<View style={styles.pickerBorder}>
							<Picker
								selectedValue={this.state.selected_branch}
								style={{ height: 50, width: 200 }}
								onValueChange={(itemValue, itemIndex) =>
									this.setState({ selected_branch: itemValue, qrcode_value: "branch_1" })
								}
							>
								<Picker.Item label="Main" value="main" />
								<Picker.Item label="Branch 1" value="branch_1" />
							</Picker>
						</View>
					</View>
				</View>

				<View>
					{this.state.qrcode_value == null ? (
						<ActivityIndicator />
					) : (
						<QRCode
							size={200}
							value={this.state.qrcode_value}
							getRef={(c) => (this.svg = c)}
						/>
					)}
				</View>

				<View style={styles.flexRow}>
					<View style={styles.flexCol}>
						<Button
							title="Download"
							onPress={() => this.getBase64("download")}
						></Button>
					</View>
					<View style={styles.flexCol}>
						<Button
							title="Share"
							onPress={() => this.getBase64("share")}
						></Button>
					</View>
				</View>

				<Button
					title="Add new branch"
					// onPress={() => this.saveQrCode()}
				></Button>
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
		// justifyContent: "center",
		marginHorizontal: 20,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		marginVertical: 20,
		fontWeight: "bold",
	},
	flexRow: {
		flex: 0.1,
		flexDirection: "row",
		marginVertical: 40,
	},
	flexCol: {
		marginHorizontal: 10,
		width: 150,
		height: 40,
		justifyContent: "center",
	},
	flexCol_wider: {
		width: 200,
	},
	flexCol_narrower: {
		width: 100,
	},
	pickerBorder: {
		borderWidth: 1,
		borderColor: "black",
		borderRadius: 5,
		marginBottom: 20,
	},
	branch_label: {
		marginTop: -20,
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 18,
	},
	flexRow_bg: {
		backgroundColor: "#f0f0f0",
		paddingVertical: 30,
		marginTop: 0,
		marginBottom: 40,
		borderRadius: 10,
	}
});
