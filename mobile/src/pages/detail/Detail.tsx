import { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer'

import { styles } from './styles';
import { THEME } from '../../theme/theme';
import { StackTypes } from '../../routes';
import { api } from '../../services/api';

interface RouteParams {
  point_id: number;
}

interface Data {
  point: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}
export function Detail() {
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation<StackTypes>();
  const route = useRoute();

  const routeParams = route.params as RouteParams;
  console.log(routeParams)

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(response => {
      setData(response.data);
    })
  }, [])

  function handleNavigationBack() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email]
    })
  }
  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=+55${data.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos.`)
  }

  if (!data.point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      < View style={styles.container} >
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name='arrow-left' size={20} color={THEME.COLORS.PRIMARY_COLOR} />
        </TouchableOpacity>
        <Image style={styles.pointImage} source={{ uri: data.point.image_url }} />
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(', ')}
        </Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
        </View>
      </View >
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name='whatsapp' size={20} color="#fff" />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name='mail' size={20} color="#fff" />
          <Text style={styles.buttonText}>Email</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}