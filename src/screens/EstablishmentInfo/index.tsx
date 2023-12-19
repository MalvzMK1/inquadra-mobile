import { HOST_API } from "@env";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import SvgUri from "react-native-svg-uri";
import BottomBlackMenu from "../../components/BottomBlackMenu";
import { CourtCard } from "../../components/CourtCardInfo";
import { useUser } from "../../context/userContext";
import useGetEstablishmentByCourtId from "../../hooks/useGetEstablishmentByCourtId";
import useGetFavoriteEstablishmentByUserId from "../../hooks/useGetFavoriteEstablishmentByUserId";
import useUpdateFavoriteEstablishment from "../../hooks/useUpdateFavoriteEstablishment";
import { useGetUserById } from "../../hooks/useUserById";
import { calculateDistance } from "../../utils/calculateDistance";

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SLIDER_WIDTH * 0.4;

export default function EstablishmentInfo({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "EstablishmentInfo">) {
  let distance;
  const {
    data: establishmentData,
    loading: establishmentLoading,
    error: establishmentError,
  } = useGetEstablishmentByCourtId(route.params.establishmentId);
  const [updateFavoriteEstablishment, { loading, error }] =
    useUpdateFavoriteEstablishment();

  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [userId, setUserId] = useState<string>();

  const [Establishment, setEstablishment] = useState<{
    id: string;
    corporateName: string;
    cellPhoneNumber: string;
    streetName: string;
    photo: string;
    latitude: number;
    longitude: number;
    photosAmenitie: Array<string>;
    type?: string;
  }>();

  const {
    data: FavoriteEstablishment,
    loading: loadingFavoriteEstablishment,
    error: errorFavoriteEstablishment,
    refetch,
  } = useGetFavoriteEstablishmentByUserId(userId ? userId : "0");

  useFocusEffect(
    React.useCallback(() => {
      refetch()
    }, [route.params])
  )

  const [arrayfavoriteEstablishment, setArrayFavoriteEstablishment] = useState<
    Array<{ id: any }>
  >([]);

  const [heart, setHeart] = useState<boolean>(false);
  const setHeartColor = () => {
    if (
      route.params.colorState !== undefined &&
      route.params.setColorState !== undefined
    ) {
      if (route.params.colorState === "red") {
        setHeart(true);
      } else {
        setHeart(false);
      }
    } else {
      const isCurrentlyFavorite = arrayfavoriteEstablishment.some(
        item => item.id === Establishment?.id,
      );
      setHeart(isCurrentlyFavorite);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (
        arrayfavoriteEstablishment !== undefined &&
        arrayfavoriteEstablishment !== null
      ) {
        setHeartColor();
      }
    }, [arrayfavoriteEstablishment]),
  );

  const [Court, setCourt] = useState<
    Array<{
      id: string;
      name: string;
      court_type: string;
      court_availabilities: boolean;
      photo: string;
    }>
  >([]);

  useFocusEffect(
    React.useCallback(() => {
      setCourt([]);
      if (!error && !loading) {
        if (establishmentData && establishmentData.establishment.data) {
          const infosEstablishment = establishmentData.establishment.data;
          const courts = infosEstablishment.attributes.courts.data.map(
            court => {
              return {
                id: court.id,
                name: court.attributes.name,
                court_type: court.attributes.court_types.data
                  .map(courtType => courtType.attributes.name)
                  .join(", "),
                court_availabilities:
                  court.attributes.court_availabilities.data.length > 0,
                photo:
                  HOST_API + court.attributes.photo.data[0]?.attributes.url ??
                  "",
              };
            },
          );

          let establishment = {
            id: infosEstablishment.id,
            corporateName: infosEstablishment.attributes.corporateName,
            cellPhoneNumber: infosEstablishment.attributes.cellPhoneNumber,
            streetName: infosEstablishment.attributes.address?.streetName ?? "",
            latitude: Number(
              infosEstablishment.attributes.address?.latitude ?? 0,
            ),
            longitude: Number(
              infosEstablishment.attributes.address?.longitude ?? 0,
            ),
            photo: infosEstablishment.attributes.logo.data
              ? HOST_API +
              infosEstablishment.attributes.logo.data.attributes.url
              : "",
            photosAmenitie: infosEstablishment.attributes.photos.data.map(
              (photo, index) => {
                return HOST_API + photo.attributes.url;
              },
            ),
            type: courts.map(court => court.court_type).join(", "),
          };

          setEstablishment(establishment);
          if (courts) {
            setCourt(prevState => [...prevState, ...courts]);
          }
        }
      }
    }, [establishmentData]),
  );

  const onShare = async () => {
    try {
      await Share.share({
        message:
          "Estabelecimento: " +
          Establishment?.corporateName +
          ", Telefone: " +
          Establishment?.cellPhoneNumber,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!errorFavoriteEstablishment && !loadingFavoriteEstablishment) {
      const favoriteEstablishmentId =
        FavoriteEstablishment!.usersPermissionsUser?.data?.attributes?.favorite_establishments?.data?.map(
          establishment => {
            return { id: establishment.id };
          },
        );
      if (favoriteEstablishmentId) {
        setArrayFavoriteEstablishment(prevFavoriteEstablishmentId => [
          ...prevFavoriteEstablishmentId,
          ...favoriteEstablishmentId,
        ]);
      }
    } else {
      console.log(error);
    }
  }, [errorFavoriteEstablishment, loadingFavoriteEstablishment]);

  const handlePressFavoriteEstablishment = () => {
    const isCurrentlyFavorite = arrayfavoriteEstablishment.some(
      item => item.id === Establishment?.id,
    );

    let newArrayfavoriteEstablishment = [];

    if (!isCurrentlyFavorite) {
      newArrayfavoriteEstablishment = [
        ...arrayfavoriteEstablishment,
        { id: Establishment?.id },
      ];
      setArrayFavoriteEstablishment(newArrayfavoriteEstablishment);
    } else {
      newArrayfavoriteEstablishment = arrayfavoriteEstablishment.filter(
        item => item.id !== Establishment?.id,
      );
      setArrayFavoriteEstablishment(newArrayfavoriteEstablishment);
    }

    if (userId) {
      updateFavoriteEstablishment({
        variables: {
          user_id: userId,
          favorite_establishments: newArrayfavoriteEstablishment.map(item =>
            item.id.toString(),
          ),
        },
      });
    }
  };

  if (Establishment) {
    distance =
      calculateDistance(
        Establishment?.latitude,
        Establishment?.longitude,
        userLocation.latitude,
        userLocation.longitude,
      ) / 1000;
  }

  const uniqueCourtTypes = [...new Set(Court.map(court => court.court_type))];

  const { userData } = useUser();

  useEffect(() => {
    if (userData) {
      userData.geolocation && setUserLocation(userData.geolocation);
      userData.id && setUserId(userData.id);
    }
  }, []);

  const {
    data: dataUser,
    loading: loadingUser,
    error: errorUser,
  } = useGetUserById(userId ? userId : "0");

  const handleTelefoneClick = () => {
    const cellPhoneNumber = `tel:${Establishment?.cellPhoneNumber}`;
    Linking.openURL(cellPhoneNumber);
  };

  return (
    <View>
      {loading ||
        establishmentLoading ||
        loadingFavoriteEstablishment ||
        loadingUser ? (
        <View className="mt-10">
          <ActivityIndicator size={32} color="#FF6112" />
        </View>
      ) : error ||
        establishmentError ||
        errorFavoriteEstablishment ||
        errorUser ? (
        <View className="mt-10 justify-center items-center">
          <Text className="font-bold text-lg">Erro Tente novamente!</Text>
        </View>
      ) : (
        <View className="w-full h-screen p-5 flex flex-col gap-y-[20]">
          <View className="flex flex-col">
            <View className="flex flex-row justify-between items-center gap-x-2 mb-2">
              <Text className="font-black text-lg flex-1">
                {Establishment?.corporateName.toUpperCase()}
              </Text>
              <View className="w-2/5 flex flex-row items-center justify-around">
                <TouchableOpacity
                  onPress={() => {
                    if (userId !== undefined && userId !== null) {
                      if (
                        route.params.colorState !== undefined &&
                        route.params.setColorState !== undefined
                      ) {
                        handlePressFavoriteEstablishment();
                        if (!heart) {
                          route.params.setColorState("red");
                          setHeart(true);
                        } else {
                          route.params.setColorState("white");
                          setHeart(false);
                        }
                      } else {
                        handlePressFavoriteEstablishment();
                        heart ? setHeart(false) : setHeart(true);
                      }
                    } else {
                      navigation.navigate("Login");
                    }
                  }}
                >
                  {!heart ? (
                    <AntDesign name="hearto" size={30} color="black" />
                  ) : (
                    <AntDesign name="heart" size={28} color="red" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleTelefoneClick}>
                  <FontAwesome name="phone" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex flex-row gap-[25] items-center">
              <Image
                className="h-20 w-20"
                source={{ uri: Establishment?.photo }}
              ></Image>
              <View>
                <Text className="font-bold text-[#717171]">
                  {Establishment?.type!.split("_").join(" ")}
                </Text>
                <Text className="font-bold text-[#717171]">
                  {distance?.toFixed(1).split(".").join(",")} Km de distância
                </Text>
                <Text className="font-bold text-[#717171]">
                  {Establishment?.streetName}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex flex-col gap-y-[20]">
            <View className="flex flex-row justify-start items-center gap-x-[10]">
              <Text className="font-black text-lg">AMENIDADES DO LOCAL</Text>
              {establishmentData &&
                establishmentData.establishment.data &&
                establishmentData.establishment.data.attributes.amenities.data
                  .length > 0 &&
                establishmentData?.establishment.data?.attributes.amenities.data.map(
                  amenitie =>
                    amenitie.attributes.iconAmenitie.data && (
                      <SvgUri
                        width={12}
                        height={12}
                        source={{
                          uri:
                            HOST_API +
                            amenitie.attributes.iconAmenitie.data.attributes
                              .url,
                        }}
                      />
                    ),
                )}
            </View>
            <View>
              <Carousel
                data={
                  Establishment?.photosAmenitie?.map(url => ({
                    imgUrl: { uri: url },
                  })) || []
                }
                useScrollView
                loop
                autoplay
                autoplayInterval={6000}
                activeSlideAlignment="center"
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                renderItem={({ item }) => (
                  <Image
                    className="h-[106px] w-[142px] rounded-[5px] "
                    source={item.imgUrl}
                  />
                )}
              />
            </View>
          </View>
          <ScrollView className="pb-10">
            {uniqueCourtTypes.map(type => (
              <View key={type}>
                <Text className="text-[18px] leading-[24px] font-black">
                  {type.toUpperCase()}
                </Text>
                {Court.filter(court => court.court_type === type).map(court => (
                  <CourtCard
                    key={court.id}
                    id={court.id}
                    userPhoto={route.params.userPhoto}
                    availabilities={court.court_availabilities}
                    image={court.photo}
                    name={court.name}
                    type={court.court_type}
                  />
                ))}
              </View>
            ))}
            <View className="h-16"></View>
          </ScrollView>
          {Platform.OS === "ios" ? (
            <View className={`absolute bottom-28 left-0 right-0`}>
              <BottomBlackMenu
                screen="EstablishmentInfo"
                userPhoto={
                  dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data
                    ?.attributes?.url
                    ? HOST_API +
                    dataUser.usersPermissionsUser.data.attributes.photo.data
                      ?.attributes.url
                    : ""
                }
                key={1}
                paddingTop={2}
                isMenuVisible={false}
              />
            </View>
          ) : (
            <View className={`absolute bottom-20 left-0 right-0`}>
              <BottomBlackMenu
                screen="EstablishmentInfo"
                userPhoto={
                  dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data
                    ?.attributes?.url
                    ? HOST_API +
                    dataUser.usersPermissionsUser.data.attributes.photo.data
                      ?.attributes.url
                    : ""
                }
                key={1}
                paddingTop={2}
                isMenuVisible={false}
              />
            </View>
          )}
          <View className="h-2"></View>
        </View>
      )}
    </View>
  );
}
