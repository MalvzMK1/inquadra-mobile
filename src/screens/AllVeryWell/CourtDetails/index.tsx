import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Alert, FlatList, Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import useRegisterCourt from "../../../hooks/useRegisterCourt";

export default function CourtDetails({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "CourtDetails">) {
  const { goBack } = useNavigation();
  const [addCourt] = useRegisterCourt();

  const courts = route.params.courtArray;

  async function handleComplete() {
    try {
      const establishmentId = await AsyncStorage.getItem(
        "@inquadra/registering-establishment-id",
      );

      if (!establishmentId) {
        throw new Error("Could not find establishment id in async storage");
      }

      await Promise.all(
        courts.map(court => {
          return addCourt({
            variables: {
              court_name: court.court_name,
              courtTypes: court.courtType,
              fantasyName: court.fantasyName,
              photos: court.photos,
              court_availabilities: court.court_availabilities,
              minimum_value: court.minimum_value,
              current_date: new Date().toISOString(),
              establishmentId,
            },
          });
        }),
      );

      navigation.navigate("CompletedEstablishmentRegistration");
    } catch (error) {
      console.log("Erro externo:", error);
      Alert.alert("Erro", "Não foi possível cadastrar as quadras");
    }
  }

  return (
    <View className="flex-1 pt-12">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity onPress={goBack}>
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
        renderItem={({ item: court, index }) => (
          <View className="bg-[#292929]">
            <View className="flex flex-row pl-5 pt-5 pb-5">
              <Image
                source={require("../../../assets/quadra.png")}
                className="w-2/5"
              />

              <View className="w-4/6 pr-5">
                <View className="flex flex-row pr-2">
                  <Text className="text-[#FF6112] font-bold pl-2 flex-grow">
                    {court.fantasyName}
                  </Text>

                  <Ionicons
                    name="pencil"
                    size={20}
                    color="#FF6112"
                    onPress={() => {
                      navigation.navigate("editCourt", {
                        courtArray: courts,
                        indexCourtArray: index,
                      });
                    }}
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
        onPress={handleComplete}
      >
        <Text className="text-gray-50">Concluir</Text>
      </TouchableOpacity>
    </View>
  );
}
