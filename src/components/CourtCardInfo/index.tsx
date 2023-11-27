import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CourtCardInfo {
  id: string;
  userId: string;
  userPhoto: string | undefined;
  name: string;
  type: string;
  image: string;
  availabilities: boolean | undefined;
}

export function CourtCard(props: CourtCardInfo) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View className="flex flex-row items-center mb-[15px] mt-[10px]">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("CourtAvailabilityInfo", {
            courtName: props.name,
            courtImage: props.image,
            courtId: props.id,
            userId: props.userId,
            userPhoto: props.userPhoto,
          });
        }}
      >
        <Image
          className="h-[90px] w-[140px] rounded-[5px]"
          source={{ uri: props.image }}
        />
      </TouchableOpacity>
      <View className="ml-[15px]">
        <Text className="text-[#FF6112] text-[15px] leading-[24px]">
          {props.name}
        </Text>
        <Text className="text-[12px] leading-[20px] font-normal">
          {props.type}
        </Text>

        <Text className="text-[12px] leading-[20px] font-bold mt-4">
          {props.availabilities || props.availabilities == undefined
            ? "Possui"
            : "Não há"}{" "}
          horário disponível
        </Text>
      </View>
    </View>
  );
}
