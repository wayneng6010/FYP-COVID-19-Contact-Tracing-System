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
import ic_privacy_statement from "./components/VisitorRegistration/ic_privacy_statement";
import forgot_password from "./components/forgot_password";
import forgot_password_po from "./components/forgot_password_po";

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
import view_health_risk from "./components/VisitorApp/view_health_risk";
import manage_dependent from "./components/VisitorApp/manage_dependent";
import ic_capture_dependent from "./components/VisitorApp/ic_capture_dependent";
import ic_extract_dependent from "./components/VisitorApp/ic_extract_dependent";
import view_dependent_qrcode from "./components/VisitorApp/view_dependent_qrcode";
import view_check_in_history from "./components/VisitorApp/view_check_in_history";
import view_each_check_in_history from "./components/VisitorApp/view_each_check_in_history";
import home_risk_assessment from "./components/VisitorApp/home_risk_assessment";
import manage_profile from "./components/VisitorApp/manage_profile";
import change_phone_no from "./components/VisitorApp/change_phone_no";
import change_email from "./components/VisitorApp/change_email";
import change_password from "./components/VisitorApp/change_password";
import change_home_location from "./components/VisitorApp/change_home_location";
import ic_privacy_statement_in_app from "./components/VisitorApp/ic_privacy_statement";

// premise owner
import premiseOwner_home from "./components/PremiseOwnerApp/home";
import qrcode_view from "./components/PremiseOwnerApp/qrcode_view";
import qrcode_checkIn_dependent from "./components/PremiseOwnerApp/qrcode_checkIn_dependent";
import real_time_check_in_record from "./components/PremiseOwnerApp/real_time_check_in_record";
import visitor_analytics from "./components/PremiseOwnerApp/visitor_analytics";
import manage_profile_po from "./components/PremiseOwnerApp/manage_profile";
import change_phone_no_po from "./components/PremiseOwnerApp/change_phone_no";
import change_email_po from "./components/PremiseOwnerApp/change_email";
import change_password_po from "./components/PremiseOwnerApp/change_password";
import change_premise_location_po from "./components/PremiseOwnerApp/change_premise_location";

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
		ic_privacy_statement: {
			screen: ic_privacy_statement,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "How IC data is managed",
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
		forgot_password: {
			screen: forgot_password,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Forgot Password",
			},
		},
		forgot_password_po: {
			screen: forgot_password_po,
			navigationOptions: {
				headerTitleAlign: "center",
				headerTitle: "Forgot Password",
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
	view_health_risk: {
		screen: view_health_risk,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Health Risk Assessment",
		},
	},
	health_risk_assessment: {
		screen: health_risk_assessment,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Health Risk Assessment",
		},
	},
	manage_dependent: {
		screen: manage_dependent,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Manage Dependent",
		},
	},
	ic_capture_dependent: {
		screen: ic_capture_dependent,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Capture IC for Dependent",
		},
	},
	ic_extract_dependent: {
		screen: ic_extract_dependent,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Confirm Dependent Information",
		},
	},
	view_dependent_qrcode: {
		screen: view_dependent_qrcode,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "View Dependent QR Code",
		},
	},
	view_check_in_history: {
		screen: view_check_in_history,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "View Check In History",
		},
	},
	view_each_check_in_history: {
		screen: view_each_check_in_history,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "View Check In History",
		},
	},
	home_risk_assessment: {
		screen: home_risk_assessment,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Home Risk Assessment",
		},
	},
	manage_profile: {
		screen: manage_profile,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Manage Profile",
		},
	},
	change_phone_no: {
		screen: change_phone_no,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Update Phone Number",
		},
	},
	change_email: {
		screen: change_email,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Update Email Address",
		},
	},
	change_password: {
		screen: change_password,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Change Password",
		},
	},
	change_home_location: {
		screen: change_home_location,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Update Home Location",
		},
	},
	ic_privacy_statement_in_app: {
		screen: ic_privacy_statement_in_app,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "How IC data is managed",
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
	qrcode_checkIn_dependent: {
		screen: qrcode_checkIn_dependent,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Check In For Dependent",
		},
	},
	real_time_check_in_record: {
		screen: real_time_check_in_record,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Real Time Check In Record",
		},
	},
	visitor_analytics: {
		screen: visitor_analytics,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Visitor Analytics",
		},
	},
	manage_profile: {
		screen: manage_profile_po,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Manage Profile",
		},
	},
	change_phone_no: {
		screen: change_phone_no_po,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Update Phone Number",
		},
	},
	change_email: {
		screen: change_email_po,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Update Email Address",
		},
	},
	change_password: {
		screen: change_password_po,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Change Password",
		},
	},
	change_premise_location: {
		screen: change_premise_location_po,
		navigationOptions: {
			headerTitleAlign: "center",
			headerTitle: "Change Premise Location",
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
