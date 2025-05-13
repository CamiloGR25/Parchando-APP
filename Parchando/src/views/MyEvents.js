import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../service/firebaseConfig';

const MyEvents = ({ navigation }) => {
    const [myEvents, setMyEvents] = useState([]);

    const fetchMyEvents = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const eventsSnapshot = await getDocs(collection(db, "users", userId, "myevents"));
            const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMyEvents(events);
        } catch (error) {
            console.error("Error al obtener tus eventos:", error.message);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMyEvents();
        }, [])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("EventDetail", { event: item })}
        >
            {item.image ? (
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
            ) : (
                <Image
                    source={require('../../assets/icon.png')}
                    style={styles.image}
                />
            )}
            <View style={styles.info}>
                <Text style={styles.title}>{item.titulo}</Text>
                <Text style={styles.date}>{item.fecha}</Text>
                <Text style={styles.ubicacion}>{item.ubicacion}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={require('../../assets/img/Fondo.jpg')}
            style={styles.fondo}
            imageStyle={{ opacity: 0.6 }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.flechaCirculo}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Configuración y actividad</Text>
                </View>

                <Text style={styles.sectionTitle}>Tus eventos</Text>

                {myEvents.length === 0 ? (
                    <Text style={styles.emptyText}>Aún no has creado ningún evento.</Text>
                ) : (
                    <FlatList
                        data={myEvents}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 30 }}
                    />
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        marginLeft: 8,
        color: '#000',
    },
    sectionTitle: {
        fontSize: 30,
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        color: '#D32F2F',
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 160,
    },
    heartIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 5,
    },
    info: {
        padding: 10,
    },
    title: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 16,
    },
    date: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 14,
        marginTop: 4,
        color: '#444',
    },
    ubicacion: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 14,
        marginTop: 4,
    },
    emptyText: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 30,
        color: '#555',
    },
    flechaCirculo: {
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: '#D32F2F', // rojo institucional
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MyEvents;
