import { ScrollView, View, Text } from "react-native";
import { InfosEstablishment } from "../../components/InfosEstablishment";
import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { HOST_API } from '@env'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGetUserById } from '../../hooks/useUserById';
import storage from '../../utils/storage'
import { calculateDistance } from "../../utils/calculateDistance";
import useGetFavoriteEstablishmentsByUserId from "../../hooks/useGetFavoriteEstablishmentsById";
import useUpdateFavoriteEstablishment from "../../hooks/useUpdateFavoriteEstablishment";
import BottomBlackMenu from "../../components/BottomBlackMenu";
import { TouchableOpacity } from "react-native-gesture-handler";
interface Colors {
    [key: string]: string;
}
export default function FavoriteEstablishments({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'FavoriteEstablishments'>) {
    const [userId, setUserId] = useState<string>();
    useEffect(() => {
        storage.load<UserInfos>({
            key: 'userInfos'
        }).then(data => setUserId(data.userId))
    }, [])
    const USER_ID = userId

    const { data, error, loading } = useGetFavoriteEstablishmentsByUserId(USER_ID ?? "")
    const [colors, setColors] = useState<Colors>({});
    const { data: userByIdData, error: userByIdError, loading: userByIdLoading } = useGetUserById(USER_ID ?? "")
    const [userFavoriteEstablishments, setUserFavoriteEstablishments] = useState<Array<string>>([])

    useEffect(() => {
        userByIdData?.usersPermissionsUser?.data?.attributes?.favorite_establishments?.data?.forEach(item => {
            setColors(prevColors => ({
                ...prevColors,
                [item.id]: "red",
            }));
            setUserFavoriteEstablishments(prevEstablishments => [...prevEstablishments, item.id]);
        });
    }, [userByIdData]);

    const [userLocation, setUserLocation] = useState({
        latitude: 0,
        longitude: 0
    })
    useEffect(() => {
        storage.load<{ latitude: string, longitude: string }>({
            key: 'userGeolocation'
        }).then(response => setUserLocation({ latitude: Number(response.latitude), longitude: Number(response.longitude) }))
    }, [])

    const [updateLikedEstablishments, { data: dataLike, error: errorLike, loading: loadingLike }] = useUpdateFavoriteEstablishment()
    const [isLoading, setIsLoading] = useState(false)
    const handleUpdateEstablishmentLike = (establishmentId: string): void => {

        const establishmentsData = [
            ...userFavoriteEstablishments
        ]

        if (userFavoriteEstablishments?.includes(establishmentId)) {
            setIsLoading(true)
            const arrayWithoutDeletedItem = establishmentsData.filter(item => item !== establishmentId)

            updateLikedEstablishments({
                variables: {
                    user_id: USER_ID ?? "",
                    favorite_establishments: arrayWithoutDeletedItem
                }
            }).then(() => {
                setColors(prevColor => ({
                    ...prevColor,
                    [establishmentId]: "white",
                }));
            })

                .finally(() => {
                    setIsLoading(false)
                    setUserFavoriteEstablishments(arrayWithoutDeletedItem)
                })
        } else {
            setIsLoading(true)
            establishmentsData.push(establishmentId)

            updateLikedEstablishments({
                variables: {
                    user_id: USER_ID ?? "",
                    favorite_establishments: establishmentsData
                }
            }).then(() => {
                setColors(prevColor => ({
                    ...prevColor,
                    [establishmentId]: "red",
                }));
            })

                .finally(() => {
                    setIsLoading(false)
                    setUserFavoriteEstablishments(establishmentsData)
                })
        }
    }

    const { data: dataUser, loading: loadingUser, error: errorUser } = useGetUserById(USER_ID!)

    const LOGIN_BUTTON = (
        <View className="w-full h-fit flex items-center justify-center">
            <TouchableOpacity onPress={() => console.log("TESTE")}>
                    <Text className="text-[18px] text-center text-white">LOGIN</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <View className="flex-1 h-max w-max bg-zing-600">
            <ScrollView className='flex-1 py-4 bg-zinc-600'>
                {
                    !loading && data?.establishments.data.map(item => (
                        <InfosEstablishment.Root category={item.attributes.corporateName}>
                            <InfosEstablishment.Establishment key={item.id} imageUrl={{ uri: HOST_API + item.attributes.photos.data[0].attributes.url, height: 90, width: 138 }}>
                                <InfosEstablishment.Content>
                                    <InfosEstablishment.ContentHeader establishmentName={item.attributes.corporateName}>
                                        <AntDesign
                                            name="heart"
                                            size={20}
                                            color={colors[item.id] || "red"}
                                            onPress={() => handleUpdateEstablishmentLike(item.id)}
                                        />
                                    </InfosEstablishment.ContentHeader>

                                    <InfosEstablishment.ContentDistance distance={
                                        (() => {
                                            const distanceInMeters = calculateDistance(
                                                userLocation.latitude,
                                                userLocation.longitude,
                                                Number(item.attributes.address.latitude),
                                                Number(item.attributes.address.longitude)
                                            );
                                            return distanceInMeters >= 1000
                                                ? `${(distanceInMeters / 1000).toFixed(1)} km`
                                                : `${distanceInMeters.toFixed(0)} m`;
                                        })()
                                    } />
                                </InfosEstablishment.Content>
                            </InfosEstablishment.Establishment>
                        </InfosEstablishment.Root>
                    ))
                }
                {
                    !USER_ID && (
                        <View className="w-full h-fit flex items-center justify-center">
                            <Text className="text-[18px] text-center text-white">FAÇA <Text onPress={() => navigation.navigate("Login")} className="text-[18px] text-white flex items-center justify-center underline">LOGIN</Text> NO APP PARA PODER FAVORITAR UM ESTABELECIMENTO!</Text>
                        </View>
                    )
                }
                {
                    !data?.establishments.data && USER_ID && (
                        <View className="w-full h-fit flex items-center justify-center">
                            <Text className="text-[18px] text-center text-white">VOCÊ NÃO POSSUI NENHUM ESTABELECIMENTO FAVORITO!</Text>
                        </View>
                    )
                }
            </ScrollView>
            <View className="absolute bottom-0 left-0 right-0">
                <BottomBlackMenu
                    screen="Favorite"
                    userID={USER_ID!}
                    userPhoto={dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data?.attributes?.url ? HOST_API + dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data?.attributes?.url : ''}
                    key={1}
                    isDisabled={true}
                    paddingTop={2}
                />
            </View>
        </View>
    )
}
