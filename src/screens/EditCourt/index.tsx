import { HOST_API } from "@env";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios/index";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import MaskInput, { Masks } from "react-native-mask-input";
import { z } from "zod";
import BottomBlackMenuEstablishment from "../../components/BottomBlackMenuEstablishment";
import { useUser } from "../../context/userContext";
import { CreateCourtAvailabilitiesVariables } from "../../graphql/mutations/createCourtAvailabilities";
import useCourtById from "../../hooks/useCourtById";
import useCreateCourtAvailabilities from "../../hooks/useCreateCourtAvailabilities";
import { useSportTypes } from "../../hooks/useSportTypesFixed";
import useUpdateCourt from "../../hooks/useUpdateCourt";
import {
  AsyncStorageKeys,
  indexToWeekDayMap,
  weekDayToIndexMap,
} from "../../utils/constants";
import { formatCurrency } from "../../utils/formatCurrency";
import { Appointment } from "../CourtPriceHour";

interface ICourtFormData {
  fantasyName: string;
  minimumScheduleValue: number;
}

const courtFormSchema = z.object({
  fantasyName: z
    .string({ required_error: "Insira um nome!" })
    .min(1, "Insira um nome!"),
  minimumScheduleValue: z.number({ required_error: "Insira um valor!" }),
});

export default function EditCourt({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "EditCourt">) {
  const { userData } = useUser();
  const courtId = route.params.courtId;

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ICourtFormData>({
    resolver: zodResolver(courtFormSchema),
  });

  const { data: courtByIdData, loading: loadingCourt } = useCourtById(
    courtId ?? "",
    {
      fetchPolicy: "cache-and-network",
      onCompleted(data) {
        if (data && data.court.data) {
          setPhoto(
            HOST_API +
              data.court.data?.attributes.photo.data[0]?.attributes.url ??
              undefined,
          );

          setValue("fantasyName", data.court.data.attributes.fantasy_name);

          setMinimumScheduleValue(
            data.court.data.attributes.minimumScheduleValue,
          );
          setValue(
            "minimumScheduleValue",
            data.court.data.attributes.minimumScheduleValue,
          );
        }
      },
    },
  );

  const [photo, setPhoto] = useState<string | undefined>();
  const { data: sportTypesData } = useSportTypes();
  const [updateCourtHook] = useUpdateCourt();
  const [isOpeningCourtPriceHour, setIsOpeningCourtPriceHour] = useState(false);
  const [createCourtAvailabilities] = useCreateCourtAvailabilities();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedCourtTypesObject, setSelectedCourtTypesObject] = useState<
    { id: string; name: string }[]
  >([]);

  const courtTypesData: { name: string; id: string }[] = [];
  sportTypesData?.courtTypes.data.forEach(sportItem => {
    courtTypesData.push({ name: sportItem.attributes.name, id: sportItem.id });
  });

  interface ICourtTypes {
    id: string;
    name: string;
  }

  const allCourtTypesJson: ICourtTypes[] = [];
  sportTypesData?.courtTypes.data.forEach(sportTypeItem => {
    allCourtTypesJson.push({
      id: sportTypeItem.id,
      name: sportTypeItem.attributes.name,
    });
  });

  useEffect(() => {
    // para limpar valores que possam estar salvo da tela de CourtPriceHour quando entrar nessa página
    Promise.all([
      AsyncStorage.removeItem(AsyncStorageKeys.CourtPriceHourDayUse),
      AsyncStorage.removeItem(AsyncStorageKeys.CourtPriceHourAllAppointments),
    ]).catch(console.error);
  }, []);

  let courtPhotos: string[] = [];
  courtByIdData?.court.data.attributes.photo.data.forEach(photoItem => {
    courtPhotos.push(photoItem.id);
  });

  async function uploadNewCourtImage(): Promise<string[] | undefined> {
    try {
      setIsLoading(true);

      if (photo) {
        const formData = new FormData();

        formData.append("files", {
          uri: photo,
          name: "court.jpg",
          type: "image/jpeg",
        } as any);

        const response = await axios.post(`${HOST_API}/api/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const uploadedImageIDs: string[] = response.data.map(
          (image: any) => image.id,
        );

        return uploadedImageIDs;
      }
    } catch (error) {
      console.error("Erro ao enviar imagens:", JSON.stringify(error, null, 2));
      throw new Error("Não foi possível realizar o upload", {
        cause: JSON.stringify(error, null, 2),
      });
    } finally {
      setIsLoading(false);
    }
  }

  const courtTypes: { id: string; name: string }[] = [];
  if (
    courtByIdData?.court.data.attributes.court_types != null ||
    courtByIdData?.court.data.attributes.court_types != undefined
  ) {
    courtByIdData?.court.data.attributes.court_types.data.forEach(
      courtTypeItem =>
        courtTypes.push({
          id: courtTypeItem.id,
          name: courtTypeItem.attributes.name,
        }),
    );
  }

  const courtTypesJson: ICourtTypes[] = [];
  courtByIdData?.court.data.attributes.court_types.data.forEach(
    courtTypeItem => {
      courtTypesJson.push({
        id: courtTypeItem.id,
        name: courtTypeItem.attributes.name,
      });
    },
  );

  const handleCourtPictureUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Desculpe, precisamos da permissão para acessar a galeria!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      alert("Erro ao carregar a imagem!");
    }
  };

  const [courtTypeSelected, setCourtTypeSelected] = useState<
    Array<string> | undefined
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [minimumScheduleValue, setMinimumScheduleValue] = useState<number>();

  const handleUpdateCourt = handleSubmit(async data => {
    setIsLoading(true);

    try {
      const courtTypesId: string[] = selectedCourtTypesObject.map(
        selected => selected.id,
      );

      let { allAvailabilities, dayUse } =
        courtByIdData!.court.data.attributes.court_availabilities.data.reduce(
          (data, availability) => {
            const index = weekDayToIndexMap[availability.attributes.weekDay];

            data.allAvailabilities[index].push({
              startsAt: availability.attributes.startsAt.slice(0, 5),
              endsAt: availability.attributes.endsAt.slice(0, 5),
              price: formatCurrency(availability.attributes.value),
            });

            data.dayUse[index] = availability.attributes.dayUseService;
            return data;
          },
          {
            allAvailabilities: [
              [], // domingo
              [], // segunda
              [], // terça
              [], // quarta
              [], // quinta
              [], // sexta
              [], // sábado
              [], // dia especial
            ] as Appointment[][],
            dayUse: [
              false, // domingo
              false, // segunda
              false, // terça
              false, // quarta
              false, // quinta
              false, // sexta
              false, // sábado
              false, // dia especial
            ],
          },
        );

      const [storageDayUse, storageAvailabilities] = await Promise.all([
        AsyncStorage.getItem(AsyncStorageKeys.CourtPriceHourDayUse),
        AsyncStorage.getItem(AsyncStorageKeys.CourtPriceHourAllAppointments),
      ]);

      if (storageDayUse) {
        dayUse = JSON.parse(storageDayUse);
      }

      if (storageAvailabilities) {
        allAvailabilities = JSON.parse(storageAvailabilities);
      }

      if (
        !dayUse.length ||
        !allAvailabilities.some(availabilities => availabilities.length > 0)
      ) {
        return Alert.alert("Erro", "Preencha os valores e horários.");
      }

      const courtAvailabilityIds: string[] = [];

      const courtAvailabilitiesData = allAvailabilities.reduce(
        (data, availabilities, index) => {
          availabilities.forEach(availability => {
            const isDayUse = dayUse[index];
            const weekDay = indexToWeekDayMap[index];
            const startsAt = `${availability.startsAt}:00.000`;
            const endsAt = `${availability.endsAt}:00.000`;
            const price = Number(
              availability.price
                .replace("R$", "")
                .replace(".", "")
                .replace(",", ".")
                .trim(),
            );

            // para não criar outro se não mudou nada
            const existingId =
              courtByIdData?.court.data.attributes.court_availabilities.data.find(
                availabilityData => {
                  return (
                    availabilityData.attributes.dayUseService === isDayUse &&
                    availabilityData.attributes.weekDay === weekDay &&
                    availabilityData.attributes.startsAt === startsAt &&
                    availabilityData.attributes.endsAt === endsAt &&
                    availabilityData.attributes.value === price
                  );
                },
              )?.id;

            if (existingId) {
              courtAvailabilityIds.push(existingId);
            } else {
              data.push({
                status: true,
                starts_at: startsAt,
                day_use_service: isDayUse,
                ends_at: endsAt,
                value: price,
                week_day: weekDay,
                court: courtId,
                publishedAt: new Date().toISOString(),
              });
            }
          });

          return data;
        },
        [] as CreateCourtAvailabilitiesVariables["data"],
      );

      if (courtAvailabilitiesData.length > 0) {
        const accessToken = userData?.jwt;

        const { data: createAvailabilitiesData } =
          await createCourtAvailabilities({
            variables: {
              data: courtAvailabilitiesData,
            },
            context: {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          });

        if (
          !createAvailabilitiesData?.createCourtAvailabilitiesCustom.success
        ) {
          throw new Error(
            "Não foi possível criar as disponibilidades de quadra",
          );
        }

        courtAvailabilityIds.push(
          ...createAvailabilitiesData.createCourtAvailabilitiesCustom.ids,
        );
      }

      let photoId: string[] | undefined = await uploadNewCourtImage();

      if (photoId && photoId[0]) {
        courtPhotos = [photoId[0], ...courtPhotos];
      }

      await updateCourtHook({
        variables: {
          court_id: courtId ?? "",
          court_availabilities: courtAvailabilityIds,
          court_name: data.fantasyName,
          court_types: courtTypesId,
          fantasy_name: data.fantasyName,
          minimum_value: data.minimumScheduleValue,
          photos: courtPhotos,
        },
      });

      alert("Quadra atualizada");
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      console.log(error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    const newCourtTypeSelected: { id: string; name: string }[] = [];

    courtTypeSelected?.forEach(selected => {
      const foundCourtType = courtTypesData.find(
        courtType => courtType.name === selected,
      );
      foundCourtType && newCourtTypeSelected.push(foundCourtType);
    });

    setSelectedCourtTypesObject(newCourtTypeSelected);
  }, [courtTypeSelected]);

  const { data: dataUserEstablishment } = useCourtById(courtId!);

  async function handleUpdateAvailabilities() {
    setIsOpeningCourtPriceHour(true);

    try {
      if (!courtByIdData) {
        throw new Error("não deve acontecer");
      }

      // pega valores já cadastrados da api e seta para a tela CourtPriceHour se ela já n tiver sido aberta e alterada

      const { allAvailabilities, dayUse } =
        courtByIdData.court.data.attributes.court_availabilities.data.reduce(
          (data, availability) => {
            const index = weekDayToIndexMap[availability.attributes.weekDay];

            data.allAvailabilities[index].push({
              startsAt: availability.attributes.startsAt.slice(0, 5),
              endsAt: availability.attributes.endsAt.slice(0, 5),
              price: formatCurrency(availability.attributes.value),
            });

            data.dayUse[index] = availability.attributes.dayUseService;
            return data;
          },
          {
            allAvailabilities: [
              [], // domingo
              [], // segunda
              [], // terça
              [], // quarta
              [], // quinta
              [], // sexta
              [], // sábado
              [], // dia especial
            ] as Appointment[][],
            dayUse: [
              false, // domingo
              false, // segunda
              false, // terça
              false, // quarta
              false, // quinta
              false, // sexta
              false, // sábado
              false, // dia especial
            ],
          },
        );

      const promises: Array<Promise<unknown>> = [];
      const [storageDayUse, storageAvailabilities] = await Promise.all([
        AsyncStorage.getItem(AsyncStorageKeys.CourtPriceHourDayUse),
        AsyncStorage.getItem(AsyncStorageKeys.CourtPriceHourAllAppointments),
      ]);

      if (!storageDayUse) {
        promises.push(
          AsyncStorage.setItem(
            AsyncStorageKeys.CourtPriceHourDayUse,
            JSON.stringify(dayUse),
          ),
        );
      }

      if (!storageAvailabilities) {
        promises.push(
          AsyncStorage.setItem(
            AsyncStorageKeys.CourtPriceHourAllAppointments,
            JSON.stringify(allAvailabilities),
          ),
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      navigation.navigate("CourtPriceHour", {
        minimumCourtPrice: String(minimumScheduleValue),
      });
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      console.log(error);
      Alert.alert(
        "Erro",
        "Não é possível alterar os valores de aluguel e horários no momento.",
      );
    } finally {
      setIsOpeningCourtPriceHour(false);
    }
  }

  if (loadingCourt) {
    return (
      <View className="justify-center mt-4">
        <ActivityIndicator size={40} color="#FF6112" />
      </View>
    );
  }

  return (
    <View className="h-full w-full flex flex-col">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="pt-[15px] pl-[7px] pr-[7px] flex flex-col items-center justify-center h-fit w-full">
          {photo ? (
            <Image
              className="h-[210px] w-[375px] rounded-[5px]"
              source={{ uri: photo }}
            />
          ) : (
            <View className="h-[210px] w-[375px] rounded-[5px]" />
          )}

          <View className="flex flex-row items-center justify-center gap-x-[5px]">
            <Text className="text-[16px] text-[#FF6112] font-semibold">
              Editar
            </Text>
            <TouchableOpacity onPress={handleCourtPictureUpload}>
              <Image source={require("../../assets/edit_icon.png")} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="pl-[20px] pr-[20px] mt-[30px]">
          <View className="mb-[20px]">
            <View className="w-full items-center mb-[5px]">
              <Text className="text-[16px] text-[#4E4E4E] font-normal">
                Selecione a modalidade:
              </Text>
            </View>
            <MultipleSelectList
              setSelected={setCourtTypeSelected}
              data={courtTypesData.map(courtType => courtType.name)}
              save="value"
              placeholder="Selecione uma modalidade"
              searchPlaceholder="Pesquisar..."
            />
          </View>

          <View className="mb-[20px]">
            <Text className="text-[16px] text-[#4E4E4E] font-normal mb-[5px]">
              Nome fantasia da quadra
            </Text>
            <Controller
              name="fantasyName"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder="Ex: Arena Society"
                  className={`p-4 border ${
                    errors.fantasyName ? "border-red-400" : "border-gray-400"
                  }  rounded-lg h-45`}
                />
              )}
            />
            {errors.fantasyName && (
              <Text className="text-red-400 text-sm -pt-[10px]">
                {errors.fantasyName.message}
              </Text>
            )}
          </View>

          <View className="mb-[20px]">
            <View className="flex-row gap-2 items-center">
              <Text className="text-[16px] text-[#4E4E4E] font-normal mb-[5px]">
                Sinal mínimo para locação
              </Text>
              <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
                <Ionicons name="information-circle" size={25} color="#FF6112" />
              </TouchableOpacity>
            </View>
            <Controller
              name="minimumScheduleValue"
              control={control}
              render={({ field: { value, onChange } }) => (
                <MaskInput
                  className={`p-4 border ${
                    errors.minimumScheduleValue
                      ? "border-red-400"
                      : "border-gray-400"
                  } rounded-lg h-45`}
                  placeholder="R$ 00,00"
                  keyboardType="numeric"
                  value={value?.toString()}
                  mask={Masks.BRL_CURRENCY}
                  onChangeText={(masked, unmasked) => {
                    onChange(parseFloat(unmasked));
                  }}
                />
              )}
            />
            {errors.minimumScheduleValue && (
              <Text className="text-red-400 text-sm -pt-[10px]">
                {errors.minimumScheduleValue.message}
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
                  O valor do sinal deve ser menor que o Valor/Hora de aluguel da
                  quadra.
                </Text>
                <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                  <Text className="text-black font-semibold text-base mt-2">
                    Fechar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View className="">
            <Text className="text-[16px] text-[#4E4E4E] font-normal mb-[5px]">
              Valor aluguel/hora
            </Text>
            <TouchableOpacity
              disabled={isOpeningCourtPriceHour || isLoading}
              onPress={handleUpdateAvailabilities}
              className="h-14 w-full rounded-md bg-orange-500 flex items-center justify-center"
            >
              {isOpeningCourtPriceHour ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-semibold text-white text-[14px]">
                  Editar
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleUpdateCourt}
            disabled={isLoading || isOpeningCourtPriceHour}
            className="h-14 w-full rounded-md bg-orange-500 flex items-center justify-center mt-[50px]"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="font-semibold text-white text-[14px]">
                Salvar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0">
        <BottomBlackMenuEstablishment
          screen="Any"
          paddingTop={2}
          establishmentID={
            dataUserEstablishment?.court.data.attributes.establishment.data.id!
          }
          establishmentLogo={
            route.params.userPhoto ? HOST_API + route.params.userPhoto : null
          }
        />
      </View>
    </View>
  );
}
