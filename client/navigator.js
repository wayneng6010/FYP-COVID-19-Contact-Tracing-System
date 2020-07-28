import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import welcome from "./components/welcome";
import register from "./components/register";
import ic_capture from "./components/ic_capture";
import ic_extract from "./components/ic_extract";
import phoneNo_verify from "./components/phoneNo_verify";
import email_verify from "./components/email_verify";
import map_findHomeLocation from "./components/map_findHomeLocation";
import home from "./components/home";
import verify_login from "./components/verify_login";

const AuthLoadingScreen = createStackNavigator({ verify_login: verify_login });

const AuthStack = createStackNavigator(
	{
		welcome: {
			screen: welcome,
			navigationOptions: {
				headerTitleAlign: 'center',
				headerTitle: "Welcome",
			},
		},
		register: {
			screen: register,
			navigationOptions: {
				headerTitleAlign: 'center',
				headerTitle: "Registration",
			},
		},
		ic_capture: {
			screen: ic_capture,
			navigationOptions: {
				headerTitleAlign: 'center',
				headerTitle: "Capture IC",
			},
		},
		ic_extract: {
			screen: ic_extract,
			navigationOptions: {
				headerTitleAlign: 'center',
				headerTitle: "Confirm Your Information",
			},
		},
		phoneNo_verify: {
			screen: phoneNo_verify,
			navigationOptions: {
				headerTitleAlign: 'center',
				headerTitle: "Verify Phone Number",
			},
		},
		email_verify: {
			screen: email_verify,
			navigationOptions: {
				headerTitleAlign: 'center',
				headerTitle: "Verify Email",
			},
		},
		map_findHomeLocation: {
			screen: map_findHomeLocation,
			navigationOptions: {
				headerTitleAlign: 'center',
				headerTitle: "Verify Home Location",
			},
		},
		// welcome: welcome,
		// register: register,
		// ic_capture: ic_capture,
		// ic_extract: ic_extract,
		// phoneNo_verify: phoneNo_verify,
		// email_verify: email_verify,
		// map_findHomeLocation: map_findHomeLocation,
	},
	{
		navigationOptions: {
			headerTintColor: "blue",
			headerStyle: {
				backgroundColor: "blue",
			},
			headerTitle: "Registration",
		},
	}
);

const AppStack = createStackNavigator({ home: home });

// const container = createAppContainer(Home);

const container = createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: AuthLoadingScreen,
			Auth: AuthStack,
			App: AppStack,
		},
		{
			initialRouteName: "AuthLoading",
		}
	)
);

export default container;
