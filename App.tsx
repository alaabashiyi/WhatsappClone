import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import { withAuthenticator } from "aws-amplify-react-native";
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";

import { getUser } from "./graphql/queries";
import { createUser } from "./graphql/mutations";

import config from "./aws-exports";
Amplify.configure(config);

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const randomImages = [
    "https://randomuser.me/api/portraits/women/39.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/women/50.jpg",
    "https://randomuser.me/api/portraits/women/34.jpg",
    "https://randomuser.me/api/portraits/women/47.jpg",
  ];

  const getRandomImage = () => {
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  };

  //Run only when App is first mounted
  useEffect(() => {
    const fetchUser = async () => {
      //get Authenticated User from Auth
      const userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });

      if (userInfo) {
        // get the user from backend using the user SUB from Auth
        const userData = await API.graphql(
          graphqlOperation(getUser, { id: userInfo.attributes.sub })
        );

        if (userData.data.getUser) {
          console.log("User is already registered in Database");
          return;
        }
        // no user with the id / create one
        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          imageUr: getRandomImage(),
          status: "Hey, I am using WhatsApp",
        };

        await API.graphql(
          graphqlOperation(createUser, {
            input: newUser,
          })
        );
      }
    };

    fetchUser();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);
