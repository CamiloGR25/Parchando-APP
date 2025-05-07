import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Animated,
    Easing,
    Modal,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
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
        if (!username || !email || !password || !confirmPassword) {
            return Alert.alert('Campos requeridos', 'Completa todos los campos');
        }
        if (password !== confirmPassword) {
            return Alert.alert('Contraseñas no coinciden', 'Verifica las contraseñas');
        }
        const result = await registerUser({ username, email, password });
        if (result.success) setModalVisible(true);
        else Alert.alert('Error', result.error);
    };

    return (
        <>
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
                            style={styles.modalButton}
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

            <ImageBackground
                source={require('../../assets/img/Fondo.jpg')}
                style={styles.background}
                imageStyle={{ opacity: 0.5 }}
            >
                {/* Gradiente en la parte inferior */}
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
                            {/* Pestañas */}
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
    },
    buttonText: { color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center' },
    modalTitle: { fontSize: 22, fontFamily: 'PlayfairDisplay_800ExtraBold', marginBottom: 15 },
    modalButton: { backgroundColor: '#D32F2F', padding: 12, borderRadius: 20 },
    modalButtonText: { color: '#fff', fontFamily: 'PlayfairDisplay_700Bold' },
});

export default Register;