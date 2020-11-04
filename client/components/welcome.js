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

export default class welcome extends React.Component {
	// set an initial state
	//const [news, setNews] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.132:5000/getArtistRelatedNews?artist_name=sam
	// useEffect(() => {}, []);

	// const captureIC = () => {};
	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.title}>Welcome!</Text>
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
				<View style={styles.flexRow}>
					<View style={styles.flexCol}>
						<Button
							title="Login"
							onPress={() => this.props.navigation.navigate("login_visitor_phoneNo")}
						></Button>
					</View>
					<View style={styles.flexCol}>
						<Button
							title="Register"
							onPress={() => this.props.navigation.navigate("register_visitor")}
						></Button>
					</View>
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
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 20,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		marginVertical: 20,
	},
	flexRow: {
		flex: 0.1,
		flexDirection: "row",
	},
	flexCol: {
		marginHorizontal: 10,
		width: 150,
		height: 40,
	},
});
