import { useNavigation } from "@react-navigation/native";
import { Text, View, Image } from "react-native";
import { Button } from "react-native-elements";

export default function PaymentQRCode() {

    const navigation = useNavigation()

    return (
        <View className="h-screen w-screen flex flex-col items-center gap-y-5  bg-white">
            <Text className="text-xl text-[#4B4B4B] font-black pt-16">
                Quadra Municipal Itaquera
            </Text>
            <Image className="h-1/4 w-2/4" source={{ uri: "https://i0.wp.com/tarciziosilva.com.br/blog/wp-content/uploads/2009/08/qrcode.png?resize=186%2C186" }} />
            <Text className="text-xl text-[#4B4B4B] font-black">
                Pagamento do Sinal
            </Text>
            <View className="w-full h-[55px] justify-center bg-[#D9D9D9] flex items-center">
                <Text className="font-black text-3xl text-[#4B4B4B]">
                    R$40.00
                </Text>
            </View>
            <View className="w-full px-5">
                <Button
                    title="Copiar código Pix"
                    buttonStyle={{
                        backgroundColor: "#F5620F",
                        borderRadius: 6,
                        paddingVertical: 16,
                    }}
                    onPress={() => navigation.navigate('PaymentLoad')}
                ></Button>
            </View>
        </View>
    )

}