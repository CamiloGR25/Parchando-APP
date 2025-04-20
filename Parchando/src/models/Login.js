import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('login');

    const slideAnim = useRef(new Animated.Value(0)).current;

    const handleTabPress = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            Animated.timing(slideAnim, {
                toValue: tab === 'login' ? 0 : 1,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.out(Easing.exp),
            }).start();

            if (tab === 'register') {
                navigation.navigate("Register");
            }
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/img/Fondo.jpg')}
            style={styles.fondo}
            resizeMode="cover"
            imageStyle={{ opacity: 0.6 }}
        >
            <StatusBar style="light" />
            <View style={styles.container}>
                <Text style={styles.header}>PARCHANDO</Text>

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

                {/* FORMULARIO DENTRO DE TARJETA */}
                <View style={styles.card}>
                    <Text style={styles.bienvenido}>Bienvenido</Text>

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

                    <TouchableOpacity style={styles.botonIngresar}>
                        <Text style={styles.textoIngresar}>Ingresar</Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity onPress={() => navigation.navigate("Recover")}>
                    <Text style={styles.olvido}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    header: {
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        fontSize: 48,
        color: '#000',
        marginBottom: "30%",
    },
    tabContainer: {
        flexDirection: 'row',
        width: 280,
        height: 48,
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
        width: '100%',
        backgroundColor: '#ffffffcc', // blanco semi-transparente
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6, // sombra 
        alignItems: 'center',
        marginBottom: "20%",

    },
    bienvenido: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 35,
        color: '#000',
        marginBottom: 20,
        marginTop: 5,
    },
    input: {
        backgroundColor: '#ffffffaa',
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
    olvido: {
        marginTop: 15,
        fontSize: 14,
        color: '#000',
        textDecorationLine: 'underline',
        fontFamily: 'PlayfairDisplay_700Bold',
    },
});

export default Login;