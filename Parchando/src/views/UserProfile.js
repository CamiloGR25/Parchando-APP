import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  BackHandler,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../service/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const UserProfile = ({ navigation }) => {
  const user = auth.currentUser;

  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const confirmExit = () => {
    setShowConfirmModal(false);
    navigation.goBack();
  };

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
          <Text style={styles.subtitulo}>Perfil del Usuario</Text>

          <Text style={styles.label}>Correo electrónico:</Text>
          <Text style={styles.info}>{user?.email || 'No disponible'}</Text>

          <Text style={styles.label}>ID de usuario:</Text>
          <Text style={styles.info}>{user?.uid || 'No disponible'}</Text>

          {/* Se pueden añadir mas datos muchachos */}
        </View>
      </View>

      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¿Desea salir del perfil?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonNo} onPress={confirmExit}>
                <Text style={styles.modalButtonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonYes}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
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
  label: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
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

export default UserProfile;
