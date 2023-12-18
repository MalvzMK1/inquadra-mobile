import { HOST_API } from "@env";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import BottomBlackMenu from "../../components/BottomBlackMenu";
import { InfosEstablishment } from "../../components/InfosEstablishment";
import { useUser } from "../../context/userContext";
import useGetFavoriteEstablishmentsByUserId from "../../hooks/useGetFavoriteEstablishmentsById";
import useUpdateFavoriteEstablishment from "../../hooks/useUpdateFavoriteEstablishment";
import { useGetUserById } from "../../hooks/useUserById";
import { calculateDistance } from "../../utils/calculateDistance";

interface Colors {
  [key: string]: string;
}

export default function FavoriteEstablishments({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "FavoriteEstablishments">) {
  const { userData } = useUser();

  const [userId, setUserId] = useState<string>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isUnliking, setIsUnliking] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const USER_ID = userId;
  const [colors, setColors] = useState<Colors>({});
  const [userFavoriteEstablishments, setUserFavoriteEstablishments] = useState<
    Array<string>
  >([]);
  const { data, error, loading, refetch } =
    useGetFavoriteEstablishmentsByUserId(userId ?? "");
  const { data: userByIdData, refetch: refetchUserInfos } = useGetUserById(
    userId ?? ""
  );
  const { data: dataUser } = useGetUserById(userId ?? "");
  const [updateLikedEstablishments] = useUpdateFavoriteEstablishment();

  const handleUpdateEstablishmentLike = (establishmentId: string): void => {
    setIsUnliking(true);
    const establishmentsData = [...userFavoriteEstablishments];
    const arrayWithoutDeletedItem = establishmentsData.filter(
      (item) => item !== establishmentId
    );

    updateLikedEstablishments({
      variables: {
        user_id: USER_ID ?? "",
        favorite_establishments: arrayWithoutDeletedItem,
      },
    })
      .then(() => {
        setColors((prevColor) => ({
          ...prevColor,
          [establishmentId]: "white",
        }));
      })

      .finally(() => {
        setUserFavoriteEstablishments(arrayWithoutDeletedItem);
      })
      .finally(() => setIsUnliking(false));
  };

  useEffect(() => {
    if (userData) {
      userData.id && setUserId(userData.id);
      userData.geolocation && setUserLocation(userData.geolocation);
    }
  }, []);

  useEffect(() => {
    if (route.params.userPhoto && route.params.userPhoto !== "") {
      navigation.setParams({
        userPhoto: route.params.userPhoto,
      });
    } else {
      console.error("userPhoto vazio ou nulo");
    }
  }, [route.params.userPhoto]);

  useFocusEffect(() => refetch);

  useFocusEffect(() => refetchUserInfos);

  useFocusEffect(() => {
    setIsLoaded(false);
    if (!error && !loading) {
      setIsLoaded(true);
    }
  });

  useFocusEffect(
    useCallback(() => {
      try {
        if (
          userByIdData &&
          userByIdData.usersPermissionsUser.data?.attributes
            .favorite_establishments.data.length! > 0
        ) {
          userByIdData?.usersPermissionsUser?.data?.attributes?.favorite_establishments?.data?.forEach(
            (item) => {
              setColors((prevColors) => ({
                ...prevColors,
                [item.id]: "red",
              }));
              setUserFavoriteEstablishments((prevEstablishments) => [
                ...prevEstablishments,
                item.id,
              ]);
            }
          );
          setIsLoaded(false);
        } else {
          setIsLoaded(true);
        }
      } catch (error) {
        console.error(
          "Preenchimento do colors e userFavoriteEstablishments, erro: "
        );
      }
    }, [userByIdData])
  );

  return (
    <View className="flex-1 h-max w-max bg-zing-600 ">
      {isLoaded ? (
        <ScrollView
          className="flex-1 p-2 bg-zinc-600"
          style={{ elevation: 12 }}
        >
          {!data?.establishments.data && data?.establishments.data === null && (
            <View className="w-full h-fit flex items-center justify-center">
              <Text className="text-[18px] text-center text-white">
                VOCÊ NÃO POSSUI NENHUM ESTABELECIMENTO FAVORITO!
              </Text>
            </View>
          )}
          {isLoaded &&
            data?.establishments.data.map !== null &&
            data?.establishments.data.map((item) =>
              item.attributes !== null && item.attributes ? (
                <InfosEstablishment.Root
                  category={
                    item.attributes.corporateName === null
                      ? "Nome não fornecido"
                      : item.attributes.corporateName
                  }
                >
                  {item.attributes.logo.data.attributes.url ? (
                    <InfosEstablishment.Establishment
                      key={item.id}
                      imageUrl={{
                        uri:
                          HOST_API + item.attributes.logo.data.attributes.url,
                        height: 90,
                        width: 138,
                      }}
                    >
                      <InfosEstablishment.Content>
                        <InfosEstablishment.ContentHeader
                          establishmentName={
                            item.attributes.corporateName === null
                              ? "Nome não fornecido"
                              : item.attributes.corporateName
                          }
                        />

                        <InfosEstablishment.ContentDistance
                          distance={(() => {
                            const distanceInMeters = calculateDistance(
                              userLocation.latitude,
                              userLocation.longitude,
                              Number(item.attributes.address.latitude),
                              Number(item.attributes.address.longitude)
                            );
                            return distanceInMeters >= 1000
                              ? `${(distanceInMeters / 1000).toFixed(1)} km`
                              : `${distanceInMeters.toFixed(0)} m`;
                          })()}
                        />
                      </InfosEstablishment.Content>
                      {!isUnliking ? (
                        <AntDesign
                          name="heart"
                          size={20}
                          color={colors[item.id] || "red"}
                          onPress={() => handleUpdateEstablishmentLike(item.id)}
                        />
                      ) : (
                        <ActivityIndicator size="small" color={"red"} />
                      )}
                    </InfosEstablishment.Establishment>
                  ) : null}
                </InfosEstablishment.Root>
              ) : (
                <View className="w-full h-fit flex items-center justify-center">
                  <Text className="text-[18px] text-center text-white">
                    ESSE ESTABELECIMENTO FAVORITO NÃO ESTA DIPONIVEL!
                  </Text>
                </View>
              )
            )}
          {!USER_ID && (
            <View className="w-full h-fit flex items-center justify-center">
              <Text className="text-[18px] text-center text-white">
                FAÇA{" "}
                <Text
                  onPress={() => navigation.navigate("Login")}
                  className="text-[18px] text-white flex items-center justify-center underline"
                >
                  LOGIN
                </Text>{" "}
                NO APP PARA PODER FAVORITAR UM ESTABELECIMENTO!
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View className="w-screen h-screen flex justify-center items-center bg-zinc-600">
          <ActivityIndicator size="large" color={"#F5620F"} />
        </View>
      )}
      {dataUser && (
        <View className="absolute bottom-0 left-0 right-0">
          <BottomBlackMenu
            screen="Favorite"
            userPhoto={
              dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data
                ?.attributes?.url
                ? HOST_API +
                  dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data
                    ?.attributes?.url
                : ""
            }
            key={1}
            isMenuVisible={false}
            paddingTop={2}
          />
        </View>
      )}
    </View>
  );
}
