import { View, Text, Image, Dimensions, ScrollView } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { ImageSourcePropType } from "react-native/Libraries/Image/Image"
import { CourtCard } from "../../components/CourtCardInfo";

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = SLIDER_WIDTH * 0.88

const carouselItemsTest = [
    {
        imgUrl:
            require('../../assets/quadra.png')
    },
    {
        imgUrl:
            require('../../assets/quadra.png')
    },
    {
        imgUrl:
            require('../../assets/quadra.png')
    }
]

type Props = {
    item: {
        imgUrl: ImageSourcePropType
    }
    index: number
}

const carouselCardItem = ({ item }: Props) => {
    return (
        <View className="w-full justify-center items-center">
            <Image className="h-20 w-40" source={item.imgUrl}></Image>
        </View>
    )
}

export default function EstablishmentInfo() {
    const [heartColor, setHeartColor] = useState("white")
    const [footerHeartColor, setFooterHeartColor] = useState("white")
    const [starColor, setStarColor] = useState("white")
    return (
        <View className="w-full h-screen p-5 flex flex-col gap-y-[20]">
            <View className="flex flex-col">

                <View className="flex flex-row justify-between items-center">
                    <Text className="font-black text-lg">FENNIX SOCCER CLUB</Text>
                    <AntDesign name="heart" size={20} color={heartColor} onPress={() => heartColor == "white" ? setHeartColor("red") : setHeartColor("white")} />
                    <TouchableOpacity>
                        <Image source={require('../../assets/share_icon.png')}></Image>
                    </TouchableOpacity>
                    
                    <TouchableOpacity>
                        <Image source={require('../../assets/phone_icon.png')}></Image>
                    </TouchableOpacity>
                </View>

                <View className="flex flex-row gap-[25] items-center">
                    <Image source={require('../../assets/court_image.png')}></Image>

                    <View>
                        <Text className="font-bold text-[#717171]">Quadra de Futsal</Text>
                        <Text className="font-bold text-[#717171]">4,3 Km de distância</Text>
                        <Text className="font-bold text-[#717171]">Avaliação: 4,4 <AntDesign name="star" size={20} color={starColor} onPress={() => starColor == "white" ? setStarColor("orange") : setStarColor("white")} /> </Text>
                        <Text className="font-bold text-[#717171]">Rua Jogatina 521 - jd Futebol</Text>
                    </View>
                </View>

            </View>

            <View className="flex flex-col gap-y-[20]">

                <View className="flex flex-row justify-start items-center gap-x-[10]">
                    <Text className="font-black text-lg">AMENIDADES DO LOCAL</Text>
                    <Image source={require('../../assets/cabinet_icon.png')}></Image>
                    <Image source={require('../../assets/food_icon.png')}></Image>
                    <Image source={require('../../assets/car_icon.png')}></Image>
                </View>

                <View>
                    <Carousel
                        data={carouselItemsTest}
                        useScrollView={true}
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={ITEM_WIDTH}
                        renderItem={carouselCardItem}
                    />
                </View>

            </View>

            <ScrollView>
                <Text className="text-[18px] leading-[24px] font-black">QUADRAS</Text>

                <CourtCard
                    image={require('../../assets/quadra.png')}
                    name="Fenix Soccer"
                    type="Quadra de Futsal"
                    rate={5}
                ></CourtCard>

                <CourtCard
                    image={require('../../assets/quadra.png')}
                    name="Fenix Beach"
                    type="Quadra de FutVôlei"
                    rate={5}
                ></CourtCard>

                <CourtCard
                    image={require('../../assets/quadra.png')}
                    name="Fenix Basket"
                    type="Quadra de Basquete"
                    rate={5}
                ></CourtCard>

                <CourtCard
                    image={require('../../assets/quadra.png')}
                    name="Fenix Soccer"
                    type="Campo de Futebol"
                    rate={5}
                ></CourtCard>
            </ScrollView>

            <View className="h-24 w-full items-center justify-end">
                <View className="bg-black h-[75px] w-2/3 rounded-[20px] items-center justify-around flex flex-row">
                    <AntDesign name="heart" size={20} color={footerHeartColor} onPress={() => footerHeartColor == "white" ? setFooterHeartColor("red") : setFooterHeartColor("white")} />
                    <Image source={require('../../assets/logo_inquadra_white.png')}></Image>
                    <Image source={require('../../assets/calendar_icon.png')}></Image>
                </View>
            </View>

        </View>
    )
}