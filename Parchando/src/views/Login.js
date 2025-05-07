import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUser } from '../service/ServiceAuth';

const Login = ({ navigation }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleTabPress = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      Animated.timing(slideAnim, {
        toValue: tab === 'login' ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.exp),
      }).start();
      if (tab === 'register') navigation.navigate('Register');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Campos requeridos', 'Ingresa correo y contraseña');
    }
    const result = await loginUser({ email, password });
    if (result.success) {
      navigation.replace('Start');
    } else {
      Alert.alert('Error al iniciar sesión', result.error);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/img/Fondo.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.5 }}
    >
      {/* Gradiente solo en la parte inferior, detrás del contenido */}
      <LinearGradient
        colors={['#FFFFFF', '#FAB0A9']}
        style={styles.gradienteVisible}
      />
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>PARCHANDO</Text>

          <View style={styles.card}>
            <View style={styles.tabContainer}>
              <Animated.View
                style={[
                  styles.slider,
                  {
                    transform: [
                      {
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 140],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <TouchableOpacity style={styles.tab} onPress={() => handleTabPress('login')}>
                <Text style={activeTab === 'login' ? styles.activeTabText : styles.tabText}>
                  Ingresar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={() => handleTabPress('register')}>
                <Text style={activeTab === 'register' ? styles.activeTabText : styles.tabText}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Recover')}>
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1, width: '100%' },
  gradienteVisible: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
    zIndex: -1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  header: {
    fontFamily: 'PlayfairDisplay_800ExtraBold',
    fontSize: 48,
    marginBottom: 30,
    color: '#000',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffffcc',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    // Asegurar que el card quede encima del gradiente
    zIndex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    width: 280,
    height: 60,
    backgroundColor: '#ccc',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
  },
  slider: {
    position: 'absolute',
    width: 140,
    height: '100%',
    backgroundColor: '#D32F2F',
    borderRadius: 30,
  },
  tab: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabText: { fontFamily: 'PlayfairDisplay_700Bold', color: '#333', fontSize: 18 },
  activeTabText: { fontFamily: 'PlayfairDisplay_700Bold', color: '#fff', fontSize: 18 },
  input: {
    width: '100%',
    borderRadius: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    zIndex: 1,
  },
  buttonText: { color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold' },
  linkText: { color: '#000', textDecorationLine: 'underline', marginTop: 10, fontFamily: 'PlayfairDisplay_700Bold' },
});

export default Login;