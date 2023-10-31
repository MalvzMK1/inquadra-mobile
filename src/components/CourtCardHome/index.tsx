import { AntDesign } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import useUpdateFavoriteCourt from "../../hooks/useUpdateFavoriteCourt";
import { useGetUserById } from "../../hooks/useUserById";
import storage from "../../utils/storage";

export default function EstablishmentCardHome(props: CourtCardInfos) {
  const [userId, setUserId] = useState<string | undefined>("");

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [color, setColor] = useState(props.liked ? "red" : "white");

  const {
    data: userByIdData,
    error: userByIdError,
    loading: userByIdLoading,
  } = useGetUserById(userId ?? "");

  const [userFavoriteCourts, setUserFavoriteCourts] = useState<Array<string>>(
    [],
  );

  useEffect(() => {
    if (
      userByIdData &&
      userByIdData.usersPermissionsUser.data
    )
      userByIdData.usersPermissionsUser.data.attributes.favorite_establishments.data.map(
        item => {
          setUserFavoriteCourts(prevState => [...prevState, item.id]);
        },
      );
  }, [userByIdData])

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
  const handleUpdateCourtLike = (courtId: string): void => {
    const courtsData = [...userFavoriteCourts];

    if (userFavoriteCourts?.includes(courtId)) {
      const arrayWithoutDeletedItem = courtsData.filter(
        item => item !== courtId,
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
            setUserFavoriteCourts(arrayWithoutDeletedItem);
          });
    } else {
      courtsData.push(courtId);

      if (userId)
        updateLikedCourts({
          variables: {
            user_id: userId,
            favorite_establishment: courtsData,
          },
        })
          .catch(reason => alert(reason))
          .finally(() => {
            setUserFavoriteCourts(courtsData);
          });
    }
  };

  return (
    <View className="flex flex-row w-full justify-between">
      <TouchableOpacity
        className="flex flex-row  gap-x-[14px] mb-5 w-full"
        onPress={() => {
            navigation.navigate("EstablishmentInfo", {
              establishmentId: props.id,
              userId: userId,
              userPhoto: userByIdData?.usersPermissionsUser.data?.attributes.photo.data?.attributes.url ?? undefined,
            })
          }
        }
      >
        <Image
          className="w-[45%] max-w-[115px] h-[85px] rounded-[10px]"
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
        <TouchableOpacity
          onPress={() => {
            color == "white" ? setColor("red") : setColor("white");
            handleUpdateCourtLike(props.id);
          }}
        >
          <AntDesign name="heart" size={20} color={color} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
