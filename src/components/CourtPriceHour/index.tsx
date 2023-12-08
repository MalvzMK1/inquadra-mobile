import { Feather } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Modal, Text, View, TouchableOpacity } from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";

const timeMask = [/\d/, /\d/, ":", /\d/, /\d/];

interface PriceHourProps {
  minimumCourtValue?: string;
  startsAt: string;
  setStartsAt: (value: string) => void;
  endsAt: string;
  setEndsAt: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  onDelete: () => void;
}

export default function PriceHour({
  minimumCourtValue,
  startsAt,
  setStartsAt,
  endsAt,
  setEndsAt,
  price,
  setPrice,
  onDelete,
}: PriceHourProps) {
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    const validatePrice = (value: string) => {
      let minimumCourtNumber = Number(minimumCourtValue);
      let priceTest = Number(value.replace(/[^\d]/g, ""));

      if (priceTest < minimumCourtNumber) {
        setInfoModalVisible(true);
      } else {
        setInfoModalVisible(false);
      }
    };

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      validatePrice(price);
    }, 6000);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [price, minimumCourtValue]);
  return (
    <View className="flex-row w-full justify-between items-center mt-[10px]">
      <View className="flex-row items-center">
        <View className="h-[40px] w-[95px] bg-white border border-[#FF6112] rounded-[5px] flex items-center justify-center">
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
                `${padValue.substring(0, 2)}:${padValue.substring(2)}`
              );
            }}
          />
        </View>
        <Text className="text-white text-[14px]"> às </Text>
        <View className="h-[40px] w-[95px] bg-white border border-[#FF6112] rounded-[5px] flex items-center justify-center">
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
        <View className="h-[40px] w-[95px] bg-white border border-[#FF6112] rounded-[5px] flex items-center justify-center">
          <MaskInput
            className="h-full items-center justify-center"
            mask={Masks.BRL_CURRENCY}
            value={price}
            onChangeText={(text) => setPrice(text)}
            placeholder="Ex.: R$250"
            inputMode="numeric"
          />
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
                O valor/hora da sua quadra deve ser maior que o valor do sinal
                mínimo para alocação.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setInfoModalVisible(false);
                  setPrice("");
                }}
              >
                <Text className="text-black font-semibold text-base mt-2">
                  Fechar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity onPress={onDelete}>
          <Feather name="x" size={20} color="#FF6112" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
