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
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import register from "./components/register";
import capture_ic from "./components/ic_capture";
import Home from "./Home";

// const RootStack = createStackNavigator(
// 	{
// 		register: register,
// 		capture_ic: capture_ic,
// 	},
// 	{
// 		navigationOptions: {
// 			headerTintColor: "#fff",
// 			headerStyle: {
// 				backgroundColor: "#000",
// 			},
// 		},
// 	}
// );

// const Stack = createStackNavigator();

// function MyStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="register" component="./components/register" />
//       <Stack.Screen name="capture_ic" component="./components/capture_ic" />
//     </Stack.Navigator>
//   );
// }

// import { createStackNavigator } from '@react-navigation/stack';

// const RootStack = createStackNavigator({
// 	register: register,
// 	capture_ic: capture_ic,
// });

// const Stack = createStackNavigator();

// function MyStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="register" component={register} />
//       <Stack.Screen name="capture_ic" component={capture_ic} />
//     </Stack.Navigator>
//   );
// }

export default function App() {
	// set an initial state
	const [news, setNews] = useState([]);
	const [hasPermission, setHasPermission] = useState(null);

	// Similar to componentDidMount and componentDidUpdate:http://192.168.0.131:5000/getArtistRelatedNews?artist_name=sam
	useEffect(() => {
		// fetch("http://192.168.0.131:5000/register", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		user: {
		// 			name: "wowwayne",
		// 			email: "email.com",
		// 			psw: "12341111",
		// 		},
		// 	}),
		// })
		// 	.then((res) => {
		// 		console.log(JSON.stringify(res.headers));
		// 		return res.json();
		// 	})
		// 	.then((jsonData) => {
		// 		console.log(jsonData);
		// 		alert("Register successful");
		// 	})
		// 	.catch((error) => {
		// 		alert(error);
		// 	});
		// get related news
		// const query_related_news = `http://192.168.0.131:5000/getArtistRelatedNews?artist_name=jj lin`;
		// console.log(query_related_news);
		// axios
		// 	.get(query_related_news)
		// 	.then((result) => {
		// 		console.log(result);
		// 		setNews(result.data.articles); // store response data in related_news state
		// 	})
		// 	.catch((error) => {
		// 		alert("Error: ", error);
		// 	});
		// ----
		// (async () => {
		// 	const { status } = await Permissions.askAsync(Permissions.CAMERA);
		// 	setHasPermission(status === "granted");
		// })();
		// if (hasPermission === false) {
		// 	alert("No access to camera");
		// }
	}, []);

	const captureIC = () => {
		// alert("Button tapped!");
		// (async () => {
		// 	const { status } = await Permissions.askAsync(Permissions.CAMERA);
		// 	setHasPermission(status === "granted");
		// })();
		// if (hasPermission === null) {
		// 	return <View />;
		// }
		// if (hasPermission === false) {
		// 	return <Text>No access to camera</Text>;
		// }
		// return (
		// 	<View style={{ flex: 1 }}>
		// 		<Camera style={{ flex: 1 }} type={Camera.Constants.Type.back}>
		// 			<View
		// 				style={{
		// 					flex: 1,
		// 					backgroundColor: "transparent",
		// 					flexDirection: "row",
		// 				}}
		// 			>
		// 			</View>
		// 		</Camera>
		// 	</View>
		// );
	};

	return (
		<Home/>
		// <SafeAreaView style={styles.container}>
		// 	<Button
		// 		title="Register"
		// 		onPress={() => this.props.navigation.navigate('register')}
		// 	/>
		// </SafeAreaView>

		// <SafeAreaView style={styles.container}>
		// 	<Text>Hello World !</Text>
		// 	<Button title="Capture IC" onPress={captureIC}></Button>
		// 	{/* {news.map((data) => {
		// 			return <Text>{data.url}</Text>;
		// 		})} */}
		// </SafeAreaView>

		// -----
		// <View style={{ flex: 1 }}>
		// 	<Camera
		// 		style={{ flex: 1 }}
		// 		type={Camera.Constants.Type.back}
		// 		ratio={'16:9'}
		// 	>
		// 		<View
		// 			style={{
		// 				flex: 1,
		// 				backgroundColor: "transparent",
		// 				flexDirection: "row",
		// 			}}
		// 		></View>
		// 	</Camera>
		// </View>
	);
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
