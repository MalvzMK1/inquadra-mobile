import {Text} from "react-native";

interface InfoEstablishmentCardContentDistanceProps {
	distance: string
}

export function InfoEstablishmentCardContentDistance({distance}: InfoEstablishmentCardContentDistanceProps) {
	return <Text className='text-white text-xs font-bold'>{distance} de distancia</Text>
}