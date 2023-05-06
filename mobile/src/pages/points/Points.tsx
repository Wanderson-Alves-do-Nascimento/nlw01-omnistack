import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { api } from '../../services/api';
import { styles } from './styles';
import { THEME } from '../../theme/theme';
import { StackTypes } from '../../routes';


interface ItemProps {
  id: number;
  title: string;
  image_url: string;
}

interface PointProps {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface RouteParams {
  uf: string;
  city: string;
}
export function Points() {
  const navigation = useNavigation<StackTypes>();
  const [items, setItems] = useState<ItemProps[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initalPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [points, setPoints] = useState<PointProps[]>([]);
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Oooops...', 'Precisamos da sua permissão para obter sua localização.')
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      setInitialPosition([
        latitude,
        longitude
      ])
    }
    loadPosition();
  }, [])

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    })
  }, [])

  useEffect(() => {
    api.get('points', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems
      }
    }).then(response => {
      setPoints(response.data);
    })
  }, [selectedItems]);

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item == id)

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }
  function handleNavigationBack() {
    navigation.goBack();
  }
  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { point_id: id })
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name='arrow-left' size={20} color={THEME.COLORS.PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text style={styles.title}>Bem vindo!</Text>
        <Text style={styles.description}>Encotre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          {initalPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initalPosition[0],
                longitude: initalPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014
              }}
            >
              {points.map(point => (
                <Marker
                  key={String(point.id)}
                  onPress={() => handleNavigateToDetail(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }} >
                  <View style={styles.mapMarkerContainer}>
                    <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map(item => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]}
              onPress={() => { handleSelectedItem(item.id) }}
              activeOpacity={0.6}
            >
              <SvgUri uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View >
    </>
  )
}