import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

export default function CourtDetails({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "CourtDetails">) {
  const courts = route.params.courtArray;

  return (
    <View className="flex-1 pt-12">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon name="arrow-back" size={24} color="#4E4E4E" />
        </TouchableOpacity>

        <Text className="text-[32px] text-[#4E4E4E] font-semibold -translate-x-3">
          Tudo Certo ?
        </Text>

        <View />
      </View>

      <Text className="p-2 pt-6 text-2xl">Detalhes Quadra</Text>

      <FlatList
        data={courts}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item: court }) => (
          <View className="bg-[#292929]">
            <View className="flex flex-row pl-5 pt-5 pb-5">
              <Image
                className="w-2/5"
                source={require("../../../assets/quadra.png")}
              />

              <View className="w-4/6 pr-5">
                <View className="flex flex-row pr-2">
                  <Text className="text-[#FF6112] font-bold pl-2 flex-grow">
                    {court.fantasyName}
                  </Text>

                  <Ionicons
                    size={20}
                    name="pencil"
                    color="#FF6112"
                    onPress={() => navigation.pop(2)}
                  />
                </View>

                <Text className="text-white font-bold pl-2">
                  Valor inicial: {court.minimum_value} reais
                </Text>

                <Text className="text-white font-bold pl-2">
                  Locação de: Terça a Domingo
                </Text>

                <Text className="text-white font-bold pl-2">
                  Day User: Habilitado
                </Text>

                <Text className="text-white font-bold pl-2">
                  Horário: das 06:00 as 23:00
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        className="h-14 w-81 m-6 rounded-md bg-[#FF6112] flex items-center justify-center"
        onPress={navigation.goBack}
      >
        <Text className="text-gray-50">Concluir</Text>
      </TouchableOpacity>
    </View>
  );
}
