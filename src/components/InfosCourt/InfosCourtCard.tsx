import {Image, ImageSourcePropType, Text, View} from "react-native";
import {ReactNode} from "react";

interface InfosCourtProps {
	imageUrl: ImageSourcePropType
	children: ReactNode
}

export function InfosCourtCard({imageUrl, children}: InfosCourtProps) {
	return(
		<View className='w-full min-h-28 flex flex-row items-center justify-between overflow-hidden'>
			<Image source={imageUrl} className='h-max w-34 rounded-md mr-2' />
			{children}
		</View>
	)
}
