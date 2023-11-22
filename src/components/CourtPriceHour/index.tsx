import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaskInput, { Masks } from "react-native-mask-input";

const timeMask = [/\d/, /\d/, ":", /\d/, /\d/];

interface PriceHourProps {
  startsAt: string;
  setStartsAt: (value: string) => void;
  endsAt: string;
  setEndsAt: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  onDelete: () => void;
}

export default function PriceHour({
  startsAt,
  setStartsAt,
  endsAt,
  setEndsAt,
  price,
  setPrice,
  onDelete,
}: PriceHourProps) {
  return (
    <View className="flex-row w-full justify-between items-center mt-[10px]">
      <View className="flex-row items-center">
        <View className="h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] flex items-center justify-center">
          <MaskInput
            className="h-full items-center justify-center"
            mask={timeMask}
            value={startsAt}
            onChangeText={setStartsAt}
            placeholder="Ex.: 06:00"
            inputMode="numeric"
            onBlur={() => {
              const padValue = startsAt.replace(/\D/, "").padEnd(4, "0");
              setStartsAt(
                `${padValue.substring(0, 2)}:${padValue.substring(2)}`,
              );
            }}
          />
        </View>
        <Text className="text-white text-[14px]"> às </Text>
        <View className="h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] flex items-center justify-center">
          <MaskInput
            className="h-full items-center justify-center"
            mask={timeMask}
            value={endsAt}
            onChangeText={setEndsAt}
            placeholder="Ex.: 07:00"
            inputMode="numeric"
            onBlur={() => {
              const padValue = endsAt.replace(/\D/, "").padEnd(4, "0");
              setEndsAt(`${padValue.substring(0, 2)}:${padValue.substring(2)}`);
            }}
          />
        </View>
      </View>

      <View className="flex-row items-center gap-x-[10px]">
        <View className="h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] flex items-center justify-center">
          <MaskInput
            className="h-full items-center justify-center"
            mask={Masks.BRL_CURRENCY}
            value={price}
            onChangeText={setPrice}
            placeholder="Ex.: R$250"
            inputMode="numeric"
          />
        </View>

        <TouchableOpacity onPress={onDelete}>
          <Feather name="x" size={20} color="#FF6112" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
