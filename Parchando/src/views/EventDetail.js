import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addToFavorites, removeFromFavorites, isFavorite } from '../service/ServiceFavorites';
import { getAuth } from 'firebase/auth';

const EventDetail = ({ route, navigation }) => {
    const { event } = route.params;

    const user = getAuth().currentUser;
    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        const checkFavorite = async () => {
            const result = await isFavorite(user.uid, event.id);
            setFavorite(result);
        };
        if (user) checkFavorite();
    }, []);

    const toggleFavorite = async () => {
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
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={require('../../assets/icon.png')} style={styles.image} />

            <TouchableOpacity style={styles.favoriteIcon} onPress={toggleFavorite}>
                <Ionicons name={favorite ? "heart" : "heart-outline"} size={28} color="#B71C1C" />
            </TouchableOpacity>

            <Text style={styles.title}>{event.titulo}</Text>
            <Text style={styles.subtitle}>{event.fecha}</Text>
            <Text style={styles.subtitle}>{event.ubicacion}</Text>
            <Text style={styles.description}>{event.descripcion}</Text>

            {event.link && (
                <Text style={styles.link} onPress={() => Linking.openURL(event.link)}>
                    {event.link}
                </Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleReminder}>
                <Text style={styles.buttonText}>Generar recordatorio</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 15,
    },
    favoriteIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
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
        marginTop: 10,
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
