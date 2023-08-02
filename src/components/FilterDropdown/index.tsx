import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'Vestuários', value: '1' },
    { label: 'Estacionamento', value: '2' },
    { label: 'Lanchonete', value: '3' },
    { label: 'Área de estar', value: '4' },
    { label: 'Loja de artigos esportivos', value: '5' },
    { label: 'Área de recreação infantil', value: '6' },
    { label: 'Sala de estar', value: '7' },
    { label: 'Quadras cobertas', value: '8' },
];

export default function FilterDropdown(props:{amenities: string | null, setAmenities: any}) {

    return (
        <Dropdown iconColor='#FFFFFF'
            value={props.amenities}
            iconStyle={{
                height: 30,
            }}
            labelField={'label'}
            valueField={'label'}
            selectedTextStyle={{ color: "white", textAlign: "center", fontWeight: "600", paddingLeft: 25 }}
            style={{
                backgroundColor: "#FF6112",
                borderRadius: 5,
                height: 35,
                paddingRight: 12
            }}
            placeholderStyle={{
                color: "#FFFFFF",
                textAlign: 'center',
                fontWeight: "600",
                fontSize: 15,
                paddingLeft: 25
            }}
            data={data}
            placeholder={"Amenidades"}
            onChange={item => {
                props.setAmenities(item.label)
            }}
        />
    )
}