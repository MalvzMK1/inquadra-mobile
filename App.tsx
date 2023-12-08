import { ApolloProvider } from "@apollo/client";
import * as Location from "expo-location";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";
import { client } from "./src/lib/apolloClient";
import Routes from "./src/routes";
import {UserProvider} from "./src/context/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  useEffect(() => {
    async function getUserGeolocation(): Promise<void> {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const { coords: {latitude, longitude} } = await Location.getCurrentPositionAsync();

        await AsyncStorage.setItem(
          '@inquadra/user_geolocation',
          JSON.stringify({latitude, longitude}),
        )
      }
    }

    getUserGeolocation();
  }, []);

  useEffect(() => {
    client
      .resetStore()
      .then(() => console.log("Cache resetado com sucesso..."));
  }, []);

  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <PaperProvider>
          <StatusBar
            translucent
            backgroundColor="#292929"
            barStyle="light-content"
          />
          <Routes />
        </PaperProvider>
      </UserProvider>
    </ApolloProvider>
  );
}
