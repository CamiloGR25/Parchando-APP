import React, { useState } from 'react';
import {View, Text, TextInput,TouchableOpacity,StyleSheet,ImageBackground,Modal, BackHandler,} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../service/firebaseConfig';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'error' or 'success'

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setAlertMessage('Completa todos los campos.');
      setAlertType('error');
      setShowAlertModal(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertMessage('Las contraseñas nuevas no coinciden.');
      setAlertType('error');
      setShowAlertModal(true);
      return;
    }

    const user = auth.currentUser;

    if (user?.email) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setAlertMessage('Contraseña actualizada correctamente');
        setAlertType('success');
        setShowAlertModal(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        navigation.goBack();
      } catch (error) {
        setAlertMessage(error.message);
        setAlertType('error');
        setShowAlertModal(true);  
        
      }
    } else {
      setAlertMessage('No hay usuario autenticado.');
      setAlertType('error');
      setShowAlertModal(true);
    }
  };

  const confirmExit = () => {
    setShowConfirmModal(false);
    navigation.goBack();
  };

  // Manejo del botón físico "atrás"
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setShowConfirmModal(true);
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <ImageBackground
      source={require('../../assets/img/Fondo.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.6 }}
    >
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowConfirmModal(true)} style={styles.flechaCirculo}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.header1Container}>
        <Text style={styles.header1}>PARCHANDO</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.subtitulo}>Cambiar Contraseña</Text>

          <TextInput
            style={styles.input}
            placeholder="Contraseña actual"
            placeholderTextColor="#888"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            placeholderTextColor="#888"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar nueva contraseña"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de confirmación */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¿DESEA VOLVER SIN CAMBIAR LA CONTRASEÑA?</Text>
            <Text style={styles.modalMessage}>Si acepta, se perderán sus cambios</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonNo} onPress={confirmExit}>
                <Text style={styles.modalButtonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonYes} onPress={() => setShowConfirmModal(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de alerta (error o éxito) */}
      <Modal
        visible={showAlertModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAlertModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, alertType === 'error' && styles.errorText]}>
              {alertType === 'error' ? '¡Error!' : 'Éxito'}
            </Text>
            <Text style={styles.modalMessage}>{alertMessage}</Text>

            <TouchableOpacity
              style={[styles.modalButtonYes, alertType === 'error' && styles.errorButton]}
              onPress={() => setShowAlertModal(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
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
  flechaCirculo: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header1Container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  header1: {
    fontFamily: 'PlayfairDisplay_800ExtraBold',
    textAlign: 'center',
    fontSize: 48,
    marginBottom: 30,
    color: '#000',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffffcc',
    borderRadius: 20,
    padding: 24,
  },
  subtitulo: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_800ExtraBold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
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
  errorText: {
    color: '#D32F2F',
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
  errorButton: {
    backgroundColor: '#D32F2F',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChangePassword;
