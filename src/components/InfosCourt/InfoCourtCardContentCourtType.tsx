import {Text} from "react-native";

interface InfoCourtCardContentCourtTypeProps {
	courtType: string
}

export function InfoCourtCardContentCourtType({courtType}: InfoCourtCardContentCourtTypeProps) {
	return <Text className='text-white text-xs'>{courtType}</Text>
}