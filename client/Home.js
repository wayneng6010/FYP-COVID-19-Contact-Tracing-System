import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';

import register from "./components/register";
import ic_capture from "./components/ic_capture";
import ic_extract from "./components/ic_extract";


const Home = createStackNavigator(
    {
        register: register,
        ic_capture: ic_capture,
        ic_extract: ic_extract,
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