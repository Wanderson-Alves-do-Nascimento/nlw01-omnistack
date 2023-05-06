import {  View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { Loading } from './src/pages/loading';
import { Routes } from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  })

  if (!fontsLoaded) {
    return <Loading />
  }
  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <Routes />
    </View>
  );
}


