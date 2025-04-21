import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, ImageBackground, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../data/categories';
import { getEvents } from '../service/ServiceEvent';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const filters = ["Hoy", "Este fin de semana", "Gratuitos"];
const Start = ({ navigation }) => {
    const [selectedFilter, setSelectedFilter] = useState("Hoy");
    const [searchTerm, setSearchTerm] = useState('');
    const [allEvents, setAllEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const result = await getEvents();
            if (result.success) {
                setAllEvents(result.data);
                setFilteredEvents(result.data);
            } else {
                console.error("Error al cargar eventos:", result.error);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const filtered = allEvents.filter(event =>
            event.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
    }, [searchTerm, allEvents]);

    return (
        <ImageBackground
            source={require('../../assets/img/Fondo.jpg')}
            style={styles.fondo}
            imageStyle={{ opacity: 0.17 }}
        >
            <StatusBar style="dark" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>PARCHANDO</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
                        <Ionicons name="menu" size={32} color="#B71C1C" />
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar eventos"
                        placeholderTextColor="#999"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    {/* Categorías */}
                    <Text style={styles.sectionTitle}>General</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        {categories.map((cat, index) => (
                            <TouchableOpacity key={index} style={styles.category}>
                                <View style={styles.iconWrapper}>
                                    {cat.icon()}
                                </View>
                                <Text style={styles.categoryText}>{cat.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Filtros */}
                    <Text style={styles.sectionTitle}>Tendencias en Bogotá</Text>
                    <View style={styles.filterRow}>
                        {filters.map((filter) => (
                            <TouchableOpacity key={filter} onPress={() => setSelectedFilter(filter)}>
                                <Text style={[
                                    styles.filterText,
                                    selectedFilter === filter && styles.filterTextSelected
                                ]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Eventos */}
                    {filteredEvents.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 20, fontFamily: 'PlayfairDisplay_400Regular' }}>
                            No se encontraron eventos.
                        </Text>
                    ) : (
                        <FlatList
                            data={filteredEvents}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingVertical: 10 }}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <Image source={require('../../assets/icon.png')} style={styles.cardImage} />
                                    <View style={{ padding: 10 }}>
                                        <Text style={styles.cardText}>{item.titulo}</Text>
                                        <Text style={styles.cardSubText}>{item.fecha}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    )}
                </ScrollView>
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
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        fontSize: 24,
        color: '#000',
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 30,
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 40,
        marginBottom: 20,
    },
    searchInput: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_400Regular',
        flex: 1,
        color: '#000',
    },
    sectionTitle: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 20,
        color: '#B71C1C',
        marginBottom: 10,
    },
    categoryScroll: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    category: {
        alignItems: 'center',
        marginRight: 20,
    },
    iconWrapper: {
        backgroundColor: '#eee',
        borderRadius: 40,
        padding: 15,
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'PlayfairDisplay_700Bold',
        color: '#333',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    filterText: {
        fontFamily: 'PlayfairDisplay_400Regular',
        color: '#555',
        fontSize: 14,
        marginRight: 15,
    },
    filterTextSelected: {
        color: '#B71C1C',
        textDecorationLine: 'underline',
        fontFamily: 'PlayfairDisplay_700Bold',
    },
    card: {
        width: 250,
        borderRadius: 15,
        overflow: 'hidden',
        marginRight: 15,
        backgroundColor: '#fff',
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    cardText: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 16,
        color: '#000',
    },
    cardSubText: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 14,
        color: '#555',
    },
});

export default Start;