import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import storage from "../../utils/storage";

interface IBottomBlackMenu {
  screen: string;
  userID: string | undefined;
  userPhoto: string | null;
  isDisabled: boolean;
  paddingTop: number;
}

export default function BottomBlackMenu(props: IBottomBlackMenu) {
  const { screen, userID, userPhoto, isDisabled, paddingTop } = props;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userGeolocation, setUserGeolocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [showPrincipalButton, setPrincipalButton] = useState(true);
  const [showButtons, setShowButtons] = useState(true);
  const [statusClickHome, setStatusClickHome] = useState(false);
  const opacityValue = useSharedValue(0);
  const buttonsContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacityValue.value, { duration: 300 }), // Duração da animação (300ms)
    };
  });

  storage
    .load<{ latitude: number; longitude: number }>({
      key: "userGeolocation",
    })
    .then(data => setUserGeolocation(data));

  useEffect(() => {
    if (screen === "Home") setShowButtons(true);
  }, []);

  return (
    <View className={`absolute bottom-0 left-0 right-0`}>
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
                        if (userID === "" || userID === "0" || !userID) {
                          navigation.navigate("Login");
                        } else {
                          navigation.navigate("FavoriteEstablishments", {
                            userPhoto: userPhoto ?? "",
                            userID: userID,
                          });
                        }
                      }}
                    >
                      <AntDesign name="heart" size={25} color={"white"} />
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <Image
                        source={require("../../assets/logo_inquadra_colored.png")}
                      ></Image>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        if (userID === "" || userID === "0" || !userID) {
                          navigation.navigate("Login");
                        } else {
                          navigation.navigate("InfoReserva", {
                            userId: userID,
                          });
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
              : screen === "Favorite"
              ? showButtons && (
                  <>
                    <TouchableOpacity>
                      <AntDesign name="heart" size={35} color={"red"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (userID === "" || userID === "0" || !userID) {
                          navigation.navigate("Login");
                        } else {
                          navigation.navigate("Home", {
                            userGeolocation: userGeolocation
                              ? userGeolocation
                              : {
                                  latitude: 78.23570781291714,
                                  longitude: 15.491400000982967,
                                },
                            userID: userID,
                            userPhoto: userPhoto ?? "",
                          });
                        }
                      }}
                    >
                      <Image
                        source={require("../../assets/logo_inquadra_colored.png")}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        if (userID === "" || userID === "0" || !userID) {
                          navigation.navigate("Login");
                        } else {
                          navigation.navigate("InfoReserva", {
                            userId: userID,
                          });
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
                        if (userID === "" || userID === "0" || !userID) {
                          navigation.navigate("Login");
                        } else {
                          navigation.navigate("FavoriteEstablishments", {
                            userPhoto: userPhoto ?? "",
                            userID: userID,
                          });
                        }
                      }}
                    >
                      <AntDesign name="heart" size={25} color={"white"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (userID === "" || userID === "0" || !userID) {
                          navigation.navigate("Login");
                        } else {
                          navigation.navigate("Home", {
                            userGeolocation: userGeolocation
                              ? userGeolocation
                              : {
                                  latitude: 78.23570781291714,
                                  longitude: 15.491400000982967,
                                },
                            userID: userID,
                            userPhoto: userPhoto ?? "",
                          });
                        }
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
                        if (userID === "" || userID === "0" || !userID) {
                          navigation.navigate("Login");
                        } else {
                          navigation.navigate("FavoriteEstablishments", {
                            userPhoto: userPhoto ? userPhoto : undefined,
                            userID: userID,
                          });
                        }
                      }}
                    >
                      <AntDesign name="heart" size={25} color={"white"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (userID === "" || userID === "0" || !userID) {
                          navigation.navigate("Login");
                        } else {
                          navigation.navigate("Home", {
                            userGeolocation: userGeolocation
                              ? userGeolocation
                              : {
                                  latitude: 78.23570781291714,
                                  longitude: 15.491400000982967,
                                },
                            userID: userID,
                            userPhoto: userPhoto ?? "",
                          });
                        }
                      }}
                    >
                      <Image
                        source={require("../../assets/logo_inquadra_colored.png")}
                      ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (userID === "" || userID === "0" || !userID) {
                          navigation.navigate("Login");
                        } else {
                          navigation.navigate("InfoReserva", {
                            userId: userID,
                          });
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
              : showButtons && (
                  <>
                    <TouchableOpacity>
                      <AntDesign name="heart" size={25} color={"white"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (userID === "" || userID === "0" || !userID) {
                          navigation.navigate("Login");
                        } else {
                          navigation.navigate("Home", {
                            userGeolocation: userGeolocation
                              ? userGeolocation
                              : {
                                  latitude: 78.23570781291714,
                                  longitude: 15.491400000982967,
                                },
                            userID: userID,
                            userPhoto: userPhoto ?? "",
                          });
                        }
                      }}
                    >
                      <Image
                        source={require("../../assets/logo_inquadra_colored.png")}
                      ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (userID === "" || userID === "0" || !userID) {
                          navigation.navigate("Login");
                        } else {
                          navigation.navigate("InfoReserva", {
                            userId: userID,
                          });
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
                )}
          </View>
        )}
      </View>
    </View>
  );
}
