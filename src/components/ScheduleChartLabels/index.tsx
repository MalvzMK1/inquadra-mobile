import Svg, { Text } from "react-native-svg";

interface ILabelsProps {
    x: (index: number) => number
    y: (value: number) => number
    bandwidth: number
    data: number[]
    maxValue: number
}

export default function ScheduleChartLabels(props: ILabelsProps) {
    return (
        <>
            <Svg>
                {props.data.map((value, index) => (
                    <Text
                        key={index}
                        x={props.x(index) + (props.bandwidth / 2)}
                        y={value < props.maxValue ? props.y(value) - 10 : props.y(value) + 15}
                        fontSize={14}
                        fill={'black'}
                        alignmentBaseline={'middle'}
                        textAnchor={'middle'}
                    >
                        {value}
                    </Text>
                ))}
            </Svg>
        </>
    )
}