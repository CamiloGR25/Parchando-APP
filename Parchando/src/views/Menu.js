import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { getAuth, signOut } from 'firebase/auth';

const Menu = ({ navigation }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);

            // Limpiar el historial de navegación
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

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
                <Text style={styles.subtitulo}>Tu cuenta</Text>
                <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("ManageAccount")}>
                    <Text style={styles.textoBoton}>Gestionar cuenta</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.seccion}>
                <Text style={styles.subtitulo}>Actividades</Text>
                <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("MyEvents")}>
                    <Text style={styles.textoBoton}>Tus eventos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("CreateEvent")}>
                    <Text style={styles.textoBoton}>Crear evento</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boton}>
                    <Text style={styles.textoBoton}>Tus recordatorios</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("Favorites")}>
                    <Text style={styles.textoBoton}>Favoritos</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.seccion}>
                <TouchableOpacity style={styles.boton} onPress={() => setShowLogoutModal(true)}>
                    <Text style={styles.textoBoton}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de confirmación para cerrar sesión */}
            <Modal
                visible={showLogoutModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>¿Seguro que quieres cerrar sesión?</Text>
                        <Text style={styles.modalMessage}>Serás redirigido al inicio de PARCHANDO</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButtonNo} onPress={() => setShowLogoutModal(false)}>
                                <Text style={styles.modalButtonText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButtonYes} onPress={handleLogout}>
                                <Text style={styles.modalButtonText}>Sí</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000099',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        width: '85%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalButtonYes: {
        backgroundColor: '#D32F2F',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginHorizontal: 10,
    },
    modalButtonNo: {
        backgroundColor: '#888',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginHorizontal: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Menu;
