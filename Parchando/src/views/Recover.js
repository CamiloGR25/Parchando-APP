import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Recover = ({ navigation }) => {
    const [email, setEmail] = useState('');

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

                <View style={styles.card}>
                    <Text style={styles.titulo}>Recuperar cuenta</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Correo electronico"
                        placeholderTextColor="#aaa"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TouchableOpacity style={styles.boton}>
                        <Text style={styles.textoBoton}>
                            Enviar código
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    header: {
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        fontSize: 48,
        color: '#000',
        marginBottom: '30%',
    },
    card: {
        width: '100%',
        backgroundColor: '#ffffffcc',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
        alignItems: 'center',
        marginBottom: '20%',
    },
    titulo: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 28,
        color: '#000',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#ffffffaa',
        width: '100%',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_400Regular',
        marginBottom: 25,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    boton: {
        backgroundColor: '#D32F2F',
        paddingVertical: 14,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    textoBoton: {
        color: '#FFFFFF',
        fontSize: 19,
        fontFamily: 'PlayfairDisplay_700Bold',
    },
});

export default Recover;
