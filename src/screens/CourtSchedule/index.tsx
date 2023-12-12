import { AntDesign, Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDays, format, sub } from "date-fns";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SelectList } from "react-native-dropdown-select-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaskInput, { Masks } from "react-native-mask-input";
import { TextInputMask } from "react-native-masked-text";
import { Button } from "react-native-paper";
import { z } from "zod";
import AddCourtSchedule from "../../components/AddCourtSchedule";
import CourtSlideButton from "../../components/CourtSlideButton";
import WeekDayButton from "../../components/WeekDays";
import {
  ISchedulingByDateResponse,
  ISchedulingByDateVariables,
  schedulingByDateQuery,
} from "../../graphql/queries/schedulingByDate";
import {
  ICourtAvailabilityByHourResponse,
  ICourtAvailabilityByHourVariables,
  courtAvailabilityByHourQuery,
} from "../../graphql/queries/schedulingByHour";
import useAllEstablishmentSchedules from "../../hooks/useAllEstablishmentSchedules";
import useCourtsByEstablishmentId from "../../hooks/useCourtsByEstablishmentId";
import { useGetUserEstablishmentInfos } from "../../hooks/useGetUserEstablishmentInfos";
import { getWeekDays } from "../../utils/getWeekDates";

import { useApolloClient } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomBlackMenuEstablishment from "../../components/BottomBlackMenuEstablishment";
import { useUser } from "../../context/userContext";
import {
  IBlockScheduleResponse,
  IBlockScheduleVariable,
  blockScheduleMutation,
} from "../../graphql/mutations/blockScheduleByDate";
import useBlockSchedule from "../../hooks/useBlockSchedule";
import useBlockScheduleByHour from "../../hooks/useBlockScheduleByHour";

const portugueseMonths = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const portugueseDaysOfWeek = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

interface IBlockScheduleByDateFormData {
  initialDate: string;
  endDate: string;
}

const blockScheduleByDateFormSchema = z.object({
  initialDate: z
    .string()
    .nonempty("Insira pelo menos uma data inicial!")
    .min(10, "Insira uma data válida!"),
  endDate: z.string().min(10, "Insira uma data válida!"),
});

interface IBlockScheduleByTimeFormData {
  initialHour: string;
  endHour: string;
}

const blockScheduleByTimeFormSchema = z.object({
  initialHour: z
    .string()
    .nonempty("Insira pelo menos um horário inicial!")
    .min(5, "Insira um horário válido"),
  endHour: z.string().min(5, "Insira um horário válido"),
});

export default function CourtSchedule({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "CourtSchedule">) {
  const { userData } = useUser();

  const [userId, setUserId] = useState<string>();
  const [establishmentId, setEstablishmentId] = useState<string>(
    route.params.establishmentId,
  );
  const [establishmentPicture, setEstablishmentPicture] = useState<
    string | undefined
  >("");

  useEffect(() => {
    AsyncStorage.getItem("@inquadra/establishment-profile-photo").then(
      value => {
        console.log({ photo: value });
        setEstablishmentPicture(value ? value : undefined);
        navigation.setParams({
          establishmentPhoto: value ?? undefined,
        });
      },
    );

    if (userData && userData.id) setUserId(userData.id);
    else navigation.navigate("Login");
  }, []);

  const [showCalendar, setShowCalendar] = useState(false);
  const [dateSelected, setDateSelected] = useState<Date>(new Date());
  const [selectedWeekDate, setSelectedWeekDate] = useState<WeekDays>();

  const [showAll, setShowAll] = useState(false);
  const [schedulingsFocus, setSchedulingsFocus] = useState(true);
  const [schedulingsHistoricFocus, setSchedulingsHistoricFocus] =
    useState(false);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [blockScheduleByDateModal, setBlockScheduleByDateModal] =
    useState(false);
  const closeBlockScheduleByDateModal = () =>
    setBlockScheduleByDateModal(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [confirmBlockSchedule, setConfirmBlockSchedule] = useState(false);
  const closeConfirmBlockScheduleModal = () => setConfirmBlockSchedule(false);
  const [chooseBlockTypeModal, setChooseBlockTypeModal] = useState(false);
  const closeChooseBlockTypeModal = () => setChooseBlockTypeModal(false);
  const [blockScheduleByTimeModal, setBlockScheduleByTimeModal] =
    useState(false);
  const closeBlockScheduleByTimeModal = () =>
    setBlockScheduleByTimeModal(false);

  const {
    data: userByEstablishmentData,
    error: userByEstablishmentError,
    loading: userByEstablishmentLoading,
  } = useGetUserEstablishmentInfos(userId!);

  const {
    data: courtsByEstablishmentIdData,
    error: courtsByEstablishmentIdError,
    loading: courtsByEstablishmentIdLoading,
  } = useCourtsByEstablishmentId(establishmentId!);
  const {
    data: schedulesData,
    error: schedulesError,
    loading: schedulesLoading,
  } = useAllEstablishmentSchedules(route.params.establishmentId!);
  const [
    blockSchedule,
    {
      data: blockScheduleData,
      error: blockScheduleError,
      loading: blockScheduleLoading,
    },
  ] = useBlockSchedule();
  const [
    blockScheduleByHour,
    {
      data: blockScheduleByHourData,
      error: blockScheduleByHourError,
      loading: blockScheduleByHourLoading,
    },
  ] = useBlockScheduleByHour();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IBlockScheduleByDateFormData>({
    resolver: zodResolver(blockScheduleByDateFormSchema),
  });
  const {
    control: blockScheduleByTimeControl,
    handleSubmit: handleSubmitBlockScheduleByTime,
    formState: { errors: blockScheduleByTimeErrors },
  } = useForm<IBlockScheduleByTimeFormData>({
    resolver: zodResolver(blockScheduleByTimeFormSchema),
  });

  interface IEstablishmentSchedules {
    courtId: string;
    courtName: string;
    courtType: string;
    startsAt: string;
    endsAt: string;
    weekDay: string;
    scheduling: {
      schedulingId: string;
      schedulingDate: string;
      schedulingStatus: boolean;
      reservedBy: string;
      payedStatus: string;
    };
  }

  const [establishmentSchedules, setEstablishmentSchedules] = useState<
    IEstablishmentSchedules[]
  >([]);
  useEffect(() => {
    if (
      schedulesData &&
      schedulesData.establishment.data &&
      schedulesData.establishment.data.attributes.courts.data.length > 0
    )
      schedulesData.establishment.data?.attributes.courts.data.map(
        courtItem => {
          if (
            courtItem &&
            courtItem.attributes.court_availabilities.data.length > 0
          ) {
            courtItem.attributes.court_availabilities.data.map(
              courtAvailabilitieItem => {
                if (
                  courtAvailabilitieItem.attributes.schedulings.data.length > 0
                ) {
                  courtAvailabilitieItem.attributes.schedulings.data.map(
                    schedulingItem => {
                      setEstablishmentSchedules([
                        ...establishmentSchedules!,
                        {
                          courtId: courtItem.id,
                          courtName: courtItem.attributes.name,
                          courtType:
                            courtItem?.attributes.court_types.data[0].attributes
                              .name,
                          startsAt: courtAvailabilitieItem.attributes.startsAt,
                          endsAt: courtAvailabilitieItem.attributes.endsAt,
                          weekDay: courtAvailabilitieItem.attributes.weekDay,
                          scheduling: {
                            schedulingId: schedulingItem.id,
                            schedulingDate: schedulingItem.attributes.date,
                            schedulingStatus: schedulingItem.attributes.status,
                            reservedBy:
                              schedulingItem.attributes.owner.data.attributes
                                .name,
                            payedStatus: schedulingItem.attributes.payedStatus,
                          },
                        },
                      ]);
                    },
                  );
                }
              },
            );
          }
        },
      );
  }, [schedulesData]);

  interface ICourts {
    id: string;
    name: string;
  }
  let allCourts: ICourts[] = [];

  let courtNames: string[] = [];
  if (!courtsByEstablishmentIdLoading)
    if (courtsByEstablishmentIdData != undefined)
      courtsByEstablishmentIdData.establishment.data.attributes.courts.data.map(
        courtItem => {
          courtNames.push(courtItem.attributes.name);
          allCourts = [
            ...allCourts,
            { id: courtItem.id, name: courtItem.attributes.name },
          ];
        },
      );

  const today = new Date();
  let nextWeekArray: string[] = [];

  for (let i = 1; i <= 7; i++) {
    const nextWeek = addDays(today, i).toISOString().split("T")[0];
    nextWeekArray = [...nextWeekArray, nextWeek];
  }

  if (
    userByEstablishmentData?.usersPermissionsUser.data.attributes.establishment
      .data.attributes.photo!
  ) {
    navigation.setParams({
      establishmentPhoto: Array.isArray(
        userByEstablishmentData.usersPermissionsUser.data.attributes
          .establishment.data.attributes.photo,
      )
        ? userByEstablishmentData.usersPermissionsUser.data.attributes
            .establishment.data.attributes.photo[0]
        : userByEstablishmentData.usersPermissionsUser.data.attributes
            .establishment.data.attributes.photo,
    });
  }

  let weekDates: FormatedWeekDates[] = [];
  if (dateSelected) weekDates = getWeekDays(dateSelected);
  else weekDates = getWeekDays(today);

  const standardActiveStates: IActiveState[] = [];
  weekDates.map(item => {
    standardActiveStates.push({
      active: false,
      date: item.date.toISOString().split("T")[0],
    });
  });
  interface IActiveState {
    active: boolean;
    date: string;
  }
  const [activeStates, setActiveStates] =
    useState<IActiveState[]>(standardActiveStates);

  const standardActiveCourts: IActiveCourt[] = [];
  allCourts.map(item => {
    standardActiveCourts.push({
      active: false,
      id: item.id,
    });
  });
  interface IActiveCourt {
    active: boolean;
    id: string;
  }
  const [activeCourts, setActiveCourts] =
    useState<IActiveCourt[]>(standardActiveCourts);

  useEffect(() => {
    setActiveStates(standardActiveStates);
    setActiveCourts(standardActiveCourts);
  }, [userByEstablishmentData]);

  const [shownSchedules, setShownSchedules] = useState<
    IEstablishmentSchedules[]
  >([]);

  function handleWeekDayClick(index: number) {
    const schedules = establishmentSchedules;

    let newActiveStates: IActiveState[] = [];
    weekDates.map(weekDayItem => {
      newActiveStates = [
        ...newActiveStates,
        {
          active: false,
          date: weekDayItem.date.toISOString().split("T")[0],
        },
      ];
    });
    newActiveStates[index] = {
      active: true,
      date: weekDates[index].date.toISOString().split("T")[0],
    };
    setActiveStates(newActiveStates);

    let newDateSelected = weekDates[index].date;
    setDateSelected(new Date(newDateSelected));

    setSelectedWeekDate(weekDates[index].dayName as unknown as WeekDays);
    if (schedules)
      setShownSchedules(
        establishmentSchedules.filter(
          scheduleItem =>
            scheduleItem.scheduling.schedulingDate ===
            weekDates[index].date.toISOString().split("T")[0],
        ),
      );
  }

  async function handleCalendarClick(data: DateData) {
    const date = new Date(data.dateString);
    const weekDay = format(addDays(date, 1), "eeee");
    setDateSelected(date);

    let newActiveStates: IActiveState[] = [];
    try {
      await Promise.all(
        weekDates.map(weekDayItem => {
          newActiveStates = [
            ...newActiveStates,
            {
              active: false,
              date: data.dateString,
            },
          ];
        }),
      );
    } catch (error) {
      alert(error);
    }

    const index = newActiveStates.findIndex(
      activeItem => activeItem.date == date.toISOString().split("T")[0],
    );
    newActiveStates[index] = {
      active: true,
      date: weekDates[index].date.toISOString().split("T")[0],
    };

    setActiveStates(newActiveStates);

    const schedules = establishmentSchedules;
    if (schedules)
      setShownSchedules(
        establishmentSchedules.filter(
          scheduleItem =>
            scheduleItem.scheduling.schedulingDate === data.dateString,
        ),
      );
  }

  console.log("shown:", shownSchedules);

  // const [selectedCourts, setSelectedCourts] = useState("")
  const [blockedCourtId, setBlockedCourtId] = useState<string>("");
  function handleSelectedCourt(index: number) {
    let newActiveCourts: IActiveCourt[] = [];
    allCourts.map(courtItem => {
      newActiveCourts = [
        ...newActiveCourts,
        {
          active: false,
          id: courtItem.id,
        },
      ];
    });
    newActiveCourts[index] = {
      active: true,
      id: allCourts[index].id,
    };
    const selectedCourtId = newActiveCourts.find(
      courtItem => courtItem.active === true,
    );
    setBlockedCourtId(selectedCourtId?.id!);
    setActiveCourts(newActiveCourts);
  }

  interface ISchedulingsByDate {
    date: string;
    scheduling_quantity: number | undefined;
  }
  const [selectedCourtId, setSelectedCourtId] = useState("0");
  const [schedulingsJson, setSchedulingsJson] = useState<ISchedulingsByDate[]>(
    [],
  );
  const apolloClient = useApolloClient();

  const handleNextSchedules = async (selectedCourt: string) => {
    const foundCourt = allCourts.find(
      courtItem => courtItem.name === selectedCourt,
    );
    if (!foundCourt) return;
    setSelectedCourtId(foundCourt.id);

    if (parseFloat(foundCourt.id) > 0) {
      let scheduleInfoArray = await Promise.all(
        nextWeekArray.map(async item => {
          const {
            data: scheduleByDateData,
            error: scheduleByDateError,
            loading: scheduleByDateLoading,
          } = await apolloClient.query<
            ISchedulingByDateResponse,
            ISchedulingByDateVariables
          >({
            query: schedulingByDateQuery,
            variables: {
              date: {
                eq: item,
              },
              court_id: {
                eq: foundCourt.id,
              },
            },
          });

          return {
            date: item,
            scheduling_quantity: scheduleByDateData?.schedulings.data?.length,
          };
        }),
      );
      setSchedulingsJson(scheduleInfoArray);
    }
  };

  const fill = "rgba(255, 97, 18, 1)";
  let data: number[] = [];
  schedulingsJson.forEach(item => {
    data.push(item.scheduling_quantity!);
  });
  const maxValue = Math.max.apply(null, data);
  const sumValues = (array: number[]): number => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) sum += array[i];
    return sum;
  };
  const sumValuesTotal: number = sumValues(data);

  const [isLoading, setIsLoading] = useState(false);

  function getDatesRange(initialDate: string, endDate: string) {
    const dates: string[] = [];

    let separatedInitialDate = initialDate.split("/");
    const formatedInitialDate = `${separatedInitialDate[2]}-${separatedInitialDate[1]}-${separatedInitialDate[0]}`;
    const initial = new Date(formatedInitialDate);

    if (endDate == "") {
      dates.push(new Date(initial).toISOString().split("T")[0]);
      return dates;
    } else {
      let separatedEndDate = endDate.split("/");
      const formatedEndDate = `${separatedEndDate[2]}-${separatedEndDate[1]}-${separatedEndDate[0]}`;
      const end = new Date(formatedEndDate);

      while (initial <= end) {
        dates.push(new Date(initial).toISOString().split("T")[0]);
        initial.setDate(initial.getDate() + 1);
      }

      return dates;
    }
  }

  async function setSchedulingsByDates(dates: string[], courtId: string) {
    let schedulingsByDatesArray = await Promise.all(
      dates.map(async dateItem => {
        const {
          data: scheduleByDateData,
          error: scheduleByDateError,
          loading: scheduleByDateLoading,
        } = await apolloClient.query<
          ISchedulingByDateResponse,
          ISchedulingByDateVariables
        >({
          query: schedulingByDateQuery,
          variables: {
            date: {
              eq: dateItem,
            },
            court_id: {
              eq: courtId,
            },
          },
        });

        if (scheduleByDateData != undefined) return scheduleByDateData;
      }),
    );

    let schedulingsByDateObject = schedulingsByDatesArray.map(item => {
      if (JSON.stringify(item?.schedulings.data) != "[]")
        return item?.schedulings.data;
    });

    interface ISchedulingId {
      schedulingId: number;
    }
    let schedulingsByDateJson: ISchedulingId[] = [];
    schedulingsByDateObject?.forEach(item => {
      if (item != undefined) {
        item.map(item2 => {
          schedulingsByDateJson = [
            ...schedulingsByDateJson,
            {
              schedulingId: item2.id,
            },
          ];
        });
      }
    });

    return schedulingsByDateJson;
  }

  async function handleBlockScheduleByDate(data: IBlockScheduleByDateFormData) {
    setIsLoading(true);
    const blockScheduleData = {
      ...data,
    };
    console.log("blockScheduleData", blockScheduleData);

    const datesRange = getDatesRange(
      blockScheduleData.initialDate,
      blockScheduleData.endDate,
    );
    console.log("datesRange", datesRange);

    const courtId = selectedCourtId;
    console.log("courtId ID:", courtId);
    const schedulingsByDate = await setSchedulingsByDates(datesRange, courtId);
    console.log("Scheduling", schedulingsByDate);

    if (schedulingsByDate.length > 0 && courtId) {
      try {
        for (const item of schedulingsByDate) {
          const response = await apolloClient.mutate<
            IBlockScheduleResponse,
            IBlockScheduleVariable
          >({
            fetchPolicy: "no-cache",
            mutation: blockScheduleMutation,
            variables: {
              scheduling_id: item.schedulingId.toString(),
            },
          });

          console.log("Mutation Response:", response);
        }
        setBlockedCourtId("");
        setBlockScheduleByDateModal(false);
        setConfirmBlockSchedule(true);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        console.error("DEFAULT_ERROR_MESSAGE", { type: "error" });
        setIsLoading(false);
      }
    }
  }

  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");

  function getHoursRange(startHour: string, endHour: string) {
    const hours: string[] = [];

    const initialHour = new Date(`2023-09-12T${startHour}`);
    const formatedInitialHour = sub(initialHour, {
      hours: 3,
    });

    const end = new Date(`2023-09-12T${endHour}`);
    const formatedEndHour = sub(end, {
      hours: 3,
    });

    while (formatedInitialHour <= formatedEndHour) {
      hours.push(
        new Date(formatedInitialHour)
          .toISOString()
          .split("T")[1]
          .replace("Z", ""),
      );
      formatedInitialHour.setMinutes(formatedInitialHour.getMinutes() + 30);
    }

    return hours;
  }

  async function setSchedulingsByHours(hours: string[], courtId: string) {
    let courtAvailabilitiesByHourArray = await Promise.all(
      hours.map(async hourItem => {
        const {
          data: courtAvailabilityByHourData,
          error: courtAvailabilityByHourError,
          loading: courtAvailabilityByHourLoading,
        } = await apolloClient.query<
          ICourtAvailabilityByHourResponse,
          ICourtAvailabilityByHourVariables
        >({
          query: courtAvailabilityByHourQuery,
          variables: {
            hour: {
              eq: hourItem,
            },
            court_id: {
              eq: courtId,
            },
          },
        });

        if (courtAvailabilityByHourData != undefined)
          return courtAvailabilityByHourData;
      }),
    );

    let courtAvailabilitiesByHourObject = courtAvailabilitiesByHourArray.map(
      item => {
        if (JSON.stringify(item?.courtAvailabilities.data) != "[]")
          return item?.courtAvailabilities.data;
      },
    );

    interface ICourtAvailabilityId {
      courtAvailabilityId: string;
    }
    let courtAvailabilitiesByHourJson: ICourtAvailabilityId[] = [];
    courtAvailabilitiesByHourObject?.forEach(item => {
      if (item != undefined) {
        item.map(item2 => {
          courtAvailabilitiesByHourJson = [
            ...courtAvailabilitiesByHourJson,
            {
              courtAvailabilityId: item2?.id,
            },
          ];
        });
      }
    });

    return courtAvailabilitiesByHourJson;
  }

  async function handleBlockScheduleByTime(data: IBlockScheduleByTimeFormData) {
    setIsLoading(true);

    const blockScheduleByTimeData = {
      ...data,
    };

    const hoursRange = getHoursRange(
      blockScheduleByTimeData.initialHour,
      blockScheduleByTimeData.endHour,
    );
    const courtId = selectedCourtId;
    const schedulingsByHour = await setSchedulingsByHours(hoursRange, courtId);

    if (courtId != "") {
      if (schedulingsByHour.length > 0) {
        try {
          await Promise.all(
            schedulingsByHour.map(async item => {
              await blockScheduleByHour({
                variables: {
                  court_availability_id: item.courtAvailabilityId.toString(),
                },
              });
              setBlockScheduleByTimeModal(false);
              setConfirmBlockSchedule(true);
              setIsLoading(false);
              setBlockedCourtId("");
            }),
          );
        } catch (error) {
          console.log("Deu erro: ", error);
          setIsLoading(false);
        }
      } else {
        alert("Não há nenhuma reserva nesse intervalo de datas!");
        setIsLoading(false);
      }
    } else {
      alert("Selecione uma quadra para bloquear a agenda!");
      setIsLoading(false);
    }
  }

  return (
    <View className="h-full w-full">
      <ScrollView>
        <View className="w-full h-fit flex-col mt-[15px] pl-[25px] pr-[25px]">
          <View className="flex-row w-full justify-between items-center">
            <Text className="font-black text-[20px] text-[#292929]">
              {dateSelected.toISOString().split("T")[0].split("-")[2]}{" "}
              {portugueseMonths[dateSelected.getMonth()]}
            </Text>
            <TouchableOpacity
              onPress={() => setChooseBlockTypeModal(!chooseBlockTypeModal)}
              className="h-fit w-fit justify-center items-center bg-[#FF6112] p-[10px] rounded-[4px]"
            >
              <Text className="font-bold text-[12px] text-white">
                Bloquear agenda
              </Text>
            </TouchableOpacity>
          </View>

          {!showCalendar && (
            <View className="h-fit w-full items-center justify-around flex flex-row mt-[30px]">
              {weekDates.map((date, index) => (
                <WeekDayButton
                  key={index}
                  localeDayInitial={date.localeDayInitial}
                  day={date.day}
                  onClick={isClicked => {
                    handleWeekDayClick(index);
                  }}
                  active={activeStates[index].active}
                />
              ))}
            </View>
          )}

          {showCalendar && (
            <Calendar
              className="h-fit mt-[30px] p-[12px]"
              current={new Date().toDateString()}
              onDayPress={handleCalendarClick}
              markedDates={{
                [dateSelected.toISOString().split("T")[0]]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: "orange",
                },
              }}
            />
          )}
        </View>

        <View className="w-full h-fit pl-[25px] pr-[25px] flex flex-row items-center justify-between">
          <Text className="text-[16px] text-[#292929] font-black">
            {dateSelected.toISOString().split("T")[0].split("-")[2]}/
            {dateSelected.toISOString().split("T")[0].split("-")[1]} -{" "}
            {portugueseDaysOfWeek[dateSelected.getUTCDay()]}
          </Text>
          <TouchableOpacity
            onPress={() => setShowCalendar(!showCalendar)}
            className="bg-[#959595] h-[4px] w-[30px] mt-[10px] rounded-[5px] ml-[10px]"
          />
          <View className="flex flex-row items-center gap-x-[5px]">
            <View className="flex flex-row items-center gap-x-[3px]">
              <View className="h-[10px] w-[10px] bg-[#FF6112] rounded-[3px]"></View>
              <Text className="text-[10px] text-black font-light">
                Reservada
              </Text>
            </View>

            <View className="flex flex-row items-center gap-x-[3px]">
              <View className="h-[10px] w-[10px] bg-[#4D4D4D] rounded-[3px]"></View>
              <Text className="text-[10px] text-black font-light">
                Disponível
              </Text>
            </View>
          </View>
        </View>

        {/* ${showAll ? "max-h-[350px]" : "max-h-fit"} */}

        <View className={`${showAll ? "max-h-[350px]" : "max-h-fit"}`}>
          <ScrollView className={`pl-[25px] pr-[40px] mt-[15px] w-full`}>
            {shownSchedules &&
              shownSchedules.map(scheduleItem => {
                const startsAt = scheduleItem.startsAt.split(":");
                const endsAt = scheduleItem.endsAt.split(":");

                return (
                  <AddCourtSchedule
                    name={scheduleItem.courtName}
                    startsAt={`${startsAt[0]}:${startsAt[1]}h`}
                    endsAt={`${endsAt[0]}:${endsAt[1]}h`}
                    isReserved={true}
                    courtType={scheduleItem.courtType}
                    reservedBy={scheduleItem.scheduling.reservedBy}
                    payedStatus={scheduleItem.scheduling.payedStatus}
                  />
                );
              })}

            {shownSchedules.length == 0 && (
              <View className="h-[50px] items-center justify-center">
                <Text className="text-[16px] font-bold">
                  Nenhuma reserva para esse dia!
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View className="pl-[25px] pr-[40px] justify-center items-center opacity-50">
          <TouchableOpacity
            onPress={() => setShowAll(!showAll)}
            className="bg-[#787878] h-[4px] w-[50px] mt-[10px] rounded-[5px]"
          ></TouchableOpacity>
        </View>

        <View className="pl-[25px] w-full h-fit flex flex-row mt-[10px]">
          <TouchableOpacity
            onPress={() => {
              setSchedulingsFocus(true);
              setSchedulingsHistoricFocus(false);
            }}
          >
            <Text
              className={`font-black text-[16px] ${
                schedulingsFocus
                  ? "text-black"
                  : "text-[#292929]" && "opacity-40"
              } ${schedulingsFocus ? "border-b-[1px]" : ""}`}
            >
              Reservas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSchedulingsHistoricFocus(true);
              setSchedulingsFocus(false);
              navigation.navigate("Schedulings", {
                establishmentId: establishmentId,
                establishmentPhoto: establishmentPicture,
              });
            }}
          >
            <Text
              className={`font-black text-[16px] ml-[10px] ${
                schedulingsHistoricFocus
                  ? "text-black"
                  : "text-[#292929]" && "opacity-40"
              } ${schedulingsHistoricFocus ? "border-b-[1px]" : ""}`}
            >
              Histórico de reservas
            </Text>
          </TouchableOpacity>
        </View>

        {schedulingsFocus && (
          <View className="pl-[25px] pr-[40px] mt-[15px] mb-[10px] w-fit h-fit">
            <View className="w-full rounded-[4px] flex flex-row items-center justify-between">
              <View className="flex flex-row">
                <Text className="font-bold text-[12px] text-black">
                  Próximos 7 dias
                </Text>
              </View>

              <SelectList
                onSelect={async () => await handleNextSchedules(selectedCourt)}
                setSelected={(val: string) => {
                  setSelectedCourt(val);
                }}
                data={courtNames}
                save="value"
                placeholder="Selecione uma quadra"
                searchPlaceholder="Pesquisar..."
                dropdownTextStyles={{ color: "#FF6112" }}
                inputStyles={{
                  alignSelf: "center",
                  height: 14,
                  color: "#B8B8B8",
                }}
                closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
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
                    size={20}
                    color="#FF6112"
                    style={{ alignSelf: "center" }}
                  />
                }
              />
            </View>

            <View>
              <Text className="font-bold text-[6px] w-[30px]">
                Qtd. reservas
              </Text>

              <Text className="font-bold text-[9px]">{sumValuesTotal}</Text>
            </View>

            {/* {maxValue > 0 && (
                            <BarChart
                                style={{ height: 200 }}
                                data={data}
                                svg={{ fill }}
                                contentInset={{ top: 20, bottom: 10 }}
                                spacing={0.2}
                                gridMin={0}
                            >
                                <Grid
                                    direction={Grid.Direction.HORIZONTAL}
                                />

                                <ScheduleChartLabels
                                    data={data}
                                    maxValue={maxValue}
                                    x={(index) => index}
                                    y={(value) => value}
                                    bandwidth={0}
                                />
                            </BarChart>
                        )} */}

            {maxValue == 0 && (
              <View className="h-[100px] flex items-center justify-center">
                <Text className="text-[16px] font-bold">
                  Não há reservas para os próximos 7 dias.
                </Text>
              </View>
            )}
          </View>
        )}

        <Modal
          visible={chooseBlockTypeModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeChooseBlockTypeModal}
        >
          <View className="h-full w-full justify-center items-center">
            <View className="h-fit w-[350px] bg-white rounded-[5px] items-center">
              <View className="w-full h-[250px] items-center justify-evenly">
                <Button
                  onPress={closeChooseBlockTypeModal}
                  className="w-[50px] h-[50px] absolute bottom-0 top-0 left-0 right-0 items-center justify-center"
                >
                  <Image
                    className=""
                    source={require("../../assets/back_arrow.png")}
                  ></Image>
                </Button>

                <Button
                  className="flex items-center justify-center bg-[#FF6112] h-[50px] w-[200px] rounded-md"
                  onPress={() => {
                    closeChooseBlockTypeModal();
                    setBlockScheduleByTimeModal(!blockScheduleByTimeModal);
                  }}
                >
                  <Text className="w-full h-full font-medium text-[16px] text-white">
                    Bloquear por horário
                  </Text>
                </Button>

                <Button
                  className="flex items-center justify-center bg-[#FF6112] h-[50px] w-[200px] rounded-md"
                  onPress={() => {
                    closeChooseBlockTypeModal();
                    setBlockScheduleByDateModal(!blockScheduleByDateModal);
                  }}
                >
                  <Text className="w-full h-full font-medium text-[16px] text-white">
                    Bloquear por data
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={blockScheduleByTimeModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeBlockScheduleByTimeModal}
        >
          <View className="h-full w-full justify-center items-center">
            <View className="h-fit w-[350px] bg-white rounded-[5px] items-center">
              <Button
                onPress={closeBlockScheduleByTimeModal}
                className="w-[50px] h-[50px] absolute bottom-0 top-0 left-0 right-0 items-center justify-center"
              >
                <Image
                  className=""
                  source={require("../../assets/back_arrow.png")}
                ></Image>
              </Button>

              <View className="w-[60%] justify-center items-center mt-[15px]">
                <Text className="font-bold text-[14px] text-center">
                  Escolha a quadra que deseja bloquear agenda?
                </Text>
              </View>

              <View className="flex flex-row flex-wrap w-full justify-evenly">
                {activeCourts != undefined &&
                  !courtsByEstablishmentIdLoading &&
                  courtsByEstablishmentIdData &&
                  courtsByEstablishmentIdData.establishment.data.attributes.courts.data.map(
                    (courtItem, index) => {
                      if (activeCourts[index] != undefined) {
                        return (
                          <CourtSlideButton
                            key={index}
                            name={courtItem.attributes.name}
                            onClick={isClicked => {
                              handleSelectedCourt(index);
                            }}
                            active={activeCourts[index].active}
                          />
                        );
                      }
                    },
                  )}
              </View>

              <View className="flex flex-row pl-[15px] pr-[15px] w-full">
                <View className="flex-1 mr-[6px]">
                  <Text className="text-sm text-[#FF6112]">A partir de:</Text>

                  <View
                    className={`flex flex-row items-center justify-between border ${
                      blockScheduleByTimeErrors.initialHour
                        ? "border-red-400"
                        : "border-gray-400"
                    } rounded p-3`}
                  >
                    <Controller
                      name="initialHour"
                      control={blockScheduleByTimeControl}
                      rules={{
                        required: true,
                        minLength: 25,
                      }}
                      render={({ field: { onChange } }) => (
                        <TextInputMask
                          type={"datetime"}
                          options={{
                            format: "99:99",
                          }}
                          onChangeText={text => {
                            onChange(text);
                            setStartHour(text);
                          }}
                          value={startHour}
                          keyboardType="numeric"
                          placeholder="HH:MM"
                          className="w-[80%]"
                        />
                      )}
                    />
                    <Image
                      source={require("../../assets/calendar_gray_icon.png")}
                    ></Image>
                  </View>
                  {blockScheduleByTimeErrors.initialHour && (
                    <Text className="text-red-400 text-sm -pt-[10px]">
                      {blockScheduleByTimeErrors.initialHour.message}
                    </Text>
                  )}
                </View>

                <View className="flex-1 ml-[6px]">
                  <Text className="text-sm text-[#FF6112]">Até:</Text>

                  <View
                    className={`flex flex-row items-center justify-between border ${
                      blockScheduleByTimeErrors.endHour
                        ? "border-red-400"
                        : "border-gray-400"
                    } rounded p-3`}
                  >
                    <Controller
                      name="endHour"
                      control={blockScheduleByTimeControl}
                      rules={{
                        required: false,
                      }}
                      render={({ field: { onChange } }) => (
                        <TextInputMask
                          type={"datetime"}
                          options={{
                            format: "99:99",
                          }}
                          onChangeText={text => {
                            onChange(text);
                            setEndHour(text);
                          }}
                          value={endHour}
                          keyboardType="numeric"
                          placeholder="HH:MM"
                          className="w-[80%]"
                        />
                      )}
                    />
                    <Image
                      source={require("../../assets/calendar_gray_icon.png")}
                    ></Image>
                  </View>
                  {blockScheduleByTimeErrors.endHour && (
                    <Text className="text-red-400 text-sm -pt-[10px]">
                      {blockScheduleByTimeErrors.endHour.message}
                    </Text>
                  )}
                </View>
              </View>

              <View className="w-full h-fit mt-[20px] mb-[20px] justify-center items-center">
                <Button
                  onPress={handleSubmitBlockScheduleByTime(
                    handleBlockScheduleByTime,
                  )}
                  className="h-[40px] w-[80%] rounded-md bg-orange-500 flex tems-center justify-center"
                >
                  <Text className="w-full h-full font-medium text-[16px] text-white">
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#F5620F" />
                    ) : (
                      "Salvar"
                    )}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={blockScheduleByDateModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeBlockScheduleByDateModal}
        >
          <View className="h-full w-full justify-center items-center">
            <View className="h-fit w-[350px] bg-white rounded-[5px] items-center">
              <Button
                onPress={closeBlockScheduleByDateModal}
                className="w-[50px] h-[50px] absolute bottom-0 top-0 left-0 right-0 items-center justify-center"
              >
                <Image
                  className=""
                  source={require("../../assets/back_arrow.png")}
                ></Image>
              </Button>
              <View className="w-[60%] justify-center items-center mt-[15px]">
                <Text className="font-bold text-[14px] text-center">
                  Escolha a quadra que deseja bloquear agenda?
                </Text>
              </View>

              <View className="flex flex-row flex-wrap w-full justify-evenly">
                {activeCourts != undefined &&
                  !courtsByEstablishmentIdLoading &&
                  courtsByEstablishmentIdData &&
                  courtsByEstablishmentIdData.establishment.data.attributes.courts.data.map(
                    (courtItem, index) => {
                      if (activeCourts[index] != undefined) {
                        return (
                          <CourtSlideButton
                            name={courtItem.attributes.name}
                            onClick={isClicked => {
                              handleSelectedCourt(index);
                            }}
                            active={activeCourts[index].active}
                          />
                        );
                      }
                    },
                  )}
              </View>

              <View className="flex flex-row pl-[15px] pr-[15px] w-full">
                <View className="flex-1 mr-[6px]">
                  <Text className="text-sm text-[#FF6112]">A partir de:</Text>

                  <View
                    className={`flex flex-row items-center justify-between border ${
                      errors.initialDate ? "border-red-400" : "border-gray-400"
                    } rounded p-3`}
                  >
                    <Controller
                      name="initialDate"
                      control={control}
                      rules={{
                        required: true,
                        minLength: 25,
                      }}
                      render={({ field: { onChange } }) => (
                        <MaskInput
                          className={`w-[80%] bg-white `}
                          placeholder="DD/MM/AAAA"
                          value={startsAt}
                          onChangeText={(masked, unmasked) => {
                            onChange(masked);
                            setStartsAt(unmasked);
                          }}
                          mask={Masks.DATE_DDMMYYYY}
                        ></MaskInput>
                      )}
                    />
                    <Image
                      source={require("../../assets/calendar_gray_icon.png")}
                    ></Image>
                  </View>
                  {errors.initialDate && (
                    <Text className="text-red-400 text-sm -pt-[10px]">
                      {errors.initialDate.message}
                    </Text>
                  )}
                </View>

                <View className="flex-1 ml-[6px]">
                  <Text className="text-sm text-[#FF6112]">Até:</Text>

                  <View
                    className={`flex flex-row items-center justify-between border ${
                      errors.endDate ? "border-red-400" : "border-gray-400"
                    } rounded p-3`}
                  >
                    <Controller
                      name="endDate"
                      control={control}
                      rules={{
                        required: false,
                      }}
                      render={({ field: { onChange } }) => (
                        <MaskInput
                          className={`w-[80%] bg-white `}
                          placeholder="DD/MM/AAAA"
                          value={endsAt}
                          onChangeText={(masked, unmasked) => {
                            onChange(masked);
                            setEndsAt(unmasked);
                          }}
                          mask={Masks.DATE_DDMMYYYY}
                        ></MaskInput>
                      )}
                    />
                    <Image
                      source={require("../../assets/calendar_gray_icon.png")}
                    ></Image>
                  </View>
                  {errors.endDate && (
                    <Text className="text-red-400 text-sm -pt-[10px]">
                      {errors.endDate.message}
                    </Text>
                  )}
                </View>
              </View>

              <View className="w-full h-fit mt-[20px] mb-[20px] justify-center items-center">
                <Button
                  onPress={handleSubmit(handleBlockScheduleByDate)}
                  className="h-[40px] w-[80%] rounded-md bg-orange-500 flex tems-center justify-center"
                >
                  <Text className="w-full h-full font-medium text-[16px] text-white">
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#F5620F" />
                    ) : (
                      "Salvar"
                    )}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={confirmBlockSchedule}
          animationType="fade"
          transparent={true}
          onRequestClose={closeConfirmBlockScheduleModal}
        >
          <View className="h-full w-full justify-center items-center">
            <View className="h-[256px] w-[350px] bg-white rounded-[5px] items-center justify-center">
              <View className=" items-center justify-evenly h-[80%]">
                <Text className="font-bold text-[14px] text-center">
                  Agenda bloqueada com sucesso
                </Text>
                <Image
                  source={require("../../assets/orange_logo_inquadra.png")}
                ></Image>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <View className={`absolute bottom-0 left-0 right-0`}>
        <BottomBlackMenuEstablishment
          screen="Schedule"
          establishmentLogo={establishmentPicture ?? null}
          establishmentID={establishmentId}
          key={1}
          paddingTop={2}
        />
      </View>
    </View>
  );
}
