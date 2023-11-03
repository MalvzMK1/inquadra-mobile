import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  State as GestureState,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useGetUserById } from "../../hooks/useUserById";
import storage from "../../utils/storage";
import EstablishmentCardHome from "../CourtCardHome";
import { useFocusEffect } from "@react-navigation/native";
import { useState } from "react";

let userId: string;

storage
  .load({
    key: "userInfos",
  })
  .then(data => {
    userId = data.userId;
  })
  .catch(error => {
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

interface HomeBarProps {
  courts: Array<{
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    type: string;
    image: string;
    distance: number;
  }>;
  userName: string | undefined;
  chosenType: string | undefined;
  HandleSportSelected: Function;
  loggedUserId?: string;
}

const screenHeight = Dimensions.get("window").height;
const minHeightPercentage = 45;
const maxHeightPercentage = 85;
const minHeight = (minHeightPercentage / 100) * screenHeight;
const maxHeight = (maxHeightPercentage / 100) * screenHeight;
const expandThreshold = 0.015 * maxHeight;

export default function HomeBar({
  courts,
  userName,
  chosenType,
  HandleSportSelected,
  loggedUserId,
}: HomeBarProps) {
  const translateY = useSharedValue(0);
  const height = useSharedValue(minHeight);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      height: height.value,
      backgroundColor: "#292929",
      borderTopEndRadius: 20,
      borderTopStartRadius: 20,
    };
  });

  const {
    data: userByIdData,
    error: userByIdError,
    loading: userByIdLoading,
  } = useGetUserById(userId ?? "");

  let userFavoriteCourts: string[] = [];

  userByIdData?.usersPermissionsUser?.data?.attributes?.favorite_establishments?.data?.map(
    item => {
      userFavoriteCourts?.push(item.id);
    },
  );


  console.log("quadras favoritas:", userFavoriteCourts)
  
 

  const verifyCourtLike = (courtId: string) => {
    return userFavoriteCourts?.includes(courtId);
  };

  console.log(verifyCourtLike("2"))

  const result = courts.filter(item => {
    if (chosenType) {
      const ampersandSeparated = item.type.split(" & ").join(",").split(",");
      return ampersandSeparated.includes(chosenType);
    }
  });

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      className="w-full"
      style={[animatedStyle, { backgroundColor: "#292929" }]}
    >
      <PanGestureHandler
        onGestureEvent={event => {
          const translateYDelta = event.nativeEvent.translationY;

          if (translateYDelta < 0 && translateYDelta > -170) {
            translateY.value = translateYDelta + 100;
            height.value = minHeight - translateYDelta + 100;
          }
        }}
        onHandlerStateChange={event => {
          if (event.nativeEvent.state === GestureState.END) {
            const targetY = translateY.value;
            if (targetY * -1 >= expandThreshold) {
              height.value = withTiming(maxHeight, { duration: 500 });
              translateY.value = withSpring(-maxHeight - 125 + screenHeight);
            } else {
              height.value = withTiming(minHeight, { duration: 500 });
              translateY.value = withSpring(0);
            }
          }
        }}
      >
        <View className="flex items-center">
          <View className="w-1/3 h-[5px] rounded-full mt-[10px] bg-[#ff6112]"></View>
          <Text className="text-white text-lg font-black mt-3">
            Olá{userName ? `, ${userName}` : null}!
          </Text>
        </View>
      </PanGestureHandler>
      <ScrollView className="p-5">
        {courts !== undefined ? (
          chosenType ? (
            result.length > 0 ? (
              courts
                .filter(item => {
                  return item.type
                    .split(" & ")
                    .join(",")
                    .split(",")
                    .includes(chosenType);
                })
                .map(item => {
                  return (
                    <EstablishmentCardHome
                      key={item.id}
                      id={item.id}
                      userId={userId}
                      type={item.type}
                      name={item.name}
                      image={item.image}
                      distance={item.distance}
                      loggedUserId={loggedUserId}
                      liked={verifyCourtLike(item.id)}
                    />
                  );
                })
            ) : (
              <></>
            )
          ) : (
            courts.map(item => (
              <EstablishmentCardHome
                id={item.id}
                key={item.id}
                userId={userId}
                name={item.name}
                type={item.type}
                image={item.image}
                distance={item.distance}
                loggedUserId={loggedUserId}
                liked={verifyCourtLike(item.id)}
              />
            ))
          )
        ) : (
          <ActivityIndicator size="small" color="#fff" />
        )}

        <View className="h-10"></View>
      </ScrollView>
    </Animated.View>
  );
}
