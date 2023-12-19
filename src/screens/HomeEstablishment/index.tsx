import { HOST_API } from "@env";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { format, parse } from "date-fns";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { TextInput } from "react-native-paper";
import { CourtType } from "../../__generated__/graphql";
import BottomBlackMenuEstablishment from "../../components/BottomBlackMenuEstablishment";
import { useUser } from "../../context/userContext";
import { CourtAvailabilitiesByWeekDayResponse } from "../../graphql/queries/courtAvailabilitiesByWeekDay";
import useAllCourtsEstablishment from "../../hooks/useAllCourtsEstablishment";
import { useCourtAvailabilitiesByWeekDay } from "../../hooks/useCourtAvailabilitiesByWeekDay";
import { useEstablishmentSchedulingsByDay } from "../../hooks/useEstablishmentSchedulingsByDay";
import { useGetUserEstablishmentInfos } from "../../hooks/useGetUserEstablishmentInfos";
import useUpdateScheduleActivateStatus from "../../hooks/useUpdateScheduleActivatedStatus";
import {IconProps} from "react-native-elements";
import {arrayIcons} from "../../components/SportsMenu";

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
                      name: User["name"];
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
  const { userData } = useUser();

  const [userId, setUserId] = useState<string>();
  const [establishmentId, setEstablishmentId] = useState<string>("");
  const [fantasy_name, setFantasyName] = useState<string>("");
  const [activationKey, setActivationKey] = useState<string>("");
  const [validated, setValidate] = useState(3);
  const [photo, setPhoto] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [establishmentCourts, setEstablishmentCourts] = useState<
    Array<ICourtProps>
  >([]);
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

  const {
    data: dataEstablishmentId,
    error: errorEstablishmentId,
    loading: loadingEstablishmentId,
  } = useGetUserEstablishmentInfos(userId ?? "", {
    skip: !userId,
  });

  const { data: dataSchedulings } = useEstablishmentSchedulingsByDay(
    establishmentId,
    fantasy_name,
    dayOfWeek,
    date,
  );

  const { data: dataCourtsEstablishment } = useAllCourtsEstablishment(
    establishmentId!,
  );

  const [updateActivatedStatus] = useUpdateScheduleActivateStatus();

  const getIdByKey = (key: string): string | undefined => {
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
    try {
      let scheduleId: string | undefined = getIdByKey(key);

      if (!scheduleId)
        throw new Error("Couldn't find schedule by activation key");

      const { data, errors } = await updateActivatedStatus({
        variables: {
          schedulingId: scheduleId,
          activate: true,
        },
      });

      if (data) {
        if (!errors) {
          setValidate(1);
        } else {
          setValidate(2);
        }
      }
    } catch (error) {
      setValidate(2);
    }
  };

  const isDayUse =
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
          courts.attributes.court_availabilities.data.map(availability => {
            if (availability.attributes.schedulings.data.length > 0) {
              setHaveScheduleToday(true);
            } else {
              setHaveScheduleToday(false);
            }
          });
        } else {
          setHaveScheduleToday(false);
        }
      });
    }
  }, [dataSchedulings]);

  useEffect(() => {
    if (userData && userData.id) {
      setUserId(userData.id);
    } else {
      navigation.navigate("Home", {
        userPhoto: undefined,
        userGeolocation: userData?.geolocation, // TODO: IMPLEMENTAR VALIDAÇÃO DE GEOLOCALIZAÇÃO INDEFINIDA
      });
    }
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
      setFirstName(
        dataEstablishmentId.usersPermissionsUser.data.attributes.name.split(
          " ",
        )[0],
      );
    }
  }, [dataEstablishmentId, errorEstablishmentId, loadingEstablishmentId]);

  useEffect(() => {
    if (
      dataCourtsEstablishment?.establishment.data?.attributes.courts.data.length
    ) {
      setEstablishmentCourts(
        dataCourtsEstablishment.establishment.data.attributes.courts.data,
      );
    }
  }, [dataCourtsEstablishment]);

  useEffect(() => {
    if (photo) {
      AsyncStorage.setItem(
        "@inquadra/establishment-profile-photo",
        photo,
        error => {
          if (error) {
            console.error(JSON.stringify(error));
          }
        },
      );
    }
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

  function setDefaultCourtInSelectList():
    | { key: number; value: string }
    | undefined {
    if (establishmentCourts[0]) {
      const { fantasy_name } = establishmentCourts[0].attributes;

      return {
        key: 1,
        value: fantasy_name,
      };
    }
  }

  const [defaultCortOption, setDefaultCortOption] = useState<{
    key: number;
    value: string;
  }>();

  useEffect(() => {
    const defaultOption = setDefaultCourtInSelectList();

    if (defaultOption) {
      setDefaultCortOption(defaultOption);
      setFantasyName(defaultOption.value);
    }
  }, [establishmentCourts[0]]);

  useEffect(() => {
    if (validated === 2) {
      setTimeout(() => {
        setValidate(3);
        clearTimeout(1);
      }, 5000);
    }
  }, [validated]);

  const { data: courtAvailabilitiesData, loading: loadingAvailabilities } =
    useCourtAvailabilitiesByWeekDay({
      skip: typeof fantasy_name !== "string" || !fantasy_name,
      variables: {
        date,
        establishmentId,
        weekDay: dayOfWeek,
        courtFantasyName: fantasy_name,
      },
    });

  const availabilitiesData = useMemo(() => {
    interface AvailabilityData {
      startsAt: string;
      availability?: CourtAvailabilitiesByWeekDayResponse["courtAvailabilities"]["data"][number];
    }

    const data: AvailabilityData[] = [];

    for (let iteration = 0; iteration < 24; iteration++) {
      data.push({
        startsAt: `${iteration.toString().padStart(2, "0")}:00`,
      });
    }

    courtAvailabilitiesData && courtAvailabilitiesData.courtAvailabilities.data.forEach(availability => {
      const index = Number(availability.attributes.startsAt.substring(0, 2));

      data[index].availability = availability;
    });

    return data;
  }, [courtAvailabilitiesData]);

  return (
    <View className="flex-1">
      <View className="h-11 w-max bg-[#292929]"></View>
      <View className="h-16 w-max bg-[#292929] flex-row item-center justify-between px-5">
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
              className="w-full h-full"
              source={
                photo
                  ? { uri: HOST_API + photo }
                  : require("../../assets/default-user-image.png")
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
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
                <Text className="text-xl font-bold text-gray-50">Inválido</Text>
              ) : (
                <Text className="text-xl font-bold text-gray-50">Validar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View className="px-5 flex flex-col justify-between">
            <View className="bg-[#292929] rounded-t-lg p-5">
              <Text className="text-[#FF6112] text-base font-bold">
                Reservas hoje
              </Text>
              <View className="pt-5 gap-2">
                {haveScheduleToday ? (
                  isDayUse === false ? (
                    dataSchedulings?.establishment.data.attributes.courts.data.map(
                      courts =>
                        courts?.attributes.court_availabilities.data.map(
                          availability =>
                            availability?.attributes.schedulings.data.map(
                              scheduling => (
                                <Text className="text-white font-bold">
                                  {scheduling?.attributes.court_availability.data?.attributes.startsAt.substring(
                                    0,
                                    5,
                                  )}
                                  hs -{" "}
                                  {scheduling.attributes.court_availability.data?.attributes.endsAt.substring(
                                    0,
                                    5,
                                  )}
                                  hs{" "}
                                  {scheduling.attributes.payedStatus &&
                                  scheduling.attributes.activated
                                    ? "Reserva ativada"
                                    : scheduling.attributes.payedStatus
                                    ? "Finalizado"
                                    : "Em andamento"}
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
              onPress={() => {
                if (userId && establishmentId) {
                  navigation.navigate("CourtSchedule", {
                    establishmentPhoto: undefined,
                    establishmentId: establishmentId,
                  });
                }
              }}
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
                    setSelected={(value: string) => setFantasyName(value)}
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
            <View className="flex flex-row">
              <View className="pt-3 w-full">
                {loadingAvailabilities ? (
                  <View className="justify-center items-center">
                    <ActivityIndicator size={48} color="#FF6112" />
                  </View>
                ) : (
                  <Fragment>
                    {!isDayUse && (
                      <View className="absolute w-1 h-full bg-gray-300 left-[64px]" />
                    )}
                    {availabilitiesData.map(
                      ({ startsAt, availability }, index) => {
                        const sportName: IconProps['name'] = '';
                        return (
                          <View
                            key={startsAt}
                            className="flex-1 flex-row space-x-5"
                          >
                            <View className="justify-center">
                              {index === 0 && (
                                <Text className="text-sm font-medium">
                                  {format(
                                    parse(date, "yyyy-MM-dd", new Date()),
                                    "dd/MM",
                                  )}
                                </Text>
                              )}

                              <Text className="text-base text-gray-400">
                                {startsAt}
                                hs
                              </Text>
                            </View>

                            {availability ? (
                              <View className="bg-[#B6B6B633] rounded-2xl items-start flex-1 relative">
                                <View className="absolute top-3 bottom-3 left-2.5 rounded bg-[#FF6112] w-1"/>

                                <Text className="ml-9 mt-1 text-gray-400 text-xs text-start">
                                  Info reserva:
                                </Text>

                                <View className="flex flex-row ml-7 p-2">
                                  <View className="flex flex-row">
                                    <View className="flex justify-start items-start">
                                      <View className="flex flex-row items-center space-x-0.5">
                                        <Ionicons
                                          size={16}
                                          color="#FF6112"
                                          name="person-outline"
                                        />
                                        <Text numberOfLines={1}>
                                          {
                                            availability.attributes.schedulings
                                              .data[0].attributes.owner.data
                                              .attributes.name
                                          }
                                        </Text>
                                      </View>
                                      <View className="flex flex-row items-center space-x-0.5">
                                        <MaterialIcons
                                          size={16}
                                          color="#FF6112"
                                          name="attach-money"
                                        />
                                        <Text numberOfLines={1}>
                                          {handlePayedStatus(
                                            availability.attributes.schedulings
                                              .data[0].attributes.payedStatus,
                                          )}
                                        </Text>
                                      </View>
                                    </View>
                                    <View className="flex flex-wrap justify-start items-start pl-2">
                                      <View className="flex flex-row items-center space-x-0.5">
                                        <Ionicons
                                          size={16}
                                          color="#FF6112"
                                          name="time-outline"
                                        />
                                        <Text numberOfLines={1}>
                                          {`${availability.attributes.startsAt.substring(
                                            0,
                                            5,
                                          )}h - ${availability.attributes.endsAt.substring(
                                            0,
                                            5,
                                          )}h`}
                                        </Text>
                                      </View>
                                      <View className="flex flex-row items-center space-x-0.5">
                                        <Image
                                          className='w-4 h-4'
                                          source={
                                            arrayIcons[parseInt(availability.attributes.court.data.attributes.court_types.data[0]?.id || '0')].activeImage
                                          }
                                        />
                                        {
                                          (
                                            availability &&
                                            availability.attributes.court.data &&
                                            availability.attributes.court.data.attributes.court_types.data.length > 0
                                          ) &&
                                          availability.attributes.court.data.attributes.court_types.data.map(
                                            (sportType, index) => (
                                              <Text key={index} numberOfLines={1}>
                                                {sportType.attributes.name || 'Vasco'}
                                              </Text>
                                            )
                                          )
                                        }
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            ) : (
                            <View className="justify-center h-[50px]">
                              <Text className="text-[#29292980] text-xs">
                                Livre
                              </Text>
                            </View>
                          )}
                        </View>
                      )},
                    )}
                  </Fragment>
                )}
              </View>
            </View>
          </View>
        </View>
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
