import { View, Text, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import Animated, {
    FadeOut,
    FadeIn,
    useSharedValue,
    withTiming,
    useAnimatedStyle
} from "react-native-reanimated";
import Home from "../home";
export default function PaymentLoad() {

    const [showAnimation, setShowAnimation] = useState(true);
    const rotation = useSharedValue(0);
    const width = useSharedValue(97);
    const height = useSharedValue(100);

    useEffect(() => {
        if (showAnimation) {

            setTimeout(() => {
                rotation.value = withTiming(68.23, { duration: 500 });
                width.value = withTiming(197, { duration: 500 });
                height.value = withTiming(200, { duration: 500 });
                setTimeout(() => {
                    rotation.value = withTiming(0, { duration: 500 });
                    width.value = withTiming(50, { duration: 500 });
                    height.value = withTiming(50, { duration: 500 });
                    setTimeout(() => {
                        width.value = withTiming(97, { duration: 500 });
                        height.value = withTiming(100, { duration: 500 });
                        setTimeout(() => {
                            setShowAnimation(false)
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000)
        }
    }, [showAnimation]);

    const IconComponent = () => (
        <>
            <Animated.View exiting={FadeOut} className={`fixed h-[220px] mt-[-90px] `}>
                <Animated.Image
                    className="fixed left-0 right-0"
                    style={useAnimatedStyle(() => {
                        return {
                            transform: [{ rotate: `${rotation.value}deg` }],
                            width: width.value,
                            height: height.value,
                            alignSelf: "center"
                        };
                    })}
                    source={require("../../assets/inquadra_active_unnamed_logo.png")} />
            </Animated.View>
            <Animated.Text exiting={FadeOut} className="font-black text-[#4B4B4B] text-xl">
                Pagamento em Processamento
            </Animated.Text>
        </>
    )

    return (
        <View className={`w-screen h-screen flex items-center justify-center bg-white`}>
            {showAnimation && <IconComponent />}
            {!showAnimation &&
                <Animated.View entering={FadeIn} className="w-full h-full items-center gap-y-5 mt-[50%]">
                    <Text className="font-black text-[#4B4B4B] text-xl">Quadra Municipal Itaquera</Text>
                    <View className="w-full h-1/4 flex items-center">
                        <Image className="w-4/5 h-full rounded-[10px]" source={{ uri: "https://www.elasta.com.br/wp-content/uploads/2020/11/Quadras-Poliesportivas-1024x526.jpg" }} />
                        <Animated.View entering={FadeIn.delay(1500)} className="absolute top-1/4 rotate-[-20deg]  bg-white rounded-full p-1">
                            <AntDesign name="checkcircle" size={100} color="#0FA958" />
                        </Animated.View>
                    </View>
                    <Text className="font-black text-[#4B4B4B] text-xl">Local Reservado</Text>
                    <Text className="font-black text-[#4B4B4B] text-xl text-center w-2/3">Você pode verificar sua reserva no ícone
                        <Text className="font-black text-[#FF6112] text-xl">
                            {` calendário`}
                        </Text>
                    </Text>
                </Animated.View>
            }
        </View>
    )
}