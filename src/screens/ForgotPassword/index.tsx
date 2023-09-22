import React, { useEffect, useState } from 'react'
import { View, Text, TextInput } from 'react-native';

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    return (
        <View>
            <Text>Testando esquecer a senha</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                className='border'
            />
        </View>
    )
}