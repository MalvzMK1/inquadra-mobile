import React from "react";
import { Text, View } from "react-native";
import { CheckBox } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Appointment } from "../../screens/CourtPriceHour";
import PriceHour from "../CourtPriceHour";
import routes from "../../routes";

interface SetCourtAvailibilityProps {
  appointments: Appointment[];
  hasCopy: boolean;
  isDayUse: boolean;
  minimumCourtPrice?: string
  setDayUse: (isDayUse: boolean) => void;
  onCopy: () => void;
  onPaste: () => void;
  onAddNewAppointment: () => void;
  setStartsAt: (value: string, index: number) => void;
  setEndsAt: (value: string, index: number) => void;
  setPrice: (value: string, index: number) => void;
  onDeleteAppointment: (index: number) => void;
}

export default function SetCourtAvailibility({
  minimumCourtPrice,
  appointments,
  hasCopy,
  isDayUse,
  setDayUse,
  onCopy,
  onPaste,
  onAddNewAppointment,
  setStartsAt,
  setEndsAt,
  setPrice,
  onDeleteAppointment,
}: SetCourtAvailibilityProps) {
  return (
    <View className="mt-2.5">
      {hasCopy && (
        <View className="flex-row items-center justify-between mt-[25px] mb-[25px]">
          <Text className="text-white text-[16px]">
            Colar horário e valores?
          </Text>

          <TouchableOpacity
            onPress={onPaste}
            className="h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center"
          >
            <Text className="text-[11px]">Colar</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text className="text-white text-[16px]">
        A quadra possui serviço de Day-Use?
      </Text>

      <View className="flex-row">
        <View className="flex-row items-center justify-center">
          <CheckBox checked={isDayUse} onPress={() => setDayUse(true)} />
          <Text className="text-white text-[16px] -ml-[15px]">Sim</Text>
        </View>

        <View className="flex-row items-center justify-center ml-[5px]">
          <CheckBox checked={!isDayUse} onPress={() => setDayUse(false)} />
          <Text className="text-white text-[16px] -ml-[15px]">Não</Text>
        </View>
      </View>

      <View className="w-full flex-col mt-[40px]">
        <View className="flex-row justify-between w-full border-b border-white">
          <Text className="text-white text-[14px]">Horário</Text>
          <Text className="text-white text-[14px]">Valor</Text>
        </View>

        <View className="h-fit w-full flex">
          {appointments.map((appointment, index) => (
            <PriceHour
              minimumCourtValue={minimumCourtPrice}
              key={index}
              startsAt={appointment.startsAt}
              endsAt={appointment.endsAt}
              price={appointment.price}
              setStartsAt={value => setStartsAt(value, index)}
              setEndsAt={value => setEndsAt(value, index)}
              setPrice={value => setPrice(value, index)}
              onDelete={() => onDeleteAppointment(index)}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={onAddNewAppointment}
        className="h-[32px] w-[86px] bg-[#FF6112] rounded-[5px] items-center justify-center ml-[105px] mt-[20px]"
      >
        <Text className="text-white text-[10px]">Adicionar horário</Text>
      </TouchableOpacity>

      {!hasCopy && appointments.length > 0 && (
        <View className="flex-row items-center justify-between mt-[35px] mb-[30px]">
          <Text className="text-white text-[16px]">
            Copiar horário e valores?
          </Text>

          <TouchableOpacity
            onPress={onCopy}
            className="h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center"
          >
            <Text className="text-[11px]">Copiar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
