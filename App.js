import * as React from 'react';
import {Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {
  TestScreen,
  InstructionScreen,
  RehabilitionScreen,
  TestProcessScreen,
  LoginScreen,
  NotificationsScreen,
  CustomHeader,
  CustomDrawerContent,
} from './src/export';

import {IMAGE} from './src/constans/Image';

import {Provider} from 'mobx-react';
import AppStore from './src/store';

const store = (window.store = new AppStore());

const Tab = createBottomTabNavigator();

const navOptionHandler = () => ({
  headerShown: false,
});

const StackTest = createStackNavigator();

function TestStack() {
  return (
    <StackTest.Navigator initialRouteName="TestScreen">
      <StackTest.Screen
        name="Test"
        component={TestScreen}
        options={navOptionHandler}
      />
      <StackTest.Screen
        name="Description"
        component={InstructionScreen}
        options={navOptionHandler}
      />
      <StackTest.Screen
        name="TestProcess"
        component={TestProcessScreen}
        options={navOptionHandler}
      />
    </StackTest.Navigator>
  );
}
const StackRehabPlan = createStackNavigator();

function RehabPlanStack() {
  return (
    <StackRehabPlan.Navigator initialRouteName="RehabPlanScreen">
      <StackRehabPlan.Screen
        name="RehabPlan"
        component={RehabilitionScreen}
        options={navOptionHandler}
      />
    </StackRehabPlan.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Test') {
            iconName = focused ? IMAGE.ICON_TEST_PRESS : IMAGE.ICON_TEST;
          } else if (route.name === 'Rehab Plan') {
            iconName = focused ? IMAGE.ICON_RP_PRESS : IMAGE.ICON_RP;
          }

          // You can return any component that you like here!
          return (
            <Image
              source={iconName}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'black',
      }}>
      <Tab.Screen name="Test" component={TestStack} />
      <Tab.Screen name="Rehab Plan" component={RehabPlanStack} />
    </Tab.Navigator>
  );
}
const Drawer = createDrawerNavigator();

function DrawerNavigator({navigation}) {
  return (
    <Drawer.Navigator
      initialRouteName="MenuTab"
      drawerContent={() => <CustomDrawerContent navigation={navigation} />}>
      <Drawer.Screen name="MenuTab" component={TabNavigator} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
}

const StackApp = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackApp.Navigator initialRouteName="Login">
          <StackApp.Screen
            name="HomeApp"
            component={DrawerNavigator}
            options={navOptionHandler}
          />
          <StackApp.Screen
            name="Login"
            component={LoginScreen}
            options={navOptionHandler}
          />
        </StackApp.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
