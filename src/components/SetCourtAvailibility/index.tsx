import { View, Text, Alert } from 'react-native';
import React, { useState, useRef } from "react"
import { CheckBox } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import PriceHour from '../CourtPriceHour';

export default function SetCourtAvailibility() {
    const [dayUseYes, setDayUseYes] = useState(false)
    const [dayUseNo, setDayUseNo] = useState(false)
    const [addedComponents, setAddedComponents] = useState<JSX.Element[]>([])
    const nextIdRef = useRef(1)

    const handleAddNewComponentButton = () => {
        const newComponent = <PriceHour key={nextIdRef.current++} />

        if (addedComponents && addedComponents.length > 0)
            setAddedComponents((prevState) => [...prevState, newComponent])
        else
            setAddedComponents([newComponent])
    };

    const [copyButtonClick, setCopyButtonClick] = useState(false)
    const [pasteButtonClick, setPasteButtonClick] = useState(false)
    const [copiedComponents, setCopiedComponents] = useState<JSX.Element[]>([])

    const handleCopyButton = () => {
        if (addedComponents && addedComponents.length > 0) {
            addedComponents.map(item => {
                setCopyButtonClick(!copyButtonClick)
                setPasteButtonClick(!pasteButtonClick)
                setCopiedComponents((prevState) => [...prevState, item])
            })
        } else {
            Alert.alert(
                'ERRO!',
                'Adicione um horário para que seja possível copiar',
                [
                  {
                    text: 'VOLTAR',
                    style: 'cancel'
                  },
                ],
                {
                  cancelable: true
                }
              );
        }
    }

    const handlePasteButton = () => {
        setAddedComponents(copiedComponents)
    }

    return (
        <View className='mt-[10px]'>
            {pasteButtonClick && (
                <View className='flex-row items-center justify-between mt-[25px] mb-[25px]'>
                    <Text className='text-white text-[16px]'>Colar horário e valores?</Text>

                    <TouchableOpacity onPress={() => {
                        handlePasteButton()
                    }} className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center'>
                        <Text className='text-[11px]'>Colar</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text className='text-white text-[16px]'>A quadra possui serviço de Day-Use?</Text>

            <View className='flex-row'>
                <View className='flex-row items-center justify-center'>
                    <CheckBox
                        checked={dayUseYes}
                        onPress={() => {
                            setDayUseYes(!dayUseYes)
                            setDayUseNo(false)
                        }}
                    />
                    <Text className='text-white text-[16px] -ml-[15px]'>Sim</Text>
                </View>

                <View className='flex-row items-center justify-center ml-[5px]'>
                    <CheckBox
                        checked={dayUseNo}
                        onPress={() => {
                            setDayUseNo(!dayUseNo)
                            setDayUseYes(false)
                        }}
                    />
                    <Text className='text-white text-[16px] -ml-[15px]'>Não</Text>
                </View>
            </View>

            <View className='w-full flex-col mt-[40px]'>
                <View className='flex-row justify-between w-full border-b border-white'>
                    <Text className='text-white text-[14px]'>Horário</Text>
                    <Text className='text-white text-[14px]'>Valor</Text>
                </View>

                <View className='h-fit w-full flex'>
                    {
                        addedComponents && addedComponents.map(component => {
                            return component
                        })
                    }
                </View>

            </View>

            <TouchableOpacity onPress={handleAddNewComponentButton} className='h-[32px] w-[86px] bg-[#FF6112] rounded-[5px] items-center justify-center ml-[105px] mt-[20px]'>
                <Text className='text-white text-[10px]'>Adicionar horário</Text>
            </TouchableOpacity>

            {!copyButtonClick && (
                <View className='flex-row items-center justify-between mt-[35px] mb-[30px]'>
                    <Text className='text-white text-[16px]'>Copiar horário e valores?</Text>

                    <TouchableOpacity onPress={handleCopyButton} className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center'>
                        <Text className='text-[11px]'>Copiar</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    )
}