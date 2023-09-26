import {Image, ImageSourcePropType, Text, View} from "react-native";
import {ReactNode} from "react";

interface InfosEstablishmentContainerProps {
	category: string
	children: ReactNode
}

export function InfosEstablishmentContainer({category, children}: InfosEstablishmentContainerProps) {
	return(
		<View className='w-full h-fit rounded-xl bg-zinc-800 pt-1 pb-6 px-2 mb-4'>
			<Text className='font-bold text-lg text-white mb-2'>{category}</Text>
			{children}
		</View>
	)
}
