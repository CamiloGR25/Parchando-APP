import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../data/categories';
import { getAuth } from 'firebase/auth';
import { ServiceCreateEvent } from '../service/ServiceEvent';
import * as ImagePicker from 'expo-image-picker';

const CreateEvent = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagenUri, setImagenUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const categoriasDisponibles = categories.map(c => c.title);

  useEffect(() => {
    (async () => {
      const { status: libStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: camStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (libStatus !== 'granted' || camStatus !== 'granted') {
        Alert.alert('Permisos necesarios', 'Debes permitir acceso a cámara y galería');
      }
    })();
  }, []);

  const elegirDeGaleria = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.cancelled) setImagenUri(result.uri);
  };

  const tomarFoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.cancelled) setImagenUri(result.uri);
  };

  const handleCreateEvent = async () => {
    const user = getAuth().currentUser;
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado.');
      return;
    }
    if (!titulo || !fecha || !ubicacion || !descripcion || !categoria) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos.');
      return;
    }
    const eventData = { titulo, subtitulo, fecha, ubicacion, descripcion, categoria, image: imagenUri, userId: user.uid };
    const result = await ServiceCreateEvent(user.uid, eventData);
    if (result.success) setModalSuccess(true);
    else Alert.alert('Error', 'Error al guardar el evento: ' + result.error);
  };

  return (
    <ImageBackground
      source={require('../../assets/img/Fondo.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.6 }}
    >
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.flechaCirculo}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.titulo}>Crear evento</Text>
          </View>

          <View style={styles.imagenContainer}>
            {imagenUri
              ? <Image source={{ uri: imagenUri }} style={styles.previewImage} />
              : <Ionicons name="camera-outline" size={60} color="#333" />
            }
            <View style={styles.imagenButtons}>
              <TouchableOpacity onPress={elegirDeGaleria}>
                <Text style={styles.imagenBtnText}>Galería</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={tomarFoto}>
                <Text style={styles.imagenBtnText}>Cámara</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            placeholder="Título del evento"
            style={styles.input}
            placeholderTextColor="#999"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            placeholder="Subtítulo"
            style={styles.input}
            placeholderTextColor="#999"
            value={subtitulo}
            onChangeText={setSubtitulo}
          />
          <TextInput
            placeholder="Fecha y hora"
            style={styles.input}
            placeholderTextColor="#999"
            value={fecha}
            onChangeText={setFecha}
          />
          <TextInput
            placeholder="Ubicación"
            style={styles.input}
            placeholderTextColor="#999"
            value={ubicacion}
            onChangeText={setUbicacion}
          />
          <TextInput
            placeholder="Descripción"
            multiline
            numberOfLines={4}
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholderTextColor="#999"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <Text style={styles.subtitulo}>Categoría</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: categoria ? '#000' : '#999' }}>
              {categoria || 'Seleccionar categoría'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonCrear} onPress={handleCreateEvent}>
            <Text style={styles.textoBoton}>Crear</Text>
          </TouchableOpacity>

          {/* Modal Categorías */}
          <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPressOut={() => setModalVisible(false)}
            >
              <View style={styles.modalWrapper}>
                <View style={styles.modalHandle} />
                <ScrollView contentContainerStyle={styles.modalContent}>
                  {categoriasDisponibles.map((cat, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.modalItem}
                      onPress={() => { setCategoria(cat); setModalVisible(false); }}
                    >
                      <Text style={styles.modalItemText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancelar}>
                    <Text style={styles.modalCancelarText}>Cancelar</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Modal Éxito */}
          <Modal
            animationType="fade"
            transparent
            visible={modalSuccess}
            onRequestClose={() => setModalSuccess(false)}
          >
            <View style={styles.modalOverlaySuccess}>
              <View style={styles.modalContentSuccess}>
                <Text style={styles.modalTitleSuccess}>¡Evento creado!</Text>
                <Text style={styles.modalSubtitleSuccess}>
                  Tu evento fue registrado exitosamente.
                </Text>
                <TouchableOpacity
                  style={styles.modalButtonSuccess}
                  onPress={() => { setModalSuccess(false); navigation.goBack(); }}
                >
                  <Text style={styles.modalButtonTextSuccess}>Listo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1, width: '100%' },
  scrollContent: { flexGrow: 1, padding: 30 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 22, fontFamily: 'PlayfairDisplay_800ExtraBold', color: '#000', marginLeft: 15 },
  flechaCirculo: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D32F2F', justifyContent: 'center', alignItems: 'center' },
  imagenContainer: { backgroundColor: '#ffffffcc', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20 },
  previewImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 10 },
  imagenButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  imagenBtnText: { fontFamily: 'PlayfairDisplay_700Bold', color: '#D32F2F' },
  input: { backgroundColor: '#ffffffcc', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, fontFamily: 'PlayfairDisplay_400Regular', marginBottom: 15, color: '#000' },
  subtitulo: { fontSize: 16, fontFamily: 'PlayfairDisplay_700Bold', marginBottom: 10, color: '#000' },
  botonCrear: { backgroundColor: '#D32F2F', borderRadius: 30, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  textoBoton: { color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalWrapper: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%', paddingBottom: 20 },
  modalHandle: { width: 50, height: 5, backgroundColor: '#ccc', borderRadius: 3, alignSelf: 'center', marginVertical: 10 },
  modalContent: { paddingHorizontal: 20 },
  modalItem: { paddingVertical: 12, borderBottomColor: '#eee', borderBottomWidth: 1 },
  modalItemText: { fontSize: 16, color: '#000', fontFamily: 'PlayfairDisplay_500Medium' },
  modalCancelar: { paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  modalCancelarText: { color: '#D32F2F', fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16 },
  modalOverlaySuccess: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  modalContentSuccess: { backgroundColor: '#fff', borderRadius: 30, padding: 30, alignItems: 'center', width: '100%', maxWidth: 350 },
  modalTitleSuccess: { fontSize: 22, fontFamily: 'PlayfairDisplay_800ExtraBold', marginBottom: 10, color: '#000' },
  modalSubtitleSuccess: { fontSize: 16, fontFamily: 'PlayfairDisplay_400Regular', color: '#555', textAlign: 'center', marginBottom: 20 },
  modalButtonSuccess: { backgroundColor: '#D32F2F', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30 },
  modalButtonTextSuccess: { color: '#fff', fontSize: 16, fontFamily: 'PlayfairDisplay_700Bold' }
});

export default CreateEvent;