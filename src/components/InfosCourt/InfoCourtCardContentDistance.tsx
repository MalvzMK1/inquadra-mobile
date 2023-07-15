import {Text} from "react-native";

interface InfoCourtCardContentDistanceProps {
	distance: string
}

export function InfoCourtCardContentDistance({distance}: InfoCourtCardContentDistanceProps) {
	return <Text className='text-white text-xs font-bold'>{distance} de distancia</Text>
}