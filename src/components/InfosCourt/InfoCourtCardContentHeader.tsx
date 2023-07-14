import {Text, View} from "react-native";
import {ReactNode} from "react";

interface InfoCourtCardContentHeaderProps {
	courtName: string
	children: ReactNode
}

export function InfoCourtCardContentHeader({courtName, children}: InfoCourtCardContentHeaderProps) {
	return(
		<View className='w-full flex flex-row justify-between items-center'>
			<Text className='font-bold text-base text-orange-600'>{courtName}</Text>
			{children}
		</View>
	)
}