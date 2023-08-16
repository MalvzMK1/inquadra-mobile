import { useState, useEffect } from 'react'
import { View, Text, Image, Dimensions, ScrollView, Share } from "react-native"
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native-gesture-handler"
import Carousel from "react-native-snap-carousel"
import { CourtCard } from "../../components/CourtCardInfo"
import useGetEstablishmentByCourtId from "../../hooks/useGetEstablishmentByCourtId"
import AsyncStorage from '@react-native-async-storage/async-storage'
import getDistanceFromLatLonInKm from '../../utils/distanceCalculator'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import useGetFavoriteEstablishmentByUserId from '../../hooks/useGetFavoriteEstablishmentByUserId'
import useUpdateFavoriteEstablishment from '../../hooks/useUpdateFavoriteEstablishment'

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = SLIDER_WIDTH * 0.4

export default function EstablishmentInfo({ route }: NativeStackScreenProps<RootStackParamList, "EstablishmentInfo">) {
    let distance
    const EstablishmentInfos = useGetEstablishmentByCourtId(route.params?.courtID.toString())
    const [updateFavoriteEstablishment, { data, loading, error }] = useUpdateFavoriteEstablishment()

    const [userLocation, setUserLocation] = useState({
        latitude: 0,
        longitude: 0
    })
    const [Establishment, setEstablishment] = useState<{
        id: number
        corporateName: string,
        cellPhoneNumber: string,
        streetName: string,
        photo: string,
        latitude: number,
        longitude: number,
        photosAmenitie: Array<string>,
        type: string
    }>()
    const [userId, setUserId] = useState<string>()

    const FavoriteEstablishment = useGetFavoriteEstablishmentByUserId(userId)

    const [arrayfavoriteEstablishment, setArrayFavoriteEstablishment] = useState<Array<{ id: any }>>([])

    const [rating, setRating] = useState<number>()
    const [heart, setHeart] = useState<boolean>(false)
    const [footerHeartColor, setFooterHeartColor] = useState("white")

    const [Court, setCourt] = useState<Array<{
        id: number,
        name: string,
        rating: number,
        court_type: string,
        court_availabilities: boolean | undefined
        photo: string,
    }>>([])

    useEffect(() => {
        const infosEstablishment = EstablishmentInfos.data?.court.data.attributes.establishment.data
        if (!EstablishmentInfos.error && !EstablishmentInfos.loading) {
            const courts = infosEstablishment.attributes.courts.data.map((court: any) => {
                return {
                    id: court.id,
                    name: court.attributes.name,
                    rating: court.attributes.rating,
                    court_type: court.attributes.court_type.data.attributes.name,
                    court_availabilities: court.attributes.court_availabilities.data[0],
                    photo: 'http://192.168.15.5:1337' + court.attributes.photo.data[0].attributes.url,
                }
            })
            const establishment = {
                id: infosEstablishment.id,
                corporateName: infosEstablishment.attributes.corporateName,
                cellPhoneNumber: infosEstablishment.attributes.cellPhoneNumber,
                type: infosEstablishment.attributes.type,
                streetName: infosEstablishment.attributes.address.streetName,
                latitude: infosEstablishment.attributes.address.latitude,
                longitude: infosEstablishment.attributes.address.longitude,
                photo: 'http://192.168.15.5:1337' + infosEstablishment.attributes.photos.data[0].attributes.url,
                photosAmenitie: infosEstablishment.attributes.photosAmenitie.data.map((photo: { attributes: { url: string } }) => "http://192.168.15.5:1337" + photo.attributes.url)
            }
            setEstablishment(establishment)
            if (courts) {
                setCourt((prevCourts) => [...prevCourts, ...courts])
            }
        }
    }, [EstablishmentInfos.data, EstablishmentInfos.loading])

    const onShare = async () => {
        try {
            await Share.share({
                message:
                    "Estabelecimento: " + Establishment?.corporateName + ", Telefone: " + Establishment?.cellPhoneNumber
            });
        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {

        if (!FavoriteEstablishment.error && !FavoriteEstablishment.loading) {
            const favoriteEstablishmentId = FavoriteEstablishment.data?.usersPermissionsUser?.data?.attributes?.favorite_establishments?.data?.map(
                (establishment) => {
                    return { id: establishment.id }
                }
            )
            if (favoriteEstablishmentId) {
                setArrayFavoriteEstablishment((prevFavoriteEstablishmentId) => [...prevFavoriteEstablishmentId, ...favoriteEstablishmentId]);
            }
        }

    }, [FavoriteEstablishment.error, FavoriteEstablishment.loading]);

    useEffect(() => {
        const isFavorite = arrayfavoriteEstablishment.some(item => item.id === Establishment?.id);
        setHeart(isFavorite);
    }, [arrayfavoriteEstablishment, Establishment?.id]);

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
            await AsyncStorage.getItem("userInfos").then((value) => {
                if (value) {
                    const userID = JSON.parse(value)
                    setUserId(userID.rawData.userId)
                }
            })

        }
        fetchData()
    }, [])

    const handlePressFavoriteEstablishment = () => {

        let newArrayfavoriteEstablishment = [""]

        if (!heart) {
            newArrayfavoriteEstablishment = arrayfavoriteEstablishment.map((item) => {
                return item.id
            })
            if (Establishment) {
                newArrayfavoriteEstablishment.push(Establishment?.id.toString())
            }
        } else {
            const filteredArray = arrayfavoriteEstablishment.filter((item) =>
                item.id !== Establishment?.id
            );
            newArrayfavoriteEstablishment = filteredArray.map((item) => {
                return item.id
            })
        }

        setHeart((prevState) => !prevState);

        if (userId) {
            updateFavoriteEstablishment({
                variables: {
                    user_id: userId,
                    favorite_establishments: newArrayfavoriteEstablishment
                }
            })
        }

    };

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
                        <TouchableOpacity className='flex justify-center items-center h-12 w-8'
                            onPress={handlePressFavoriteEstablishment}>
                            {
                                !heart ?
                                    < AntDesign name="hearto" size={26} color="black" />
                                    :
                                    < AntDesign name="heart" size={24} color="red" />
                            }
                        </TouchableOpacity >
                        <TouchableOpacity onPress={onShare}>
                            <Ionicons name="share-social" size={30} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onShare}>
                            <FontAwesome name="phone" size={30} color="black" />
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
                                key={court.id}
                                availabilities={court.court_availabilities}
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