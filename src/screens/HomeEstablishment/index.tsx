import { HOST_API } from "@env";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { TextInput } from "react-native-paper";
import { CourtType } from "../../__generated__/graphql";
import BottomBlackMenuEstablishment from "../../components/BottomBlackMenuEstablishment";
import useAllCourtsEstablishment from "../../hooks/useAllCourtsEstablishment";
import { useEstablishmentSchedulingsByDay } from "../../hooks/useEstablishmentSchedulingsByDay";
import { useGetUserEstablishmentInfos } from "../../hooks/useGetUserEstablishmentInfos";
import useUpdateScheduleActivateStatus from "../../hooks/useUpdateScheduleActivatedStatus";
import storage from "../../utils/storage";
import {useUser} from "../../context/userContext";
const { parse, format } = require("date-fns");

interface ICourtProps {
  attributes: {
    fantasy_name: Court["fantasy_name"];
    court_availabilities: {
      data: Array<{
        id: CourtAvailability["id"];
        attributes: {
          startsAt: CourtAvailability["startsAt"];
          endsAt: CourtAvailability["endsAt"];
          court: {
            data: {
              id: Court["id"];
              attributes: {
                name: Court["name"];
              };
            };
          };
          schedulings: {
            data: Array<{
              id: string;
              attributes: {
                date: Scheduling["date"];
                payedStatus: Scheduling["payedStatus"];
                activated: boolean;
                activationKey: string;
                owner: {
                  data: {
                    attributes: {
                      username: User["username"];
                    };
                  };
                };
                court_availability: {
                  data: {
                    attributes: {
                      startsAt: CourtAvailability["startsAt"];
                      endsAt: CourtAvailability["endsAt"];
                      dayUseService: CourtAvailability["dayUseService"];
                      court: {
                        data: {
                          attributes: {
                            court_types: {
                              data: Array<{
                                attributes: {
                                  name: CourtType["name"];
                                };
                              }>;
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            }>;
          };
        };
      }>;
    };
  };
}

export default function HomeEstablishment({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "HomeEstablishment">) {
  const {userData} = useUser();

  const [userId, setUserId] = useState<string>();
  const [establishmentId, setEstablishmentId] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [fantasy_name, setFantasyName] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [activationKey, setActivationKey] = useState<string>("");
  const [validated, setValidate] = useState(3);
  const [photo, setPhoto] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [establishmentCourts, setEstablishmentCourts] = useState<
    Array<ICourtProps>
  >([]);
  const [courtAvailabilityDisponible, setCourtAvailabilityDisponible] =
    useState<boolean>(false);
  const [haveScheduleToday, setHaveScheduleToday] = useState<boolean>(false);

  const actualDate = new Date();
  const dateFormat = "yyyy-MM-dd";
  const targetDate = parse(
    format(actualDate, dateFormat),
    "yyyy-MM-dd",
    new Date(),
  );
  const dayOfWeek = format(targetDate, "EEEE");
  const date = format(actualDate, dateFormat);

  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const formattedData = `${day}/${month}`;

  const {
    data: dataEstablishmentId,
    error: errorEstablishmentId,
    loading: loadingEstablishmentId,
  } = useGetUserEstablishmentInfos(userId ?? "");
  const {
    data: dataSchedulings,
    error: errorSchedulings,
    loading: loadingSchedulings,
  } = useEstablishmentSchedulingsByDay(
    establishmentId!,
    fantasy_name,
    dayOfWeek,
    date,
  );

  console.log({
    establishmentId,
    fantasy_name,
    dayOfWeek,
    date,
  });

  const {
    data: dataCourtsEstablishment,
    error: errorCourts,
    loading: loadingCourts,
  } = useAllCourtsEstablishment(establishmentId!);

  const [
    updateActivatedStatus,
    {
      data: dataActivateStatus,
      error: errorActivateStatus,
      loading: loadingActivateStatus,
    },
  ] = useUpdateScheduleActivateStatus();

  // 1 === true / 2 === false / 3 === null

  const getIdByKey = (key: string): string | undefined => {
    establishmentCourts;
    const schedulingFound = establishmentCourts?.flatMap(courts =>
      courts?.attributes?.court_availabilities?.data?.flatMap(availabilities =>
        availabilities?.attributes?.schedulings?.data?.filter(
          schedulings => schedulings?.attributes?.activationKey === key,
        ),
      ),
    )[0];

    if (schedulingFound) {
      return schedulingFound.id;
    }
    return undefined;
  };

  const handleActivate = async (key: string) => {
    let scheduleId: string = getIdByKey(key) ?? "";

    try {
      const { data } = await updateActivatedStatus({
        variables: {
          schedulingId: scheduleId,
          activate: true,
        },
      });

      if (data) {
        if (!errorActivateStatus || !loadingActivateStatus) {
          setValidate(1);
        } else {
          setValidate(2);
        }
      }
    } catch (error) {
      if (
        errorActivateStatus?.graphQLErrors &&
        errorActivateStatus.graphQLErrors[0] &&
        errorActivateStatus.graphQLErrors[0].extensions &&
        errorActivateStatus?.graphQLErrors[0]?.extensions?.exception === 400
      ) {
        setValidate(2);
        setTimeout(() => {
          setValidate(2);
        }, 100);
      } else {
        setValidate(2);
      }
    }
  };

  const handleDayUse =
    dataSchedulings?.establishment?.data?.attributes?.courts?.data?.some(
      court =>
        court?.attributes?.court_availabilities?.data?.some(availability =>
          availability?.attributes?.schedulings?.data?.some(
            scheduling =>
              scheduling?.attributes?.court_availability?.data?.attributes
                ?.dayUseService === true,
          ),
        ),
    );

  useEffect(() => {
    if (
      dataSchedulings &&
      dataSchedulings.establishment.data.attributes.courts.data.length > 0
    ) {
      dataSchedulings.establishment.data.attributes.courts.data.map(courts => {
        if (courts.attributes.court_availabilities.data.length > 0) {
          setCourtAvailabilityDisponible(true);
          courts.attributes.court_availabilities.data.map(availability => {
            if (availability.attributes.schedulings.data.length > 0) {
              setHaveScheduleToday(true);
            } else {
              setHaveScheduleToday(false);
            }
          });
        } else {
          setCourtAvailabilityDisponible(false);
          setHaveScheduleToday(false);
        }
      });
    }
  }, [dataSchedulings]);

  useEffect(() => {
    if (
      userData &&
      userData.id
    ) setUserId(userData.id);
    else navigation.navigate('Home', {
      userID: undefined,
      userPhoto: undefined,
      userGeolocation: userData?.geolocation, // TODO: IMPLEMENTAR VALIDAÇÃO DE GEOLOCALIZAÇÃO INDEFINIDA
    });
  }, []);

  useEffect(() => {
    if (
      dataEstablishmentId &&
      dataEstablishmentId.usersPermissionsUser.data &&
      dataEstablishmentId.usersPermissionsUser.data.attributes.establishment
        .data
    ) {
      setEstablishmentId(
        dataEstablishmentId.usersPermissionsUser.data.attributes.establishment
          .data.id,
      );
      setPhoto(
        dataEstablishmentId.usersPermissionsUser.data.attributes.establishment
          .data?.attributes.logo.data?.attributes.url ?? undefined,
      );
      setUserName(
        dataEstablishmentId.usersPermissionsUser.data.attributes.username,
      );
      setFirstName(
        dataEstablishmentId.usersPermissionsUser.data.attributes.username.split(
          " ",
        )[0],
      );
    }
  }, [dataEstablishmentId, errorEstablishmentId, loadingEstablishmentId]);

  useEffect(() => {
    if (
      dataCourtsEstablishment &&
      dataCourtsEstablishment.establishment.data &&
      dataCourtsEstablishment.establishment.data.attributes.courts.data.length >
        0
    ) {
      setEstablishmentCourts(
        dataCourtsEstablishment.establishment.data.attributes.courts.data,
      );
    }
  }, [dataCourtsEstablishment]);

  useEffect(() => {
    photo &&
      AsyncStorage.setItem(
        "@inquadra/establishment-profile-photo",
        photo,
        error => {
          if (error) console.error(JSON.stringify(error));
        },
      );
  }, [photo]);

  function handlePayedStatus(payedStatus: "waiting" | "payed" | "canceled") {
    switch (payedStatus) {
      case "waiting":
        return "Pgt.Parcial";
      case "payed":
        return "Pago";
      case "canceled":
        return "Cancelado";
    }
  }

	function setDefaultCourtInSelectList(): {key: number, value: string} | undefined {
		if (establishmentCourts[0]) {
			const {fantasy_name} = establishmentCourts[0].attributes;

			return {
				key: 1,
				value: fantasy_name,
			}
		}
	}

	const [defaultCortOption, setDefaultCortOption] = useState<{key: number, value: string}>()

	useEffect(() => {
		const defaultOption = setDefaultCourtInSelectList();

		if (defaultOption) {
			setDefaultCortOption(defaultOption);
			setFantasyName(defaultOption.value);
		}
	}, [establishmentCourts[0]])

  return (
    <View className="flex-1">
      <View className=" h-11 w-max  bg-[#292929]"></View>
      <View className=" h-16 w-max  bg-[#292929] flex-row item-center justify-between px-5">
        <View className="flex item-center justify-center">
          <View className="w-12" />
        </View>
        <View className="flex item-center justify-center">
          <Text className="text-lg font-bold text-white">
            Olá{firstName ? `, ${firstName}` : ""}!
          </Text>
        </View>
        <View className="h-max w-max flex justify-center items-center">
          <TouchableOpacity
            className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
            onPress={() => {
              navigation.navigate("InfoProfileEstablishment", {
                establishmentPhoto: photo ?? "",
                establishmentId: establishmentId,
              });
            }}
          >
            <Image
              source={
                photo
                  ? { uri: HOST_API + photo }
                  : require("../../assets/default-user-image.png")
              }
              className="w-full h-full"
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View className="p-5 flex flex-col justify-between">
          <View className="bg-[#292929] border rounded-md p-5 h-40">
            <Text className="text-[#FF6112] text-base font-bold">
              Código de ativação
            </Text>
            <View className="items-center pt-5">
              <TextInput
                style={{
                  backgroundColor: "#D9D9D9",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderTopColor: "#ccc",
                  borderLeftColor: "#ccc",
                  borderRightColor: "#ccc",
                  paddingHorizontal: 10,
                  height: 40,
                  width: "50%",
                  alignSelf: "center",
                  textAlign: "center",
                }}
                // placeholder="123"
                value={activationKey}
                onChangeText={setActivationKey}
                keyboardType="default"
                maxLength={4}
              />
            </View>
          </View>
          <View className="items-center">
            <TouchableOpacity
              className="-mt-6 w-1/2 h-10 rounded-md bg-[#FF6112] flex items-center justify-center"
              onPress={() => handleActivate(activationKey)}
              style={{ elevation: 8 }}
            >
              {validated === 1 ? (
                <Text className="text-xl font-bold text-green-700">
                  Validado
                </Text>
              ) : validated === 2 ? (
                <Text className="text-xl font-bold text-red-700">Invalido</Text>
              ) : (
                <Text className="text-xl font-bold text-gray-50">Validar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View className="p-5 flex flex-col justify-between">
            <View className="bg-[#292929] rounded-t-lg p-5">
              <Text className="text-[#FF6112] text-base font-bold">
                Reservas hoje
              </Text>
              <View className="pt-5 gap-2">
                {haveScheduleToday ? (
                  handleDayUse === false ? (
                    dataSchedulings?.establishment.data.attributes.courts.data.map(
                      courts =>
                        courts?.attributes.court_availabilities.data.map(
                          availabilities =>
                            availabilities?.attributes.schedulings.data.map(
                              schedulings => (
                                <Text className="text-white font-bold">
                                  {schedulings?.attributes.court_availability.data?.attributes.startsAt.substring(
                                    0,
                                    5,
                                  )}{" "}
                                  -{" "}
                                  {schedulings.attributes.court_availability.data?.attributes.endsAt.substring(
                                    0,
                                    5,
                                  )}{" "}
                                  {schedulings.attributes.payedStatus &&
                                  schedulings.attributes.activated
                                    ? "Reserva ativada"
                                    : schedulings.attributes.payedStatus
                                    ? "Pagamento realizado"
                                    : "Pagamento em andamento"}
                                </Text>
                              ),
                            ),
                        ),
                    )
                  ) : (
                    dataSchedulings?.establishment.data?.attributes.courts.data.map(
                      courts =>
                        courts?.attributes?.court_availabilities?.data?.map(
                          availabilities =>
                            availabilities?.attributes?.schedulings?.data?.map(
                              (schedulings, index) => (
                                <Text
                                  key={index}
                                  className="text-white font-bold"
                                >
                                  Day use -{" "}
                                  {schedulings.attributes.payedStatus &&
                                  schedulings.attributes.activated
                                    ? "Reserva ativada"
                                    : schedulings.attributes.payedStatus
                                    ? "Pagamento realizado"
                                    : "Pagamento em andamento"}
                                </Text>
                              ),
                            ),
                        ),
                    )
                  )
                ) : (
                  <Text className="text-sm font-bold text-white">
                    Não existe alguma reserva hoje
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              className="bg-[#FF6112] h-7 rounded-b-lg flex items-center justify-center"
              style={{ elevation: 8 }}
              onPress={() =>
                userId &&
                establishmentId &&
                navigation.navigate("CourtSchedule", {
                  establishmentPhoto: undefined,
                  establishmentId: establishmentId,
                })
              }
            >
              <Text className="text-black font-semibold text-center mb-1 h-4">
                Ver detalhes
              </Text>
            </TouchableOpacity>
            <View className="pt-10">
              <View className="flex flex-row">
                <Text className="font-extrabold text-xl">Por quadra</Text>
                <View className="ml-auto flex flex-col items-start">
                  <SelectList
                    setSelected={(val: any) => setFantasyName(val)}
                    data={
                      establishmentCourts.map(fantasy => {
                        return fantasy.attributes.fantasy_name;
                      }) ?? []
                    }
                    save="value"
										defaultOption={defaultCortOption}
                    searchPlaceholder="Pesquisar..."
                    boxStyles={{
                      borderColor: "#FF6112",
                      borderRadius: 4,
                      height: 43,
                      width: 160,
                    }}
                    dropdownTextStyles={{ color: "#FF6112" }}
                    inputStyles={{ color: "#FF6112", alignSelf: "center" }}
                    dropdownStyles={{ borderColor: "#FF6112", width: 160 }}
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
                        style={{
                          marginEnd: 2,
                          alignSelf: "center",
                          marginLeft: 5,
                        }}
                      />
                    }
                  />
                </View>
              </View>
            </View>
            <View></View>
            <View className="flex flex-row h-max w-max">
              <View className="gap-4 pt-3 h-max w-max">
                {courtAvailabilityDisponible ? (
                  !handleDayUse ? (
                    <View className="before:absolute before:w-1 before:h-full before:bg-gray-300 before:content left-[60px]"></View>
                  ) : null
                ) : null}
                {courtAvailabilityDisponible ? (
                  handleDayUse !== true ? (
                    dataSchedulings?.establishment.data.attributes.courts.data.map(
                      courts =>
                        courts.attributes.court_availabilities.data.map(
                          availabilities => (
                            <View
                              className="flex flex-row"
                              key={availabilities.id}
                            >
                              <View className="flex justify-center items-center pr-3">
                                <Text className="text-base text-gray-400">
                                  {availabilities.attributes.startsAt.substring(
                                    0,
                                    5,
                                  )}
                                  hs
                                </Text>
                              </View>
                              {availabilities.attributes.schedulings.data
                                .length !== 0 ? (
                                availabilities.attributes.schedulings.data.map(
                                  scheduling => {
                                    return (
                                      <View
                                        className="min-h-20 h-auto bg-[#B6B6B633] rounded-2xl items-start"
                                        key={scheduling.id}
                                      >
                                        <Text className="pl-10 pt-1 text-gray-400 text-xs text-start">
                                          Info reserva:
                                        </Text>
                                        <View className="flex flex-row p-2">
                                          <View className="h-12 -mt-4 border-2 rounded border-orange-500"></View>
                                          <View className=" flex flex-row justify-between w-max pl-5">
                                            <View className="flex justify-start items-start">
                                              <View className="flex flex-row items-start">
                                                <Ionicons
                                                  name="person-outline"
                                                  size={16}
                                                  color="#FF6112"
                                                  className="pr-2"
                                                />
                                                <Text>
                                                  {scheduling.attributes.owner
                                                    .data !== null
                                                    ? scheduling.attributes
                                                        .owner.data.attributes
                                                        .username
                                                    : ""}
                                                </Text>
                                              </View>
                                              <View className="flex flex-row items-start">
                                                <MaterialIcons
                                                  name="attach-money"
                                                  size={16}
                                                  color="#FF6112"
                                                  className="pr-2"
                                                />
                                                <Text className="">
                                                  {handlePayedStatus(
                                                    scheduling.attributes
                                                      .payedStatus,
                                                  )}
                                                </Text>
                                              </View>
                                            </View>
                                            <View className=" flex flex-wrap justify-start items-start pl-2">
                                              <View className="flex flex-row items-start">
                                                <Ionicons
                                                  name="time-outline"
                                                  size={16}
                                                  color="#FF6112"
                                                  className="pr-2"
                                                />
                                                <Text>{`${scheduling.attributes.court_availability.data.attributes.startsAt.substring(
                                                  0,
                                                  5,
                                                )} - ${scheduling.attributes.court_availability.data.attributes.endsAt.substring(
                                                  0,
                                                  5,
                                                )}`}</Text>
                                              </View>
                                              <View className="flex flex-row items-start">
                                                <Ionicons
                                                  name="basketball-outline"
                                                  size={16}
                                                  color="#FF6112"
                                                  className="pr-2"
                                                />
                                                <View className="flex flex-wrap">
                                                  <View className="flex flex-wrap">
                                                    {scheduling.attributes.court_availability.data.attributes.court.data.attributes.court_types.data.map(
                                                      (sportType, index) => (
                                                        <Text key={index}>
                                                          {
                                                            sportType.attributes
                                                              .name
                                                          }
                                                        </Text>
                                                      ),
                                                    )}
                                                  </View>
                                                </View>
                                              </View>
                                            </View>
                                          </View>
                                        </View>
                                      </View>
                                    );
                                  },
                                )
                              ) : (
                                <View className=" h-16 items-center justify-center">
                                  <Text className="text-base text-gray-400">
                                    Livre
                                  </Text>
                                </View>
                              )}
                            </View>
                          ),
                        ),
                    )
                  ) : (
                    dataSchedulings?.establishment.data.attributes.courts.data.map(
                      courts =>
                        courts.attributes.court_availabilities.data.map(
                          availabilities =>
                            availabilities.attributes.schedulings.data.map(
                              (scheduling, index) => (
                                <View
                                  key={index}
                                  className="h-max w-80 flex flex-row justify-center items-center"
                                >
                                  <View className="flex h-max w-max justify-center items-center">
                                    <View className="flex flex-row items-start">
                                      <Ionicons
                                        name="person-outline"
                                        size={16}
                                        color="#FF6112"
                                        className="pr-2"
                                      />
                                      <Text>
                                        {
                                          scheduling.attributes.owner.data
                                            .attributes.username
                                        }
                                      </Text>
                                    </View>
                                    <View className="flex flex-row items-start">
                                      <MaterialIcons
                                        name="attach-money"
                                        size={16}
                                        color="#FF6112"
                                        className="pr-2"
                                      />
                                      <Text className="">
                                        {scheduling.attributes.payedStatus
                                          ? "Pago"
                                          : "Pgt.parcial"}
                                      </Text>
                                    </View>
                                    <View className="flex flex-row items-start">
                                      <Ionicons
                                        name="time-outline"
                                        size={16}
                                        color="#FF6112"
                                        className="pr-2"
                                      />
                                      <Text>{`Day use`}</Text>
                                    </View>
                                    <View className="flex items-center justify-center">
                                      <Ionicons
                                        name="basketball-outline"
                                        size={16}
                                        color="#FF6112"
                                        className="pr-2"
                                      />
                                      <View className="flex items-center justify-center">
                                        {scheduling.attributes.court_availability.data.attributes.court.data.attributes.court_types.data.map(
                                          (sportType, index) => (
                                            <Text key={index}>
                                              {sportType.attributes.name}
                                            </Text>
                                          ),
                                        )}
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              ),
                            ),
                        ),
                    )
                  )
                ) : (
                  <View className="h-max w-full flex justify-center items-center px-2">
                    <Text className="text-base font-bold text-center">
                      Não existem disponibilidades para data atual
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        <View className="h-16"></View>
      </ScrollView>
      {userId ? (
        <View className={`absolute bottom-0 left-0 right-0`}>
          <BottomBlackMenuEstablishment
            screen="Home"
            establishmentLogo={photo ? photo : null}
            establishmentID={establishmentId}
            key={1}
            paddingTop={2}
          />
        </View>
      ) : null}
    </View>
  );
}
