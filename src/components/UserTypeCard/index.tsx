import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { UserTypeCardType } from "../../types/UserTypeCard";

export function UserTypeCard(props: UserTypeCardType) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View className="w-full p-6 bg-white rounded-lg shadow-xl flex flex-col justify-evenly items-center">
      <Image source={props.image}></Image>
      <Text className="text-3xl font-semibold">{props.title}</Text>
      <Text className="text-lg w-4/6 flex text-center">{props.subtitle}</Text>

      <TouchableOpacity
        className="h-14 w-60 mt-4 rounded-md bg-orange-500 flex items-center justify-center"
        onPress={() => navigation.navigate("Register", { flow: props.flow })}
      >
        <Text className="text-white text-base">Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}
