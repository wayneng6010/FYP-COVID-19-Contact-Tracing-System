import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

// visitor registration
import welcome from "./components/welcome";
import login_visitor_phoneNo from "./components/login_visitor_phoneNo";
import register_visitor from "./components/VisitorRegistration/register_visitor";
import ic_capture from "./components/VisitorRegistration/ic_capture";
import ic_extract from "./components/VisitorRegistration/ic_extract";
import phoneNo_verify from "./components/VisitorRegistration/phoneNo_verify";
import email_verify from "./components/VisitorRegistration/email_verify";
import map_findHomeLocation from "./components/VisitorRegistration/map_findHomeLocation";
import password_create from "./components/VisitorRegistration/password_create";
import verify_rememberMe from "./components/verify_rememberMe";

// premise owner registration
import phoneNo_verify_po from "./components/PremiseOwnerRegistration/phoneNo_verify";
import email_verify_po from "./components/PremiseOwnerRegistration/email_verify";
import premise_info_po from "./components/PremiseOwnerRegistration/premise_info";
import map_findPremiseLocation_po from "./components/PremiseOwnerRegistration/map_findPremiseLocation";
import password_create_po from "./components/PremiseOwnerRegistration/password_create";
import login_premiseOwner from "./components/login_premiseOwner";

// visitor
import visitor_home from "./components/VisitorApp/home";
import qrcode_checkIn from "./components/VisitorApp/qrcode_checkIn";
import health_risk_assessment from "./components/VisitorApp/health_risk_assessment";

// premise owner
import premiseOwner_home from "./components/PremiseOwnerApp/home";
import qrcode_view from "./components/PremiseOwnerApp/qrcode_view";

const AuthLoadingScreen = createStackNavigator({
	verify_rememberMe: {
		screen: verify_rememberMe,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Please Wait",
		},
	},
});

const AuthStack = createStackNavigator(
	{
		welcome: {
			screen: welcome,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Welcome",
			},
		},
		login_visitor_phoneNo: {
			screen: login_visitor_phoneNo,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Visitor Login",
			},
		},
		register_visitor: {
			screen: register_visitor,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Visitor Registration",
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
				headerTitle: "Find Home Location",
			},
		},
		password_create: {
			screen: password_create,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Create Password",
			},
		},
		phoneNo_verify_po: {
			screen: phoneNo_verify_po,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Verify Phone Number",
			},
		},
		email_verify_po: {
			screen: email_verify_po,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Verify Email",
			},
		},
		premise_info_po: {
			screen: premise_info_po,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Fill in Premise Profile",
			},
		},
		map_findPremiseLocation_po: {
			screen: map_findPremiseLocation_po,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Find Premise Location",
			},
		},
		password_create_po: {
			screen: password_create_po,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Create Password",
			},
		},
		login_premiseOwner: {
			screen: login_premiseOwner,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Premise Owner Login",
			},
		},
	},
	// Premise owner registration page
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
	health_risk_assessment: {
		screen: health_risk_assessment,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Health Risk Assessment",
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
