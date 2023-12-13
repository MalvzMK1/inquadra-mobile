import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { ScrollView } from "react-native-gesture-handler";
import MaskInput, { Masks } from "react-native-mask-input";
import { ActivityIndicator } from "react-native-paper";
import { z } from "zod";
import useAvailableSportTypes from "../../hooks/useAvailableSportTypes";
import useRegisterCourt from "../../hooks/useRegisterCourt";
import { useSportTypes } from "../../hooks/useSportTypesFixed";

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

export default function RegisterNewCourtAdded({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "RegisterNewCourtAdded">) {
  const [modalities, setModalities] = useState([]);
  const [minimumValue, setMinimumValue] = useState<string>("");
  const [courtName, setCourtName] = useState("");
  const [courtType, setCourtType] = useState("");
  const [fantasyName, setFantasyName] = useState("");
  const [photo, setPhoto] = useState(Array<string>);
  const [courtAvailabilities, setCourtAvailabilities] = useState(Array<string>);
  const [minValue, setMinValue] = useState("");
  const [courtTypes, setCourtTypes] = useState<CourtTypes>([]);
  const [registerCourt, { data, error, loading }] = useRegisterCourt();
  const {
    data: dataSportType,
    loading: sportLoading,
    error: sportError,
  } = useAvailableSportTypes();
  const {
    data: dataSportTypeAvaible,
    loading: loadingSportTypeAvaible,
    error: errorSportTypeAvaible,
  } = useSportTypes();
  const [courts, setCourts] = useState<CourtArrayObject[]>(
    route.params.courtArray
  );
  const [loadingMessage, setLoadingMessage] = useState(
    "Fazendo upload das imagens"
  );
  const [photoIDs, setPhotoIDs] = useState([]);

  const addToCourtArray = async (court: CourtAdd) => {
    setCourts((prevState) => [...prevState, court]);
  };

  useFocusEffect(
    React.useCallback(() => {
      setCourts(route.params.courtArray);
    }, [route.params.courtArray])
  );

  async function RegisterNewCourt(data: IFormDatasCourt) {
    setIsLoading(true);

    let courtIDs: Array<string> = [];

    selected.forEach((selectedType) => {
      courtTypes.forEach((type) => {
        if (type.value === selectedType) courtIDs.push(type.label);
      });
    });

    const uploadedImageIDs = await uploadImage();

    const payload = {
      court_name: `Quadra de ${selected}`,
      courtType: courtIDs,
      fantasyName: data.fantasyName,
      photos: uploadedImageIDs,
      court_availabilities: ["2"], // tela vinicius
      minimum_value: Number(data.minimum_value) / 100,
      currentDate: new Date().toISOString(),
    };
    addToCourtArray(payload);

    if (uploadedImageIDs.length > 0) {
      navigation.navigate("RegisterNewCourt", {
        courtArray: [...courts, payload],
      });
    }
  }

  async function finishingCourtsRegisters(data: IFormDatasCourt) {
    let courtIDs: Array<string> = [];

    selected.forEach((selectedType) => {
      courtTypes.forEach((type) => {
        if (type.value === selectedType) courtIDs.push(type.label);
      });
    });

    const uploadedImageIDs = await uploadImage();

    const payload = {
      court_name: `Quadra de ${selected}`,
      courtType: courtIDs,
      fantasyName: data.fantasyName,
      photos: uploadedImageIDs,
      court_availabilities: ["2"], // tela vinicius
      minimum_value: Number(data.minimum_value) / 100,
      currentDate: new Date().toISOString(),
    };
    addToCourtArray(payload);

    if (uploadedImageIDs.length > 0) {
      navigation.navigate("AllVeryWell", { courtArray: [...courts, payload] });
    }
  }

  const formSchema = z.object({
    minimum_value: z
      .string()
      .nonempty("É necessário determinar um valor mínimo."),
    fantasyName: z.string().nonempty("Diga um nome fantasia."),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<IFormDatasCourt>({
    resolver: zodResolver(formSchema),
  });

  interface IFormDatasCourt {
    court_name: string;
    minimum_value: string;
    courtType: string;
    fantasyName: string;
    photos: string[];
    court_availabilities?: string[];
  }

  const [isLoading, setIsLoading] = useState(false);

  const [photos, setPhotos] = useState([]);

  const [selected, setSelected] = useState<Array<string>>([]);

  const [isCourtTypeEmpty, setIsCourtTypeEmpty] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleProfilePictureUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Desculpe, precisamos da permissão para acessar a galeria!");
        return;
      }

      // const result = await ImagePicker.launchImageLibraryAsync({
      //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //     allowsEditing: true,
      //     aspect: [1, 1],
      //     quality: 1,
      //     allowsMultipleSelection: true,
      // });

      // if (!result.canceled) {
      //     setPhotos([...photos, { uri: result.uri }]);
      // }
    } catch (error) {
      console.log("Erro ao carregar a imagem: ", error);
    }
  };

  const uploadImage = async () => {
    setIsLoading(true);
    const apiUrl = "https://inquadra-api-uat.qodeless.io";

    const formData = new FormData();
    photos.forEach((uri, index) => {
      fetch(uri)
        .then((response) => response.blob())
        .then((blob) => {
          formData.append(`files`, blob, `image${index}.jpg`);
        });
    });

    try {
      const response = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImageIDs = response.data.map((image: any) => image.id);

      setIsLoading(false);

      return uploadedImageIDs;
    } catch (error) {
      console.error("Erro ao enviar imagens:", error);
      setIsLoading(false);
      return "Deu erro";
    }
  };

  const handleDeletePhoto = (index: any) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const dataSports = dataSportType?.courts?.data || [];

  useEffect(() => {
    let newCourtTypes: Array<{ value: string; label: string }> = [];
    if (!loadingSportTypeAvaible && !errorSportTypeAvaible)
      dataSportTypeAvaible?.courtTypes.data.forEach((sportType) => {
        newCourtTypes.push({
          value: sportType.attributes.name,
          label: sportType.id,
        });
      });

    setCourtTypes(newCourtTypes);
  }, [dataSportTypeAvaible, loadingSportTypeAvaible]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScrollView className="h-fit bg-white flex-1">
      <View className="items-center mt-9 p-4">
        <Text className="text-3xl text-center font-extrabold text-gray-700">
          Cadastro Quadra
        </Text>
      </View>
      <View className="h-fit">
        <View className="p-5 gap-7 flex flex-col justify-between">
          <View>
            <Text className="text-xl p-1">s:</Text>
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
                  inputStyles={{ color: "#FF6112", alignSelf: "center" }}
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
            <Text className="text-xl p-1">Nome fantasia da quadra?</Text>
            <Controller
              name="fantasyName"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="p-5 border border-neutral-400 rounded"
                  placeholder="Ex.: Quadra do Zeca"
                  value={value}
                  onChangeText={onChange}
                ></TextInput>
              )}
            />
            {errors?.fantasyName?.message && (
              <Text className="text-red-400 text-sm">
                {errors.fantasyName.message}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-xl p-1">Fotos da quadra</Text>
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
                          source={{ uri: item }}
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
            <Text className="text-xl p-1">Valor aluguel/hora</Text>
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
                  Defina um preço mínimo primeiramente para definir os horários
                </Text>
              </>
            )}
          </View>
          <View>
            <Text className="text-xl p-1">Sinal mínimo para locação</Text>
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
          <View className="border-t border-neutral-400 border-b flex flex-row p-5 items-center">
            <MaterialIcons
              name="add-box"
              size={38}
              color="#FF6112"
              onPress={() => {
                if (selected.length === 0) {
                  setIsCourtTypeEmpty(true);
                } else {
                  setIsCourtTypeEmpty(false);

                  if (!isLoading) {
                    setLoadingMessage("Fazendo upload das imagens...");
                    setIsLoading(true);
                    handleSubmit(RegisterNewCourt)();
                  }
                }
              }}
            />
            <Text
              className="pl-4 text-lg"
              onPress={() => {
                if (selected.length === 0) {
                  setIsCourtTypeEmpty(true);
                } else {
                  setIsCourtTypeEmpty(false);

                  if (!isLoading) {
                    setLoadingMessage("Fazendo upload das imagens...");
                    setIsLoading(true);
                    handleSubmit(RegisterNewCourt)();
                  }
                }
              }}
            >
              {" "}
              {isLoading ? (
                <View style={{ alignItems: "center", paddingTop: 5 }}>
                  <ActivityIndicator size="small" color="#FFFF" />
                  <Text style={{ marginTop: 6, color: "white" }}>
                    {loadingMessage}
                  </Text>
                </View>
              ) : (
                "Adicionar uma nova Quadra"
              )}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              className="h-14 w-81 rounded-md bg-[#FF6112] flex items-center justify-center"
              onPress={() => {
                if (selected.length === 0) {
                  setIsCourtTypeEmpty(true);
                } else {
                  setIsCourtTypeEmpty(false);

                  if (!isLoading) {
                    setLoadingMessage("Fazendo upload das imagens...");
                    setIsLoading(true);
                    handleSubmit(finishingCourtsRegisters)();
                  }
                }
              }}
            >
              <Text className="text-white">
                {isLoading ? (
                  <View style={{ alignItems: "center", paddingTop: 5 }}>
                    <ActivityIndicator size="small" color="#FFFF" />
                    <Text style={{ marginTop: 6, color: "white" }}>
                      {loadingMessage}
                    </Text>
                  </View>
                ) : (
                  "Concluir"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
