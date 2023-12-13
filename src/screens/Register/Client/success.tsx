import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function RegisterSuccess({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "RegisterSuccess">) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <View className="h-full flex justify-center items-center">
      <View className="h-2/5 w-full flex flex-col justify-between items-center">
        <View className="w-3/4 flex flex-col justify-center items-center gap-5">
          <Text className="text-4xl text-center w-full font-semibold">
            Cadastro concluído com sucesso
          </Text>
          <Image
            source={require("../../../assets/orange_logo_inquadra.png")}
            className="w-24 h-24"
          ></Image>
        </View>
        <TouchableOpacity
          className="h-14 w-80 rounded-md bg-orange-500 flex items-center justify-center"
          onPress={() =>
            navigation.navigate(
              route.params.nextRoute,
              route.params.routePayload
            )
          }
        >
          <Text className="text-gray-50">Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
