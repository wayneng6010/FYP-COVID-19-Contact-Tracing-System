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
	Modal,
	TouchableHighlight,
	TextInput,
	Alert,
	Image,
} from "react-native";

import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

export default class view_dependent_qrcode extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// busy: null,
			// imageSaved: null,
			qrcode_value: null,
			qrcode_options: null,
			modalVisible_regenerate: false,
			modalVisible_delete: false,
			dependent_id: null,
			dependent_name: null,
			dependent_relationship: null,
			dependent_ic_num: null,
		};
	}

	getUserID = async () => {
		await fetch("http://192.168.0.131:5000/get_user_id", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(jsonData);
				this.setState({
					qrcode_value:
						'{"for":"COVID-19_Contact_Tracing_App", "role":"dependent", "did":"' +
						this.props.navigation.state.params.dependent_id +
						'", "uid":"' +
						jsonData +
						'"}',
				});
				// console.log(this.state.qrcode_value);
			})
			.catch((error) => {
				alert(error);
			});
	};

	componentDidMount = async () => {
		// alert(this.props.navigation.state.params.dependent_name);
		this.setState({
			dependent_id: this.props.navigation.state.params.dependent_id,
			dependent_name: this.props.navigation.state.params.dependent_name,
			dependent_relationship: this.props.navigation.state.params
				.dependent_relationship,
			dependent_ic_num: this.props.navigation.state.params.dependent_ic_num,
		});

		this.getUserID();
	};

	saveFile = async (file_path_updated) => {
		if (this.state.qrcode_options === "download") {
			try {
				const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
				alert("QR code saved to File Manager->DCIM");
				if (status === "granted") {
					const asset = await MediaLibrary.createAssetAsync(file_path_updated);
					// alert("QR code saved to File Manager->DCIM");
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
					'<div style = "margin-top: 10%; border: 1px solid grey; border-radius: 20px; width: 500px; height: 250px; padding: 0 25px;">' +
					'<div style="display: inline-block; width: 200px; height: 200px;"><p style="text-align: center; margin-top: -30px;"><img src="data:image;base64,' +
					dataURL +
					'"' +
					'alt="QR code" style="margin-top: 50px; width: 200px; height: 200px;" /></p></div>' +
					'<div style="display: inline-block; width: 300px; height: 200px; transform: translate(0, -20px); margin-top: 0; padding-top: 0;"><p style = "line-height: .4; font-size: 20; font-weight: bold; text-align: right; font-size: 35px;">COVID-19 CTS</p>' +
					'<p style = "line-height: 1; text-align: right; font-size: 24px; margin-bottom: -25px;">' +
					this.state.dependent_name +
					'</p><p style="line-height: 1; font-size: 20; text-align: right; margin-top: 50px;">Show this to premise<br/>staff while check in</p></div>' +
					"</div>",
				width: 600,
				height: 800,
			});

			// to change file name, file path remain unchanged
			const file_path_updated = `${file_path.uri.slice(
				0,
				file_path.uri.lastIndexOf("/") + 1
			)}CheckIn-QRCode-${this.state.dependent_name}.pdf`;

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

	setModalVisible_regenerate = (visible) => {
		this.setState({ modalVisible_regenerate: visible });
	};

	setModalVisible_delete = (visible) => {
		this.setState({ modalVisible_delete: visible });
	};

	delete_dependent = async () => {
		await fetch("http://192.168.0.131:5000/delete_dependent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				dependent_id: this.state.dependent_id,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData == "success") {
					// alert("This dependent have been deleted");
					this.setModalVisible_delete(false);
					this.props.navigation.pop();
				} else {
					alert("Error occured while deleting this dependent");
				}
				// console.log(this.state.qrcode_value);
			})
			.catch((error) => {
				alert(error);
			});
	};

	regenerate_dependent_qrcode = async () => {
		await fetch("http://192.168.0.131:5000/regenerate_dependent_qrcode", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				dependent_id: this.state.dependent_id,
				ic_fname: this.state.dependent_name,
				relationship: this.state.dependent_relationship,
				ic_num: this.state.dependent_ic_num,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData == "success") {
					// alert("The QR code of this dependent have been regenerated");
					this.setModalVisible_regenerate(false);
					this.props.navigation.pop();
				} else {
					alert("Error occured while regenerating QR code of this dependent");
				}
				// console.log(this.state.qrcode_value);
			})
			.catch((error) => {
				alert(error);
			});
	};

	render() {
		const { modalVisible_regenerate, modalVisible_delete } = this.state;

		return (
			<SafeAreaView style={styles.container}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible_regenerate}
					onRequestClose={() => {
						this.setModalVisible_regenerate(!modalVisible_regenerate);
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>
								Are you sure to regenerate this QR code? The previous check ins
								data will still be kept in the database.
							</Text>
							<View style={styles.flexRow1}>
								<View style={styles.flexCol}>
									<TouchableHighlight
										style={{ ...styles.openButton, backgroundColor: "grey" }}
										onPress={() => {
											this.setModalVisible_regenerate(!modalVisible_regenerate);
										}}
									>
										<Text style={styles.textStyle}>Cancel</Text>
									</TouchableHighlight>
								</View>
								<View style={styles.flexCol}>
									<TouchableHighlight
										style={{ ...styles.openButton, backgroundColor: "#1e90ff" }}
										onPress={() => {
											this.regenerate_dependent_qrcode();
										}}
									>
										<Text style={styles.textStyle}>Regenerate</Text>
									</TouchableHighlight>
								</View>
							</View>
						</View>
					</View>
				</Modal>

				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible_delete}
					onRequestClose={() => {
						this.setModalVisible_delete(!modalVisible_delete);
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>
								Are you sure to delete this dependent? The previous check ins
								data will still be kept in the database.
							</Text>
							<View style={styles.flexRow1}>
								<View style={styles.flexCol}>
									<TouchableHighlight
										style={{ ...styles.openButton, backgroundColor: "grey" }}
										onPress={() => {
											this.setModalVisible_delete(!modalVisible_delete);
										}}
									>
										<Text style={styles.textStyle}>Cancel</Text>
									</TouchableHighlight>
								</View>
								<View style={styles.flexCol}>
									<TouchableHighlight
										style={{ ...styles.openButton, backgroundColor: "#dc3545" }}
										onPress={() => {
											this.delete_dependent();
										}}
									>
										<Text style={styles.textStyle}>Delete</Text>
									</TouchableHighlight>
								</View>
							</View>
						</View>
					</View>
				</Modal>

				<Text style={styles.title}>Check in QR code for your dependent</Text>

				<View>
					{this.state.qrcode_value == null ? (
						<ActivityIndicator />
					) : (
						<View style={styles.qrcode_outer}>
							<QRCode
								size={200}
								value={this.state.qrcode_value}
								getRef={(c) => (this.svg = c)}
							/>

							<View style={styles.selectedEntryPoint}>
								<Text style={styles.dependent_name}>
									{this.state.dependent_name}
								</Text>
								<Text style={styles.dependent_relationship}>
									{this.state.dependent_relationship}
								</Text>
								<Text style={styles.dependent_relationship}>
									{this.state.dependent_ic_num}
								</Text>
							</View>
						</View>
					)}
				</View>

				<View style={styles.flexRow}>
					<View style={styles.flexCol}>
						{/* <Button
							title="Download"
							onPress={() => this.getBase64("download")}
						></Button> */}
						<TouchableHighlight
							style={{ ...styles.openButton, backgroundColor: "#1e90ff" }}
							onPress={() => {
								this.getBase64("download");
							}}
						>
							{/* <View>
								<Text style={styles.textStyle}>Download</Text>
							</View> */}
							<View>
								<Image
									source={require("../../assets/download_icon.png")}
									style={styles.icon}
								/>
								<Text style={styles.textStyle}>Download</Text>
							</View>
						</TouchableHighlight>
					</View>
					<View style={styles.flexCol}>
						{/* <Button
							title="Share"
							onPress={() => this.getBase64("share")}
						></Button> */}
						<TouchableHighlight
							style={{ ...styles.openButton, backgroundColor: "#3c5494" }}
							onPress={() => {
								this.getBase64("share");
							}}
						>
							{/* <View>
								<Text style={styles.textStyle}>Share</Text>
							</View> */}
							<View>
								<Image
									source={require("../../assets/share_icon.png")}
									style={styles.icon}
								/>
								<Text style={styles.textStyle}>Share</Text>
							</View>
						</TouchableHighlight>
					</View>
				</View>
				<Text />

				<View
					style={{
						borderBottomColor: "black",
						borderBottomWidth: StyleSheet.hairlineWidth,
						width: "100%",
					}}
				/>

				{/* <Button
					title="Add new entry point"
					onPress={() => this.setModalVisible(true)}
				></Button> */}
				<Text />
				<TouchableHighlight
					style={{
						...styles.openButton,
						backgroundColor: "#6c757d",
						borderRadius: 0,
						width: 200,
					}}
					onPress={() => {
						this.setModalVisible_regenerate(true);
					}}
				>
					<View>
						<Text style={styles.textStyle}>Regenerate QR Code</Text>
					</View>
				</TouchableHighlight>
				<Text />
				<TouchableHighlight
					style={{
						...styles.openButton,
						backgroundColor: "#dc3545",
						borderRadius: 0,
						width: 200,
					}}
					onPress={() => {
						this.setModalVisible_delete(true);
					}}
				>
					<View>
						<Text style={styles.textStyle}>Delete This Dependent</Text>
					</View>
				</TouchableHighlight>
			</SafeAreaView>

			// 	{/* {news.map((data) => {
			// 			return <Text>{data.url}</Text>;
			// 		})} */}
		);
	}
}

const styles = StyleSheet.create({
	icon: {
		width: 20,
		height: 20,
		justifyContent: "center",
		alignSelf: "center",
	},
	container: {
		flex: 1,
		backgroundColor: "white",
		alignItems: "center",
		// justifyContent: "center",
		marginHorizontal: 10,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		marginVertical: 20,
		marginBottom: 40,
		fontWeight: "bold",
	},
	flexRow1: {
		flex: 0.1,
		flexDirection: "row",
		marginTop: 30,
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
		paddingBottom: 15,
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
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
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
	textStyle_black: {
		color: "#3b3a3a",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: 18,
		// fontWeight: "bold",
	},
	input: {
		borderColor: "#c0cbd3",
		borderWidth: 2,
		width: 300,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	selectedEntryPoint: {
		textAlign: "center",
		marginTop: 30,
		backgroundColor: "#363535",
		padding: 10,
		borderRadius: 10,
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		width: 200,
	},
	dependent_name: {
		textAlign: "center",
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	dependent_relationship: {
		textAlign: "center",
		color: "white",
		fontSize: 16,
		fontStyle: "italic",
	},
	qrcode_outer: {
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#f0f0f0",
		borderRadius: 20,
		paddingVertical: 30,
		paddingHorizontal: 50,
		marginTop: -20,
	},
});
