import { AntDesign } from "@expo/vector-icons";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import useUpdateFavoriteCourt from "../../hooks/useUpdateFavoriteCourt";
import { useGetUserById } from "../../hooks/useUserById";
import storage from "../../utils/storage";
import React from "react";

export default function EstablishmentCardHome(props: CourtCardInfos) {
  const [userId, setUserId] = useState<string | undefined>("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [color, setColor] = useState<string>("white");
  const [isLoaded, setIsLoaded] = useState<boolean>()
  const [isLikeLoading, setIsLikeLoading] = useState<boolean>();

  const {
    data: userByIdData,
    error: userByIdError,
    loading: userByIdLoading,
  } = useGetUserById(userId ?? "");

  useEffect(() => {
    if (!userByIdError && !userByIdLoading) {
      setIsLoaded(true)
    }
  }, [userByIdError, userByIdLoading])

  useEffect(() => {
    if (isLoaded) {
      props.liked
        ? setColor("red")
        : setColor("white");
    }
  }, [isLoaded]);

  useEffect(() => {
    storage
      .load<UserInfos>({
        key: "userInfos",
      })
      .then(data => {
        setUserId(data.userId);
      })
      .catch(error => {
        if (error instanceof Error) {
          if (error.name === 'NotFoundError') {
            console.log('The item wasn\'t found.');
            setUserId(undefined)
          } else if (error.name === 'ExpiredError') {
            console.log('The item has expired.');
            storage.remove({
              key: 'userInfos'
            }).then(() => {
              console.log('The item has been removed.');
              setUserId(undefined)
            })
          } else {
            console.log('Unknown error:', error);
            setUserId(undefined)
          }
        }
      });
  }, [userByIdData]);

  const [updateLikedCourts, { data, error, loading }] =
    useUpdateFavoriteCourt();


  const handleUpdateCourtLike = async (courtId: string): Promise<void> => {
    setIsLikeLoading(true);
    const courtsData = props.userFavoriteCourts;

    if (props.userFavoriteCourts?.includes(courtId)) {
      const arrayWithoutDeletedItem = courtsData.filter(
        (item: string) => item !== courtId,
      );
      if (userId)
        updateLikedCourts({
          variables: {
            user_id: userId,
            favorite_establishment: arrayWithoutDeletedItem,
          },
        })
          .catch(reason => alert(reason))
          .finally(() => {
            props.setUserFavoriteCourts(arrayWithoutDeletedItem);
            setIsLikeLoading(false);
          });
    } else {
      if (userId) {
        const updatedCourts = [...props.userFavoriteCourts, courtId];
        await updateLikedCourts({
          variables: {
            user_id: userId,
            favorite_establishment: updatedCourts,
          },
        })
          .then(() => setIsLikeLoading(false))
          .catch(reason => {
            alert(reason);
            setIsLikeLoading(false);
          }).finally(() => {props.setUserFavoriteCourts(updatedCourts)})
      }
    }
  };

  return (
    <View className="flex flex-row w-full justify-between">
      {
        isLoaded
          ?
          <>
            <TouchableOpacity
              className="flex flex-row  gap-x-[14px] mb-5 flex-1"
              onPress={() => {
                navigation.navigate("EstablishmentInfo", {
                  establishmentId: props.id,
                  userId: userId,
                  userPhoto: userByIdData?.usersPermissionsUser.data?.attributes.photo.data?.attributes.url ?? undefined,
                  colorState: color,
                  setColorState: setColor
                })
              }
              }
            >
              <Image
                className="w-[45%] w-[115px] h-[85px] rounded-[10px]"
                source={{ uri: props.image }}
              />
              <View className="flex mt-1">
                <Text className="text-[#ff6112] font-black text-[15px]">
                  {props.name}
                </Text>
                <Text className="text-white font-bold text-xs">
                  {Array.isArray(props.type) ? props.type.join(" & ") : props.type}
                </Text>
                <Text className="text-white font-bold text-xs">
                  {props.distance.toFixed(2).replace(".", ",")}km
                </Text>
              </View>
            </TouchableOpacity>
            {props.loggedUserId ? (
              !isLikeLoading ?
                <TouchableOpacity
                  onPress={() => {
                    console.log("click")
                    color === "white" ? setColor("red") : setColor("white");
                    console.log("changed", color)
                    handleUpdateCourtLike(props.id)
                  }}
                >
                  <AntDesign name="heart" size={20} color={color} />
                </TouchableOpacity>
                : <TouchableOpacity >
                  <ActivityIndicator size={'small'} color={'red'} />
                </TouchableOpacity>

            ) : null}
          </>
          : userId !== "" && userId !== undefined
            ? <View className="w-max h-max flex justify-center items-center"><ActivityIndicator size={48} color="#FF6112" /></View>
            : <>
              <TouchableOpacity
                className="flex flex-row  gap-x-[14px] mb-5 flex-1"
                onPress={() => {
                  navigation.navigate("EstablishmentInfo", {
                    establishmentId: props.id,
                    userId: userId,
                    userPhoto: userByIdData?.usersPermissionsUser.data?.attributes.photo.data?.attributes.url ?? undefined,
                    colorState: color,
                    setColorState: setColor
                  })
                }
                }
              >
                <Image
                  className="w-[45%] w-[115px] h-[85px] rounded-[10px]"
                  source={{ uri: props.image }}
                />
                <View className="flex mt-1">
                  <Text className="text-[#ff6112] font-black text-[15px]">
                    {props.name}
                  </Text>
                  <Text className="text-white font-bold text-xs">
                    {Array.isArray(props.type) ? props.type.join(" & ") : props.type}
                  </Text>
                  <Text className="text-white font-bold text-xs">
                    {props.distance.toFixed(2).replace(".", ",")}km
                  </Text>
                </View>
              </TouchableOpacity>
            </>
      }

    </View>
  );
}
