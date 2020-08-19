import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

// visitor registration
import welcome from "./components/welcome";
import register from "./components/register";
import ic_capture from "./components/ic_capture";
import ic_extract from "./components/ic_extract";
import phoneNo_verify from "./components/phoneNo_verify";
import email_verify from "./components/email_verify";
import map_findHomeLocation from "./components/map_findHomeLocation";
import password_create from "./components/password_create";
import verify_rememberMe from "./components/verify_rememberMe";

// visitor
import visitor_home from "./components/VisitorApp/home";
import qrcode_checkIn from "./components/VisitorApp/qrcode_checkIn";

// premise owner
import premiseOwner_home from "./components/PremiseOwnerApp/home";
import qrcode_view from "./components/PremiseOwnerApp/qrcode_view";

const AuthLoadingScreen = createStackNavigator({ verify_rememberMe: verify_rememberMe });

const AuthStack = createStackNavigator(
	{
		welcome: {
			screen: welcome,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Welcome",
			},
		},
		register: {
			screen: register,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Registration",
			},
		},
		ic_capture: {
			screen: ic_capture,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Capture IC",
			},
		},
		ic_extract: {
			screen: ic_extract,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Confirm Your Information",
			},
		},
		phoneNo_verify: {
			screen: phoneNo_verify,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Verify Phone Number",
			},
		},
		email_verify: {
			screen: email_verify,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Verify Email",
			},
		},
		map_findHomeLocation: {
			screen: map_findHomeLocation,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Verify Home Location",
			},
		},
		password_create: {
			screen: password_create,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Create Password",
			},
		},
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

const AppStackVisitor = createStackNavigator({
	visitor_home: {
		screen: visitor_home,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Visitor Home",
		},
	},
	qrcode_checkIn: {
		screen: qrcode_checkIn,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Check In",
		},
	},
});
const AppStackPremiseOwner = createStackNavigator({
	premiseOwner_home: {
		screen: premiseOwner_home,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Premise Owner Home",
		},
	},
	qrcode_view: {
		screen: qrcode_view,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "View QR code",
		},
	},
});

const container = createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: AuthLoadingScreen,
			Auth: AuthStack,
			AppVisitor: AppStackVisitor,
			AppPremiseOwner: AppStackPremiseOwner,
		},
		{
			initialRouteName: "AuthLoading",
		}
	)
);

export default container;
