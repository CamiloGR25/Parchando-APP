import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addToFavorites, removeFromFavorites, isFavorite } from '../service/ServiceFavorites';
import { getAuth } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient'; // Importa LinearGradient

const EventDetail = ({ route, navigation }) => {
    const { event } = route.params;

    console.log("Datos del evento en EventDetail:", event); // Para depuración

    const user = getAuth().currentUser;
    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        const checkFavorite = async () => {
            if (user && event && event.id) { // Asegúrate de que user y event.id existan
                const result = await isFavorite(user.uid, event.id);
                setFavorite(result);
            }
        };
        checkFavorite();
    }, [user, event]); // Depende de user y event para re-verificar al cambiar

    const toggleFavorite = async () => {
        if (!user || !event) return; // No hacer nada si no hay usuario o evento
        if (favorite) {
            await removeFromFavorites(user.uid, event.id);
            setFavorite(false);
        } else {
            await addToFavorites(user.uid, event);
            setFavorite(true);
        }
    };

    const handleReminder = () => {
        Alert.alert("Recordatorio", "Tu recordatorio ha sido generado correctamente (simulado).");
        // Aquí podrías usar expo-notifications
    };

    return (
        <LinearGradient
            colors={['rgba(255, 255, 255, 0.3)', 'rgba(250, 176, 169, 0.7)']}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0.7, 1]}
        >
            <View style={styles.headerContainer}>
                {/* Botón de Volver */}
                <TouchableOpacity style={styles.backButtonMenu} onPress={() => navigation.goBack()}>
  <Ionicons name="arrow-back" size={28} color="#fff" />
</TouchableOpacity>

                {/* Título "PARCHANDO" */}
                <Text style={styles.header}>PARCHANDO</Text>

                {/* Icono de Menú */}
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Menu")}>
  <Ionicons name="menu" size={32} color="#B71C1C" />
</TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                {event.image || event.imagen_url ? (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: event.image || event.imagen_url }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                ) : null}

                <TouchableOpacity style={styles.favoriteIcon} onPress={toggleFavorite}>
                    <Ionicons name={favorite ? "heart" : "heart-outline"} size={28} color="#B71C1C" />
                </TouchableOpacity>

                <Text style={styles.title}>{event?.titulo}</Text>

                {event?.subtitulo && (
                    <Text style={styles.subtitle}>{event.subtitulo}</Text>
                )}

                {event?.fechaDisplay && (
                    <Text style={styles.subtitle}>{event.fechaDisplay}</Text>
                )}

                {event?.fecha_hora && !event?.fechaDisplay && (
                    <Text style={styles.subtitle}>{event.fecha_hora}</Text>
                )}

                {event?.ubicacion && (
                    <Text style={styles.subtitle}>{event.ubicacion}</Text>
                )}

                {event?.ubicacion_lugar && !event?.ubicacion && (
                    <Text style={styles.subtitle}>{event.ubicacion_lugar}</Text>
                )}

                {event?.ubicacion_ciudad && (
                    <Text style={styles.subtitle}>{event.ubicacion_ciudad}</Text>
                )}

                {event?.categoria && (
                    <Text style={styles.subtitle}>{event.categoria}</Text>
                )}

                {event?.descripcion && (
                    <Text style={styles.description}>{event.descripcion}</Text>
                )}

                {event?.url && (
                    <Text style={styles.link} onPress={() => Linking.openURL(event.url)}>
                        {event.url}
                    </Text>
                )}

                <TouchableOpacity style={styles.button} onPress={handleReminder}>
                    <Text style={styles.buttonText}>Generar recordatorio</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  container: {
    padding: 10,
    paddingBottom: 40,
    backgroundColor: 'transparent',
    marginTop: 120, // Adjust to place content below header
  },
  backButtonMenu: {
    width: 40,
    height: 40,
    top: 50,
    borderRadius: 25,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontFamily: 'PlayfairDisplay_800ExtraBold',
    top: 10,
    fontSize: 20,
    color: '#000',
  },
  menuButton: {
    width: 40,
    height: 40,
    top: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '90%',
    borderRadius: 15,
    marginBottom: 15,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    zIndex: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginTop: 15,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_500Medium',
    color: '#333',
    marginVertical: 4,
  },
  description: {
    marginTop: 5,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
    color: '#444',
  },
  link: {
    color: '#D32F2F',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#D32F2F',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
});

export default EventDetail;