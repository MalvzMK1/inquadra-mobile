import { useState, useEffect, Key } from 'react'
import { View, Text, Image, Dimensions, ScrollView } from "react-native"
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native-gesture-handler"
import Carousel, { ParallaxImage } from "react-native-snap-carousel"
import { CourtCard } from "../../components/CourtCardInfo"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import useGetEstablishmentByCourtId from "../../hooks/useGetEstablishmentByCourtId"
import AsyncStorage from '@react-native-async-storage/async-storage'
import storage from '../../utils/storage'
import getDistanceFromLatLonInKm from '../../utils/distanceCalculator'

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = SLIDER_WIDTH * 0.4

export default function EstablishmentInfo({ route }: { route: { params: { establishmentInfo: number } } }) {

    let distance
    const { data, loading, error } = useGetEstablishmentByCourtId(route.params.establishmentInfo.toString())
    const infosEstablishment = data?.court.data.attributes.establishment.data.attributes
    const [userLocation, setUserLocation] = useState({
        latitude: 0,
        longitude: 0
    })

    const [Establishment, setEstablishment] = useState<{
        corporateName: string,
        streetName: string,
        photo: string,
        latitude: number,
        longitude: number,
        photosAmenitie: Array<string>,
        type: string
    }>()

    const [rating, setRating] = useState<number>()
    const [heart, setHeart] = useState(true)
    const [footerHeartColor, setFooterHeartColor] = useState("white")

    const [Court, setCourt] = useState<Array<{
        name: string,
        rating: number,
        court_type: string,
        court_availabilities: boolean | undefined
        photo: string,
    }>>([])

    useEffect(() => {
        async function fetchData() {
            await AsyncStorage.getItem("userGeolocation").then((value) => {
                if (value) {
                    const geolocationData = JSON.parse(value)
                    const latitude = geolocationData.rawData.latitude
                    const longitude = geolocationData.rawData.longitude
                    setUserLocation({
                        latitude: latitude,
                        longitude: longitude
                    })
                }
            })
        }
        fetchData()
    }, [])
    useEffect(() => {
        if (!error && !loading) {
            const courts = infosEstablishment.courts.data.map((court: any) => {
                return {
                    name: court.attributes.name,
                    rating: court.attributes.rating,
                    court_type: court.attributes.court_type.data.attributes.name,
                    photo: 'http://192.168.15.5:1337' + court.attributes.photo.data[0].attributes.url,
                }
            })
            const establishment = {
                corporateName: infosEstablishment.corporateName,
                type: infosEstablishment.type,
                streetName: infosEstablishment.address.streetName,
                latitude: infosEstablishment.address.latitude,
                longitude: infosEstablishment.address.longitude,
                photo: 'http://192.168.15.5:1337' + infosEstablishment.photos.data[0].attributes.url,
                photosAmenitie: infosEstablishment.photosAmenitie.data.map((photo: { attributes: { url: string } }) => "http://192.168.15.5:1337" + photo.attributes.url)
            }
            setEstablishment(establishment)
            if (courts) {
                setCourt((prevCourts) => [...prevCourts, ...courts])
            }
        }
    }, [data, loading])

    if (Establishment) {
        distance = getDistanceFromLatLonInKm(Establishment?.latitude, Establishment?.longitude, userLocation.latitude, userLocation.longitude)
    }

    const uniqueCourtTypes = [...new Set(Court.map((court) => court.court_type))];

    useEffect(() => {
        function calculateRating() {
            const generalRating = Court.map((item) => {
                if (item.rating) {
                    return item.rating;
                } else {
                    return 5;
                }
            });

            if (generalRating.length > 0) {
                const sum = generalRating.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                setRating(sum / generalRating.length);
            } else {
                // Defina um valor padrão caso não haja avaliações
                setRating(0);
            }
        }

        calculateRating();
    }, [Court]);




    return (
        <View className="w-full h-screen p-5 flex flex-col gap-y-[20]">
            <View className="flex flex-col">
                <View className="flex flex-row justify-between items-center">
                    <Text className="font-black text-lg">{Establishment?.corporateName.toUpperCase()}</Text>
                    <View className='flex flex-row items-center gap-x-8'>
                        <TouchableOpacity className='flex justify-center items-center h-12 w-8' onPress={() => setHeart((prevState) => !prevState)}>
                            {
                                heart ?
                                    < AntDesign name="hearto" size={26} color="black" />
                                    :
                                    < AntDesign name="heart" size={24} color="red" />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require('../../assets/share_icon.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require('../../assets/phone_icon.png')}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="flex flex-row gap-[25] items-center">
                    <Image className='h-20 w-20' source={{ uri: Establishment?.photo }}></Image>
                    <View>
                        <Text className="font-bold text-[#717171]">{Establishment?.type.split("_").join(" ")}</Text>
                        <Text className="font-bold text-[#717171]">{distance?.toFixed(1).split(".").join(",")} Km de distância</Text>
                        <Text className="font-bold text-[#717171]">Avaliação: {rating?.toFixed(1).split(".").join(",")} <Ionicons name="star-sharp" size={20} color="orange" /></Text>
                        <Text className="font-bold text-[#717171]">{Establishment?.streetName}</Text>
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
                        data={Establishment?.photosAmenitie?.map(url => ({ imgUrl: { uri: url } })) || []}
                        useScrollView
                        loop
                        autoplay
                        autoplayInterval={6000}
                        activeSlideAlignment="center"
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={ITEM_WIDTH}
                        renderItem={({ item }) => (
                            <Image className="h-[106px] w-[142px] rounded-[5px] " source={item.imgUrl}></Image>
                        )}
                    />
                </View>
            </View>
            <ScrollView>
                {uniqueCourtTypes.map((type) => (
                    <View key={type}>
                        <Text className="text-[18px] leading-[24px] font-black">{type.toUpperCase()}</Text>
                        {Court.filter((court) => court.court_type === type).map((court) => (
                            <CourtCard
                                image={court.photo}
                                name={court.name}
                                type={court.court_type}
                                rate={court.rating}
                            />
                        ))}
                    </View>
                ))}
            </ScrollView>
            <View className="w-full items-center justify-end">
                <View className="bg-black h-[75px] w-2/3 rounded-[20px] items-center justify-around flex flex-row">
                    <AntDesign name="heart" size={20} color={footerHeartColor} onPress={() => footerHeartColor == "white" ? setFooterHeartColor("red") : setFooterHeartColor("white")} />
                    <Image source={require('../../assets/logo_inquadra_white.png')}></Image>
                    <Image source={require('../../assets/calendar_icon.png')}></Image>
                </View>
            </View>
        </View>
    )
}