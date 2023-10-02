import { useState, useEffect } from 'react'
import { View, Text, Image, Dimensions, ScrollView, Share } from "react-native"
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native-gesture-handler"
import Carousel from "react-native-snap-carousel"
import { CourtCard } from "../../components/CourtCardInfo"
import useGetEstablishmentByCourtId from "../../hooks/useGetEstablishmentByCourtId"
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import useGetFavoriteEstablishmentByUserId from '../../hooks/useGetFavoriteEstablishmentByUserId'
import useUpdateFavoriteEstablishment from '../../hooks/useUpdateFavoriteEstablishment'
import { HOST_API } from '@env';
import storage from '../../utils/storage'
import { calculateDistance } from "../../utils/calculateDistance";
import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { useGetUserById } from '../../hooks/useUserById'
import BottomBlackMenu from '../../components/BottomBlackMenu'

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = SLIDER_WIDTH * 0.4

export default function EstablishmentInfo({ route }: NativeStackScreenProps<RootStackParamList, "EstablishmentInfo">) {
    let distance
    const { data: establishmentData, loading: establishmentLoading, error: establishmentError } = useGetEstablishmentByCourtId(route.params.establishmentId)
    const [updateFavoriteEstablishment, { data, loading, error }] = useUpdateFavoriteEstablishment()
    
    const [userLocation, setUserLocation] = useState({
        latitude: 0,
        longitude: 0
    })
    const [userId, setUserId] = useState<string>();

    const [Establishment, setEstablishment] = useState<{
        id: string
        corporateName: string,
        cellPhoneNumber: string,
        streetName: string,
        photo: string,
        latitude: number,
        longitude: number,
        photosAmenitie: Array<string>,
        type?: string
    }>()

    const FavoriteEstablishment = useGetFavoriteEstablishmentByUserId(userId)

    const [arrayfavoriteEstablishment, setArrayFavoriteEstablishment] = useState<Array<{ id: any }>>([])

    const [rating, setRating] = useState<number>()
    const [heart, setHeart] = useState<boolean>(false)
    const [footerHeartColor, setFooterHeartColor] = useState("white")

    const [Court, setCourt] = useState<Array<{
        id: string,
        name: string,
        rating: number,
        court_type: string,
        court_availabilities: boolean
        photo: string,
    }>>([])

    useFocusEffect(
        React.useCallback(() => {
            setCourt([])
            setEstablishment(undefined)
            if (!error && !loading) {
                if (establishmentData) {
                    const infosEstablishment = establishmentData.establishment.data
                    const courts = infosEstablishment.attributes.courts.data.map(court => {
                        return {
                            id: court.id,
                            name: court.attributes.name,
                            rating: court.attributes.rating ? court.attributes.rating : 0,
                            court_type: court.attributes.court_types.data.map(courtType => courtType.attributes.name).join(', '),
                            court_availabilities: court.attributes.court_availabilities.data.length > 0,
                            photo: HOST_API + court.attributes.photo.data[0].attributes.url,
                        }
                    })


                    let establishment


                    establishment = {
                        id: infosEstablishment.id,
                        corporateName: infosEstablishment.attributes.corporateName,
                        cellPhoneNumber: infosEstablishment.attributes.cellPhoneNumber,
                        streetName: infosEstablishment.attributes.address.streetName,
                        latitude: Number(infosEstablishment.attributes.address.latitude),
                        longitude: Number(infosEstablishment.attributes.address.longitude),
                        photo: infosEstablishment.attributes.logo.data ? HOST_API + infosEstablishment.attributes.logo.data.attributes.url : "",
                        photosAmenitie: infosEstablishment.attributes.photos.data.map((photo, index) => {
                            return HOST_API + photo.attributes.url
                        }),
                        type: courts.map(court => court.court_type).join(', ')
                    }


                    setEstablishment(establishment)
                    if (courts) {
                        setCourt(prevState => [...prevState, ...courts])
                    }
                }
            }
        }, [establishmentData])
    )

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
                console.log(favoriteEstablishmentId)
                setArrayFavoriteEstablishment((prevFavoriteEstablishmentId) => [...prevFavoriteEstablishmentId, ...favoriteEstablishmentId]);
            }

        }

    }, [FavoriteEstablishment.error, FavoriteEstablishment.loading]);

    useEffect(() => {
        const isFavorite = arrayfavoriteEstablishment.some(item => item.id === Establishment?.id);
        setHeart(isFavorite);
    }, [arrayfavoriteEstablishment, Establishment?.id]);

    const handlePressFavoriteEstablishment = () => {
        const isCurrentlyFavorite = arrayfavoriteEstablishment.some(item => item.id === Establishment?.id);

        let newArrayfavoriteEstablishment = [];

        if (!isCurrentlyFavorite) {
            newArrayfavoriteEstablishment = [...arrayfavoriteEstablishment, { id: Establishment?.id }];
        } else {
            newArrayfavoriteEstablishment = arrayfavoriteEstablishment.filter(item => item.id !== Establishment?.id);
        }

        setArrayFavoriteEstablishment(newArrayfavoriteEstablishment);

        if (userId) {
            updateFavoriteEstablishment({
                variables: {
                    user_id: userId,
                    favorite_establishments: newArrayfavoriteEstablishment.map(item => item.id.toString())
                }
            });
        }
    };


    if (Establishment) {
        distance = calculateDistance(
            Establishment?.latitude,
            Establishment?.longitude,
            userLocation.latitude,
            userLocation.longitude
        ) / 1000

        console.log({
            result: calculateDistance(
                Establishment.latitude,
                Establishment.longitude,
                userLocation.latitude,
                userLocation.longitude,
            ) / 1000,
            establishment: { lat: Establishment.latitude, long: Establishment.longitude },
            user: userLocation
        })
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

    useEffect(() => {
        storage.load<{ latitude: string, longitude: string }>({
            key: 'userGeolocation'
        }).then(response => setUserLocation({ latitude: Number(response.latitude), longitude: Number(response.longitude) }))
    }, [])


    const {data:dataUser, loading:loadingUser, error:errorUser} = useGetUserById(userId)

    useEffect(() => {
        storage.load<UserInfos>({
            key: 'userInfos'
        }).then(data => {
            setUserId(data.userId)
        })
    }, [])

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
                        <Text className="font-bold text-[#717171]">{Establishment?.type!.split("_").join(" ")}</Text>
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
            <ScrollView className='pb-10'>
                {uniqueCourtTypes.map((type) => (
                    <View key={type}>
                        <Text className="text-[18px] leading-[24px] font-black">{type.toUpperCase()}</Text>
                        {Court.filter((court) => court.court_type === type).map((court) => (

                            <CourtCard
                                key={court.id}
                                id={court.id}
                                userId={userId}
                                userPhoto={route.params.userPhoto}
                                availabilities={court.court_availabilities}
                                image={court.photo}
                                name={court.name}
                                type={court.court_type}
                                rate={court.rating}
                            />
                        ))}
                    </View>
                ))}
                <View className='h-16'></View>
            </ScrollView>
            <View className="absolute bottom-0 left-0 right-0 pt-10 pb-10">
                <BottomBlackMenu
                  screen={"Any"}
                  userID={userId}
                  userPhoto={dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data?.attributes?.url ? HOST_API + dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data?.attributes?.url : ''}
                  key={1}
                  isDisabled ={true}
                  paddingTop={2}
                />
            </View>
            <View className='h-2'></View>
        </View>
    )
}