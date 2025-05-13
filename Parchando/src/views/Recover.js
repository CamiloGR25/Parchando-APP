import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { resetPassword } from '../service/ServiceAuth';
import { LinearGradient } from 'expo-linear-gradient';

const Recover = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const handleReset = async () => {
        if (!email) {
            setAlertMessage('Por favor, ingresa tu correo electrónico.');
            setAlertType('error');
            setShowAlertModal(true);
            return;
        }
        const result = await resetPassword(email);
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
                animationType="fade"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Correo enviado</Text>
                        <Text style={styles.modalSubTitle}>
                            Hemos enviado un enlace para restablecer tu contraseña.
                        </Text>
                        <TouchableOpacity
                            style={[styles.modalButton, { zIndex: 1 }]}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.goBack();
                            }}
                        >
                            <Text style={styles.modalButtonText}>Listo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de alerta de error */}
            <Modal
                visible={showAlertModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAlertModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={[styles.modalTitle, alertType === 'error' && styles.errorText]}>
                            {alertType === 'error' ? '¡Error!' : 'Aviso'}
                        </Text>
                        <Text style={styles.modalSubTitle}>{alertMessage}</Text>

                        <TouchableOpacity
                            style={[styles.modalButton, alertType === 'error' && styles.errorButton]}
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
                imageStyle={{ opacity: 0.6 }}
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
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={styles.header}>PARCHANDO</Text>

                        <View style={[styles.card, { zIndex: 1 }]}>
                            <Text style={styles.title}>Recuperar cuenta</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Correo electrónico"
                                placeholderTextColor="#aaa"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <TouchableOpacity style={styles.button} onPress={handleReset}>
                                <Text style={styles.buttonText}>Enviar código</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.linkText}>Volver a iniciar sesión</Text>
                        </TouchableOpacity>
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
        marginBottom: 20,
    },
    title: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 28,
        marginBottom: 20,
        color: '#000',
    },
    input: {
        width: '100%',
        borderRadius: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#D32F2F',
        paddingVertical: 14,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'PlayfairDisplay_700Bold',
    },
    linkText: {
        marginTop: 15,
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 16,
        textDecorationLine: 'underline',
        color: '#000',
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
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        fontSize: 24,
        marginBottom: 10,
    },
    modalSubTitle: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
    },
    modalButton: {
        backgroundColor: '#D32F2F',
        padding: 12,
        borderRadius: 20,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_700Bold',
    },
    errorText: {
        color: '#D32F2F',
    },
    errorButton: {
        backgroundColor: '#D32F2F',
    },
});

export default Recover;