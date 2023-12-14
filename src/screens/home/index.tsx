import { APP_DEBUG_VERBOSE, HOST_API } from "@env";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import HomeBar from "../../components/BarHome";
import BottomBlackMenu from "../../components/BottomBlackMenu";
import CourtBallon from "../../components/CourtBalloon";
import FilterComponent from "../../components/FilterComponent";
import SportsMenu from "../../components/SportsMenu";
import { useUser } from "../../context/userContext";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import useEstablishmentCardInformations from "../../hooks/useEstablishmentCardInformations";
import useFilters from "../../hooks/useFilters";
import { useSportTypes } from "../../hooks/useSportTypesFixed";
import { useGetUserById } from "../../hooks/useUserById";
import { calculateDistance } from "../../utils/calculateDistance";
import customMapStyle from "../../utils/customMapStyle";

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
  const { userData } = useUser();

  const [isUserInfosLoading, setIsUserInfosLoading] = useState<boolean>(
    route?.params?.loadUserInfos ?? false,
  );
  const [userPicture, setUserPicture] = useState<string | undefined>();
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userGeolocation, setUserGeolocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: userData?.geolocation?.latitude ?? 0,
    longitude: userData?.geolocation?.longitude ?? 0,
  });
  const [userGeolocationDelta, setUserGeolocationDelta] = useState<{
    latDelta: number;
    longDelta: number;
  }>(userData?.geolocation ? {
    longDelta: calculateGeolocationDelta(userData.geolocation.latitude).longDelta,
    latDelta: calculateGeolocationDelta(userData.geolocation.latitude).latDelta,
  } : {
    latDelta: 50,
    longDelta: 50
  });
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

  const [sportTypes, setSportTypes] = useState<Array<SportType>>([]);
  const [sportSelected, setSportSelected] = useState<string>();
  const [isUpdated, setIsUpdated] = useState<number>(0);
  const {
    data: availableSportTypes,
    loading: availableSportTypesLoading,
    error: availableSportTypesError,
  } = useSportTypes();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 700);
  const { data, loading } = useEstablishmentCardInformations({
    variables: {
      search: debouncedSearch,
    },
  });

  const { data: userHookData, refetch: refetchUserInfos } = useGetUserById(
    userId ?? "",
  );

  const { data: establishmentsFiltered } = useFilters(filter);

  useFocusEffect(
    useCallback(() => {
      setIsUserInfosLoading(true);
      setIsUpdated(isUpdated + 1);

      refetchUserInfos()
        .then(() => {
          if (
            userData?.id &&
            userHookData?.usersPermissionsUser.data?.attributes.photo.data
          ) {
            const profilePicture =
              userHookData.usersPermissionsUser.data.attributes.photo.data
                .attributes.url;

            setUserPicture(HOST_API + profilePicture);
            navigation.setParams({
              userPhoto: profilePicture,
            });
          } else {
            setUserPicture(undefined);
            navigation.setParams({
              userPhoto: undefined,
            });
          }
        })
        .finally(() => setIsUserInfosLoading(false));
    }, [
      data,
      userHookData,
      filter,
      establishmentsFiltered,
      userGeolocation,
      userData,
    ]),
  );

  const establishments = useMemo((): EstablishmentObject[] => {
    if (!data?.establishments.data) {
      return [];
    }

    if (
      !(
        filter.amenities.length <= 0 &&
        !filter.dayUseService &&
        !filter.endsAt &&
        !filter.startsAt &&
        !filter.weekDay
      )
    ) {
      const newEstablishments = establishmentsFiltered?.establishments.data
        .filter(
          establishment =>
            establishment?.attributes?.photos.data &&
            establishment?.attributes?.photos.data.length > 0 &&
            establishment?.attributes?.courts.data,
        )
        .map(establishment => {
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
              court => court?.attributes?.court_types.data.length > 0,
            )
            .map(court => court?.attributes?.court_types.data)
            .map(courtType => courtType.map(type => type?.attributes?.name));

          if (!courtTypes) courtTypes = [];

          if (userGeolocation)
            establishmentObject = {
              id: establishment.id,
              name: establishment?.attributes?.corporateName,
              latitude: Number(establishment?.attributes?.address.latitude),
              longitude: Number(establishment?.attributes?.address.longitude),
              distance:
                calculateDistance(
                  userGeolocation.latitude,
                  userGeolocation.longitude,
                  Number(establishment?.attributes?.address.latitude),
                  Number(establishment?.attributes?.address.longitude),
                ) / 1000,
              image:
                HOST_API +
                establishment?.attributes?.logo?.data?.attributes?.url,
              type: courtTypes.length > 0 ? courtTypes.join(" & ") : "",
            };

          return establishmentObject;
        });

      navigation.setParams({
        userPhoto:
          userHookData?.usersPermissionsUser?.data?.attributes?.photo?.data
            ?.attributes?.url ?? undefined,
      });

      return newEstablishments ?? [];
    }

    const newEstablishments = data.establishments.data
      .filter(establishment => establishment.attributes.courts.data)
      .map(establishment => {
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
            .filter(court => court.attributes.court_types.data.length > 0)
            .map(court => court.attributes.court_types.data)
            .map(courtType => courtType.map(type => type.attributes.name)) ??
          [];

        if (!courtTypes) courtTypes = [];

        if (userGeolocation)
          establishmentObject = {
            id: establishment.id,
            name: establishment.attributes.corporateName,
            latitude: Number(establishment.attributes.address?.latitude),
            longitude: Number(establishment.attributes.address?.longitude),
            distance:
              calculateDistance(
                userGeolocation.latitude,
                userGeolocation.longitude,
                Number(establishment.attributes.address?.latitude),
                Number(establishment.attributes.address?.longitude),
              ) / 1000,
            image:
              HOST_API + establishment.attributes.logo.data?.attributes.url,
            type: courtTypes.length > 0 ? courtTypes.join(" & ") : "",
          };

        return establishmentObject;
      });

    return newEstablishments;
  }, [data, userHookData, filter, establishmentsFiltered, userGeolocation]);

  useEffect(() => {
    const newAvailableSportTypes: SportType[] = [];

    availableSportTypes?.courtTypes.data.forEach(courtType => {
      const sportAlreadyAdded = newAvailableSportTypes.some(
        sport => sport.id === courtType.id,
      );

      if (!sportAlreadyAdded)
        newAvailableSportTypes.push({
          id: courtType.id,
          name: courtType?.attributes?.name,
        });
    });

    setSportTypes(newAvailableSportTypes);
  }, [availableSportTypes, availableSportTypesError]);

  function calculateGeolocationDelta(latitude: number): {latDelta: number, longDelta: number} {
    const radiusKm = 5;

    const earthRadiusKm = 6371;
    const deltaLatitude: number =
      (radiusKm / earthRadiusKm) * (180 / Math.PI);
    const deltaLongitude: number =
      (radiusKm /
        (earthRadiusKm *
          Math.cos(Math.PI * (latitude / 180)))) *
      (180 / Math.PI);

    const zoomOutFactor = 3;

    const latDelta = deltaLatitude * zoomOutFactor;
    const longDelta = deltaLongitude * zoomOutFactor;

    return {
      latDelta,
      longDelta
    }
  }

  useEffect(() => {
    if (userGeolocation) {
      const {latDelta, longDelta} = calculateGeolocationDelta(userGeolocation.latitude);

      setUserGeolocationDelta({
        latDelta,
        longDelta
      });
    }
  }, [userGeolocation]);

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
        });
    }
  }, [userHookData]);

  const mapView = useRef<MapView>(null);

  useEffect(() => {
    try {
      setIsUserInfosLoading(true);
      if (userData) {
        if (userData.id) {
          setUserId(userData.id);
        } else {
          navigation.setParams({
            userPhoto: undefined,
          });
        }

        userData.geolocation && setUserGeolocation(userData.geolocation);
      } else {
        setUserId(undefined);
        navigation.setParams({
          userPhoto: undefined,
        });
      }
    } catch (error) {
      if (APP_DEBUG_VERBOSE) alert(JSON.stringify(error, null, 2));
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setIsUserInfosLoading(false);
    }
  }, [userData]);

  const handlePress = () => {
    if (setMenuBurguer) {
      setMenuBurguer(prevState => !prevState);
    }
  };

  const HandleSportSelected = (nameSport: string) => {
    setSportSelected(nameSport);
  };

  return (
    <View className="flex-1 flex flex-col justify-center items-center h-full">
      <View className="flex justify-between pt-8 bg-[#292929] flex-row items-center h-[105px] w-full space-x-4">
        <TouchableOpacity className="ml-3" onPress={handlePress}>
          {!menuBurguer ? (
            <Entypo name="menu" size={48} color={"white"} />
          ) : (
            <MaterialIcons name="filter-list" size={48} color="white" />
          )}
        </TouchableOpacity>

        <View className="relative flex-1">
          <TextInput
            value={search}
            returnKeyType="search"
            onChangeText={setSearch}
            placeholderTextColor="#B8B8B8"
            placeholder="O que você está procurando?"
            className="border border-[#8C8C8C] bg-white rounded-2xl pl-4 pr-8 text-black h-[42px]"
          />

          <View className="absolute top-1/2 -translate-y-6 right-4">
            <AntDesign name="search1" size={16} color="#B8B8B8" />
          </View>
        </View>

        {isUserInfosLoading ? (
          <ActivityIndicator
            size={"small"}
            color={"#FF1116"}
            className={"w-12 h-12"}
          />
        ) : (
          <TouchableOpacity
            className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
            onPress={() => {
              if (userData && userData.id)
                navigation.navigate("ProfileSettings", {
                  userPhoto: HOST_API + userPicture ?? undefined,
                });
              else navigation.navigate("Login");
            }}
          >
            <Image
              source={
                userPicture
                  ? { uri: userPicture }
                  : require("../../assets/default-user-image.png")
              }
              className="w-full h-full"
            />
          </TouchableOpacity>
        )}
      </View>

      {availableSportTypesLoading ? (
        <ActivityIndicator size="small" color="#FF6112" />
      ) : (
        isMenuVisible &&
        !menuBurguer && (
          <SportsMenu
            sports={sportTypes}
            callBack={HandleSportSelected}
            sportSelected={sportSelected}
          />
        )
      )}
      <View className="flex-1">
        <MapView
          loadingEnabled
          className="w-screen flex-1"
          onPress={() => setIsMenuVisible(false)}
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
              .filter(item => {
                if (sportSelected) {
                  return item.type.split(" & ").includes(sportSelected);
                } else {
                  return true;
                }
              })
              .filter(establishment => {
                if (
                  userGeolocation.latitude !== 0 &&
                  userGeolocation.longitude !== 0
                ) return establishment.distance < 5;
                return true;
              })
              .map(item => {
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
                        liked={true}
                      />
                    </Callout>
                  </Marker>
                );
              })}
        </MapView>
        {!isMenuVisible && (
          <TouchableOpacity
            className={`absolute left-3 top-1`}
            onPress={() => setIsMenuVisible(prevState => !prevState)}
          >
            <AntDesign name="left" size={30} color="black" />
          </TouchableOpacity>
        )}

        {Platform.OS === "ios" && (
          <TouchableOpacity
            className="absolute right-1 top-1 w-12 h-12 bg-white rounded-xl justify-center items-center"
            onPress={() => {
              mapView.current?.animateToRegion({
                latitude: userGeolocation?.latitude ?? 0,
                longitude: userGeolocation?.longitude ?? 0,
                latitudeDelta: userGeolocationDelta?.latDelta ?? 0,
                longitudeDelta: userGeolocationDelta?.longDelta ?? 0,
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
            setIsMenuVisible={setIsMenuVisible}
            filter={filter}
          />
        )}
      </View>

      {isMenuVisible && !menuBurguer && (
        <HomeBar
          isUpdated={isUpdated}
          isCourtsLoading={loading}
          chosenType={sportSelected}
          courts={establishments.sort((a, b) => a.distance - b.distance)}
          userName={
            userData && userData.id
              ? userHookData?.usersPermissionsUser?.data?.attributes?.name
              : undefined
          }
          HandleSportSelected={HandleSportSelected}
          isUserInfosLoading={isUserInfosLoading}
        />
      )}

      <BottomBlackMenu
        screen="Home"
        userPhoto={userPicture!}
        isMenuVisible={!isMenuVisible}
        paddingTop={2}
        onMiddleButtonPress={
          menuBurguer ? () => setMenuBurguer?.(false) : undefined
        }
      />
    </View>
  );
}
