import { StyleSheet, Text, View } from 'react-native';
import React, {  useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Home,Restaurant, OrderDelivery } from './screens';
import  Tabs  from './navigation/Tabs';
import * as SplashScreen from 'expo-splash-screen';
import {useFonts} from "expo-font";

const Stack = createStackNavigator();

export default function App() {
  
  const [fontsLoaded] = useFonts({
    "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
    "Roboto-BlackItalic": require("./assets/fonts/Roboto-BlackItalic.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-BoldItalic": require("./assets/fonts/Roboto-BoldItalic.ttf"),
    "Roboto-Italic": require("./assets/fonts/Roboto-Italic.ttf"),
    "Roboto-Light": require("./assets/fonts/Roboto-Light.ttf"),
    "Roboto-LightItalic": require("./assets/fonts/Roboto-LightItalic.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-MediumItalic": require("./assets/fonts/Roboto-MediumItalic.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Thin": require("./assets/fonts/Roboto-Thin.ttf"),
    "Roboto-ThinItalic": require("./assets/fonts/Roboto-ThinItalic.ttf"),
  });
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  }else{
    SplashScreen.hideAsync();
  }

  return (
    <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'Tabs'}

        >
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="Restaurant" component={Restaurant} />
          <Stack.Screen name="OrderDelivery" component={OrderDelivery} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
