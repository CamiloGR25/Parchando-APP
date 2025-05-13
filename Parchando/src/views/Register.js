import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { registerUser } from '../service/ServiceAuth';
import { LinearGradient } from 'expo-linear-gradient';

const Register = ({ navigation }) => {
    const slideAnim = useRef(new Animated.Value(1)).current;
    const [activeTab, setActiveTab] = useState('register');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const handleTabPress = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            Animated.timing(slideAnim, {
                toValue: tab === 'login' ? 0 : 1,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.out(Easing.exp),
            }).start();
            if (tab === 'login') navigation.navigate('Login');
        }
    };

    const handleRegister = async () => {
        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setAlertMessage('Completa todos los campos.');
            setAlertType('error');
            setShowAlertModal(true);
        }
        if (password !== confirmPassword) {
            setAlertMessage('Las contraseñas no coinciden.');
            setAlertType('error');
            setShowAlertModal(true);
            return;
        }
        const result = await registerUser({ username, email, password });
        if (result.success) {
            setModalVisible(true);
        } else {
            setAlertMessage(result.error);
            setAlertType('error');
            setShowAlertModal(true);
        }
    };

    return (
        <>
            {/* Modal de éxito */}
            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>¡Registro exitoso!</Text>
                        <TouchableOpacity
                            style={[styles.modalButton, { width: '100%', alignItems: 'center', marginTop: 10 }]}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.replace('Login');
                            }}
                        >
                            <Text style={styles.modalButtonText}>Listo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de error */}
            <Modal
                transparent
                visible={showAlertModal}
                animationType="fade"
                onRequestClose={() => setShowAlertModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={[styles.modalTitle, alertType === 'error' && styles.errorText]}>
                            {alertType === 'error' ? '¡Error!' : 'Aviso'}
                        </Text>
                        <Text style={styles.modalMessage}>{alertMessage}</Text>

                        <TouchableOpacity
                            style={[styles.modalButton, alertType === 'error' && styles.errorButton, { width: '100%', alignItems: 'center', marginTop: 10 }]}
                            onPress={() => setShowAlertModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ImageBackground
                source={require('../../assets/img/Fondo.jpg')}
                style={styles.background}
                imageStyle={{ opacity: 0.5 }}
            >
                <LinearGradient
                    colors={['#FFFFFF', '#FAB0A9']}
                    style={styles.gradienteVisible}
                />
                <StatusBar style="light" />

                <KeyboardAvoidingView
                    style={styles.flex}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={styles.header}>PARCHANDO</Text>

                        <View style={[styles.card, { zIndex: 1 }]}>
                            <View style={styles.tabContainer}>
                                <Animated.View
                                    style={[
                                        styles.slider,
                                        {
                                            transform: [
                                                {
                                                    translateX: slideAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 140],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                />
                                <TouchableOpacity style={styles.tab} onPress={() => handleTabPress('login')}>
                                    <Text style={activeTab === 'login' ? styles.activeTabText : styles.tabText}>
                                        Ingresar
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.tab} onPress={() => handleTabPress('register')}>
                                    <Text style={activeTab === 'register' ? styles.activeTabText : styles.tabText}>
                                        Registrarse
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.title}>Regístrate</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Nombre de usuario"
                                placeholderTextColor="#aaa"
                                value={username}
                                onChangeText={setUsername}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Correo electrónico"
                                placeholderTextColor="#aaa"
                                keyboardType="email-address"
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
                                placeholder="Confirmar contraseña"
                                placeholderTextColor="#aaa"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />

                            <TouchableOpacity style={[styles.button, { zIndex: 1 }]} onPress={handleRegister}>
                                <Text style={styles.buttonText}>Registrar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    background: { flex: 1, width: '100%' },
    gradienteVisible: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 250,
        zIndex: -1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    header: {
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        fontSize: 48,
        marginBottom: 30,
        color: '#000',
    },
    card: {
        width: '100%',
        backgroundColor: '#ffffffcc',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        width: 280,
        height: 60,
        backgroundColor: '#ccc',
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 20,
    },
    slider: {
        position: 'absolute',
        width: 140,
        height: '100%',
        backgroundColor: '#D32F2F',
        borderRadius: 30,
    },
    tab: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    tabText: { fontFamily: 'PlayfairDisplay_700Bold', color: '#333', fontSize: 18 },
    activeTabText: { fontFamily: 'PlayfairDisplay_700Bold', color: '#fff', fontSize: 18 },
    title: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 35,
        textAlign: 'center',
        marginBottom: 20,
        color: '#000',
    },
    input: {
        width: '100%',
        borderRadius: 10,
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#D32F2F',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'PlayfairDisplay_700Bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        width: '85%',
    },
    modalTitle: {
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        fontSize: 24,
        marginBottom: 10,
        color: '#000',
    },
    modalMessage: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#D32F2F',
        paddingVertical: 14,
        borderRadius: 30,
    },
    modalButtonText: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 18,
        color: '#fff',
    },
    errorText: {
        color: '#D32F2F',
    },
    errorButton: {
        backgroundColor: '#D32F2F',
    },
});

export default Register;