import { format, parse } from "date-fns";
import { useState } from "react";
import { Alert, Share, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";

const storeDownloadLink = "https://google.com.br";

interface DescriptionReserveShareButtonProps {
  courtName: string;
  schedulingDate: string;
  schedulingEndsAt: string;
  schedulingStartsAt: string;
  schedulingRedeemCode: string;
}

export const DescriptionReserveShareButton: React.FC<
  DescriptionReserveShareButtonProps
> = ({
  courtName,
  schedulingDate,
  schedulingEndsAt,
  schedulingStartsAt,
  schedulingRedeemCode,
}) => {
  const [isSharing, setIsSharing] = useState(false);

  async function handleShare() {
    setIsSharing(true);

    try {
      const startsAt = schedulingStartsAt.substring(0, 5);
      const endsAt = schedulingEndsAt.substring(0, 5);
      const date = format(
        parse(schedulingDate, "yyyy-MM-dd", new Date()),
        "dd/MM/yyyy",
      );

      const subject = `Olá, topa se juntar a mim na quadra ${courtName} das ${startsAt} às ${endsAt} do dia ${date}?`;

      await Share.share({
        title: subject,
        url: storeDownloadLink,
        message: `
${subject}

Aqui está o link para o download do aplicativo do InQuadra:

${storeDownloadLink}

Cadastre-se para utilizar a plataforma e utilize o código abaixo para participar desta reserva.

Código: *${schedulingRedeemCode}*

Para resgatar o código, basta clica no botão "RESGATAR CÓDIGO" na tela de Agenda.

Atenciosamente, Equipe InQuadra.
        `.trim(),
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível compartilhar.");
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <TouchableOpacity
      className="flex-row"
      disabled={isSharing}
      onPress={handleShare}
    >
      <View className="h-5 w-5 items-center justify-center">
        <TextInput.Icon icon={"share-variant"} size={21} color={"#FF6112"} />
      </View>

      <View className="item-center justify-center">
        <Text className="font-black text-xs text-center text-white pl-1">
          Compartilhar
        </Text>
      </View>
    </TouchableOpacity>
  );
};
