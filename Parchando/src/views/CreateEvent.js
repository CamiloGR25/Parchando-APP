import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../data/categories';

const CreateEvent = ({ navigation }) => {
    const [titulo, setTitulo] = useState('');
    const [subtitulo, setSubtitulo] = useState('');
    const [fecha, setFecha] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    // 🔥 Sin "Otro"
    const categoriasDisponibles = categories.map(c => c.title);

    return (
        <ImageBackground
            source={require('../../assets/img/Fondo.jpg')}
            style={styles.fondo}
            imageStyle={{ opacity: 0.6 }}
        >
            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.flechaCirculo}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.titulo}>Crear eventos</Text>
                </View>

                <TouchableOpacity style={styles.imagenSubir}>
                    <Ionicons name="camera-outline" size={30} color="#333" />
                </TouchableOpacity>

                <TextInput
                    placeholder="Título del evento"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={titulo}
                    onChangeText={setTitulo}
                />
                <TextInput
                    placeholder="Subtítulo del evento"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={subtitulo}
                    onChangeText={setSubtitulo}
                />
                <TextInput
                    placeholder="Fecha y hora"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={fecha}
                    onChangeText={setFecha}
                />
                <TextInput
                    placeholder="Ubicación"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={ubicacion}
                    onChangeText={setUbicacion}
                />
                <TextInput
                    placeholder="Descripción"
                    multiline
                    numberOfLines={4}
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    placeholderTextColor="#999"
                    value={descripcion}
                    onChangeText={setDescripcion}
                />

                <Text style={styles.subtitulo}>Categoría</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={{ color: categoria ? '#000' : '#999', fontFamily: 'PlayfairDisplay_400Regular' }}>
                        {categoria || 'Seleccionar categoría'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonCrear}>
                    <Text style={styles.textoBoton}>Crear</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* MODAL de categorías */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <View style={styles.modalWrapper}>
                        <View style={styles.modalHandle} />
                        <ScrollView contentContainerStyle={styles.modalContent}>
                            {categoriasDisponibles.map((cat, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setCategoria(cat);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancelar}>
                                <Text style={styles.modalCancelarText}>Cancelar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        padding: 30,
        paddingBottom: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 25,
        marginLeft: 5,

    },
    titulo: {
        fontSize: 22,
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        color: '#000',
        marginBottom: 20,
        marginLeft: 15,
        marginTop: 15,
    },
    imagenSubir: {
        backgroundColor: '#ffffffcc',
        height: 100,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#ffffffcc',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_400Regular',
        marginBottom: 15,
        color: '#000',
    },
    subtitulo: {
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_700Bold',
        marginBottom: 10,
        color: '#000',
    },
    botonCrear: {
        backgroundColor: '#D32F2F',
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    textoBoton: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'PlayfairDisplay_700Bold',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    modalWrapper: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
        paddingBottom: 20,
    },
    modalHandle: {
        width: 50,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: 10,
    },
    modalContent: {
        paddingHorizontal: 20,
    },
    modalItem: {
        paddingVertical: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    modalItemText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'PlayfairDisplay_500Medium',
    },
    modalCancelar: {
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    modalCancelarText: {
        color: '#D32F2F',
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 16,
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

export default CreateEvent;