import {Text, View} from "react-native";
import {ReactNode} from "react";

interface InfoEstablishmentCardContentHeaderProps {
	establishmentName: string
}

export function InfoEstablishmentCardContentHeader({establishmentName}: InfoEstablishmentCardContentHeaderProps) {
	return(
		<View className='w-full flex flex-row justify-between items-center'>
			<Text className='font-bold text-base text-orange-600'>{establishmentName}</Text>
		</View>
	)
}