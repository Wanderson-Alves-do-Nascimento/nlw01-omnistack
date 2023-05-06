import { useState } from 'react';
import { Image, ImageBackground, View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import backgroundImg from '../../assets/home-background.png';
import logo from '../../assets/logo.png';

import { styles } from './styles';
import { StackTypes } from '../../routes';


export function Home() {
  const navigation = useNavigation<StackTypes>();
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');

  function handleNavigationToPoints() {
    navigation.navigate('Points', {
      uf,
      city
    });
  }


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={backgroundImg} style={styles.container} imageStyle={{ width: 274, height: 364 }}>
          <View style={styles.main}>
            <Image source={logo} />
            <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
          <View style={styles.footer}>

            <TextInput
              style={styles.input}
              placeholder='Digite a UF'
              value={uf}
              onChangeText={setUf}
              maxLength={2}
              autoCapitalize='characters'
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder='Digite a Cidade'
              value={city}
              onChangeText={setCity}
              autoCorrect={false}
            />

            <RectButton style={styles.button} onPress={handleNavigationToPoints}>
              <View style={styles.buttonIcon}>
                <Icon name='arrow-right' color="#FFF" size={24} />
              </View>
              <Text style={styles.buttonText}>Entrar</Text>
            </RectButton>
          </View>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  )
}
