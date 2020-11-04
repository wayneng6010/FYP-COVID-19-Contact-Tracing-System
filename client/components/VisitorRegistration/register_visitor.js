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
} from "react-native";

export default class register extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.132:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.flexRow}>
					<View style={styles.flexCol_1}>
						<Text style={styles.title_reg}>Register as Premise Owner?</Text>
					</View>
					<View style={styles.flexCol_2}>
						<Text
							style={{
								color: "blue",
								textDecorationLine: "underline",
							}}
							onPress={
								() => this.props.navigation.navigate("phoneNo_verify_po")
								// this.props.navigation.navigate("password_create_po")
							}
						>
							Register here
						</Text>
					</View>
				</View>

				{/* <View
					style={{
						borderWidth: 0.5,
						width: "100%",
						borderColor: "black",
						margin: 5,
					}}
				/> */}

				{/* <Button
					title="Capture IC"
					onPress={() =>
						this.props.navigation.navigate("ic_capture", { name: "test" })
					}
				></Button>
				<Button
					title="Verify phone number"
					onPress={() => this.props.navigation.navigate("phoneNo_verify")}
				></Button>
				<Button
					title="Verify email"
					onPress={() => this.props.navigation.navigate("email_verify")}
				></Button>
				<Button
					title="Map Find Home"
					onPress={() => this.props.navigation.navigate("map_findHomeLocation")}
				></Button> */}
				<View style={styles.reg_content}>
					<Text style={styles.title}>Register as Visitor</Text>
					<Text style={[styles.subtitle, styles.subtitle_bg]}>
						Step 1/5: Verify Yourself
					</Text>
					<Text style={styles.subtitle}>
						We need you to capture your original Malaysian identity card to
						verify your personal information
					</Text>
					<Text style={styles.subtitle}>
						Personal information collected include:
					</Text>
					<Text style={{ fontSize: 16 }}>- IC number</Text>
					<Text style={{ fontSize: 16 }}>- Full name</Text>
					<Text style={{ fontSize: 16 }}>- Residential Address</Text>
					<Text></Text>
					<Button
						title="Capture IC"
						onPress={() => this.props.navigation.navigate("ic_capture")}
						// onPress={() => this.props.navigation.navigate("phoneNo_verify")}
					></Button>

					<Text
						style={[styles.subtitle, styles.subtitle_1]}
						onPress={() => this.props.navigation.navigate("ic_privacy_statement")}
					>
						How do we manage your IC data?
					</Text>
				</View>
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
		backgroundColor: "#f5f5f5",
		alignItems: "center",
		// justifyContent: "center",
		// marginHorizontal: 20,
	},
	reg_content: {
		backgroundColor: "white",
		borderRadius: 5,
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
		marginVertical: 10,
	},
	subtitle_1: {
		color: "blue",
		textDecorationLine: "underline",
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
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
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
});
