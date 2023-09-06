import { ScrollView, TouchableOpacity } from 'react-native';
import SportItem from '../SportItem';
import { useState } from 'react';
const iconFutebol = require('./icons/iconFutebol.png');
const iconVoley = require('./icons/iconVoley.png');
const iconBasquete = require('./icons/iconBasquete.png');
const iconBTennis = require('./icons/iconBTennis.png');
const iconTennis = require('./icons/iconTennis.png');
const iconFVoley = require('./icons/iconFVoley.png');
const activeIconFutebol = require('./icons/activeIconFutebol.png');
const activeIconVoley = require('./icons/activeIconVoley.png');
const activeIconBasquete = require('./icons/activeIconBasquete.png');
const activeIconBTennis = require('./icons/activeIconBTennis.png');
const activeIconTennis = require('./icons/activeIconTennis.png');
const activeIconFVoley = require('./icons/activeIconFVoley.png');
import Animated, {
	FadeOut,
	FadeIn
} from 'react-native-reanimated';

const arrayIcons = [
	{
		id: 1,
		image: iconFutebol,
		activeImage: activeIconFutebol
	},
	{
		id: 2,
		image: iconBTennis,
		activeImage: activeIconBTennis
	},
	{
		id: 3,
		image: iconFutebol,
		activeImage: activeIconFutebol
	},
	{
		id: 4,
		image: iconVoley,
		activeImage: activeIconVoley
	},
	{
		id: 5,
		image: iconFVoley,
		activeImage: activeIconFVoley
	},
	{
		id: 6,
		image: iconTennis,
		activeImage: activeIconTennis
	},
	{
		id: 7,
		image: iconBasquete,
		activeImage: activeIconBasquete
	},
]

interface ISportsMenuProps {
	sports: SportType[],
	callBack: Function
}

export default function SportsMenu({ sports, callBack }: ISportsMenuProps) {

	const [selected, setSelected] = useState<string>()

	return (
		<Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} className={`flex w-full h-[8%] px-3`}>
			<ScrollView className="flex" horizontal={true}>
				{
					sports.map((item) => (
						<TouchableOpacity className='flex justify-center items-center pr-4'
							onPress={() => {
								if (selected === item.id) {
									callBack(undefined)
									setSelected(undefined)
								} else {
									callBack(item.name)
									setSelected(item.id)
								}
							}}>
							{selected !== item.id ? (
								<SportItem key={item.id} id={item.id} name={item.name} image={arrayIcons[parseInt(item.id) - 1].image} />
							)
								:
								(
									<SportItem key={item.id} id={item.id} name={item.name} image={arrayIcons[parseInt(item.id) - 1].activeImage} />
								)}
						</TouchableOpacity>
					))
				}
			</ScrollView>
		</Animated.View>
	)
}