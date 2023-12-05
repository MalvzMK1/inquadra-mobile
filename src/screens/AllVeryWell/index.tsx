import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { IRegisterUserVariables } from "../../graphql/mutations/register";
import { IRegisterEstablishmentVariables } from "../../graphql/mutations/registerEstablishment";
import useCreateCourtAvailabilities from "../../hooks/useCreateCourtAvailabilities";
import useDeleteCourtAvailability from "../../hooks/useDeleteCourtAvailability";
import useDeleteEstablishment from "../../hooks/useDeleteEstablishment";
import useDeleteUser from "../../hooks/useDeleteUser";
import useRegisterCourt from "../../hooks/useRegisterCourt";
import useRegisterEstablishment from "../../hooks/useRegisterEstablishment";
import useRegisterUser from "../../hooks/useRegisterUser";
import {
  API_BASE_URL,
  AsyncStorageKeys,
  indexToWeekDayMap,
} from "../../utils/constants";

interface ToDelete {
  userIdToRemove: string | undefined;
  imageIdsToRemove: string[];
  establishmentIdToRemove: string | undefined;
  courtAvailabilityIdsToRemove: string[];
}

export default function AllVeryWell({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "AllVeryWell">) {
  const { goBack } = useNavigation();
  const [addCourt] = useRegisterCourt();
  const [createCourtAvailabilities] = useCreateCourtAvailabilities();
  const [registerUser] = useRegisterUser();
  const [deleteUser] = useDeleteUser();
  const [registerEstablishment] = useRegisterEstablishment();
  const [deleteEstablishment] = useDeleteEstablishment();
  const [deleteCourtAvailability] = useDeleteCourtAvailability();
  const [isLoading, setIsLoading] = useState(false);

  const courts = route.params.courtArray;

  const uploadImages = async (photos: string[]) => {
    const formData = new FormData();

    for (let index = 0; index < photos.length; index++) {
      const uri = photos[index];
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append("files", {
        uri,
        type: blob.type,
        name: `image-${blob.name}.jpg`,
      } as any);
    }

    const response = await axios.post<Array<{ id: string }>>(
      `${API_BASE_URL}/api/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const uploadedImageIDs = response.data.map((image) => image.id);
    console.log("Imagens enviadas com sucesso!", response.data);
    return uploadedImageIDs;
  };

  async function removeRegisteredInfos({
    userIdToRemove,
    imageIdsToRemove,
    establishmentIdToRemove,
    courtAvailabilityIdsToRemove,
  }: ToDelete) {
    console.log({
      userIdToRemove,
      imageIdsToRemove,
      establishmentIdToRemove,
      courtAvailabilityIdsToRemove,
    });

    const promises: Array<Promise<any>> = [];

    if (userIdToRemove) {
      promises.push(
        deleteUser({
          variables: {
            user_id: userIdToRemove,
          },
        }).then((response) => console.log("DELETED_USER", response))
      );
    }

    if (establishmentIdToRemove) {
      promises.push(
        deleteEstablishment({
          variables: {
            establishment_id: establishmentIdToRemove,
          },
        }).then((response) => console.log("DELETED_ESTABLISHMENT", response))
      );
    }

    if (courtAvailabilityIdsToRemove.length > 0) {
      courtAvailabilityIdsToRemove.forEach((id) => {
        promises.push(
          deleteCourtAvailability({
            variables: {
              court_availability_id: id,
            },
          }).then((response) =>
            console.log("DELETED_COURT_AVAILABILITY", response)
          )
        );
      });
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }
  }

  async function handleComplete() {
    setIsLoading(true);
    const imageIdsToRemove: string[] = [];
    let userIdToRemove: string | undefined;
    let establishmentIdToRemove: string | undefined;
    const courtAvailabilityIdsToRemove: string[] = [];

    try {
      const registerUserPayload: IRegisterUserVariables = {
        ...route.params.profileInfos,
      };

      const { data: newUserData, errors: newUserErrors } = await registerUser({
        variables: registerUserPayload,
      });

      if (!newUserData || !newUserData.createUsersPermissionsUser.data) {
        throw new Error("Não foi possível criar o usuário", {
          cause: newUserErrors?.map((error) => error),
        });
      }

      userIdToRemove = newUserData.createUsersPermissionsUser.data.id;

      const [logoId, ...establishmentPhotoIds] = await uploadImages([
        route.params.establishmentInfos.logo,
        ...route.params.establishmentInfos.photos,
      ]);

      imageIdsToRemove.push(logoId);
      imageIdsToRemove.push(...establishmentPhotoIds);

      const registerEstalishmentPayload: IRegisterEstablishmentVariables = {
        logo: logoId,
        photos: establishmentPhotoIds,
        publishedAt: new Date().toISOString(),
        ownerId: newUserData.createUsersPermissionsUser.data.id,
        latitude: route.params.establishmentInfos.latitude,
        longitude: route.params.establishmentInfos.longitude,
        street_name: route.params.establishmentInfos.street_name,
        cep: route.params.establishmentInfos.cep,
        phone_number: route.params.establishmentInfos.phone_number,
        cnpj: route.params.establishmentInfos.cnpj,
        cellphone_number: route.params.establishmentInfos.cellphone_number,
        amenities: route.params.establishmentInfos.amenities,
        corporate_name: route.params.establishmentInfos.corporate_name,
      };

      const { data: establishmentData, errors: establishmentErrors } =
        await registerEstablishment({
          variables: registerEstalishmentPayload,
        });

      if (!establishmentData) {
        throw new Error("Não foi possível criar o estabelecimento", {
          cause: establishmentErrors?.map((error) => error),
        });
      }

      establishmentIdToRemove = establishmentData.createEstablishment.data.id;

      for (const court of courts) {
        const [newPhotosIds, courtAvailabilityIds] = await Promise.all([
          uploadImages(court.photos.map((photo) => photo.uri)),
          createCourtAvailabilities({
            variables: {
              data: court.court_availabilities.flatMap(
                (availabilities, index) => {
                  return availabilities.map((availability) => ({
                    status: true,
                    starts_at: `${availability.startsAt}:00.000`,
                    day_use_service: court.dayUse[index],
                    ends_at: `${availability.endsAt}:00.000`,
                    value: Number(
                      availability.price
                        .replace("R$", "")
                        .replace(".", "")
                        .replace(",", ".")
                        .trim()
                    ),
                    week_day: indexToWeekDayMap[index],
                    publishedAt: new Date().toISOString(),
                  }));
                }
              ),
            },
          }).then((response) => {
            if (!response.data?.createCourtAvailabilitiesCustom.success) {
              throw new Error(
                "Não foi possível criar as disponibilidades de quadra"
              );
            }

            return response.data.createCourtAvailabilitiesCustom.ids;
          }),
        ]);

        imageIdsToRemove.push(...newPhotosIds);
        courtAvailabilityIdsToRemove.push(...courtAvailabilityIdsToRemove);

        await addCourt({
          variables: {
            court_name: court.fantasyName,
            courtTypes: court.courtType,
            court_availabilities: courtAvailabilityIds,
            minimum_value: court.minimum_value,
            current_date: court.currentDate,
            photos: newPhotosIds,
            establishmentId: establishmentData.createEstablishment.data.id,
            fantasyName: court.fantasyName,
          },
        });
      }

      await Promise.all([
        AsyncStorage.removeItem(AsyncStorageKeys.CourtPriceHourDayUse),
        AsyncStorage.removeItem(AsyncStorageKeys.CourtPriceHourAllAppointments),
      ]);

      navigation.navigate("CompletedEstablishmentRegistration");
    } catch (error) {
      console.error(error);
      const msgError = JSON.stringify(error, null, 2);

      if (process.env.APP_DEBUG_VERBOSE) {
        Alert.alert("Erro", msgError);
      } else {
        Alert.alert("Erro", "Não foi possível concluir o cadastro.");
      }

      removeRegisteredInfos({
        userIdToRemove,
        imageIdsToRemove,
        establishmentIdToRemove,
        courtAvailabilityIdsToRemove,
      })
        .then(() => console.log("Informações deletadas com sucesso"))
        .catch(console.error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNavigateToDetails() {
    navigation.navigate("CourtDetails", {
      courtArray: courts,
    });
  }

  return (
    <View className="flex-1 pt-12">
      <View className="px-4 gap-3 flex-1 bg-white">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={goBack}>
            <Icon name="arrow-back" size={24} color="#4E4E4E" />
          </TouchableOpacity>

          <Text className="text-[32px] text-[#4E4E4E] font-semibold -translate-x-3">
            Tudo Certo?
          </Text>

          <View />
        </View>

        <TouchableOpacity onPress={handleNavigateToDetails}>
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
                  0
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
            <TouchableOpacity onPress={handleNavigateToDetails}>
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
          className="h-14 w-81 m-6 rounded-md bg-[#FF6112] items-center justify-center"
          onPress={handleComplete}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-gray-50">Concluir</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
