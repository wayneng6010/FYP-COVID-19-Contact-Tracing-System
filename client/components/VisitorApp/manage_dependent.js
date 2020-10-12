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
	Modal,
	TouchableHighlight,
	ActivityIndicator,
	TouchableOpacity,
	Picker,
} from "react-native";

export default class manage_dependent extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			all_dependent: null,
			selected_relation: null,
		};
	}

	getAllDependent = async () => {
		await fetch("http://192.168.0.131:5000/get_user_dependent", {
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
				if (jsonData === undefined || jsonData.length == 0) {
					// alert("No record found");
					this.setState({
						all_dependent: "none",
					});
				} else {
					// alert(jsonData);
					this.setState({
						all_dependent: jsonData,
					});
				}
				// console.log(jsonData);
			})
			.catch((error) => {
				alert(error);
			});
	};

	componentDidMount = async () => {
		this.getAllDependent();
	};

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	render() {
		const { modalVisible, all_dependent } = this.state;
		// alert(JSON.stringify(all_dependent));
		// let all_dependent_item = null;
		// if (all_dependent !== null) {
		// 	// alert(all_dependent);
		// 	all_dependent_item = all_dependent.map((data, index) => {
		// 		return (
		// 			<View style={styles.dependent_outer} key={index}>
		// 				<Text style={styles.dependent_name}>{data.ic_fname}</Text>
		// 				<Text style={styles.dependent_relationship}>{data.relationship}</Text>
		// 			</View>
		// 		);
		// 	});
		// }
		return (
			<SafeAreaView style={styles.container}>
				{/* <View style={styles.flexRow}>
					<View style={styles.flexCol_1}>
						<Text style={styles.title_reg}>Register as Premise Owner?</Text>
					</View>
					<View style={styles.flexCol_2}>
						<Text
							style={{
								color: "blue",
								textDecorationLine: "underline",
							}}
							onPress={() =>
								this.props.navigation.navigate("phoneNo_verify_po")
								// this.props.navigation.navigate("password_create_po")
							}
						>
							Register here
						</Text>
					</View>
				</View> */}

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
							<Text style={styles.modalText}>Add New Dependent</Text>
							<View style={[styles.flexRow, styles.flexRow_bg]}>
								<View style={[styles.flexCol, styles.flexCol_narrower]}>
									<Text style={styles.branch_label}>Relation</Text>
								</View>
								<View style={[styles.flexCol, styles.flexCol_wider]}>
									<View style={styles.pickerBorder}>
										<Picker
											selectedValue={this.state.selected_relation}
											style={{ height: 50, width: 180 }}
											onValueChange={(itemValue, itemIndex) => {
												// alert(JSON.stringify(all_qrcode));
												this.setState({
													selected_relation: itemValue,
												});
											}}
										>
											<Picker.Item value="Grandparent" label="Grandparent" />
											<Picker.Item value="Spouse" label="Spouse" />
											<Picker.Item value="Child" label="Child" />
											<Picker.Item value="Siblings" label="Siblings" />
											<Picker.Item
												value="Parents / Parents-in-law"
												label="Parents / Parents-in-law"
											/>
											<Picker.Item value="Guardian" label="Guardian" />
										</Picker>
									</View>
								</View>
							</View>
							<Text style={styles.subtitle}>
								We need you to capture the original Malaysian identity card of
								your dependent to verify their personal information
							</Text>
							<Text style={styles.subtitle}>
								Personal information collected include:
							</Text>
							<Text style={{ fontSize: 16 }}>- IC number</Text>
							<Text style={{ fontSize: 16 }}>- Full name</Text>
							<Text style={{ fontSize: 16 }}>- Residential Address</Text>

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
										// onPress={() => {
										// 	this.addDependent();
										// }}
										onPress={() => {
											this.setModalVisible(!modalVisible);
											this.props.navigation.navigate("ic_capture_dependent", {
												dependent_relationship: this.state.selected_relation,
											});
										}}
									>
										<Text style={styles.textStyle}>Capture IC</Text>
									</TouchableHighlight>
								</View>
							</View>
							<Text />
							<Text />
							<Text style={[styles.subtitle, styles.subtitle_1]}>
								Add via Passport
							</Text>
						</View>
					</View>
				</Modal>

				<View style={styles.reg_content}>
					<Text style={styles.subtitle_2}>
						You can add your family members that does not own a smartphone so
						that they can perform check in at premises
					</Text>
					<Text />
					<Text style={[styles.subtitle, styles.subtitle_bg]}>
						Your Dependent
					</Text>
					<Text />
					<ScrollView>
						{all_dependent == null ? (
							<ActivityIndicator />
						) : // { all_dependent_item }
						// <View />
						all_dependent == "none" ? (
							<Text style={styles.no_record}>No dependent found</Text>
						) : (
							<View style={styles.dependent_view}>
								{all_dependent.map((data) => {
									return (
										<TouchableOpacity
											style={styles.dependent_outer}
											key={data._id}
											onPress={() => {
												this.props.navigation.navigate(
													"view_dependent_qrcode",
													{
														dependent_id: data._id,
														dependent_name: data.ic_fname,
														dependent_relationship: data.relationship,
													}
												);
											}}
										>
											<Text style={styles.dependent_name}>{data.ic_fname}</Text>
											<Text style={styles.dependent_relationship}>
												{data.relationship}
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>
						)}
					</ScrollView>
				</View>

				<View style={styles.add_dependent}>
					{/* <Button
						title="Add Dependent"
						onPress={() => {
							this.setModalVisible(true);
						}}
					></Button> */}
					<TouchableHighlight
						style={{
							...styles.openButton,
							backgroundColor: "#3cb371",
							width: 170,
							alignSelf: "flex-end",
							borderRadius: 10,
						}}
						onPress={() => {
							this.setModalVisible(true);
						}}
					>
						<Text style={styles.textStyle}>Add Dependent</Text>
					</TouchableHighlight>
				</View>
			</SafeAreaView>

			// 	{/* {news.map((data) => {
			// 			return <Text>{data.url}</Text>;
			// 		})} */}
		);
	}
}

const styles = StyleSheet.create({
	no_record: {
		textAlign: "center",
		fontStyle: "italic",
	},
	flexRow_bg: {
		backgroundColor: "#f0f0f0",
		paddingTop: 40,
		paddingBottom: 25,
		paddingLeft: 20,
		marginTop: 10,
		borderRadius: 10,
	},
	branch_label: {
		fontWeight: "bold",
		fontSize: 16,
	},
	flexCol_wider: {
		width: 180,
	},
	flexCol_narrower: {
		width: 60,
	},
	pickerBorder: {
		borderWidth: 1,
		borderColor: "black",
		borderRadius: 5,
	},
	dependent_view: {
		width: 350,
	},
	dependent_outer: {
		marginHorizontal: 10,
		paddingVertical: 15,
		borderBottomColor: "grey",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	dependent_name: {
		fontWeight: "bold",
		paddingHorizontal: 10,
	},
	dependent_relationship: {
		paddingHorizontal: 10,
		color: "grey",
	},
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		alignItems: "center",
		// justifyContent: "center",
		// marginHorizontal: 20,
	},
	reg_content: {
		backgroundColor: "white",
		// marginTop: 10,
		// borderRadius: 5,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 10,
		paddingVertical: 20,
		width: "95%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		maxHeight: "90%",
	},
	add_dependent: {
		position: "absolute",
		bottom: 0,
		backgroundColor: "white",
		width: "100%",
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		fontWeight: "bold",
		// marginTop: 20,
		marginBottom: 15,
		// backgroundColor: "#0f52ba",
		// color: "white",
		// borderRadius: 5,
		width: "80%",
		// paddingHorizontal: 15,
		// paddingVertical: 5,
	},
	subtitle: {
		fontSize: 16,
		textAlign: "center",
		marginVertical: 5,
	},
	subtitle_2: {
		fontSize: 16,
		textAlign: "center",
		marginVertical: 5,
		backgroundColor: "#f7f7f7",
		width: "105%",
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	subtitle_1: {
		color: "blue",
		textDecorationLine: "underline",
		marginBottom: -35,
	},
	subtitle_bg: {
		backgroundColor: "lightgrey",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
	},
	title_reg: {
		fontSize: 16,
		textAlign: "center",
		marginVertical: 20,
	},
	flexRow: {
		backgroundColor: "white",
		borderRadius: 5,
		width: "95%",
		flex: 0.1,
		flexDirection: "row",
		marginVertical: 20,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
	},
	flexCol_1: {
		marginHorizontal: 10,
		width: 200,
		height: 40,
		// backgroundColor: "grey",
		alignItems: "center",
		justifyContent: "center",
	},
	flexCol_2: {
		width: 100,
		height: 40,
		// backgroundColor: "grey",
		alignItems: "center",
		justifyContent: "center",
	},
	flexRow1: {
		flex: 0.1,
		flexDirection: "row",
		marginTop: 30,
		marginBottom: 5,
	},
	flexCol: {
		marginHorizontal: 10,
		width: 110,
		height: 40,
		justifyContent: "center",
		paddingBottom: 15,
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
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold",
	},
});
