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
	TextInput,
	ToastAndroid,
	TouchableHighlight,
	ActivityIndicator,
	Image,
	Dimensions,
	Modal,
	Picker,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default class manage_profile extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.132:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};

	constructor() {
		super();
		this.state = {
			password: null,
			cpassword: null,
			user_info: null,
			region: null,
			modalVisible: false,
			updated_premise_name: null,
			updated_owner_fname: null,
			updated_premise_address: null,
			updated_premise_postcode: null,
			updated_premise_state: null,
			edit_field: null,
		};
	}

	getPremiseInfo = async () => {
		await fetch("http://192.168.0.132:5000/get_premise_info", {
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
				// console.log(jsonData);
				if (!jsonData) {
					this.setState({ user_info: "none" });
				} else {
					this.setState({
						user_info: jsonData,
						region: {
							latitude: jsonData.premise_lat,
							longitude: jsonData.premise_lng,
							latitudeDelta: 0.002,
							longitudeDelta: 0.002,
						},
					});
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	componentDidMount = async () => {
		this.getPremiseInfo();
		const { navigation } = this.props;
		this.focusListener = navigation.addListener("didFocus", () => {
			this.getPremiseInfo();
		});
	};

	updatePremiseDetials = async () => {
		const { edit_field } = this.state;

		if (edit_field == "p_name") {
			if (this.state.updated_premise_name == null) {
				alert("There is no update in premise name");
				return;
			} else {
				const premise_name = this.state.updated_premise_name.trim();
				if (premise_name == null || premise_name == "") {
					alert("Please enter premise name");
					return;
				} else if (premise_name.length > 40) {
					alert("Premise name should not have more than 40 characters");
					return;
				}
				await fetch("http://192.168.0.132:5000/update_premise_name", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						new_premise_name: premise_name,
					}),
				})
					.then((res) => {
						// console.log(JSON.stringify(res.headers));
						return res.text();
					})
					.then((jsonData) => {
						// alert(jsonData);
						if (jsonData == "success") {
							alert("Premise name has been updated");
							this.setState({ updated_premise_name: null });
							this.getPremiseInfo();
							this.setModalVisible(false);
						} else if (jsonData == "failed") {
							alert("Premise name failed to update");
						}
					})
					.catch((error) => {
						alert(error);
					});
			}
		} else if (edit_field == "o_name") {
			if (this.state.updated_owner_fname == null) {
				alert("There is no update in owner's name");
				return;
			} else {
				const owner_fname = this.state.updated_owner_fname.trim();
				if (owner_fname == null || owner_fname == "") {
					alert("Please enter owner's name");
					return;
				} else if (owner_fname.length > 40) {
					alert("Owner's name should not have more than 40 characters");
					return;
				}
				await fetch("http://192.168.0.132:5000/update_owner_fname", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						new_owner_fname: owner_fname,
					}),
				})
					.then((res) => {
						// console.log(JSON.stringify(res.headers));
						return res.text();
					})
					.then((jsonData) => {
						// alert(jsonData);
						if (jsonData == "success") {
							alert("Owner's name has been updated");
							this.setState({ updated_owner_fname: null });
							this.getPremiseInfo();
							this.setModalVisible(false);
						} else if (jsonData == "failed") {
							alert("Owner's name failed to update");
						}
					})
					.catch((error) => {
						alert(error);
					});
			}
		} else if (edit_field == "p_address") {
			var {
				updated_premise_address,
				updated_premise_postcode,
				updated_premise_state,
				user_info,
			} = this.state;
			if (
				updated_premise_address == null &&
				updated_premise_postcode == null &&
				updated_premise_state == null
			) {
				alert("There is no update in premise address");
				return;
			} else {
				if (updated_premise_address == null) {
					updated_premise_address = user_info.premise_address;
				}
				if (updated_premise_postcode == null) {
					updated_premise_postcode = user_info.premise_postcode;
				}
				if (updated_premise_state == null) {
					updated_premise_state = user_info.premise_state;
				}

				const premise_address = updated_premise_address.trim();
				const premise_postcode = updated_premise_postcode.trim();
				const premise_state = updated_premise_state.trim();
				if (
					premise_address == null ||
					premise_address == "" ||
					premise_postcode == null ||
					premise_postcode == "" ||
					premise_state == null ||
					premise_state == ""
				) {
					alert("Please fill in all the inputs for premise address");
					return;
				} else if (premise_address.length > 40) {
					alert("Premise address should not have more than 40 characters");
					return;
				} else if (premise_postcode.length > 5) {
					alert("Premise postcode should not have more than 5 characters");
					return;
				}
				await fetch("http://192.168.0.132:5000/update_premise_address", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						new_premise_address: premise_address,
						new_premise_postcode: premise_postcode,
						new_premise_state: premise_state,
					}),
				})
					.then((res) => {
						// console.log(JSON.stringify(res.headers));
						return res.text();
					})
					.then((jsonData) => {
						// alert(jsonData);
						if (jsonData == "success") {
							alert("Premise address has been updated");
							this.setState({
								updated_premise_address: null,
								updated_premise_postcode: null,
								updated_premise_state: null,
							});
							this.getPremiseInfo();
							this.setModalVisible(false);
						} else if (jsonData == "failed") {
							alert("Premise address failed to update");
						}
					})
					.catch((error) => {
						alert(error);
					});
			}
		}
	};

	render() {
		const {
			user_info,
			region,
			modalVisible,
			updated_owner_fname,
			updated_premise_name,
			updated_premise_address,
			updated_premise_postcode,
			updated_premise_state,
			edit_field,
		} = this.state;
		return (
			<SafeAreaView style={styles.container}>
				{user_info == null ? (
					<View />
				) : (
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
								<Text style={styles.modalText}>Update Premise Details</Text>

								{edit_field == "p_name" ? (
									<View>
										<Text
											style={{
												...styles.user_info_subtitle,
											}}
										>
											Premise Name
										</Text>
										<TextInput
											name="updated_premise_name"
											keyboardType="default"
											autoCapitalize="words"
											maxLength={40}
											onChangeText={(value) =>
												this.setState({ updated_premise_name: value })
											}
											// onChangeText={(value) => this.onChangePassword(value)}
											value={
												updated_premise_name == null
													? user_info.premise_name
													: updated_premise_name
											}
											style={styles.input}
										/>
									</View>
								) : edit_field == "o_name" ? (
									<View>
										<Text
											style={{
												...styles.user_info_subtitle,
											}}
										>
											Owner's Name
										</Text>
										<TextInput
											name="updated_owner_fname"
											keyboardType="default"
											autoCapitalize="words"
											maxLength={40}
											onChangeText={(value) =>
												this.setState({ updated_owner_fname: value })
											}
											// onChangeText={(value) => this.onChangePassword(value)}
											value={
												updated_owner_fname == null
													? user_info.owner_fname
													: updated_owner_fname
											}
											style={styles.input}
										/>
									</View>
								) : edit_field == "p_address" ? (
									<View>
										<Text
											style={{
												...styles.user_info_subtitle,
											}}
										>
											Premise Address
										</Text>
										<TextInput
											name="new_entry_point"
											keyboardType="default"
											autoCapitalize="words"
											maxLength={80}
											onChangeText={(value) =>
												this.setState({ updated_premise_address: value })
											}
											// onChangeText={(value) => this.onChangePassword(value)}
											value={
												updated_premise_address == null
													? user_info.premise_address
													: updated_premise_address
											}
											style={styles.input}
										/>
										<Text />
										<Text style={styles.user_info_subtitle}>
											Premise Postcode
										</Text>
										<TextInput
											name="premise_postcode"
											keyboardType="numeric"
											placeholder="e.g. 11700"
											maxLength={5}
											onChangeText={(value) =>
												this.setState({
													updated_premise_postcode: value.trim(),
												})
											}
											value={
												updated_premise_postcode == null
													? user_info.premise_postcode
													: updated_premise_postcode
											}
											style={styles.input}
										/>

										<Text />
										<Text style={styles.user_info_subtitle}>Premise State</Text>
										<View style={{ borderColor: "#c0cbd3", borderWidth: 2 }}>
											<Picker
												style={{
													height: 35,
													width: 300,
												}}
												onValueChange={(itemValue, itemIndex) =>
													this.setState({ updated_premise_state: itemValue })
												}
												selectedValue={
													updated_premise_state == null
														? user_info.premise_state
														: updated_premise_state
												}
											>
												{/* <Picker.Item
											label="- Select Premise State -"
											value="empty"
										/> */}
												<Picker.Item
													label="Kuala Lumpur"
													value="Kuala Lumpur"
												/>
												<Picker.Item label="Labuan" value="Labuan" />
												<Picker.Item label="Putrajaya" value="Putrajaya" />
												<Picker.Item label="Johor" value="Johor" />
												<Picker.Item label="Kedah" value="Kedah" />
												<Picker.Item label="Kelantan" value="Kelantan" />
												<Picker.Item label="Melaka" value="Melaka" />
												<Picker.Item
													label="Negeri Sembilan"
													value="Negeri Sembilan"
												/>
												<Picker.Item label="Pahang" value="Pahang" />
												<Picker.Item label="Perak" value="Perak" />
												<Picker.Item label="Perlis" value="Perlis" />
												<Picker.Item
													label="Pulau Pinang"
													value="Pulau Pinang"
												/>
												<Picker.Item label="Sabah" value="Sabah" />
												<Picker.Item label="Sarawak" value="Sarawak" />
												<Picker.Item label="Selangor" value="Selangor" />
												<Picker.Item label="Terengganu" value="Terengganu" />
											</Picker>
										</View>
									</View>
								) : (
									<View />
								)}

								<View style={styles.flexRow1}>
									<View style={styles.flexCol}>
										<TouchableHighlight
											style={{
												...styles.openButton_1,
												backgroundColor: "grey",
											}}
											onPress={() => {
												this.setModalVisible(!modalVisible);
											}}
										>
											<Text style={styles.textStyle}>Cancel</Text>
										</TouchableHighlight>
									</View>
									<View style={styles.flexCol}>
										<TouchableHighlight
											style={{
												...styles.openButton_1,
												backgroundColor: "#5cb85c",
											}}
											onPress={() => {
												this.updatePremiseDetials();
											}}
										>
											<Text style={styles.textStyle}>Update</Text>
										</TouchableHighlight>
									</View>
								</View>
							</View>
						</View>
					</Modal>
				)}
				<Text style={[styles.subtitle, styles.subtitle_bg]}>
					Manage Profile
				</Text>
				{/* <Text style={styles.subtitle_lightbg}>
					IC number, full name and residential address are not editable as it
					has been verified
				</Text> */}
				<Text />
				{user_info == null ? (
					<ActivityIndicator />
				) : (
					<ScrollView style={styles.user_info_outer}>
						<View
							style={{
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<Text
								style={{
									...styles.user_info_subtitle,
									flex: 0.5,
								}}
							>
								Premise Name
							</Text>
							<TouchableHighlight
								style={{
									...styles.edit_btn,
									flex: 0.15,
									backgroundColor: "#3cb371",
								}}
								onPress={() => {
									this.setState({ edit_field: "p_name" });
									this.setModalVisible(true);
								}}
							>
								<Image
									source={require("../../assets/edit_icon.png")}
									style={{ height: 15, width: 15 }}
								/>
							</TouchableHighlight>
						</View>
						<Text style={styles.user_info}>{user_info.premise_name}</Text>
						<Text />

						<View
							style={{
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<Text
								style={{
									...styles.user_info_subtitle,
									flex: 0.4,
								}}
							>
								Owner's Name
							</Text>
							<TouchableHighlight
								style={{
									...styles.edit_btn,
									flex: 0.15,
									backgroundColor: "#3cb371",
								}}
								onPress={() => {
									this.setState({ edit_field: "o_name" });
									this.setModalVisible(true);
								}}
							>
								<Image
									source={require("../../assets/edit_icon.png")}
									style={{ height: 15, width: 15 }}
								/>
							</TouchableHighlight>
						</View>
						<Text style={styles.user_info}>{user_info.owner_fname}</Text>
						<Text />

						<View
							style={{
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<Text
								style={{
									...styles.user_info_subtitle,
									flex: 0.6,
								}}
							>
								Premise Full Address
							</Text>
							<TouchableHighlight
								style={{
									...styles.edit_btn,
									flex: 0.15,
									backgroundColor: "#3cb371",
								}}
								onPress={() => {
									this.setState({ edit_field: "p_address" });
									this.setModalVisible(true);
								}}
							>
								<Image
									source={require("../../assets/edit_icon.png")}
									style={{ height: 15, width: 15 }}
								/>
							</TouchableHighlight>
						</View>
						<Text style={styles.user_info}>
							{user_info.premise_address +
								", " +
								user_info.premise_postcode +
								" " +
								user_info.premise_state}
						</Text>
						<Text />

						<View
							style={{
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<Text
								style={{
									...styles.user_info_subtitle,
									flex: 0.35,
								}}
							>
								Phone No.
							</Text>
							<TouchableHighlight
								style={{
									...styles.edit_btn,
									flex: 0.15,
									backgroundColor: "#3cb371",
								}}
								onPress={() => {
									this.props.navigation.navigate("change_phone_no");
								}}
							>
								<Image
									source={require("../../assets/edit_icon.png")}
									style={{ height: 15, width: 15 }}
								/>
							</TouchableHighlight>
						</View>
						<Text style={styles.user_info}>{user_info.phone_no}</Text>
						<Text />

						<View
							style={{
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<Text style={{ ...styles.user_info_subtitle, flex: 0.2 }}>
								Email
							</Text>
							<TouchableHighlight
								style={{
									...styles.edit_btn,
									flex: 0.15,
									backgroundColor: "#3cb371",
								}}
								onPress={() => {
									this.props.navigation.navigate("change_email");
								}}
							>
								<Image
									source={require("../../assets/edit_icon.png")}
									style={{ height: 15, width: 15 }}
								/>
							</TouchableHighlight>
						</View>
						<Text style={styles.user_info}>{user_info.email}</Text>
						<Text />

						<Text style={styles.user_info_subtitle}>Password</Text>
						<TouchableHighlight
							style={{
								...styles.openButton,
								width: 200,
								backgroundColor: "#1e90ff",
							}}
							onPress={() => {
								this.props.navigation.navigate("change_password");
							}}
						>
							<Text style={styles.textStyle}>Change Password</Text>
						</TouchableHighlight>
						<Text />

						<View
							style={{
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<Text
								style={{
									...styles.user_info_subtitle,
									flex: 0.5,
								}}
							>
								Premise Location
							</Text>
							<TouchableHighlight
								style={{
									...styles.edit_btn,
									flex: 0.15,
									backgroundColor: "#3cb371",
								}}
								onPress={() => {
									this.props.navigation.navigate("change_premise_location");
								}}
							>
								<Image
									source={require("../../assets/edit_icon.png")}
									style={{ height: 15, width: 15 }}
								/>
							</TouchableHighlight>
						</View>
						<View style={styles.mapOuter}>
							<MapView
								style={styles.mapStyle}
								// customMapStyle={mapStyle}
								region={region}
								loadingEnabled={true}
								loadingIndicatorColor="#666666"
								loadingBackgroundColor="#eeeeee"
								moveOnMarkerPress={false}
								// showsUserLocation={true}
								showsCompass={true}
								showsPointsOfInterest={false}
								provider="google"
							>
								<Marker
									coordinate={{
										latitude: user_info.premise_lat,
										longitude: user_info.premise_lng,
									}}
									title="Your Premise Location"
									description={user_info.ic_address}
								>
									<Image
										source={require("../../assets/marker_icon.png")}
										style={{ height: 40, width: 40 }}
									/>
								</Marker>
							</MapView>
							<TouchableHighlight
								style={{
									...styles.openButton_refocus,
									backgroundColor: "#6c757d",
								}}
								onPress={() => {
									this.setState({ region: region });
								}}
							>
								<Image
									source={require("../../assets/refocus_icon.png")}
									style={{ height: 20, width: 20 }}
								/>
							</TouchableHighlight>
						</View>
						<Text />
						{/* <Text style={styles.subtitle}>Password</Text>
						<TextInput
							name="password"
							keyboardType="default"
							autoCompleteType="password"
							maxLength={20}
							secureTextEntry={true}
							// onChangeText={(value) => this.setState({ password: value })}
							onChangeText={(value) => this.onChangePassword(value)}
							value={this.state.password}
							style={styles.input}
						/>
						<Text />

						<Text style={styles.subtitle}>Confirm Password</Text>
						<TextInput
							name="cpassword"
							keyboardType="default"
							autoCompleteType="password"
							maxLength={20}
							secureTextEntry={true}
							onChangeText={(value) => this.setState({ cpassword: value })}
							value={this.state.cpassword}
							style={styles.input}
						/>
						<Text />
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<TouchableHighlight
								style={{ ...styles.openButton, backgroundColor: "#3cb371" }}
								onPress={() => {
									this.onSubmit();
								}}
							>
								<Text style={styles.textStyle}>Update</Text>
							</TouchableHighlight>
						</View>
						<Text /> */}
					</ScrollView>
				)}
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold",
	},
	flexRow1: {
		flex: 0.1,
		flexDirection: "row",
		marginTop: 30,
	},
	flexCol: {
		marginHorizontal: 10,
		width: 100,
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
	subtitle_lightbg: {
		fontSize: 14,
		textAlign: "center",
		marginTop: 10,
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: "#F2F2F2",
	},
	mapOuter: {
		position: "relative",
	},
	mapStyle: {
		width: "100%",
		height: 300,
		marginTop: 10,
		marginBottom: 20,
	},
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
	subtitle: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 10,
	},
	user_info_outer: {
		width: "100%",
		paddingHorizontal: "10%",
	},
	user_info_subtitle: {
		fontSize: 16,
		marginBottom: 5,
		fontWeight: "bold",
	},
	user_info: {
		fontSize: 16,
		color: "grey",
	},
	subtitle_bg: {
		marginVertical: 20,
		backgroundColor: "lightgrey",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontWeight: "bold",
	},
	input: {
		borderColor: "#c0cbd3",
		borderWidth: 2,
		width: 300,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		paddingVertical: 10,
		width: 120,
		elevation: 2,
	},
	openButton_1: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		padding: 10,
		elevation: 2,
	},
	edit_btn: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		paddingVertical: 10,
		width: 50,
		elevation: 2,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	openButton_refocus: {
		backgroundColor: "#F194FF",
		borderRadius: 5,
		paddingVertical: 10,
		width: 50,
		elevation: 2,
		position: "absolute",
		top: 15,
		left: 5,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
});
