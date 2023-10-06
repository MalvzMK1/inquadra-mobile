import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import useRegisterCourt from "../../hooks/useRegisterCourt";

export default function AllVeryWell({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "AllVeryWell">) {
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
      <View className="px-4 gap-3 flex-1 bg-white">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={goBack}>
            <Icon name="arrow-back" size={24} color="#4E4E4E" />
          </TouchableOpacity>

          <Text className="text-[32px] text-[#4E4E4E] font-semibold -translate-x-3">
            Tudo Certo ?
          </Text>

          <View />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CourtDetails", {
              courtArray: courts,
            });
          }}
        >
          <View>
            <Text className="text-xl p-2">Detalhes Gerais</Text>

            <View className="border rounded border-orange-400 p-5">
              <Text className="text-base">
                {courts.length} quadras cadastradas
              </Text>

              <Text className="text-base">
                Total de{" "}
                {courts.reduce(
                  (totalPhotos, court) => totalPhotos + court.photos.length,
                  0,
                )}{" "}
                fotos
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <FlatList
          data={courts}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item: court }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CourtDetails", { courtArray: courts });
              }}
            >
              <View>
                <Text className="text-xl p-2">{court.court_name}</Text>

                <View className="border rounded border-orange-400 p-5">
                  {court.photos.length > 1 ? (
                    <Text className="text-base">
                      Total de {court.photos.length} fotos cadastradas
                    </Text>
                  ) : (
                    <Text className="text-base">
                      Total de {court.photos.length} foto cadastrada
                    </Text>
                  )}
                  {court.court_availabilities.length > 0 ? (
                    <Text className="text-base">
                      Valores e horários editados
                    </Text>
                  ) : (
                    <Text className="text-base">
                      Valores e horarios não editados
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <View className="bg-white">
        <TouchableOpacity
          className="h-14 w-81 m-6 rounded-md bg-[#FF6112] flex items-center justify-center"
          onPress={handleComplete}
        >
          <Text className="text-gray-50">Concluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
