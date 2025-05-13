import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, ImageBackground, ActivityIndicator, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../data/categories';
import { LinearGradient } from 'expo-linear-gradient';
import { getGeneralEvents } from '../service/ServiceEvent';

const filters = ["Hoy |", "Este fin de semana |", "Gratuitos |"];

const Start = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState("Hoy");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGeneralEvents = async () => {
    setLoading(true);
    setError(null);
    const result = await getGeneralEvents();
    console.log("Resultado de getGeneralEvents:", result);
    if (result.success) {
      setAllEvents(result.data);
      console.log("Datos en allEvents:", result.data);
      setFilteredEvents(result.data);
    } else {
      console.error("Error al cargar eventos generales:", result.error);
      setError("Error al cargar los eventos generales.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGeneralEvents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      const filtered = allEvents.filter(event =>
        event.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else if (selectedCategory) {
      const filtered = allEvents.filter(event =>
        event.categoria === selectedCategory
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(allEvents);
    }
  }, [searchTerm, selectedCategory, allEvents]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#B71C1C" />
        <Text style={{ marginTop: 10, fontFamily: 'PlayfairDisplay_400Regular' }}>Cargando eventos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, color: 'red', textAlign: 'center' }}>Error al cargar los eventos:</Text>
        <Text style={{ marginTop: 10, fontFamily: 'PlayfairDisplay_400Regular', textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      style={styles.fondo}
      imageStyle={{ opacity: 0.5 }}
    >
      <LinearGradient
        colors={['#FFFFFF', '#FFB0AA']}
        style={styles.gradienteVisible}
      />
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

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id || Math.random().toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
          ListHeaderComponent={
            <>
              {/* Categorías */}
              <Text style={styles.sectionTitle}>General</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {categories.map((cat, index) => {
                  const isActive = selectedCategory === cat.title;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.category}
                      onPress={() =>
                        setSelectedCategory(prev =>
                          prev === cat.title ? null : cat.title
                        )
                      }
                    >
                      <View style={[
                        styles.iconWrapper,
                        isActive && { backgroundColor: '#FAB0A9' }
                      ]}>
                        {cat.icon()}
                      </View>
                      <Text style={[
                        styles.categoryText,
                        isActive && { color: '#B71C1C' }
                      ]}>
                        {cat.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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

              {/* Mensaje si no hay resultados */}
              {filteredEvents.length === 0 && (
                <Text style={{
                  textAlign: 'center',
                  marginTop: 20,
                  fontFamily: 'PlayfairDisplay_400Regular',
                  fontSize: 16,
                  color: '#555',
                }}>
                  No se encontraron eventos.
                </Text>
              )}
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => navigation.navigate("EventDetail", { event: item })}>
                {item.imagen_url ? (
                  <Image
                    source={{ uri: item.imagen_url }}
                    style={styles.cardImage}
                    onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
                  />
                ) : (
                  <View style={[styles.cardImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontFamily: 'PlayfairDisplay_400Regular', color: '#555' }}>No Image</Text>
                  </View>
                )}
                <View style={{ padding: 10 }}>
                  <Text style={styles.cardText}>{item.titulo}</Text>
                  <Text style={styles.cardSubText}>{item.fecha_hora}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    width: "100%",
    height: "90%",
    backgroundColor: '#FFFFFF',
  },
  gradienteVisible: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
    zIndex: 1, // por encima del fondo
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    zIndex: 2, // contenido encima del gradiente
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
    fontFamily: 'Roboto Slab',
    flex: 1,
    color: '#000',
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 40,
    color: '#DA2D2D',
    marginBottom: 10,

  },
  categoryScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  category: {
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  iconWrapper: {
    backgroundColor: '#eee',
    borderRadius: 50,
    padding: 21,
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
    fontSize: 15,
    marginRight: 15,
    marginBottom: 15,
    marginTop: 15,
  },
  filterTextSelected: {
    color: '#DA2D2D',
    textDecorationLine: 'underline',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  card: {
    flex: 0.48,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
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