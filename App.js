import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import RegistrosScreen from './src/screens/RegistrosScreen';
import EditarScreen from './src/screens/EditarScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0d6efd',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'AlertaFebre' }}
        />
        <Stack.Screen 
          name="Registros" 
          component={RegistrosScreen}
          options={{ title: 'Registros de Temperatura' }}
        />
        <Stack.Screen 
          name="Editar" 
          component={EditarScreen}
          options={{ title: 'Editar Registro' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}