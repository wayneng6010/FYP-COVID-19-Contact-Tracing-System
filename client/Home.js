import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';

import register from "./components/register";
import ic_capture from "./components/ic_capture";
import ic_extract from "./components/ic_extract";
import phoneNo_verify from "./components/phoneNo_verify";
import email_verify from "./components/email_verify";

const Home = createStackNavigator(
    {
        register: register,
        ic_capture: ic_capture,
        ic_extract: ic_extract,
        phoneNo_verify: phoneNo_verify,
        email_verify: email_verify,
    },
    {
        navigationOptions: {
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#000',
            },
        },
    }
);

const container = createAppContainer(Home);

export default container;