import { View, Text } from 'react-native';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import { Button } from 'react-native-paper';

export default function Home() {
    return (
        <View className="flex-1 flex flex-col">
          <View className="flex-1 bg-red-500"></View>
          <Button>
            <Text>INTEGRA AI</Text>
          </Button>
          <BottomNavigationBar />
        </View>
	  );
}
