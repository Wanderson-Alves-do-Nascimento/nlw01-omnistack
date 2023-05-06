import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import { Home } from './pages/home/Home';
import { Points } from './pages/points/Points';
import { Detail } from './pages/detail/Detail';

const AppStack = createStackNavigator();
type StackNavigationProps = {
  Home: undefined;
  Detail: {
    point_id: number;
  };
  Points: {
    city: string;
    uf: string;
  };
}
export type StackTypes = StackNavigationProp<StackNavigationProps>



export function Routes() {
  return (
    <NavigationContainer >
      <AppStack.Navigator
        screenOptions={{
          cardStyle: {
            backgroundColor: '#f0f0f5'
          },
          headerShown: false
        }}
      >
        <AppStack.Screen name='Home' component={Home} />
        <AppStack.Screen name='Points' component={Points} />
        <AppStack.Screen name='Detail' component={Detail} />
      </AppStack.Navigator>
    </NavigationContainer>
  )
}
