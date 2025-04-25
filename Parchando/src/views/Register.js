import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { registerUser } from "../service/ServiceAuth";
import { LinearGradient } from 'expo-linear-gradient';

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [activeTab, setActiveTab] = useState('register');
    const [modalVisible, setModalVisible] = useState(false);


    const slideAnim = useRef(new Animated.Value(1)).current; // Inicia en "register"

    const handleRegister = async () => {
        console.log("Botón presionado");

        if (!email || !password || !username || !confirmPassword) {
            Alert.alert("Campos requeridos", "Por favor completa todos los campos");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Contraseñas no coinciden", "Por favor verifica las contraseñas");
            return;
        }

        const result = await registerUser({ username, email, password });
        //console.log("Resultado:", result);

        if (result.success) {
            setModalVisible(true);
        } else {
            Alert.alert("Error", result.error);
        }
    };


    const handleTabPress = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            Animated.timing(slideAnim, {
                toValue: tab === 'login' ? 0 : 1,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.out(Easing.exp),
            }).start();

            if (tab === 'login') {
                navigation.navigate("Login");
            }
        }
    };

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>REGISTRO</Text>
                        <Text style={styles.modalSubTitle}>EXITOSAMENTE</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.replace("Login");
                            }}
                        >
                            <Text style={styles.modalButtonText}>Listo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ImageBackground
                source={require('../../assets/img/Fondo.jpg')}
                style={styles.fondo}
                imageStyle={{ opacity: 0.5 }}
            >
                <LinearGradient
                    colors={['#FFFFFF', '#FAB0A9']}
                    style={styles.gradienteVisible}
                />
                <StatusBar style="light" />
                <View style={styles.container}>
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
                                                    outputRange: [0, 140], // Mitad del contenedor
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            />
                            <TouchableOpacity style={styles.tab} onPress={() => handleTabPress('login')}>
                                <Text style={activeTab === 'login' ? styles.tabTextActivo : styles.tabTextInactivo}>
                                    Ingresar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.tab} onPress={() => handleTabPress('register')}>
                                <Text style={activeTab === 'register' ? styles.tabTextActivo : styles.tabTextInactivo}>
                                    Registrarse
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.bienvenido}>Registrate</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de usuario"
                            placeholderTextColor="#aaa"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electronico"
                            placeholderTextColor="#aaa"
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
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar Contraseña"
                            placeholderTextColor="#aaa"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <TouchableOpacity style={styles.botonIngresar} onPress={handleRegister}>
                            <Text style={styles.textoIngresar}>Registrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
        width: "100%",
        height: "90%",
        backgroundColor:'#FFFFFF',
    },
    gradienteVisible: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 250,
        zIndex: 1, // por encima del fondo
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        zIndex: 2, // contenido encima del gradiente
    },
    header: {
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        fontSize: 48,
        color: '#000',
        
    },
    tabContainer: {
        flexDirection: 'row',
        width: 280,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ccc',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20,
    },
    slider: {
        position: 'absolute',
        width: 140,
        height: '100%',
        backgroundColor: '#D32F2F',
        borderRadius: 30,
        zIndex: 0,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    tabTextActivo: {
        fontFamily: 'PlayfairDisplay_700Bold',
        color: '#fff',
        fontSize: 18,
    },
    tabTextInactivo: {
        fontFamily: 'PlayfairDisplay_700Bold',
        color: '#333',
        fontSize: 18,
    },
    card: {
        marginTop:"40%",
        width: '100%',
        backgroundColor: '#ffffffcc',
        borderRadius: 50,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        alignItems: 'center',
        marginBottom: "-10%",
    },
    bienvenido: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 35,
        color: '#000',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_400Regular',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    botonIngresar: {
        backgroundColor: '#D32F2F',
        paddingVertical: 14,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    textoIngresar: {
        color: '#FFFFFF',
        fontSize: 23,
        fontFamily: 'PlayfairDisplay_700Bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 350,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        color: '#000',
        textAlign: 'center',
    },
    modalSubTitle: {
        fontSize: 22,
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 30,
    },
    modalButton: {
        backgroundColor: '#D32F2F',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'PlayfairDisplay_700Bold',
    },

});

export default Register;
