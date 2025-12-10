import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FormularioScreen from './src/screens/FormularioScreen';
import RegistrosScreen from './src/screens/RegistrosScreen';
import EditarRegistroScreen from './src/screens/EditarRegistroScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Formulario"
        screenOptions={{
          headerStyle: { backgroundColor: '#0d6efd' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Formulario" 
          component={FormularioScreen} 
          options={{ title: 'AlertaFebre - Novo' }}
        />
        <Stack.Screen 
          name="Registros" 
          component={RegistrosScreen} 
          options={{ title: 'Histórico' }}
        />
        <Stack.Screen 
          name="Editar" 
          component={EditarRegistroScreen} 
          options={{ title: 'Editar Registro' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}