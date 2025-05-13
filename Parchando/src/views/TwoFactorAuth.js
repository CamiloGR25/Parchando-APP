import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../service/firebaseConfig';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { sendEmailVerification } from "firebase/auth";
import { loginUser } from '../service/ServiceAuth';
import { LinearGradient } from 'expo-linear-gradient';

const db = getFirestore();

const TwoFactorAuth = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const userRef = doc(db, 'user', auth.currentUser.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const userEmail = userData.email;
                    if (!userEmail) throw new Error('Correo electrónico no registrado.');
                    setEmail(userEmail);
                } else {
                    throw new Error('No se encontró un correo electrónico registrado para este usuario.');
                }
            } catch (error) {
                setAlertMessage(error.message);
                setAlertType('error');
                setShowModal(false);
            }
        };

        fetchEmail();
    }, []);

    const sendVerification = async () => {
        try {
            await sendEmailVerification(auth.currentUser);
            setAlertMessage('Se envió un correo de verificación. Revisa tu bandeja de entrada.');
            setAlertType('success');
            setShowModal(true);
        } catch (error) {
            setAlertMessage(error.message);
            setAlertType('error');
            setShowModal(true);
        }
    };

    const checkVerification = async () => {
        try {
            await auth.currentUser.reload(); // actualiza el estado del usuario
            if (auth.currentUser.emailVerified) {
                setAlertMessage('Correo verificado con éxito.');
                setAlertType('success');
                setShowModal(true);

                setTimeout(() => {
                    navigation.replace('Start');
                }, 1500);
            } else {
                setAlertMessage('El correo aún no ha sido verificado. Intenta de nuevo.');
                setAlertType('error');
                setShowModal(true);
            }
        } catch (error) {
            setAlertMessage(error.message);
            setAlertType('error');
            setShowModal(true);
        }
    };

    return (
        <View style={styles.backgroundContainer}>
            <ImageBackground
                source={require('../../assets/img/Fondo.jpg')}
                style={styles.fondo}
                imageStyle={{ opacity: 0.8 }}
            >
                <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.flechaCirculo}>
                            <Ionicons name="arrow-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Verificación de correo</Text>
                    </View>

                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(247, 185, 179, 0.7)']}
                    style={styles.gradientOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0.7, 1]}
                >

                    <StatusBar style="dark" />
                    <View style={styles.container}>


                        <TouchableOpacity style={styles.button} onPress={sendVerification}>
                            <Text style={styles.buttonText}>Enviar correo de verificación</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={checkVerification}>
                            <Text style={styles.buttonText}>Ya verifiqué el correo</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal visible={showModal} transparent animationType="fade">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={[styles.modalTitle, alertType === 'error' && styles.errorText]}>
                                    {alertType === 'error' ? '¡Error!' : 'Éxito'}
                                </Text>
                                <Text style={styles.modalMessage}>{alertMessage}</Text>
                                <TouchableOpacity
                                    style={[styles.modalButton, alertType === 'error' && styles.errorButton]}
                                    onPress={() => setShowModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cerrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundContainer: {
    flex: 1,
  },
    fondo: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingTop: 60,
    },header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        marginLeft: 10,
    },
    gradientOverlay: {
    flex: 1,
  },
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    flechaCirculo: {
        width: 40,
        height: 40,
        borderRadius: 25,
        top: '20%',
        backgroundColor: '#D32F2F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        top: '20%',
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        marginLeft: 8,
        color: '#000',
    },
    button: {
        backgroundColor: '#D32F2F',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'PlayfairDisplay_700Bold',
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
    modalButton: {
        backgroundColor: '#D32F2F',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: '#D32F2F',
    },
    errorButton: {
        backgroundColor: '#D32F2F',
    },
});

export default TwoFactorAuth;
