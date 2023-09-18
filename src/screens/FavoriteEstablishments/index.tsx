import { ScrollView, Text } from "react-native";
import { InfosEstablishment } from "../../components/InfosEstablishment";
import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { HOST_API } from '@env'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGetUserById } from '../../hooks/useUserById';
import useUpdateFavoriteCourts from "../../hooks/useUpdateFavoriteCourtsMutation";
import useGetFavoritesCourtsById from "../../hooks/useGetFavoritesCourtsById";
import storage from '../../utils/storage'
import { calculateDistance } from "../../utils/calculateDistance";
import useGetFavoriteEstablishmentsByUserId from "../../hooks/useGetFavoriteEstablishmentsById";
import useUpdateFavoriteEstablishment from "../../hooks/useUpdateFavoriteEstablishment";
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
    // const { data, error, loading } = useGetFavoritesCourtsById(USER_ID ?? "")
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


    return (
        <ScrollView className='flex-1 py-4 bg-zinc-600'>
            {
                // !loading &&
                // data?.courtTypes?.data?.map(courtType => (
                //     <InfosEstablishment.Root category={courtType.attributes.name} key={courtType.attributes.name}>
                //         {courtType.attributes.courts.data.map(courtInfo => {
                //             const schedulings = courtInfo?.attributes?.court_availabilities?.data[0]?.attributes?.schedulings?.data;
                //             const lastScheduling = schedulings && schedulings.length > 0
                //                 ? new Date(schedulings[schedulings.length - 1].attributes.date)
                //                 : undefined;

                //             return (
                //                 <InfosEstablishment.Court key={courtInfo.id} imageUrl={{ uri: HOST_API + courtInfo?.attributes?.photo?.data[0]?.attributes?.url, height: 90, width: 138 }}>
                //                     <InfosEstablishment.Content lastScheduling={lastScheduling}>
                //                         <InfosEstablishment.ContentHeader courtName={courtInfo?.attributes?.fantasy_name}>
                //                             <AntDesign
                //                                 name="heart"
                //                                 size={20}
                //                                 color={colors[courtInfo.id] || "red"}
                //                                 onPress={() => handleUpdateEstablishmentLike(courtInfo.id)}
                //                             />
                //                         </InfosEstablishment.ContentHeader>
                //                         <InfosEstablishment.ContentCourtType courtType={courtInfo?.attributes?.name} />

                //                         <InfosEstablishment.ContentDistance distance={
                //                             (() => {
                //                                 const distanceInMeters = calculateDistance(
                //                                     userLocation.latitude,
                //                                     userLocation.longitude,
                //                                     Number(courtInfo.attributes.establishment.data.attributes.address.latitude),
                //                                     Number(courtInfo.attributes.establishment.data.attributes.address.longitude)
                //                                 );
                //                                 return distanceInMeters >= 1000
                //                                     ? `${(distanceInMeters / 1000).toFixed(1)} Km`
                //                                     : `${distanceInMeters.toFixed(0)} metros`;
                //                             })()
                //                         } />
                //                     </InfosEstablishment.Content>
                //                 </InfosEstablishment.Court>
                //             );
                //         })}
                //     </InfosEstablishment.Root>
                // ))


            }

            {
                !loading && data?.establishments.data.map(item => (
                    <InfosEstablishment.Root category="">
                        <InfosEstablishment.Establishment imageUrl={{uri: item.attributes.photos.data[0].attributes.url}}>
                            <InfosEstablishment.Content>
                                <InfosEstablishment.ContentHeader establishmentName={item.attributes.corporateName}>
                                    <AntDesign
                                        name="heart"
                                        size={20}
                                        color={colors[item.id] || "red"}
                                        onPress={() => handleUpdateEstablishmentLike(item.id)}
                                    />
                                </InfosEstablishment.ContentHeader>
                                <Text>TORA GRANDE E GROSSA</Text>

                                <InfosEstablishment.ContentDistance distance={
                                    (() => {
                                        const distanceInMeters = calculateDistance(
                                            userLocation.latitude,
                                            userLocation.longitude,
                                            Number(item.attributes.address.latitude),
                                            Number(item.attributes.address.longitude)
                                        );
                                        return distanceInMeters >= 1000
                                            ? `${(distanceInMeters / 1000).toFixed(1)} Km`
                                            : `${distanceInMeters.toFixed(0)} metros`;
                                    })()
                                } />
                            </InfosEstablishment.Content>
                        </InfosEstablishment.Establishment>
                    </InfosEstablishment.Root>
                ))
            }
        </ScrollView>
    )
}
