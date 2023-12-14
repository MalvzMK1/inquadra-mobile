import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  State as GestureState,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  AnimatedStyleProp,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useUser } from "../../context/userContext";
import { useGetUserById } from "../../hooks/useUserById";
import EstablishmentCardHome from "../CourtCardHome";

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
  isUpdated?: number;
  isUserInfosLoading: boolean;
  isCourtsLoading?: boolean;
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
  isUpdated,
  isUserInfosLoading,
  isCourtsLoading,
}: HomeBarProps) {
  const { userData } = useUser();
  const translateY = useSharedValue(0);
  const height = useSharedValue(minHeight);

  const animatedStyle: AnimatedStyleProp<ViewStyle> = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      height: height.value,
      backgroundColor: "#292929",
      borderTopEndRadius: 20,
      borderTopStartRadius: 20,
    } as AnimatedStyleProp<ViewStyle>;
  });

  const {
    data: userByIdData,
    error: userByIdError,
    loading: userByIdLoading,
  } = useGetUserById(userData?.id ?? "");

  const [isLoaded, setIsLoaded] = useState<boolean>();
  const [userFavoriteCourts, setUserFavoriteCourts] = useState<Array<string>>(
    [],
  );

  const resetUserInfos = async () => {
    if (
      userByIdData &&
      userByIdData.usersPermissionsUser.data &&
      userByIdData.usersPermissionsUser.data.attributes.favorite_establishments
        .data.length > 0
    ) {
      const idsEstablishementsLikeds =
        userByIdData?.usersPermissionsUser?.data?.attributes?.favorite_establishments?.data?.map(
          item => {
            return item.id;
          },
        );

      setUserFavoriteCourts(idsEstablishementsLikeds!);
    }
  };

  useEffect(() => {
    if (!userByIdError && !userByIdLoading) {
      setIsLoaded(true);
    }
  }, [userByIdError, userByIdLoading]);

  useEffect(() => {
    if (isLoaded) {
      resetUserInfos();
    }
  }, [isLoaded]);

  const verifyCourtLike = (courtId: string) => {
    return userFavoriteCourts?.includes(courtId);
  };

  const filteredCourts = useMemo(() => {
    if (!chosenType) {
      return courts;
    }

    return courts.filter(item => {
      return item.type.split(" & ").join(",").split(",").includes(chosenType);
    });
  }, [courts, chosenType]);

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      className="w-full"
      style={animatedStyle}
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
          <View className="w-1/3 h-[5px] rounded-full mt-[10px] bg-[#ff6112]" />
          {isUserInfosLoading ? (
            <ActivityIndicator
              size={"small"}
              color={"#FF6112"}
              className={"h-7"}
            />
          ) : (
            <Text className="text-white text-lg font-black mt-3">
              Olá{userName ? `, ${userName}` : null}!
            </Text>
          )}
        </View>
      </PanGestureHandler>

      {isCourtsLoading ? (
        <ActivityIndicator size="large" color="#FF6112" />
      ) : // <FlatList
      //   data={filteredCourts}
      //   keyExtractor={item => item.id}
      //   contentContainerStyle={{ padding: 20, paddingBottom: 64 }}
      //   ListEmptyComponent={() => (
      //     <Text className="text-white text-sm font-medium">
      //       Não há quadras para exibir...
      //     </Text>
      //   )}
      //   renderItem={({ item }) => (
      //     <EstablishmentCardHome
      //       id={item.id}
      //       name={item.name}
      //       type={item.type}
      //       image={item.image}
      //       updated={isUpdated}
      //       distance={item.distance}
      //       liked={verifyCourtLike(item.id)}
      //       userFavoriteCourts={userFavoriteCourts}
      //       setUserFavoriteCourts={setUserFavoriteCourts}
      //     />
      //   )}
      // />
      filteredCourts.length === 0 ? (
        <View className="pt-7 flex items-center justify-center">
          <Text className="text-white text-base justify-center items-center flex font-medium">
            Não há quadras para exibir...
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          {filteredCourts.map(item => (
            <EstablishmentCardHome
              key={item.id}
              id={item.id}
              name={item.name}
              type={item.type}
              image={item.image}
              updated={isUpdated}
              distance={item.distance}
              liked={verifyCourtLike(item.id)}
              userFavoriteCourts={userFavoriteCourts}
              setUserFavoriteCourts={setUserFavoriteCourts}
            />
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
}
