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

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.reg_content}>
					<Text style={[styles.subtitle, styles.subtitle_bg]}>
						Managing your IC data
					</Text>
					<ScrollView style={styles.scrollview}>
						<Text style={styles.title}>Data collected from identity card</Text>
						<Text style={styles.subtitle}>
							• Identity card (IC) number {"\n"}• Full name {"\n"}• Residential
							address (for dependent registration, address will be processed but not stored){"\n\n"}
							Face photo on the IC will be processed for verification but will
							not be stored.
						</Text>

						<Text style={styles.title}>Purpose of data collection</Text>
						<Text style={styles.subtitle}>
							The data is used if you are a COVID-19 patient or casual contact
							of COVID-19 patient. If you are a COVID-19 patient, the data
							collected will be used during searching of your casual contact to
							ensure the casual contact of correct person is being searched. If
							you are a casual contact, the data collected will be used to
							identify who you are and residential address will be used to
							locate your home location if the medical team is not able to reach
							you via email and phone call.
						</Text>

						<Text style={styles.title}>Where the data collected is stored</Text>
						<Text style={styles.subtitle}>
							The data collected is store in the database managed by Ministry of
							Health Malaysia.
						</Text>

						<Text style={styles.title}>Who can access the data collected</Text>
						<Text style={styles.subtitle}>
							The medical teams can access the data only if you are a COVID-19
							patient or casual contact. The medical teams do not have direct
							access to your personal information if you are not COVID-19
							patient or casual contact. Premise owner is not able to view your
							personal data as premise owner can only view a check in ID when
							you check in to the premise.
						</Text>

						<Text style={styles.title}>Who will be shared with the data</Text>
						<Text style={styles.subtitle}>
							The data collected will not be shared to any third parties.
						</Text>

						<Text style={styles.title}>Confidentiality of data</Text>
						<Text style={styles.subtitle}>
							The check in data will be deleted from the database after 90 days.
							The medical team will keep the data confidential.
						</Text>

						<Text/>
						<Text/>
					</ScrollView>
				</View>
			</SafeAreaView>

			// 	{/* {news.map((data) => {
			// 			return <Text>{data.url}</Text>;
			// 		})} */}
		);
	}
}

const styles = StyleSheet.create({
	scrollview: {
		width: 460,
		paddingLeft: 70,
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
		fontSize: 18,
		textAlign: "left",
		fontWeight: "bold",
		marginTop: 10,
		// marginBottom: 15,
		// backgroundColor: "#0f52ba",
		// color: "white",
		// borderRadius: 5,
		width: "80%",
		// paddingHorizontal: 15,
		// paddingVertical: 5,
	},
	subtitle: {
		fontSize: 16,
		marginVertical: 10,
		width: "80%",
		textAlign: "justify",
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
		fontSize: 20,
		textAlign: "center",
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
