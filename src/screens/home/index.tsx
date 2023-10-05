import { HOST_API } from "@env";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
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

interface Props extends NativeStackScreenProps<RootStackParamList, "Home"> {
  menuBurguer: boolean;
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

export default function Home({ menuBurguer, route, navigation }: Props) {
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
  });

  const [userId, setUserId] = useState("");
  const pointerMap = require("../../assets/pointerMap.png");
  useEffect(() => {
    storage
      .load<{ latitude: number; longitude: number }>({
        key: "userGeolocation",
      })
      .then(data => setUserGeolocation(data));

    storage
      .load<UserInfos>({
        key: "userInfos",
      })
      .then(data => {
        setUserId(data.userId);
      });
  }, []);

  const { data, loading, error } = useEstablishmentCardInformations();
  const {
    data: userHookData,
    loading: userHookLoading,
    error: userHookError,
  } = useGetUserById(route?.params?.userID);
  const {
    data: establishmentsFiltered,
    loading: loadingFilter,
    error: errorFilter,
  } = useFilters(filter);

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
  const {
    data: availableSportTypes,
    loading: availableSportTypesLoading,
    error: availableSportTypesError,
  } = useSportTypes();

  const HandleSportSelected = (nameSport: string) => {
    setSportSelected(nameSport);
  };

  useEffect(() => {
    if (menuBurguer) setIsDisabled(false);
  }, [menuBurguer]);

  useFocusEffect(
    React.useCallback(() => {
      setEstablishments([]);
      if (!error && !loading) {
        if (
          !filter ||
          (filter.amenities.length <= 0 &&
            !filter.dayUseService &&
            !filter.endsAt &&
            !filter.startsAt &&
            !filter.weekDay)
        ) {
          const newEstablishments = data?.establishments.data
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
                .map(courtType =>
                  courtType.map(type => type?.attributes?.name),
                );

              if (!courtTypes) courtTypes = [];

              if (userGeolocation)
                establishmentObject = {
                  id: establishment.id,
                  name: establishment?.attributes?.corporateName,
                  latitude: Number(establishment?.attributes?.address.latitude),
                  longitude: Number(
                    establishment?.attributes?.address.longitude,
                  ),
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

          if (newEstablishments) setEstablishments(newEstablishments);

          navigation.setParams({
            userPhoto:
              userHookData?.usersPermissionsUser?.data?.attributes?.photo?.data
                ?.attributes?.url ?? "",
          });
        } else {
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
                .map(courtType =>
                  courtType.map(type => type?.attributes?.name),
                );

              if (!courtTypes) courtTypes = [];

              if (userGeolocation)
                establishmentObject = {
                  id: establishment.id,
                  name: establishment?.attributes?.corporateName,
                  latitude: Number(establishment?.attributes?.address.latitude),
                  longitude: Number(
                    establishment?.attributes?.address.longitude,
                  ),
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

          if (newEstablishments) setEstablishments(newEstablishments);

          navigation.setParams({
            userPhoto:
              userHookData?.usersPermissionsUser?.data?.attributes?.photo?.data
                ?.attributes?.url ?? "",
          });
        }
      }
    }, [data, loading, userHookLoading, userHookData, error, filter]),
  );
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

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

  useEffect(() => {
    if (userGeolocation) {
      const radiusKm = 5;

      const earthRadiusKm = 6371; // Raio médio da Terra em quilômetros
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

  return (
    <View className="flex-1 flex flex-col justify-center items-center">
      {availableSportTypesLoading ? (
        <ActivityIndicator size="small" color="#FF6112" />
      ) : (
        isDisabled &&
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
            onPress={() => setIsDisabled(false)}
            customMapStyle={customMapStyle}
            showsCompass={false}
            showsMyLocationButton
            showsUserLocation
            initialRegion={{
              latitude: userGeolocation.latitude,
              longitude: userGeolocation.longitude,
              latitudeDelta: userGeolocationDelta.latDelta,
              longitudeDelta: userGeolocationDelta.longDelta,
            }}
            // initialCamera={{
            //     zoom: 0.5,
            //     center: {
            //         ...userGeolocation
            //     },
            //     heading: 1,
            //     pitch: 1,
            //     altitude: 10000
            // }}
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
                .map(item => (
                  <Marker
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                    icon={pointerMap}
                    title={item.name}
                    description={item.name}
                  >
                    <Callout
                      key={item.id}
                      tooltip
                      onPress={() =>
                        navigation.navigate("EstablishmentInfo", {
                          establishmentId: item.id,
                          userId: userId,
                          userPhoto: undefined,
                        })
                      }
                    >
                      <CourtBallon
                        id={item.id}
                        key={item.id}
                        name={item.name}
                        distance={item.distance ?? ""}
                        image={item.image}
                        type={item.type}
                        userId={route?.params?.userID ?? ""}
                        liked={true}
                      />
                    </Callout>
                  </Marker>
                ))}
          </MapView>
        )}

        {!isDisabled && (
          <TouchableOpacity
            className={`absolute left-3 top-3`}
            onPress={() => setIsDisabled(prevState => !prevState)}
          >
            <AntDesign name="left" size={30} color="black" />
          </TouchableOpacity>
        )}
        {menuBurguer && <FilterComponent setFilter={setFilter} />}
      </View>

      {isDisabled && !menuBurguer && (
        <HomeBar
          chosenType={sportSelected}
          courts={establishments}
          userName={
            userHookData?.usersPermissionsUser?.data?.attributes?.username
          }
          HandleSportSelected={HandleSportSelected}
        />
      )}
      {
        <View className={`absolute bottom-0 left-0 right-0`}>
          <BottomBlackMenu
            screen="Home"
            userID={route?.params?.userID}
            userPhoto={
              userHookData?.usersPermissionsUser?.data?.attributes?.photo?.data
                ?.attributes?.url
                ? HOST_API +
                  userHookData.usersPermissionsUser.data.attributes.photo.data
                    ?.attributes.url
                : ""
            }
            key={1}
            isDisabled={!isDisabled}
            paddingTop={2}
          />
        </View>
      }
    </View>
  );
}
