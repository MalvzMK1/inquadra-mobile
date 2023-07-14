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
			{/*<View className='flex-1 flex-1 flex flex-col justify-between'>*/}
			{/*	<View className='w-full flex-1'>*/}
			{/*		{children}*/}
			{/*		/!*<View className='w-full flex flex-row justify-between items-center'>*!/*/}
			{/*		/!*	<Text className='font-bold text-base text-orange-600'>{courtName}</Text>*!/*/}
			{/*		/!*	<SvgUri*!/*/}
			{/*		/!*		height={18}*!/*/}
			{/*		/!*		width={18}*!/*/}
			{/*		/!*		source={require('../../assets/filled-heart.svg')}*!/*/}
			{/*		/!*	/>*!/*/}
			{/*		/!*</View>*!/*/}
			{/*		<Text className='text-white text-xs'>{courtType}</Text>*/}
			{/*		<Text className='text-white text-xs font-bold'>{distance} de distancia</Text>*/}
			{/*	</View>*/}
			{/*	<Text className='text-white text-xs font-bold mt-2'>Última reserva {formatedDate} as {formatedHour}</Text>*/}
			{/*</View>*/}
		</View>
	)
}
