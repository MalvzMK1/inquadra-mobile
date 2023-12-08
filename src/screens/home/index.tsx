import { HOST_API } from "@env";
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import HomeBar from "../../components/BarHome";
import BottomBlackMenu from "../../components/BottomBlackMenu";
import CourtBallon from "../../components/CourtBalloon";
import FilterComponent from "../../components/FilterComponent";
import SportsMenu from "../../components/SportsMenu";
import useEstablishmentCardInformations from "../../hooks/useEstablishmentCardInformations";
import useFilters from "../../hooks/useFilters";
import { useSportTypes } from "../../hooks/useSportTypesFixed";
import { useGetUserById } from "../../hooks/useUserById";
import { calculateDistance } from "../../utils/calculateDistance";
import customMapStyle from "../../utils/customMapStyle";
import storage from "../../utils/storage";
import { TextInput } from "react-native-paper";

const pointerMap = require("../../assets/pointerMap.png");

interface Props extends NativeStackScreenProps<RootStackParamList, "Home"> {
  menuBurguer: boolean;
  setMenuBurguer?: React.Dispatch<React.SetStateAction<boolean>>;
}
interface EstablishmentObject {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  type: string;
  image: string;
  distance: number;
}

export default function Home({
  menuBurguer,
  setMenuBurguer,
  route,
  navigation,
}: Props) {
  const [userPicture, setUserPicture] = useState<string>();
  // const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | undefined>();
  const [userGeolocation, setUserGeolocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [userGeolocationDelta, setUserGeolocationDelta] = useState<{
    latDelta: number;
    longDelta: number;
  }>();
  const [filter, setFilter] = useState<{
    amenities: string[] | [];
    dayUseService: boolean | undefined;
    endsAt: string | undefined;
    startsAt: string | undefined;
    date: Date | undefined;
    weekDay:
      | "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday"
      | "Sunday"
      | undefined;
  }>({
    amenities: [],
    dayUseService: undefined,
    endsAt: undefined,
    startsAt: undefined,
    weekDay: undefined,
    date: undefined,
  });

  const [establishments, setEstablishments] = useState<
    Array<{
      id: string;
      latitude: number;
      longitude: number;
      name: string;
      type: string;
      image: string;
      distance: number;
    }>
  >([]);
  const [sportTypes, setSportTypes] = useState<Array<SportType>>([]);
  const [sportSelected, setSportSelected] = useState<string>();
  const [IsUpdated, setIsUpdated] = useState<number>(0);
  const {
    data: availableSportTypes,
    loading: availableSportTypesLoading,
    error: availableSportTypesError,
  } = useSportTypes();
  const {
    data,
    loading,
    error,
    refetch: refetchEstablishments,
  } = useEstablishmentCardInformations();
  const {
    data: userHookData,
    loading: userHookLoading,
    error: userHookError,
    refetch: refetchUserInfos,
  } = useGetUserById(userId ?? "");
  const {
    data: establishmentsFiltered,
    loading: loadingFilter,
    error: errorFilter,
  } = useFilters(filter);

  const HandleSportSelected = (nameSport: string) => {
    setSportSelected(nameSport);
  };

  // useEffect(() => {
  //   if (menuBurguer) setIsMenuVisible(false);
  // }, [menuBurguer]);

  const [isEstablishmentsLoaded, setIsEstablishmentsLoaded] =
    useState<boolean>();
  const [uniqueIdGenerate, setUniqueIdGenerate] = useState<number>();
  const [color, setColor] = useState<string>("white");

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setUniqueIdGenerate(Math.random());
    }
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      setIsUpdated(IsUpdated + 1);
      refetchUserInfos().then(() => {
        if (
          userHookData?.usersPermissionsUser.data?.attributes.photo.data
            ?.attributes.url! !== undefined ||
          userHookData?.usersPermissionsUser.data?.attributes.photo.data
            ?.attributes.url! !== null
        ) {
          setUserPicture(
            HOST_API +
              userHookData?.usersPermissionsUser.data?.attributes.photo.data
                ?.attributes.url!
          );
          navigation.setParams({
            userPhoto:
              userHookData?.usersPermissionsUser.data?.attributes.photo.data
                ?.attributes.url!,
          });
        } else {
          setUserPicture("../../assets/default-user-image.png");
          navigation.setParams({
            userPhoto: "../../assets/default-user-image.png",
          });
        }
      });
      setEstablishments([]);
      if (!error && !loading) {
        if (
          !loadingFilter &&
          !errorFilter &&
          filter.amenities.length <= 0 &&
          !filter.dayUseService &&
          !filter.endsAt &&
          !filter.startsAt &&
          !filter.weekDay
        ) {
          if (data && data.establishments.data) {
            const newEstablishments = data.establishments.data
              .filter((establishment) => establishment.attributes.courts.data)
              .map((establishment) => {
                let establishmentObject: EstablishmentObject = {
                  id: "",
                  latitude: 0,
                  longitude: 0,
                  name: "",
                  type: "",
                  image: "",
                  distance: 0,
                };

                let courtTypes =
                  establishment.attributes.courts.data
                    .filter(
                      (court) => court.attributes.court_types.data.length > 0
                    )
                    .map((court) => court.attributes.court_types.data)
                    .map((courtType) =>
                      courtType.map((type) => type.attributes.name)
                    ) ?? [];

                if (!courtTypes) courtTypes = [];

                if (userGeolocation)
                  establishmentObject = {
                    id: establishment.id,
                    name: establishment.attributes.corporateName,
                    latitude: Number(
                      establishment.attributes.address?.latitude
                    ),
                    longitude: Number(
                      establishment.attributes.address?.longitude
                    ),
                    distance:
                      calculateDistance(
                        userGeolocation.latitude,
                        userGeolocation.longitude,
                        Number(establishment.attributes.address?.latitude),
                        Number(establishment.attributes.address?.longitude)
                      ) / 1000,
                    image:
                      HOST_API +
                      establishment.attributes.logo.data?.attributes.url,
                    type: courtTypes.length > 0 ? courtTypes.join(" & ") : "",
                  };

                return establishmentObject;
              });
            console.log({ newEstablishmentsLength: newEstablishments.length });

            if (newEstablishments) setEstablishments(newEstablishments);
          }
        } else {
          const newEstablishments = establishmentsFiltered?.establishments.data
            .filter(
              (establishment) =>
                establishment?.attributes?.photos.data &&
                establishment?.attributes?.photos.data.length > 0 &&
                establishment?.attributes?.courts.data
            )
            .map((establishment) => {
              let establishmentObject: EstablishmentObject = {
                id: "",
                latitude: 0,
                longitude: 0,
                name: "",
                type: "",
                image: "",
                distance: 0,
              };

              let courtTypes = establishment?.attributes?.courts
                .data!.filter(
                  (court) => court?.attributes?.court_types.data.length > 0
                )
                .map((court) => court?.attributes?.court_types.data)
                .map((courtType) =>
                  courtType.map((type) => type?.attributes?.name)
                );

              if (!courtTypes) courtTypes = [];

              if (userGeolocation)
                establishmentObject = {
                  id: establishment.id,
                  name: establishment?.attributes?.corporateName,
                  latitude: Number(establishment?.attributes?.address.latitude),
                  longitude: Number(
                    establishment?.attributes?.address.longitude
                  ),
                  distance:
                    calculateDistance(
                      userGeolocation.latitude,
                      userGeolocation.longitude,
                      Number(establishment?.attributes?.address.latitude),
                      Number(establishment?.attributes?.address.longitude)
                    ) / 1000,
                  image:
                    HOST_API +
                    establishment?.attributes?.logo?.data?.attributes?.url,
                  type: courtTypes.length > 0 ? courtTypes.join(" & ") : "",
                };

              return establishmentObject;
            });

          if (newEstablishments) setEstablishments(newEstablishments);

          navigation.setParams({
            userPhoto:
              userHookData?.usersPermissionsUser?.data?.attributes?.photo?.data
                ?.attributes?.url ?? "",
          });
        }
      }

      if (!error && !loading) {
        setIsEstablishmentsLoaded(true);
      } else {
        setIsEstablishmentsLoaded(false);
      }
    }, [data, userHookData, filter, establishmentsFiltered, userGeolocation])
  );

  useEffect(() => {
    const newAvailableSportTypes: SportType[] = [];

    availableSportTypes?.courtTypes.data.forEach((courtType) => {
      const sportAlreadyAdded = newAvailableSportTypes.some(
        (sport) => sport.id === courtType.id
      );

      if (!sportAlreadyAdded)
        newAvailableSportTypes.push({
          id: courtType.id,
          name: courtType?.attributes?.name,
        });
    });

    setSportTypes(newAvailableSportTypes);
  }, [availableSportTypes, availableSportTypesError]);

  useEffect(() => {
    if (userGeolocation) {
      const radiusKm = 5;

      const earthRadiusKm = 6371;
      const deltaLatitude: number =
        (radiusKm / earthRadiusKm) * (180 / Math.PI);
      const deltaLongitude: number =
        (radiusKm /
          (earthRadiusKm *
            Math.cos(Math.PI * (userGeolocation?.latitude / 180)))) *
        (180 / Math.PI);

      const zoomOutFactor = 3;

      const newLatitudeDelta = deltaLatitude * zoomOutFactor;
      const newLongitudeDelta = deltaLongitude * zoomOutFactor;

      setUserGeolocationDelta({
        latDelta: newLatitudeDelta,
        longDelta: newLongitudeDelta,
      });
    }
  }, [userGeolocation]);

  useEffect(() => {
    console.log(route.params);

    if (
      route &&
      route.params &&
      route.params.userID &&
      route.params.userID !== ""
    )
      setUserId(route.params.userID);
    else setUserId(undefined);
  }, []);

  useEffect(() => {
    if (!userId) {
      storage
        .load<{ latitude: number; longitude: number }>({
          key: "userGeolocation",
        })
        .then((data) => setUserGeolocation(data))
        .catch((error) => {
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
        .then((data) => {
          console.log({ data });
          setUserId(data.userId);
          navigation.setParams({
            userID: data.userId,
          });
        })
        .catch((error) => {
          if (error instanceof Error) {
            setUserId(undefined);
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
    }
  }, [userId]);

  const buttonCoordinates = {
    top: 1,
    left: 1,
    right: 13,
    bottom: 13,
  };

  useEffect(() => {
    if (
      userHookData &&
      userHookData.usersPermissionsUser.data &&
      userHookData.usersPermissionsUser.data.attributes.role.data
    ) {
      const userRole =
        userHookData.usersPermissionsUser.data.attributes.role.data.id;
      userRole === "4" &&
        navigation.navigate("HomeEstablishment", {
          userPhoto: undefined,
          userID: userHookData.usersPermissionsUser.data.id,
        });
    }

    establishments.forEach((establishment) => {
      console.log(establishment.distance);
    });
  }, [userHookData]);



  const [corporateName, setCorporateName] = useState<string>("")
  const [EstablishmentsInfos, setEstablishmentsInfos] = useState<
    Array<{
      establishmentsId: string;
      corporateName: string;
    }>
  >([]);


  const { data: allEstablishments } = useAllEstablishments();

  useEffect(() => {
    if (corporateName === "") setEstablishmentsInfos([]);
    else if (allEstablishments) {
      const establishments = allEstablishments.establishments.data.map(
        (establishment: { id: any; attributes: { corporateName: any; }; }) => {
          return {
            establishmentsId: establishment.id,
            corporateName: establishment.attributes.corporateName,
          };
        },
      );

      const filteredEstablishments = establishments.filter((establishment: { corporateName: string; }) => {
        return establishment.corporateName
          .toLowerCase()
          .includes(corporateName.toLowerCase());
      });
      setEstablishmentsInfos(filteredEstablishments);
    }
  }, [corporateName]);




  const mapView = useRef(null);

  return (
    <View className="flex-1 flex flex-col justify-center items-center">

<View className=" h-11 w-max bg-[#292929]"></View>
      <View className="bg-[#292929] flex-row justify-between w-full">
        <TouchableOpacity
          className="pl-5 pr-2"
          onPress={() => {
            setMenuBurguer(prevState => !prevState);
          }}
        >
          {!menuBurguer ? (
            <Entypo name="menu" size={48} color={"white"} />
          ) : (
            <MaterialIcons name="filter-list" size={48} color="white" />
          )}
        </TouchableOpacity>

        {Platform.OS === "ios" ? (
          <View className="w-[50vw]">
            <TextInput
              theme={{ colors: { placeholder: "#e9e9e9" } }}
              placeholder="O que você está procurando?"
              underlineColorAndroid="transparent"
              underlineColor="transparent"
              className=" pr-2 bg-white rounded-2xl w-56 flex h-[40px] mb-[0.5] placeholder:text-[#e9e9e9] text-sm outline-none"
              right={<TextInput.Icon icon={"magnify"} />}
              onChangeText={e => {
                setCorporateName(e);
              }}
            />
          </View>
        ) : (
          <TextInput
            theme={{ colors: { placeholder: "#e9e9e9" } }}
            placeholder="O que você está procurando?"
            underlineColorAndroid="transparent"
            underlineColor="transparent"
            className="bg-white pr-10 rounded-2xl w-56 flex items-center justify-center h-[50px] placeholder:text-[#e9e9e9] text-sm outline-none z-10"
            right={<TextInput.Icon icon={"magnify"} />}
            onChangeText={e => {
              setCorporateName(e);
            }}
          />
        )}
        <TouchableOpacity
          className="w-12 h-12 bg-gray-500 rounded-full overflow-hidden mr-20 ml-1"
          onPress={() => {
            if (userId)
              navigation.navigate("ProfileSettings", {
                userPhoto: userPicture ?? undefined,
                userID: userId,
              });
            else navigation.navigate("Login");
          }}
        >
          <Image
            source={
              userPicture
                ? { uri: `${userPicture}` }
                : require("../../assets/default-user-image.png")
            }
            className="w-full h-full"
          />
          
        </TouchableOpacity>
      </View>

      
<View className="top-[55px] w-[170px] h-max flex-1 z-[1] absolute justify-center flex items-center">
        {EstablishmentsInfos ? (
          EstablishmentsInfos.length > 0 ? (
            EstablishmentsInfos.map(item => {
              return (
                <TouchableOpacity
                  key={item.establishmentsId}
                  className="h-[35px] w-full bg-white justify-center border-b-2 border-neutral-300 pl-1 "
                  style={{ zIndex: 1 }}
                  onPress={() => {
                    navigation.navigate("EstablishmentInfo", {
                      establishmentId: item.establishmentsId,
                      userPhoto: userPictureWithoutUrl !== undefined ? userPictureWithoutUrl : undefined,
                      userId: userId,
                    });
                  }}
                >
                  <Text className="text-sm outline-none">
                    {item.corporateName}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </View>
      {availableSportTypesLoading ? (
        <ActivityIndicator size="small" color="#FF6112" />
      ) : (
        // isMenuVisible &&
        !menuBurguer && (
          <SportsMenu
            sports={sportTypes}
            callBack={HandleSportSelected}
            sportSelected={sportSelected}
          />
        )
      )}

          
      <View className="flex-1">
        {userGeolocation && userGeolocationDelta && (
          <MapView
            loadingEnabled
            className="w-screen flex-1"
            onPress={() => setMenuBurguer?.(false)}
            customMapStyle={customMapStyle}
            showsCompass={false}
            showsMyLocationButton={true}
            ref={mapView}
            showsUserLocation
            initialRegion={{
              latitude: userGeolocation.latitude,
              longitude: userGeolocation.longitude,
              latitudeDelta: userGeolocationDelta.latDelta,
              longitudeDelta: userGeolocationDelta.longDelta,
            }}
          >
            {establishments.length > 0 &&
              establishments
                .filter((item) => {
                  if (sportSelected) {
                    return item.type.split(" & ").includes(sportSelected);
                  } else {
                    return true;
                  }
                })
                .filter((establishment) => establishment.distance < 5)
                .map((item) => {
                  return (
                    <Marker
                      key={item.id}
                      coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                      }}
                      image={pointerMap}
                      title={item.name}
                      description={item.name}
                    >
                      <Callout
                        key={item.id}
                        tooltip
                        onPress={() => {
                          navigation.navigate("EstablishmentInfo", {
                            establishmentId: item.id,
                            userId: userId,
                            userPhoto: route.params.userPhoto,
                            colorState: undefined,
                            setColorState: undefined,
                          });
                        }}
                      >
                        <CourtBallon
                          id={item.id}
                          name={item.name}
                          distance={item.distance ?? ""}
                          image={item.image}
                          type={item.type}
                          userId={userId ?? ""}
                          liked={true}
                        />
                      </Callout>
                    </Marker>
                  );
                })}
          </MapView>
        )}

        {!menuBurguer && (
          <TouchableOpacity
            className={`absolute left-3 top-3`}
            onPress={() => setMenuBurguer?.((prevState) => !prevState)}
          >
            <AntDesign name="left" size={30} color="black" />
          </TouchableOpacity>
        )}
        {Platform.OS === "ios" && (
          <TouchableOpacity
            className="absolute right-1 top-1 w-12 h-12 bg-white rounded-xl justify-center items-center"
            onPress={() => {
              mapView.current?.animateToRegion({
                latitude: userGeolocation?.latitude,
                longitude: userGeolocation?.longitude,
                latitudeDelta: userGeolocationDelta?.latDelta,
                longitudeDelta: userGeolocationDelta?.longDelta,
              });
            }}
          >
            <FontAwesome name="location-arrow" size={24} color="black" />
          </TouchableOpacity>
        )}
        {menuBurguer && (
          <FilterComponent
            setBurguer={setMenuBurguer!}
            setFilter={setFilter}
            setIsMenuVisible={setMenuBurguer!}
            filter={filter}
          />
        )}
      </View>

      {!menuBurguer && (
        <HomeBar
          key={uniqueIdGenerate}
          isUpdated={IsUpdated}
          loggedUserId={userId}
          chosenType={sportSelected}
          courts={establishments.sort((a, b) => a.distance - b.distance)}
          userName={
            userHookData?.usersPermissionsUser?.data?.attributes?.username
          }
          HandleSportSelected={HandleSportSelected}
        />
      )}
      {
        <BottomBlackMenu
          screen="Home"
          userID={userId}
          userPhoto={userPicture!}
          isMenuVisible={menuBurguer}
          paddingTop={2}
          onMiddleButtonPress={
            menuBurguer ? () => setMenuBurguer?.(false) : undefined
          }
        />
      }
    </View>
  );
}
