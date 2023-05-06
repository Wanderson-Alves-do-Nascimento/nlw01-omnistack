import { View, ActivityIndicator, Image } from 'react-native';
import logo from '../../../assets/logo.png';
import { THEME } from '../../theme/theme';

export function Loading() {
  return (
    <View style={{ flex: 1 }}>
      <ActivityIndicator color={THEME.COLORS.BACKGROUND} />
      <Image source={logo} />
    </View>
  )
}