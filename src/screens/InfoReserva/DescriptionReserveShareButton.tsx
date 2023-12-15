import { AntDesign } from "@expo/vector-icons";
import { format, parse } from "date-fns";
import { Fragment, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import { Button, TextInput } from "react-native-paper";
import { useUser } from "../../context/userContext";
import { useGetUserById } from "../../hooks/useUserById";
import { generatePix } from "../../services/pixCielo";
import { generateRandomKey } from "../../utils/activationKeyGenerate";

interface DescriptionReserveShareButtonProps {
  userId: string;
  courtName: string;
  scheduleId: string;
  scheduleDate: string;
  schedulingEndsAt: string;
  schedulingStartsAt: string;
}

export const DescriptionReserveShareButton: React.FC<
  DescriptionReserveShareButtonProps
> = ({
  userId,
  courtName,
  scheduleId,
  scheduleDate,
  schedulingEndsAt,
  schedulingStartsAt,
}) => {
  const { userData } = useUser();
  const [price, setPrice] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: userByIdData } = useGetUserById(userData?.id ?? "");

  async function handleShare() {
    setIsSharing(true);

    try {
      const parsedPrice = Number(
        price
          .replace("R$", "")
          .replace(/[^\d,]/, "")
          .replace(",", "."),
      );

      if (!userByIdData?.usersPermissionsUser.data) {
        throw new Error("No user data");
      }

      const generatePixJSON: RequestGeneratePix = {
        MerchantOrderId:
          scheduleId + userId + generateRandomKey(3) + new Date().toISOString(),
        Customer: {
          Name: userByIdData.usersPermissionsUser.data.attributes.name,
          Identity: userByIdData.usersPermissionsUser.data.attributes.cpf,
          IdentityType: "CPF",
        },
        Payment: {
          Type: "Pix",
          Amount: parsedPrice * 100, // amount precisa ser em cents
        },
      };

      const pixGenerated = await generatePix(generatePixJSON);
      const startsAt = schedulingStartsAt.substring(0, 5);
      const endsAt = schedulingEndsAt.substring(0, 5);
      const date = format(
        parse(scheduleDate, "yyyy-MM-dd", new Date()),
        "dd/MM/yyyy",
      );

      const subject = `Olá, topa se juntar a mim na quadra ${courtName} das ${startsAt} às ${endsAt} do dia ${date}?`;

      await Share.share({
        title: subject,
        url: `data:image/png;base64,${pixGenerated.Payment.QrCodeBase64Image}`,
        message: `
${subject}

Aqui está o código PIX para realizar o pagamento:

${pixGenerated.Payment.QrCodeString}

Valor: ${price}

Certifique-se de utilizar a chave correta para evitar qualquer inconveniente. Após efetuar a transação, por favor, nos avise para que possamos confirmar o recebimento do pagamento.

Agradecemos pela sua preferência e estamos à disposição para qualquer dúvida.

Atenciosamente, Equipe InQuadra.
        `.trim(),
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível compartilhar a chave pix.");
    } finally {
      setIsSharing(false);
    }
  }

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    <Fragment>
      <TouchableOpacity onPress={handleOpenModal} className="flex-row">
        <View className="h-5 w-5 items-center justify-center">
          <TextInput.Icon icon={"share-variant"} size={21} color={"#FF6112"} />
        </View>

        <View className="item-center justify-center">
          <Text className="font-black text-xs text-center text-white pl-1">
            Compartilhar
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        transparent
        visible={isModalOpen}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View className="bg-black bg-opacity-10 flex-1 justify-center items-center">
          <View className="bg-[#292929] w-11/12 justify-center rounded-lg p-4">
            <TouchableOpacity
              disabled={isSharing}
              onPress={handleCloseModal}
              className="bg-[#FF6112] rounded-full w-6 aspect-square items-center justify-center self-end"
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>

            <View className="space-y-1">
              <Text className="text-sm text-[#FF6112]">
                Valor da contribuição
              </Text>

              <MaskInput
                className="p-3 border border-neutral-400 rounded bg-white"
                placeholder="Ex: R$ 30,00"
                value={price}
                onChangeText={setPrice}
                mask={Masks.BRL_CURRENCY}
                keyboardType="numeric"
              />
            </View>

            <Button
              mode="contained"
              onPress={handleShare}
              disabled={isSharing}
              style={{
                height: 50,
                width: "100%",
                backgroundColor: "#FF6112",
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              {isSharing ? (
                <ActivityIndicator size={24} color="white" />
              ) : (
                <Text className="text-base text-white">COMPARTILHAR</Text>
              )}
            </Button>
          </View>
        </View>
      </Modal>
    </Fragment>
  );
};
