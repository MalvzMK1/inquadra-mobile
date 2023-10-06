import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Image,
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
import useRegisterCourtAvailability from "../../hooks/useRegisterCourtAvailability";
import { useSportTypes } from "../../hooks/useSportTypesFixed";
import { Appointment } from "../CourtPriceHour";

const indexToWeekDayMap: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "SpecialDays",
};

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

interface CourtArrayObject {
  court_name: string;
  courtType: string[];
  fantasyName: string;
  photos: string[];
  court_availabilities: string[]; // tela vinicius
  minimum_value: number;
  currentDate: string;
}

type CourtTypes = Array<{ label: string; value: string }>;

export default function RegisterCourt({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "RegisterCourts">) {
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [courts, setCourts] = useState<CourtArrayObject[]>([]);
  const [courtTypes, setCourtTypes] = useState<CourtTypes>([]);
  const [isCourtTypeEmpty, setIsCourtTypeEmpty] = useState(false);
  const [photos, setPhotos] = useState<Array<{ uri: string }>>([]);
  const [registerCourtAvailability] = useRegisterCourtAvailability();
  const {
    data: dataSportTypeAvaible,
    loading: loadingSportTypeAvaible,
    error: errorSportTypeAvaible,
  } = useSportTypes();

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

    try {
      const courtIds: string[] = [];

      selected.forEach(selectedType => {
        courtTypes.forEach(type => {
          if (type.value === selectedType) {
            courtIds.push(type.label);
          }
        });
      });

      const [storageDayUse, storageAvailabilities] = await Promise.all([
        AsyncStorage.getItem("@inquadra/court-price-hour_day-use"),
        AsyncStorage.getItem("@inquadra/court-price-hour_all-appointments"),
      ]);

      let dayUse: boolean[];
      let allAvailabilities: Appointment[][];

      if (
        !storageDayUse ||
        !storageAvailabilities ||
        !(dayUse = JSON.parse(storageDayUse))?.length ||
        !(allAvailabilities = JSON.parse(storageAvailabilities))?.some(
          (availabilities: Appointment[]) => availabilities.length > 0,
        )
      ) {
        return Alert.alert("Erro", "Preencha os valores e horários.");
      }

      const [uploadedImageIds, courtAvailabilityIds] = await Promise.all([
        uploadImages(),
        Promise.all(
          allAvailabilities.flatMap((availabilities, index) => {
            return availabilities.map(async availability => {
              const { data } = await registerCourtAvailability({
                variables: {
                  status: true,
                  title: "O que deve vir aqui?",
                  day_use_service: dayUse[index],
                  starts_at: availability.startsAt,
                  ends_at: availability.endsAt,
                  value: Number(availability.price),
                  week_day: indexToWeekDayMap[index],
                },
              });

              if (!data) {
                throw new Error("No data");
              }

              return data.createCourtAvailability.data.id;
            });
          }),
        ),
      ]);

      const payload: CourtAdd = {
        court_name: `Quadra de ${selected}`,
        courtType: courtIds,
        fantasyName: data.fantasyName,
        photos: uploadedImageIds,
        court_availabilities: courtAvailabilityIds,
        minimum_value: Number(data.minimum_value) / 100,
        currentDate: new Date().toISOString(),
      };

      if (shouldRedirect) {
        navigation.navigate("AllVeryWell", {
          courtArray: [...courts, payload],
        });
      } else {
        await Promise.all([
          AsyncStorage.removeItem("@inquadra/court-price-hour_day-use"),
          AsyncStorage.removeItem(
            "@inquadra/court-price-hour_all-appointments",
          ),
        ]);

        reset();
        setPhotos([]);
        setSelected([]);
        setCourtTypes([]);
        setCourts(currentCourts => [...currentCourts, payload]);
      }
    } catch (error) {
      console.error("Erro ao enviar imagens:", error);
      Alert.alert("Erro", "Não foi possível registrar a quadra");
    } finally {
      setIsLoading(false);
    }
  }

  const registerNewCourt = handleSubmit(async (data: IFormDatasCourt) => {
    if (!photos.length) {
      return Alert.alert("Erro", "Selecione uma foto.");
    }

    await register(data);
  });

  const finishCourtsRegisters = handleSubmit(async (data: IFormDatasCourt) => {
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

  const uploadImages = async () => {
    const formData = new FormData();
    const apiUrl = "https://inquadra-api-uat.qodeless.io";

    for (let index = 0; index < photos.length; index++) {
      const { uri } = photos[index];
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append("files", blob, `image${index}.jpg`);
    }

    const response = await axios.post<Array<{ id: string }>>(
      `${apiUrl}/api/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const uploadedImageIDs = response.data.map(image => image.id);
    console.log("Imagens enviadas com sucesso!", response.data);
    return uploadedImageIDs;
  };

  const handleDeletePhoto = (index: any) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  useEffect(() => {
    let newCourtTypes: Array<{ value: string; label: string }> = [];
    if (!loadingSportTypeAvaible && !errorSportTypeAvaible) {
      dataSportTypeAvaible?.courtTypes.data.forEach(sportType => {
        newCourtTypes.push({
          value: sportType.attributes.name,
          label: sportType.id,
        });
      });
    }

    setCourtTypes(newCourtTypes);
  }, [dataSportTypeAvaible, loadingSportTypeAvaible]);

  return (
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
                    setSelected(val);
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
            <TouchableOpacity
              className="h-14 w-81 rounded-md bg-[#FF6112] flex items-center justify-center"
              onPress={() => navigation.navigate("CourtPriceHour")}
            >
              <Text className="text-white font-semibold text-base">
                Clique para definir
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text className="text-base p-1">Sinal mínimo para locação</Text>
            <Controller
              name="minimum_value"
              control={control}
              render={({ field: { onChange, value } }) => (
                <MaskInput
                  mask={Masks.BRL_CURRENCY}
                  keyboardType="numeric"
                  value={value}
                  placeholder="Ex.: R$ 00.00"
                  onChangeText={(masked, unmasked) => onChange(unmasked)}
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
          <TouchableOpacity
            className="border-t border-neutral-400 border-b flex flex-row p-5 items-center"
            onPress={() => {
              if (selected.length === 0) {
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
                if (selected.length === 0) {
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
                className="h-14 w-full rounded-md bg-[#FF6112] flex items-center justify-center"
                onPress={() => {
                  if (selected.length === 0) {
                    setIsCourtTypeEmpty(true);
                  } else {
                    setIsCourtTypeEmpty(false);
                    finishCourtsRegisters();
                  }
                }}
              >
                {isLoading ? (
                  <View
                    style={{
                      alignItems: "center",
                      paddingTop: 5,
                      flexDirection: "row",
                    }}
                  >
                    <ActivityIndicator size="small" color="#FFFF" />
                    <Text style={{ marginTop: 6, color: "white" }}>
                      Fazendo upload das imagens...
                    </Text>
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
  );
}
