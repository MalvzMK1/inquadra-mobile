import { ScrollView, TouchableOpacity, Text } from 'react-native';
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
		name: "Futebol",
		image: iconFutebol,
		activeImage: activeIconFutebol
	},
	{
		id: 2,
		name: "Beach Tennis",
		image: iconBTennis,
		activeImage: activeIconBTennis
	},
	{
		id: 3,
		name: "Futsal",
		image: iconFutebol,
		activeImage: activeIconFutebol
	},
	{
		id: 4,
		name: "Volei",
		image: iconVoley,
		activeImage: activeIconVoley
	},
	{
		id: 5,
		name: "Footvolley",
		image: iconFVoley,
		activeImage: activeIconFVoley
	},
	{
		id: 6,
		name: "Tenis",
		image: iconTennis,
		activeImage: activeIconTennis
	},
	{
		id: 7,
		name: "Basquete",
		image: iconBasquete,
		activeImage: activeIconBasquete
	},
]

export default function SportsMenu(props: { value: boolean }) {

	const [selected, setSelected] = useState(1)

	const selectedIcon = arrayIcons.find(value => value.id === selected);

	return (
		<Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} className={`flex w-full justify-center items-center h-[8%] `}>
			{
				props.value ? (
					<Text className='font-black text-[18px] text-center'>
						PRÓXIMO A VOCÊ: {selectedIcon?.name.toUpperCase()}
					</Text>
				)
					:
					<ScrollView horizontal={true}>
						{
							arrayIcons.map((item) => (
								<TouchableOpacity key={item.id} className='justify-center' onPress={() => setSelected(item.id)}>
									{selected !== item.id ? (
										<SportItem id={item.id} name={item.name} image={item.image} />
									) : (
										<SportItem id={item.id} name={item.name} image={item.activeImage} />
									)}
								</TouchableOpacity>
							))
						}
					</ScrollView>
			}
		</Animated.View >
	)
}