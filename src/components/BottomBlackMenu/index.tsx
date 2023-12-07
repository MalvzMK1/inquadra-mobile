import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import {useUser} from "../../context/userContext";

interface IBottomBlackMenu {
  screen: string;
  userPhoto: string | null;
  isDisabled: boolean;
  paddingTop: number;
  onMiddleButtonPress?: () => void;
}

export default function BottomBlackMenu(props: IBottomBlackMenu) {
  const {userData} = useUser();

  const { screen, userPhoto, paddingTop } = props;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userGeolocation, setUserGeolocation] = useState<{
    latitude: number;
    longitude: number;
  } | undefined>(userData?.geolocation ?? undefined);
  const [userIdStorage, setUserIdStorage] = useState<string | undefined>();
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
    if (screen === "Home") setShowButtons(true);
  }, [screen]);

  return (
    <View className="absolute bottom-0 left-0 right-0">
      <View
        className={`items-center bg-transparent w-full pt-${paddingTop} pb-1`}
      >
        {showButtons && (
          <View className="bg-black h-[75px] w-2/3 rounded-[20px] items-center justify-around flex flex-row">
            {screen === "Home"
              ? showButtons && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          userData &&
                          userData.id
                        ) {
                          navigation.navigate('FavoriteEstablishments', {
                            userID: userData.id,
                            userPhoto: userPhoto ?? undefined,
                          })
                        } else {
                          navigation.navigate('Login');
                        }
                      }
                    }
                    >
                      <AntDesign name="heart" size={25} color={"white"} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={props.onMiddleButtonPress}>
                      <Image
                        source={require("../../assets/logo_inquadra_colored.png")}
                      ></Image>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        if (
                          userData &&
                          userData.id
                        ) {
                          navigation.navigate('InfoReserva', {
                            userId: userData.id
                          })
                        } else {
                          navigation.navigate('Login');
                        }
                      }
                    }
                    >
                      <MaterialIcons
                        name="calendar-today"
                        color={"white"}
                        size={26}
                      />
                    </TouchableOpacity>
                  </>
                )
              : screen === "Favorite"
              ? showButtons && (
                  <>
                    <TouchableOpacity>
                      <AntDesign name="heart" size={35} color={"red"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (props.onMiddleButtonPress) {
                          props.onMiddleButtonPress();
                        } else if (
                          userData &&
                          userData.id
                        ) {
                          navigation.navigate("Home", {
                            userGeolocation: userData.geolocation, // TODO: IMPLEMENTAR VALIDAÇÃO DE GEOLOCALIZAÇÃO INDEFINIDA
                            userID: userData.id,
                            userPhoto: userPhoto ?? "",
                          });

                        } else {
                          navigation.navigate('Login');
                        }
                      }}
                    >
                      <Image
                        source={require("../../assets/logo_inquadra_colored.png")}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        if (
                          userData &&
                          userData.id
                        ) {
                          navigation.navigate('InfoReserva', {
                            userId: userData.id
                          });
                        } else {
                          navigation.navigate('Login');
                        }
                      }}
                    >
                      <MaterialIcons
                        name="calendar-today"
                        color={"white"}
                        size={26}
                      />
                    </TouchableOpacity>
                  </>
                )
              : screen === "Historic"
              ? showButtons && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          userData &&
                          userData.id
                        ) {
                          navigation.navigate("FavoriteEstablishments", {
                            userPhoto: userPhoto ?? "",
                            userID: userData.id,
                          });
                        } else {
                          navigation.navigate('Login');
                        }
                      }}
                    >
                      <AntDesign name="heart" size={25} color={"white"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (props.onMiddleButtonPress) {
                          props.onMiddleButtonPress();
                        } else if (
                          userData &&
                          userData.id
                        )
                          navigation.navigate("Home", {
                            userGeolocation: userData.geolocation, // TODO: IMPLEMENTAR VALIDAÇÃO DE GEOLOCALIZAÇÃO INDEFINIDA
                            userID: userData.id,
                            userPhoto: userPhoto ?? "",
                          });
                        else
                          navigation.navigate('Login');
                      }}
                    >
                      <Image
                        source={require("../../assets/logo_inquadra_colored.png")}
                      ></Image>
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <MaterialIcons
                        name="calendar-today"
                        color="#F5620F"
                        size={33}
                      />
                    </TouchableOpacity>
                  </>
                )
              : screen === "EstablishmentInfo"
              ? showButtons && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          userData &&
                          userData.id
                        ) {
                          navigation.navigate('FavoriteEstablishments', {
                            userPhoto: userPhoto ?? "",
                            userID: userData.id,
                          });
                        } else
                          navigation.navigate('Login');
                      }}
                    >
                      <AntDesign name="heart" size={25} color={"white"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (props.onMiddleButtonPress) {
                          props.onMiddleButtonPress();
                        } else if (
                          userData &&
                          userData.id
                        ) {
                          navigation.navigate("Home", {
                            userGeolocation: userData.geolocation, // TODO: IMPLEMENTAR VALIDAÇÃO DE GEOLOCALIZAÇÃO INDEFINIDA
                            userID: userData.id,
                            userPhoto: userPhoto ?? "",
                          });
                        }
                        else {
                          navigation.navigate('Login');
                        }
                      }}
                    >
                      <Image
                        source={require("../../assets/logo_inquadra_colored.png")}
                      ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          userData &&
                          userData.id
                        ) {
                          navigation.navigate('InfoReserva', {
                            userId: userData.id
                          })
                        } else
                          navigation.navigate('Login');
                      }}
                    >
                      <MaterialIcons
                        name="calendar-today"
                        color={"white"}
                        size={26}
                      />
                    </TouchableOpacity>
                  </>
                )
              : showButtons && (
                  <>
                    <TouchableOpacity>
                      <AntDesign name="heart" size={25} color={"white"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (props.onMiddleButtonPress) {
                          props.onMiddleButtonPress();
                        } else if (
                          userData &&
                          userData.id
                        ) {
                          navigation.navigate("Home", {
                            userGeolocation: userData.geolocation, // TODO: IMPLEMENTAR VALIDAÇÃO DE GEOLOCALIZAÇÃO INDEFINIDA
                            userID: userData.id,
                            userPhoto: userPhoto ?? "",
                          });
                        }
                        else {
                          navigation.navigate('Login');
                        }
                      }}
                    >
                      <Image
                        source={require("../../assets/logo_inquadra_colored.png")}
                      ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          userData &&
                          userData.id
                        ) {
                          navigation.navigate('InfoReserva', {
                            userId: userData.id
                          })
                        } else
                          navigation.navigate('Login');
                      }}
                    >
                      <MaterialIcons
                        name="calendar-today"
                        color={"white"}
                        size={26}
                      />
                    </TouchableOpacity>
                  </>
                )}
          </View>
        )}
      </View>
    </View>
  );
}
