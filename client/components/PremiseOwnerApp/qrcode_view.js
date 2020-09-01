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

export default class qrcode_view extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// busy: null,
			// imageSaved: null,
			premiseName: "Hulala Sdn. Bhd.",
			all_qrcode: null,
			qrcode_value: null,
			qrcode_options: null,
			selected_entry_point: null,
			selected_entry_point_id: null,
			new_entry_point: "",
			edit_entry_point: "",
			premise_id: null,
			modalVisible: false,
			modalVisible_edit: false,
		};
	}

	// getSelectedQRCode = async () => {
	// 	await fetch("http://192.168.0.131:5000/get_main_premise_qrcode", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({
	// 			entry_point: this.state.selected_entry_point,
	// 		}),
	// 	})
	// 		.then((res) => {
	// 			// console.log(JSON.stringify(res.headers));
	// 			return res.json();
	// 		})
	// 		.then((jsonData) => {
	// 			// alert(JSON.stringify(jsonData));
	// 			var qrcode_id = jsonData[0]._id,
	// 				premise_id = jsonData[0].user_premiseowner;
	// 			this.setState({
	// 				qrcode_value:
	// 					'{"for":"COVID-19_Contact_Tracing_App", "qrid":"' +
	// 					qrcode_id +
	// 					'", "pid":"' +
	// 					premise_id +
	// 					'"}',
	// 			});
	// 			// console.log(this.state.qrcode_value);
	// 		})
	// 		.catch((error) => {
	// 			alert(error);
	// 		});
	// };

	getAllQRCode = async () => {
		await fetch("http://192.168.0.131:5000/get_all_premise_qrcode", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				this.setState({
					all_qrcode: jsonData,
					premise_id: jsonData[0].user_premiseowner,
					selected_entry_point: jsonData[0].entry_point,
					selected_entry_point_id: jsonData[0]._id,
					qrcode_value:
						'{"for":"COVID-19_Contact_Tracing_App", "qrid":"' +
						jsonData[0]._id +
						'", "pid":"' +
						jsonData[0].user_premiseowner +
						'"}',
				});
				// console.log(this.state.qrcode_value);
			})
			.catch((error) => {
				alert(error);
			});
	};

	componentDidMount = async () => {
		await fetch("http://192.168.0.131:5000/save_premise_qrcode", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(jsonData);
				if (jsonData == "success") {
					// alert("QR code saved");
				} else if (jsonData == "failed") {
					// alert("QR code existed");
				} else {
					alert("Error occured while saving qr code");
				}
			})
			.catch((error) => {
				alert(error);
			});

		// this.getSelectedQRCode();
		this.getAllQRCode();
	};

	saveFile = async (file_path_updated) => {
		if (this.state.qrcode_options === "download") {
			try {
				const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
				if (status === "granted") {
					const asset = await MediaLibrary.createAssetAsync(file_path_updated);
					alert("Retrieve the downloaded PDF file via File Manager -> DCIM");
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
					'<p style = "font-weight: bold; text-align: center; font-size: 45px;">Check in to ' +
					this.state.premiseName +
					"</p>" +
					'<p style = "font-size: 38; font-weight: bold; text-align: center;">' +
					this.state.selected_entry_point +
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
			)}CheckIn-QRCode-${this.state.selected_entry_point}.pdf`;

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

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	setModalVisible_edit = (visible) => {
		this.setState({ modalVisible_edit: visible });
	};

	saveNewEntryPoint = async () => {
		await fetch("http://192.168.0.131:5000/save_new_entry_point", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				new_entry_point: this.state.new_entry_point,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData == "success") {
					alert("New entry point have been saved");
					this.setModalVisible(false);
					this.getAllQRCode();
				} else if (jsonData == "existed") {
					alert(
						"New entry point name should not be similar with existing entry point"
					);
				} else if (jsonData == "failed") {
					alert("Error occured while saving qr code");
				} else {
					alert("Error occured while saving qr code");
				}
				// console.log(this.state.qrcode_value);
			})
			.catch((error) => {
				alert(error);
			});
	};

	addNewEntryPoint = async () => {
		if (
			this.state.new_entry_point == null ||
			this.state.new_entry_point == ""
		) {
			alert("Please fill in new entry point name");
		} else {
			this.saveNewEntryPoint();
		}
	};

	editEntryPointName = async () => {
		await fetch("http://192.168.0.131:5000/edit_entry_point_name", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				selected_entry_point_id: this.state.selected_entry_point_id,
				edit_entry_point_name: this.state.edit_entry_point,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData == "success") {
					alert("Entry point name have been saved");
					this.setModalVisible_edit(false);
					this.getAllQRCode();
				} else if (jsonData == "existed") {
					alert(
						"New entry point name should not be similar with existing entry point"
					);
				} else if (jsonData == "failed") {
					alert("Error occured while saving entry point name");
				} else {
					alert("Error occured while saving entry point name");
				}
				// console.log(this.state.qrcode_value);
			})
			.catch((error) => {
				alert(error);
			});
	};

	render() {
		const { modalVisible, modalVisible_edit, all_qrcode } = this.state;
		let all_entry_points = null;
		if (this.state.all_qrcode !== null) {
			all_entry_points = this.state.all_qrcode.map((data) => {
				return (
					<Picker.Item
						key={data._id}
						value={data._id}
						label={data.entry_point}
					/>
				);
			});
		}

		return (
			<SafeAreaView style={styles.container}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						this.setModalVisible(!modalVisible);
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>New Entry Point Name</Text>
							<TextInput
								name="new_entry_point"
								keyboardType="default"
								maxLength={20}
								onChangeText={(value) =>
									this.setState({ new_entry_point: value })
								}
								// onChangeText={(value) => this.onChangePassword(value)}
								value={this.state.new_entry_point}
								style={styles.input}
							/>
							<View style={styles.flexRow1}>
								<View style={styles.flexCol}>
									<TouchableHighlight
										style={{ ...styles.openButton, backgroundColor: "grey" }}
										onPress={() => {
											this.setModalVisible(!modalVisible);
										}}
									>
										<Text style={styles.textStyle}>Cancel</Text>
									</TouchableHighlight>
								</View>
								<View style={styles.flexCol}>
									<TouchableHighlight
										style={{ ...styles.openButton, backgroundColor: "#5cb85c" }}
										onPress={() => {
											this.addNewEntryPoint();
										}}
									>
										<Text style={styles.textStyle}>Add</Text>
									</TouchableHighlight>
								</View>
							</View>
						</View>
					</View>
				</Modal>

				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible_edit}
					onRequestClose={() => {
						this.setModalVisible_edit(!modalVisible_edit);
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>Edit Entry Point Info</Text>
							<TextInput
								name="edit_entry_point"
								keyboardType="default"
								maxLength={20}
								onChangeText={(value) =>
									this.setState({ edit_entry_point: value })
								}
								// onChangeText={(value) => this.onChangePassword(value)}
								value={this.state.edit_entry_point}
								style={styles.input}
							/>
							<View style={styles.flexRow1}>
								<View style={styles.flexCol}>
									<TouchableHighlight
										style={{ ...styles.openButton, backgroundColor: "grey" }}
										onPress={() => {
											this.setModalVisible_edit(!modalVisible_edit);
										}}
									>
										<Text style={styles.textStyle}>Cancel</Text>
									</TouchableHighlight>
								</View>
								<View style={styles.flexCol}>
									<TouchableHighlight
										style={{ ...styles.openButton, backgroundColor: "#5cb85c" }}
										onPress={() => {
											this.editEntryPointName();
										}}
									>
										<Text style={styles.textStyle}>Edit</Text>
									</TouchableHighlight>
								</View>
							</View>
						</View>
					</View>
				</Modal>
				<Text style={styles.title}>Check in QR code of your premise</Text>
				<View style={[styles.flexRow, styles.flexRow_bg]}>
					<View style={[styles.flexCol, styles.flexCol_narrower]}>
						<Text style={styles.branch_label}>Entry Point</Text>
					</View>
					<View style={[styles.flexCol, styles.flexCol_wider]}>
						<View style={styles.pickerBorder}>
							<Picker
								selectedValue={this.state.selected_entry_point_id}
								style={{ height: 50, width: 200 }}
								onValueChange={(itemValue, itemIndex) => {
									// alert(JSON.stringify(all_qrcode));
									this.setState({
										selected_entry_point_id: itemValue,
										selected_entry_point: all_qrcode[itemIndex].entry_point,
										qrcode_value:
											'{"for":"COVID-19_Contact_Tracing_App", "qrid":"' +
											itemValue +
											'", "pid":"' +
											this.state.premise_id +
											'"}',
									});
								}}
							>
								{all_entry_points}
							</Picker>
						</View>
					</View>
				</View>

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

							<Text style={styles.selectedEntryPoint}>
								{this.state.selected_entry_point}
							</Text>
						</View>
					)}
				</View>

				<View style={styles.flexRow}>
					<View style={styles.flexCol}>
						{/* <Button
							title="Share"
							onPress={() => this.getBase64("share")}
						></Button> */}
						<TouchableHighlight
							style={{ ...styles.openButton, backgroundColor: "#3cb371" }}
							onPress={() => {
								this.setModalVisible_edit(true);
								this.setState({
									edit_entry_point: this.state.selected_entry_point,
								});
							}}
						>
							<View>
								<Text style={styles.textStyle}>Edit</Text>
							</View>
						</TouchableHighlight>
					</View>
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
							<View>
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
							<View>
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
				<Text />
				<TouchableHighlight
					style={{
						...styles.openButton,
						backgroundColor: "#f5f5f5",
						width: 200,
					}}
					onPress={() => {
						this.setModalVisible(true);
					}}
				>
					<View>
						<Text style={styles.textStyle_black}>Add New Entry Point</Text>
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
		width: 100,
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
		fontWeight: "bold",
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
