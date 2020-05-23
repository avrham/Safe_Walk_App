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
  LoginScreen,
  NotificationsScreen,
  CustomHeader,
  CustomDrawerContent,
  VideoDetailesScreen,
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
      <StackRehabPlan.Screen
        name="VideoDetailes"
        component={VideoDetailesScreen}
        options={navOptionHandler}
      />
    </StackRehabPlan.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Test" component={TestStack} />
      <Tab.Screen name="RehabPlan" component={RehabPlanStack} />
    </Tab.Navigator>
  );
}
const Drawer = createDrawerNavigator();

function DrawerNavigator({navigation}) {
  return (
    <Drawer.Navigator
      initialRouteName="MenuTab"
      drawerContent={() => <CustomDrawerContent navigation={navigation} />}>
      <Drawer.Screen name="MenuTab" component={TestStack} />
      <Drawer.Screen name="RehabPlan" component={RehabPlanStack} />
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
