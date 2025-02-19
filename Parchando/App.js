import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; //el objeto para navegar
import { NavigationContainer } from '@react-navigation/native'; //container de navegacion
import Main from './src/models/Main';
import Explore from './src/models/Explore';

const stack = createNativeStackNavigator(); //se crea el objeto para navegar

function App() {
  return (
    //lista de pantallas: (con nombre y el componente designado de cada pantalla)
    <NavigationContainer>
      <stack.Navigator initialRouteName="Main" >
        <stack.Screen name="Main" component={Main} />
        <stack.Screen name="Explore" component={Explore} />
      </stack.Navigator>

    </NavigationContainer>
  );
}


export default App; //exportar la funcion app

