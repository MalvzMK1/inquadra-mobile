import { ApolloProvider } from "@apollo/client";
import * as Location from "expo-location";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";
import { client } from "./src/lib/apolloClient";
import Routes from "./src/routes";
import storage from "./src/utils/storage";

export default function App() {
  useEffect(() => {
    async function getUserGeolocation(): Promise<void> {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const { coords } = await Location.getCurrentPositionAsync();
        storage.save({
          key: "userGeolocation",
          data: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        });
      }
    }

    getUserGeolocation();
  }, []);

  return (
    <ApolloProvider client={client}>
      <PaperProvider>
        {/*<ComponentProvider>*/}
        <StatusBar
          translucent
          backgroundColor="#292929"
          barStyle="light-content"
        />
        <Routes />
        {/*</ComponentProvider>*/}
      </PaperProvider>
    </ApolloProvider>
  );
}
