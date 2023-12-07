import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { formatCardNumber } from "../../utils/formatCardNumber";
import {useUser} from "../../context/userContext";

type CreditCardInfosT = {
  id: number;
  number: string;
};

export default function CreditCardCard(props: CreditCardInfosT) {
  const {userData} = useUser();
  const [cardDeleted, setCardDeleted] = useState(false);

  const creditCardNumber = props.number.replace(/\D/g, "");
  let label = "";

  const regexVisa = /^4[0-9]{12}(?:[0-9]{3})?$/;
  const regexMasterCard = /^5[1-5][0-9]{14}$/;
  const regexElo = /^(636368|438935|504175|451416|636297)[0-9]{10}$/;

  if (regexVisa.test(creditCardNumber)) {
    label = "visa";
  } else if (regexMasterCard.test(creditCardNumber)) {
    label = "masterCard";
  } else if (regexElo.test(creditCardNumber)) {
    label = "elo";
  } else {
    label = "unknown";
  }

  const handleDeleteCard = async (cardId: number) => {
    try {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Deseja excluir o cartão?",
        button: "Sim",
        onPressButton: async () => {
          if (userData && userData.id) {
            const userCardsJSON = await AsyncStorage.getItem(
              `user${userData?.id}Cards`,
            );
            if (userCardsJSON) {
              const userCards = JSON.parse(userCardsJSON) as CreditCardInfosT[];

              const cardIndex = userCards.findIndex(card => card.id === cardId);

              if (cardIndex !== -1) {
                userCards.splice(cardIndex, 1);

                await AsyncStorage.setItem(
                  `user${userData?.id}Cards`,
                  JSON.stringify(userCards),
                );

                setCardDeleted(true);
                Dialog.show({
                  title: "Cartão deletado com sucesso",
                  type: ALERT_TYPE.SUCCESS,
                });
              }
            }
          }
        },
      });
    } catch (error) {
      console.error("Erro ao excluir o cartão", error);
    }
  };

  return !cardDeleted ? (
    <View className="flex h-[90px] w-full rounded-xl border justify-center items-start border-[#292929]">
      <View className="before:absolute before:w-1 before:h-[69px] before:bg-[#F5620F] before:content '' left-[10px] "></View>
      <View className="flex w-full items-end pr-4 pt-2">
        <MaterialIcons
          name="delete"
          color="#F5620F"
          size={25}
          onPress={() => handleDeleteCard(props.id)}
        />
      </View>
      <View className="flex-row pl-5 items-center">
        <Text className="font-bold text-base">
          {formatCardNumber(props.number)}
        </Text>
        {label === "visa" ? (
          <Image
            className="h-[15px] w-[48px] pl-2"
            source={require("../../assets/visaLogo.png")}
          ></Image>
        ) : label === "masterCard" ? (
          <Image
            className="h-[15px] w-[43px] pl-2"
            source={require("../../assets/masterCardLogo.png")}
          ></Image>
        ) : label === "elo" ? (
          <Image
            className="h-[18px] w-[48px] pl-6"
            source={require("../../assets/eloLogo.png")}
          ></Image>
        ) : null}
      </View>
      <View className="h-[25]"></View>
    </View>
  ) : null;
}
