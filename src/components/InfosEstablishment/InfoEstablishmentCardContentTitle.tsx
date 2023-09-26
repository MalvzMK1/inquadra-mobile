import {Text} from "react-native";

interface InfoEstablishmentCardContentTitleProps {
	title: string
}

export function InfoEstablishmentCardContentTitle({title}: InfoEstablishmentCardContentTitleProps) {
	return <Text className='text-white text-xs'>{title}</Text>
}