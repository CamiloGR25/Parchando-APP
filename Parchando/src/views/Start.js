import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, ImageBackground, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../data/categories';

const filters = ["Hoy", "Este fin de semana", "Gratuitos"];

const events = [
    { id: "1", title: "Obra teatral destacada", image: require('../../assets/icon.png') },
    { id: "2", title: "Festival Gastronómico", image: require('../../assets/icon.png') },
];

const Start = ({ navigation }) => {
    const [selectedFilter, setSelectedFilter] = useState("Hoy");

    return (
        <ImageBackground
            source={require('../../assets/img/Fondo.jpg')}
            style={styles.fondo}
            resizeMode="cover"
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

                    {/* Tendencias */}
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

                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 10 }}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Image source={item.image} style={styles.cardImage} />
                                <Text style={styles.cardText}>{item.title}</Text>
                            </View>
                        )}
                    />
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
        padding: 10,
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 16,
        color: '#000',
    },
});

export default Start;