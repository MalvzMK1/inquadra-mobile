import {Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import {AntDesign} from "@expo/vector-icons";

interface ICustomSelectListProps {
	options: Array<{
		name: string;
		onPress: () => void;
		render?: () => JSX.Element
	}>;
}

export default function CustomSelectList({options}: ICustomSelectListProps) {
	const [expand, setExpand] = useState<boolean>(false);

	return (
		<View className='w-full flex flex-col p-4 rounded-md border border-gray-500'>
			<View className='w-full flex flex-row justify-between items-center'>
				<Text className='text-gray-400'>Selecione um dado...</Text>
				<TouchableOpacity onPress={() => setExpand(prevState => !prevState)}>
					<AntDesign
						name={expand ? 'up' : 'down'}
						size={20}
						color="#FF6112"
						style={{ alignSelf: "center" }}
					/>
				</TouchableOpacity>
			</View>
			{expand &&
				<View className='flex flex-col items-start justify-start border border-gray-500 p-2 mt-2'>
					{
						options.map((option, index) => (
							<TouchableOpacity
								onPress={option.onPress}
								className='w-full'
							>
								<Text>{option.name}</Text>
								{
									index !== options.length - 1 &&
										<View className='w-full h-[1px] bg-gray-500 my-2'/>
								}
							</TouchableOpacity>
						))
					}
				</View>
			}
		</View>
	)
}