import { ScrollView } from 'react-native';
import SportItem from '../SportItem';
import Animated, {
    FadeOut,
    FadeIn
} from 'react-native-reanimated';

const arrayTesteIcons = [
	{
		id: 1,
		name: "Futebol",
		image: "./icons/futebolIcon.svg"
	},
	{
		id: 2,
		name: "Beach Tennis",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
		id: 3,
		name: "Futsal",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
		id: 4,
		name: "Volei",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
		id: 5,
		name: "Footvolley",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
		id: 6,
		name: "Tenis",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
		id: 7,
		name: "Basquete",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
]

export default function SportsMenu() {
    return (
        <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} className={`flex w-full justify-center items-center h-[8%] `}>
            <ScrollView horizontal={true}>
                {
                    arrayTesteIcons.map((item) => (
                        <SportItem key={item.id} name={item.name} image={item.image} />
                    ))
                }
            </ScrollView>
        </Animated.View>
    )
}