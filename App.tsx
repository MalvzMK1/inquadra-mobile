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

  useEffect(() => {
    storage
      .load<{ latitude: number; longitude: number }>({
        key: "userGeolocation",
      })
      .then(console.log)
      .catch(error => {
        if (error instanceof Error) {
          if (error.name === "NotFoundError") {
            console.log("The item wasn't found.");
          } else if (error.name === "ExpiredError") {
            console.log("The item has expired.");
            storage
              .remove({
                key: "userGeolocation",
              })
              .then(() => {
                console.log("The item has been removed.");
              });
          } else {
            console.log("Unknown error:", error);
          }
        }
      });

    storage
      .load<UserInfos>({
        key: "userInfos",
      })
      .then(data => {
        console.log({ LOGGED_USER_ID: data.userId });
      })
      .catch(error => {
        if (error instanceof Error) {
          if (error.name === "NotFoundError") {
            console.log("The item wasn't found.");
          } else if (error.name === "ExpiredError") {
            console.log("The item has expired.");
            storage
              .remove({
                key: "userInfos",
              })
              .then(() => {
                console.log("The item has been removed.");
              });
          } else {
            console.log("Unknown error:", error);
          }
        }
      });
  }, []);

  useEffect(() => {
    client
      .resetStore()
      .then(() => console.log("Cache resetado com sucesso..."));
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
