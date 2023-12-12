import { APP_DEBUG_VERBOSE, HOST_API } from "@env";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MapView, { Callout, Marker } from "react-native-maps";
import { Text, TextInput } from "react-native-paper";
import HomeBar from "../../components/BarHome";
import BottomBlackMenu from "../../components/BottomBlackMenu";
import CourtBallon from "../../components/CourtBalloon";
import FilterComponent from "../../components/FilterComponent";
import SportsMenu from "../../components/SportsMenu";
import { useUser } from "../../context/userContext";
import useEstablishmentCardInformations from "../../hooks/useEstablishmentCardInformations";
import useFilters from "../../hooks/useFilters";
import useAllEstablishments from "../../hooks/useGetEstablishmentByCorporateName";
import { useSportTypes } from "../../hooks/useSportTypesFixed";
import { useGetUserById } from "../../hooks/useUserById";
import { calculateDistance } from "../../utils/calculateDistance";
import customMapStyle from "../../utils/customMapStyle";
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";
import { EstablishmentsData } from "../../graphql/queries/searchEstablishmentsByCorporateName";

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
  const { data, loading, error } = useEstablishmentCardInformations();
  const { data: userHookData, refetch: refetchUserInfos } = useGetUserById(
    userId ?? "",
  );
  const {
    data: establishmentsFiltered,
    loading: loadingFilter,
    error: errorFilter,
  } = useFilters(filter);
  const [uniqueIdGenerate, setUniqueIdGenerate] = useState<number>();
  const isFocused = useIsFocused();
  const { data: allEstablishments, loading:loadingEstablishments } = useAllEstablishments();
  const [corporateName, setCorporateName] = useState<string>("");
  const [establishmentsInfos, setEstablishmentsInfos] = useState<
    Array<{
      establishmentsId: string;
      corporateName: string;
    }>
  >([]);
  const establishmentsData = allEstablishments?.establishments?.data || [];

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (isFocused) {
      setUniqueIdGenerate(Math.random());
    }
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      setIsUserInfosLoading(true);

      setIsUpdated(IsUpdated + 1);
      refetchUserInfos().then(() => {
        setIsUserInfosLoading(true);
        if (
          userData &&
          userData.id &&
          userHookData &&
          userHookData.usersPermissionsUser.data &&
          userHookData.usersPermissionsUser.data.attributes.photo.data
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
        setIsUserInfosLoading(false);
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
                    .filter(
                      court => court.attributes.court_types.data.length > 0,
                    )
                    .map(court => court.attributes.court_types.data)
                    .map(courtType =>
                      courtType.map(type => type.attributes.name),
                    ) ?? [];

                if (!courtTypes) courtTypes = [];

                if (userGeolocation)
                  establishmentObject = {
                    id: establishment.id,
                    name: establishment.attributes.corporateName,
                    latitude: Number(
                      establishment.attributes.address?.latitude,
                    ),
                    longitude: Number(
                      establishment.attributes.address?.longitude,
                    ),
                    distance:
                      calculateDistance(
                        userGeolocation.latitude,
                        userGeolocation.longitude,
                        Number(establishment.attributes.address?.latitude),
                        Number(establishment.attributes.address?.longitude),
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
                ?.attributes?.url ?? undefined,
          });
        }
      }
    }, [
      data,
      userHookData,
      filter,
      establishmentsFiltered,
      userGeolocation,
      userData,
    ]),
  );

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

  useEffect(() => {
    if (corporateName === "") setEstablishmentsInfos([]);
    else if (allEstablishments) {
      const establishments = allEstablishments.establishments.data.map(
        (establishment: { id: any; attributes: { corporateName: any } }) => {
          return {
            establishmentsId: establishment.id,
            corporateName: establishment.attributes.corporateName,
          };
        },
      );
      const filteredEstablishments = establishments.filter(
        (establishment: { corporateName: string }) => {
          return establishment.corporateName
            .toLowerCase()
            .includes(corporateName.toLowerCase());
        },
      );
      setEstablishmentsInfos(filteredEstablishments);
    }
  }, [corporateName]);

  const mapView = useRef(null);

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

  function filterEstablishments(
    products: EstablishmentsData[],
    search: string,
  ): TAutocompleteDropdownItem[] {
    return products
      .filter(
        product =>
          product.attributes.corporateName
            .toLowerCase()
            .includes(search.toLowerCase()),
      )
      .map(product => {
        return {
          id: product.id,
          title: `${product.attributes.corporateName}`,
        };
      });
  }

  return (
    <View className="flex-1 flex flex-col justify-center items-center h-full">
      <View className="flex justify-between pt-8 bg-[#292929] flex-row items-center h-[105px] w-full">
        <TouchableOpacity className="ml-3" onPress={() => handlePress}>
          {!menuBurguer ? (
            <Entypo name="menu" size={48} color={"white"} />
          ) : (
            <MaterialIcons name="filter-list" size={48} color="white" />
          )}
        </TouchableOpacity>
        
        <AutocompleteDropdown
          closeOnSubmit
          useFilter={false}
          closeOnBlur={false}
          loading={loadingEstablishments}
          onChangeText={text => setSearchValue(text)}
          inputContainerStyle={{ backgroundColor: "white" }}
          emptyResultText="Informe o número OTK ou nome do item"
          dataSet={searchValue ? filterEstablishments(establishmentsData, searchValue) : []}
          onSelectItem={item => {
            if (userId) {
              navigation.navigate("EstablishmentInfo", {
                establishmentId: item.id,
                userPhoto: userPicture,
              });
              setCorporateName("");
            } else navigation.navigate("Login");
          }}
        />

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

      {userGeolocation && userGeolocationDelta && (
        <MapView
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
              .filter(establishment => establishment.distance < 5)
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
      )}

      {!isMenuVisible && (
        <TouchableOpacity
          className={`absolute left-3 top-3`}
          onPress={() => setIsMenuVisible(prevState => !prevState)}
        >
          <AntDesign name="left" size={30} color="black" />
        </TouchableOpacity>
      )}

      {Platform.OS === "ios" && (
        <TouchableOpacity
          className="absolute right-1 top-1 w-12 h-12 bg-white rounded-xl justify-center items-center"
          onPress={() => {
            mapView.current
              ? {
                latitude: userGeolocation?.latitude,
                longitude: userGeolocation?.longitude,
                latitudeDelta: userGeolocationDelta?.latDelta,
                longitudeDelta: userGeolocationDelta?.longDelta,
              }
              : null;
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

      {isMenuVisible && !menuBurguer && (
        <HomeBar
          key={uniqueIdGenerate}
          isUpdated={IsUpdated}
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
