import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import * as React from "react";
import {
  ColorSchemeName,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import {
  Octicons,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import ChatRoomScreen from "../screens/ChatRoomScreen";
import ContactsScreen from "../screens/ContactsScreen";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../types";
import MainTabNavigator from "./MainTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.tint,
          shadowOpacity: 0,
          elevation: 0,
        },
        headerTintColor: Colors.light.background,
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Root"
        component={MainTabNavigator}
        options={{
          title: "Whatsapp",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                width: 60,
                justifyContent: "space-between",
                marginRight: 10,
              }}
            >
              <Octicons name="search" size={22} color={"white"} />
              <MaterialCommunityIcons
                name="dots-vertical"
                size={22}
                color={"white"}
              />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ navigation, route }) => ({
          title: route.params.name,
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                width: 115,
                justifyContent: "space-between",
                marginRight: 10,
              }}
            >
              <FontAwesome5 name="video" size={20} color={"white"} />
              <MaterialIcons name="call" size={20} color={"white"} />
              <MaterialCommunityIcons
                name="dots-vertical"
                size={20}
                color={"white"}
              />
            </View>
          ),
          headerLeft: () => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                width: 70,
              }}
            >
              <TouchableOpacity
                onPress={navigation.goBack}
                style={{
                  // borderWidth: 1,
                  // borderColor: "#000",

                  paddingVertical: 10,
                }}
              >
                <MaterialIcons name="arrow-back" size={24} color={"white"} />
              </TouchableOpacity>
              <Image
                source={{ uri: route.params.imageUri }}
                style={{ width: 35, height: 35, borderRadius: 25, padding: 5 }}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
