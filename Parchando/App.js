import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_400Regular, PlayfairDisplay_800ExtraBold } from '@expo-google-fonts/playfair-display';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Main from './src/views/Main';
import Explore from './src/views/Explore';
import Login from './src/views/Login';
import Register from './src/views/Register';
import Recover from './src/views/Recover';
import Start from './src/views/Start';
import Menu from './src/views/Menu';
import CreateEvent from './src/views/CreateEvent';
import EventDetail from './src/views/EventDetail';
import Favorites from './src/views/Favorites';

// Evita que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold, PlayfairDisplay_400Regular, PlayfairDisplay_800ExtraBold
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // No renderizamos nada hasta que cargue
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
          <Stack.Screen name="Explore" component={Explore} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="Recover" component={Recover} options={{ headerShown: false }} />
          <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
          <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
          <Stack.Screen name="CreateEvent" component={CreateEvent} options={{ headerShown: false }} />
          <Stack.Screen name="EventDetail" component={EventDetail} options={{ headerShown: false }} />
          <Stack.Screen name="Favorites" component={Favorites} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
