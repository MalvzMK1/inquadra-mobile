import { Alert, Share, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useEstablishmentPixKeysQuery } from "../../hooks/useEstablishmentPixKeysQuery";

interface DescriptionReserveShareButtonProps {
  establishmentId: string;
  courtName: string;
  schedulingStartsAt: string;
  schedulingEndsAt: string;
}

export const DescriptionReserveShareButton: React.FC<
  DescriptionReserveShareButtonProps
> = ({ establishmentId, courtName, schedulingStartsAt, schedulingEndsAt }) => {
  const { data } = useEstablishmentPixKeysQuery({
    skip: !establishmentId,
    variables: {
      establishmentId: establishmentId!,
    },
  });

  async function share() {
    try {
      if (!data?.pixKeys.data.length) {
        throw new Error(
          `Não há chaves pix para do estabelecimento: ${establishmentId}`,
        );
      }

      const pixKey = data.pixKeys.data[0].attributes.key;

      await Share.share({
        title: "Compartilhar Estabelecimento",
        message: `
Olá, topa se juntar a mim na quadra ${courtName} das ${schedulingStartsAt.substring(
          0,
          5,
        )} às ${schedulingEndsAt.substring(0, 5)}?

Aqui está a chave Pix para realizar o pagamento:

Chave Pix: *${pixKey}*

Certifique-se de utilizar a chave correta para evitar qualquer inconveniente. Após efetuar a transação, por favor, nos avise para que possamos confirmar o recebimento do pagamento.

Agradecemos pela sua preferência e estamos à disposição para qualquer dúvida.

Atenciosamente, Equipe InQuadra.
        `.trim(),
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível compartilhar a chave pix.");
    }
  }

  return (
    <TouchableOpacity onPress={share} className="flex-row">
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
