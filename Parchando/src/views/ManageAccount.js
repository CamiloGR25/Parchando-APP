import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const ManageAccount = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../assets/img/Fondo.jpg')}
      style={styles.fondo}
      imageStyle={{ opacity: 0.6 }}
    >
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.flechaCirculo}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Configuración y actividad</Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>Configuración de cuenta</Text>

        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("PasswordSecurity")} >
          <Text style={styles.textoBoton}>Contraseña y seguridad</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("UserProfile")}>
          <Text style={styles.textoBoton}>Visualizar datos personales</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton}>
          <Text style={styles.textoBoton}>Ver historial de búsqueda</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginLeft: 10,
  },
  titulo: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_800ExtraBold',
    marginLeft: 8,
    color: '#000',
  },
  seccion: {
    backgroundColor: '#ffffffcc',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    marginTop: 22,
    marginHorizontal: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_800ExtraBold',
    color: '#000',
    marginBottom: 15,
  },
  boton: {
    backgroundColor: '#D32F2F',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  flechaCirculo: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManageAccount;
