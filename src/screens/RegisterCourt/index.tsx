import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { ScrollView } from "react-native-gesture-handler";
import MaskInput, { Masks } from "react-native-mask-input";
import { ActivityIndicator } from "react-native-paper";
import { z } from "zod";
import { useSportTypes } from "../../hooks/useSportTypesFixed";
import { AsyncStorageKeys } from "../../utils/constants";
import { Appointment } from "../CourtPriceHour";

const availabilityTimeRegex = /^\d{2}:\d{2}$/;

const formSchema = z.object({
  minimum_value: z
    .string()
    .nonempty("É necessário determinar um valor mínimo."),
  fantasyName: z.string().nonempty("Diga um nome fantasia."),
});

interface IFormDatasCourt {
  court_name: string;
  minimum_value: string;
  courtType: string;
  fantasyName: string;
  photos: string[];
  court_availabilities?: string[];
}

type CourtTypes = Array<{ label: string; value: string }>;

export default function RegisterCourt({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "RegisterCourts">) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourtTypes, setSelectedCourtTypes] = useState<string[]>([]);
  const [courts, setCourts] = useState<CourtAddRawPayload[]>([]);
  const [isCourtTypeEmpty, setIsCourtTypeEmpty] = useState(false);
  const [photos, setPhotos] = useState<Array<{ uri: string }>>([]);
  const { data: dataSportTypeAvailable } = useSportTypes();
  const [minimumValue, setMinimumValue] = useState<string>("");

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormDatasCourt>({
    resolver: zodResolver(formSchema),
  });

  async function register(data: IFormDatasCourt, shouldRedirect = false) {
    setIsLoading(true);

    const [storageDayUse, storageAvailabilities] = await Promise.all([
      AsyncStorage.getItem(AsyncStorageKeys.CourtPriceHourDayUse),
      AsyncStorage.getItem(AsyncStorageKeys.CourtPriceHourAllAppointments),
    ]);

    const selectedCourtTypeIds: string[] = [];

    selectedCourtTypes.forEach(selectedType => {
      courtTypes.forEach(type => {
        if (type.value === selectedType) {
          selectedCourtTypeIds.push(type.label);
        }
      });
    });

    try {
      let dayUse: boolean[];
      let allAvailabilities: Appointment[][];

      if (
        storageDayUse &&
        storageAvailabilities &&
        (dayUse = JSON.parse(storageDayUse) as typeof dayUse).length &&
        (allAvailabilities = JSON.parse(
          storageAvailabilities,
        ) as typeof allAvailabilities).some(
          availabilities => availabilities.length > 0,
        )
      ) {
        const areAvailabilitiesValid = allAvailabilities.every(
          availabilities => {
            return availabilities.every(availability => {
              const isStartValid = availabilityTimeRegex.test(
                availability.startsAt,
              );

              const isEndValid = availabilityTimeRegex.test(
                availability.endsAt,
              );

              const isPriceValid =
                Boolean(availability.price) &&
                !isNaN(
                  Number(
                    availability.price
                      .replace("R$", "")
                      .replace(".", "")
                      .replace(",", ".")
                      .trim(),
                  ),
                );

              return isStartValid && isEndValid && isPriceValid;
            });
          },
        );

        if (!areAvailabilitiesValid) {
          return Alert.alert(
            "Erro",
            "Preencha todos os horários e valores corretamente.",
          );
        }

        const payload: CourtAddRawPayload = {
          court_name: data.court_name,
          courtType: selectedCourtTypeIds,
          minimum_value: Number(data.minimum_value) / 100,
          fantasyName: data.fantasyName,
          photos,
          court_availabilities: allAvailabilities,
          dayUse,
          currentDate: new Date().toISOString(),
        };

        if (shouldRedirect) {
          navigation.navigate("AllVeryWell", {
            courtArray: [...courts, payload],
            profileInfos: route.params.profileInfos,
            establishmentInfos: route.params.establishmentInfos,
          });
        } else {
          await Promise.all([
            AsyncStorage.removeItem(AsyncStorageKeys.CourtPriceHourDayUse),
            AsyncStorage.removeItem(
              AsyncStorageKeys.CourtPriceHourAllAppointments,
            ),
          ]);

          reset();
          setPhotos([]);
          setSelectedCourtTypes([]);
          setCourts(prevState => [...prevState, payload]);
        }
      } else {
        Alert.alert("Erro", "Preencha os valores e horários.");
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      Alert.alert("Erro", "Não foi possível registrar a quadra");
    } finally {
      setIsLoading(false);
    }
  }

  const registerNewCourt = handleSubmit(async data => {
    if (!photos.length) {
      return Alert.alert("Erro", "Selecione uma foto.");
    }

    await register(data);
  });

  const finishCourtsRegisters = handleSubmit(async data => {
    if (!photos.length) {
      return Alert.alert("Erro", "Selecione uma foto.");
    }

    await register(data, true);
  });

  const handleProfilePictureUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        return Alert.alert(
          "Erro",
          "Desculpe, precisamos da permissão para acessar a galeria!",
        );
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        setPhotos(currentPhotos => {
          return currentPhotos.concat(
            result.assets.map(asset => ({ uri: asset.uri })),
          );
        });
      }
    } catch (error) {
      console.log("Erro ao carregar a imagem: ", error);
    }
  };

  const handleDeletePhoto = (index: any) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const courtTypes = useMemo((): Array<{ value: string; label: string }> => {
    if (!dataSportTypeAvailable) {
      return [];
    }

    return dataSportTypeAvailable.courtTypes.data.map(sportType => {
      return {
        value: sportType.attributes.name,
        label: sportType.id,
      };
    });
  }, []);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView className="h-fit bg-white flex-1">
        <View className="items-center mt-9 p-4">
          <Text className="text-3xl text-center font-semibold text-gray-700">
            Cadastro Quadra
          </Text>
        </View>
        <View className="h-fit">
          <View className="p-5 gap-7 flex flex-col justify-between">
            <View>
              <Text className="text-base p-1">Selecione a modalidade:</Text>
              <Controller
                name="courtType"
                control={control}
                render={({ field: { onChange } }) => (
                  <MultipleSelectList
                    setSelected={(val: []) => {
                      setSelectedCourtTypes(val);
                      onChange([val]);
                    }}
                    data={courtTypes}
                    save="value"
                    placeholder="Selecione aqui..."
                    label="Modalidades escolhidas:"
                    boxStyles={{ borderRadius: 4, minHeight: 55 }}
                    inputStyles={{
                      color: "#FF6112",
                      alignSelf: "center",
                      fontWeight: "600",
                    }}
                    searchPlaceholder="Procurar"
                    badgeStyles={{ backgroundColor: "#FF6112" }}
                    closeicon={
                      <Ionicons name="close" size={20} color="#FF6112" />
                    }
                    searchicon={
                      <Ionicons
                        name="search"
                        size={18}
                        color="#FF6112"
                        style={{ marginEnd: 10 }}
                      />
                    }
                    arrowicon={
                      <AntDesign
                        name="down"
                        size={13}
                        color="#FF6112"
                        style={{ marginEnd: 2, alignSelf: "center" }}
                      />
                    }
                  />
                )}
              />
              {isCourtTypeEmpty === true ? (
                <Text className="text-red-400 text-sm">
                  É necessário inserir pelo menos um tipo de quadra
                </Text>
              ) : null}
            </View>
            <View>
              <Text className="text-base p-1">Nome fantasia da quadra</Text>
              <Controller
                name="fantasyName"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="p-5 border border-neutral-400 rounded"
                    placeholder="Ex.: Quadra do Zeca"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors?.fantasyName?.message && (
                <Text className="text-red-400 text-sm">
                  {errors.fantasyName.message}
                </Text>
              )}
            </View>
            <View>
              <Text className="text-base p-1">Fotos da quadra</Text>
              <View className="border border-dotted border-neutral-400 rounded relative">
                <View
                  className="flex flex-row items-center"
                  style={{ justifyContent: "space-between", height: 130 }}
                >
                  <Text
                    className="text-base text-gray-300 font-bold m-6 "
                    onPress={handleProfilePictureUpload}
                  >
                    Carregue suas fotos aqui.
                  </Text>
                  <Ionicons
                    name="star-outline"
                    size={20}
                    color="#FF6112"
                    style={{ marginEnd: 20 }}
                    onPress={handleProfilePictureUpload}
                  />
                </View>
                <Controller
                  name="photos"
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <FlatList
                      className="h-max"
                      data={photos}
                      renderItem={({ item, index }) => (
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            source={{ uri: item.uri }}
                            style={{ width: 100, height: 100, margin: 10 }}
                          />
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              right: 0,
                              left: 0,
                              bottom: 0,
                              top: 0,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onPress={() => handleDeletePhoto(index)}
                          >
                            <Ionicons name="trash" size={25} color="#FF6112" />
                          </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal
                    />
                  )}
                />
              </View>
            </View>
            <View>
              <Text className="text-base p-1">Valor aluguel/hora</Text>
              {minimumValue !== undefined &&
              minimumValue !== null &&
              minimumValue !== "" ? (
                <>
                  <TouchableOpacity
                    className="h-14 w-81 rounded-md bg-[#FF6112] flex items-center justify-center"
                    onPress={() =>
                      navigation.navigate("CourtPriceHour", {
                        minimumCourtPrice: minimumValue,
                      })
                    }
                  >
                    <Text className="text-white font-semibold text-base">
                      Clique para definir
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    className="h-14 w-81 rounded-md bg-gray-400 flex items-center justify-center"
                    onPress={() => {}}
                  >
                    <Text className="text-white font-semibold text-base">
                      Clique para definir
                    </Text>
                  </TouchableOpacity>
                  <Text className="text-base text-gray-300 font-bold m-6 ">
                    Defina um preço mínimo primeiramente para definir os
                    horários
                  </Text>
                </>
              )}
            </View>
            <View>
              <Text className="text-base p-1">Sinal mínimo para locação</Text>
              <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
                <Ionicons name="information-circle" size={25} color="#FF6112" />
              </TouchableOpacity>
              <Controller
                name="minimum_value"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <MaskInput
                    mask={Masks.BRL_CURRENCY}
                    keyboardType="numeric"
                    value={value}
                    placeholder="Ex.: R$ 00.00"
                    onChangeText={(masked, unmasked) => {
                      onChange(unmasked), setMinimumValue(unmasked);
                    }}
                    className="p-5 border border-neutral-400 rounded"
                  />
                )}
              />

              {errors.minimum_value && (
                <Text className="text-red-400 text-sm">
                  {errors.minimum_value.message}
                </Text>
              )}
            </View>
            <Modal
              visible={infoModalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setInfoModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#FF6112",
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  <Text className="text-white font-semibold text-base">
                    O valor do sinal deve ser menor que o Valor/Hora de aluguel
                    da quadra.
                  </Text>
                  <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                    <Text className="text-black font-semibold text-base mt-2">
                      Fechar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <TouchableOpacity
              className="border-t border-neutral-400 border-b flex flex-row p-5 items-center"
              onPress={() => {
                if (selectedCourtTypes.length === 0) {
                  setIsCourtTypeEmpty(true);
                } else {
                  setIsCourtTypeEmpty(false);
                  registerNewCourt();
                }
              }}
            >
              <MaterialIcons
                name="add-box"
                size={38}
                color="#FF6112"
                onPress={() => {
                  if (selectedCourtTypes.length === 0) {
                    setIsCourtTypeEmpty(true);
                  } else {
                    setIsCourtTypeEmpty(false);
                    registerNewCourt();
                  }
                }}
              />
              <Text className="pl-4 text-lg">
                {isLoading ? (
                  <View style={{ alignItems: "center", paddingTop: 5 }}>
                    <ActivityIndicator size="small" color="#FFFF" />
                    <Text style={{ marginTop: 6, color: "white" }}>
                      Fazendo upload das imagens...
                    </Text>
                  </View>
                ) : (
                  "Adicionar uma nova Quadra"
                )}
              </Text>
            </TouchableOpacity>
            <View>
              <View>
                <TouchableOpacity
                  className="h-14 w-full rounded-md bg-[#FF6112] items-center justify-center"
                  onPress={() => {
                    if (selectedCourtTypes.length === 0) {
                      setIsCourtTypeEmpty(true);
                    } else {
                      setIsCourtTypeEmpty(false);
                      finishCourtsRegisters();
                    }
                  }}
                >
                  {isLoading ? (
                    <View className="flex-row items-center space-x-2">
                      <ActivityIndicator size="small" color="#FFFF" />
                      <Text className="text-white">Carregando...</Text>
                    </View>
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      Concluir
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
