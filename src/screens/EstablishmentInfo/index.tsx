import { HOST_API } from "@env";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, Share, Text, View, Linking } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel from "react-native-snap-carousel";
import BottomBlackMenu from "../../components/BottomBlackMenu";
import { CourtCard } from "../../components/CourtCardInfo";
import useGetEstablishmentByCourtId from "../../hooks/useGetEstablishmentByCourtId";
import useGetFavoriteEstablishmentByUserId from "../../hooks/useGetFavoriteEstablishmentByUserId";
import useUpdateFavoriteEstablishment from "../../hooks/useUpdateFavoriteEstablishment";
import { useGetUserById } from "../../hooks/useUserById";
import { calculateDistance } from "../../utils/calculateDistance";
import storage from "../../utils/storage";
import SvgUri from "react-native-svg-uri";

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
  const [updateFavoriteEstablishment, { data, loading, error }] =
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

  const { data: FavoriteEstablishment, loading: loadingFavoriteEstablishment, error: errorFavoriteEstablishment, refetch } = useGetFavoriteEstablishmentByUserId(userId ? userId : "0");


  useFocusEffect(() => refetch)

  const [arrayfavoriteEstablishment, setArrayFavoriteEstablishment] = useState<
    Array<{ id: any }>
  >([]);

  const [rating, setRating] = useState<number>();
  const [heart, setHeart] = useState<boolean>(route.params.colorState === "red" ? true : false);
  const [footerHeartColor, setFooterHeartColor] = useState("white");

  const [Court, setCourt] = useState<
    Array<{
      id: string;
      name: string;
      rating: number;
      court_type: string;
      court_availabilities: boolean;
      photo: string;
    }>
  >([]);

  useFocusEffect(
    React.useCallback(() => {
      setCourt([]);
      // setEstablishment(undefined);
      if (!error && !loading) {
        if (
          establishmentData &&
          establishmentData.establishment.data
        ) {
          const infosEstablishment = establishmentData.establishment.data;
          const courts = infosEstablishment.attributes.courts.data.map(
            court => {
              return {
                id: court.id,
                name: court.attributes.name,
                rating: court.attributes.rating ? court.attributes.rating : 0,
                court_type: court.attributes.court_types.data
                  .map(courtType => courtType.attributes.name)
                  .join(", "),
                court_availabilities:
                  court.attributes.court_availabilities.data.length > 0,
                photo: HOST_API + court.attributes.photo.data[0]?.attributes.url ?? '',
              };
            },
          );

          let establishment = {
            id: infosEstablishment.id,
            corporateName: infosEstablishment.attributes.corporateName,
            cellPhoneNumber: infosEstablishment.attributes.cellPhoneNumber,
            streetName: infosEstablishment.attributes.address?.streetName ?? '',
            latitude: Number(infosEstablishment.attributes.address?.latitude ?? 0),
            longitude: Number(infosEstablishment.attributes.address?.longitude ?? 0),
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
      console.log("curtiu")
      const favoriteEstablishmentId =
        FavoriteEstablishment!.usersPermissionsUser?.data?.attributes?.favorite_establishments?.data?.map(
          establishment => {
            return { id: establishment.id };
          },
        );
      if (favoriteEstablishmentId) {
        console.log("descurtiu");
        setArrayFavoriteEstablishment(prevFavoriteEstablishmentId => [
          ...prevFavoriteEstablishmentId,
          ...favoriteEstablishmentId,
        ]);
      }
    } else {
      console.log(error)
    }
  }, [errorFavoriteEstablishment, loadingFavoriteEstablishment]);


  const handlePressFavoriteEstablishment = () => {
    const isCurrentlyFavorite = arrayfavoriteEstablishment.some(
      item => item.id === Establishment?.id,
    );

    let newArrayfavoriteEstablishment = [];

    if (!isCurrentlyFavorite) {
      console.log("curtiu")
      newArrayfavoriteEstablishment = [
        ...arrayfavoriteEstablishment,
        { id: Establishment?.id }
      ];
      setArrayFavoriteEstablishment(newArrayfavoriteEstablishment);

    } else {
      console.log("descurtiu")
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

  useEffect(() => {
    function calculateRating() {
      const generalRating = Court.map(item => {
        if (item.rating) {
          return item.rating;
        } else {
          return 5;
        }
      });

      if (generalRating.length > 0) {
        const sum = generalRating.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        );
        setRating(sum / generalRating.length);
      } else {
        setRating(0);
      }
    }

    calculateRating();
  }, [Court]);

  useEffect(() => {
    storage
      .load<{ latitude: string; longitude: string }>({
        key: "userGeolocation",
      })
      .then(response =>
        setUserLocation({
          latitude: Number(response.latitude),
          longitude: Number(response.longitude),
        }),
      );
  }, []);

  const {
    data: dataUser,
    loading: loadingUser,
    error: errorUser,
  } = useGetUserById(userId ? userId : "0");

  useEffect(() => {
    storage
      .load<UserInfos>({
        key: "userInfos",
      })
      .then(data => {
        setUserId(data.userId);
      })
      .catch(error => {
        setUserId(undefined)
        if (error instanceof Error) {
          if (error.name === 'NotFoundError') {
            console.log('The item wasn\'t found.');
          } else if (error.name === 'ExpiredError') {
            console.log('The item has expired.');
            storage.remove({
              key: 'userInfos'
            }).then(() => {
              console.log('The item has been removed.');
            })
          } else {
            console.log('Unknown error:', error);
          }
        }
      });
  }, []);

  const handleTelefoneClick = () => {
    const cellPhoneNumber = `tel:${Establishment?.cellPhoneNumber}`;
    Linking.openURL(cellPhoneNumber);
  };

  return (
    <View className="w-full h-screen p-5 flex flex-col gap-y-[20]">
      <View className="flex flex-col">
        <View className="flex flex-row justify-between items-center">
          <Text className="font-black text-lg">
            {Establishment?.corporateName.toUpperCase()}
          </Text>
          <View className="flex flex-row items-center gap-x-8">
            <TouchableOpacity
              className="flex justify-center items-center h-12 w-8"
              onPress={() => {
                if (userId !== undefined && userId !== null) {
                  if (route.params.colorState !== undefined && route.params.setColorState !== undefined) {
                    handlePressFavoriteEstablishment()
                    if (heart !== true) {
                      route.params.setColorState("red")
                      setHeart(true)
                    } else {
                      route.params.setColorState("white")
                      setHeart(false)
                    }
                  } else {
                    handlePressFavoriteEstablishment()
                    heart ? setHeart(false) : setHeart(true)
                  }
                }else{
                 navigation.navigate('Login')
                }
              }
              }
            >
              {!heart ? (
                <AntDesign name="hearto" size={26} color="black" />
              ) : (
                <AntDesign name="heart" size={24} color="red" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare}>
              <Ionicons name="share-social" size={30} color="black" />
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
              Avaliação: {rating?.toFixed(1).split(".").join(",")}{" "}
              <Ionicons name="star-sharp" size={20} color="orange" />
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
          {
            (
              establishmentData &&
              establishmentData.establishment.data &&
              establishmentData.establishment.data.attributes.amenities.data.length > 0
            ) &&
            establishmentData?.establishment.data?.attributes.amenities.data.map(amenitie => (
              amenitie.attributes.iconAmenitie.data &&
              <SvgUri
                width={12}
                height={12}
                source={{ uri: HOST_API + amenitie.attributes.iconAmenitie.data.attributes.url }}
              />
            )
            )
          }
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
                userId={userId ? userId : "0"}
                userPhoto={route.params.userPhoto}
                availabilities={court.court_availabilities}
                image={court.photo}
                name={court.name}
                type={court.court_type}
                rate={court.rating}
              />
            ))}
          </View>
        ))}
        <View className="h-16"></View>
      </ScrollView>
      <View className={`absolute bottom-20 left-0 right-0`}>
        <BottomBlackMenu
          screen="EstablishmentInfo"
          userID={userId ? userId : "0"}
          userPhoto={
            dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data
              ?.attributes?.url
              ? HOST_API +
              dataUser.usersPermissionsUser.data.attributes.photo.data
                ?.attributes.url
              : ""
          }
          key={1}
          isDisabled={true}
          paddingTop={2}
        />
      </View>
      <View className="h-2"></View>
    </View >
  );
}
