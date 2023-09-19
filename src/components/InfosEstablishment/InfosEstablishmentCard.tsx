import {Button, GestureResponderEvent, Image, ImageSourcePropType, Text, TouchableOpacity, View} from "react-native";
import {ReactNode} from "react";

interface InfosEstablishmentProps {
	imageUrl: ImageSourcePropType
	children: ReactNode
	onPress?: (event: GestureResponderEvent) => void
}

export function InfosEstablishmentCard({imageUrl, children, onPress}: InfosEstablishmentProps) {
	return(
		<TouchableOpacity className='w-full min-h-28 flex flex-row items-center justify-between pb-2 overflow-hidden' onPress={onPress}>
				<Image source={imageUrl} className='h-max w-34 rounded-md mr-2' />
				{children}
		</TouchableOpacity>
	)
}
