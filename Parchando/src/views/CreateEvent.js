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
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'; // Nueva importación
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getAuth } from 'firebase/auth';
import * as FileSystem from 'expo-file-system';
import { app } from '../service/firebaseConfig';
import { categories } from '../data/categories';
import { ServiceCreateEvent } from '../service/ServiceEvent';
import { LinearGradient } from 'expo-linear-gradient';

const MAX_IMAGE_SIZE = 1.5 * 1024 * 1024; // 1.5 MB

const CreateEvent = ({ navigation }) => {
    const [titulo, setTitulo] = useState('');
    const [subtitulo, setSubtitulo] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [displayDate, setDisplayDate] = useState('');

    const categoriasDisponibles = categories.map(c => c.title);

    useEffect(() => {
        setDisplayDate(formatDateTime(new Date()));
        (async () => {
            const { status: lib } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const { status: cam } = await ImagePicker.requestCameraPermissionsAsync();
            if (lib !== 'granted' || cam !== 'granted') {
                showError('Permite acceso a cámara y galería');
            }
        })();
    }, []);

    const showError = (message) => {
        setAlertMessage(message);
        setShowAlertModal(true);
    };

    const formatDateTime = dt => dt.toLocaleString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const showDatePicker = () => setDatePickerVisible(true);
    const hideDatePicker = () => setDatePickerVisible(false);
    const handleConfirm = selectedDate => {
        hideDatePicker();
        setDate(selectedDate);
        setDisplayDate(formatDateTime(selectedDate));
    };

    const compressAndResizeImage = async (uri) => {
        try {
            let compressedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 800 } }], // Redimensionar ancho máximo
                { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
            );

            // Verificar tamaño después de compresión
            const fileInfo = await FileSystem.getInfoAsync(compressedImage.uri);
            if (fileInfo.size > MAX_IMAGE_SIZE) {
                // Compresión adicional si sigue siendo grande
                compressedImage = await ImageManipulator.manipulateAsync(
                    compressedImage.uri,
                    [],
                    { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG }
                );
            }

            return compressedImage.uri;
        } catch (error) {
            console.error('Error comprimiendo imagen:', error);
            throw new Error('Error al procesar la imagen');
        }
    };

    const openGallery = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7, // Calidad inicial
            });

            if (!result.canceled) {
                const compressedUri = await compressAndResizeImage(result.assets[0].uri);
                setImageUri(compressedUri);
            }
        } catch (error) {
            showError('Error al procesar la imagen');
        }
    };

    const openCamera = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!result.canceled) {
                const compressedUri = await compressAndResizeImage(result.assets[0].uri);
                setImageUri(compressedUri);
            }
        } catch (error) {
            showError('Error al procesar la imagen');
        }
    };

    const pickImage = () => {
        // Aquí sí mantenemos Alert tradicional porque son opciones.
        Alert.alert(
            'Seleccionar imagen',
            '¿De dónde quieres seleccionar la imagen?',
            [
                { text: 'Galería', onPress: openGallery },
                { text: 'Cámara', onPress: openCamera },
                { text: 'Cancelar', style: 'cancel' },
                imageUri && {
                    text: 'Eliminar imagen',
                    style: 'destructive',
                    onPress: () => setImageUri(null),
                },
            ].filter(Boolean)
        );
    };

    const validate = () => {
        if (!titulo || !displayDate || !ubicacion || !descripcion || !categoria) {
            showError('Completa todos los campos.');
            return false;
        }
        return true;
    };

    const handleCreate = async () => {
        // Verificar montaje del componente
        let isMounted = true;
        try {
            // Validación básica
            if (!validate()) return;

            // Verificar usuario
            const user = getAuth().currentUser;
            if (!user || !user.uid) {
                showError('Debes iniciar sesión para crear eventos');
                return;
            }

            // Bloquear UI durante el proceso
            setIsLoading(true);

            // Procesar imagen
            let imageBase64 = null;
            if (imageUri) {
                try {
                    // Verificar existencia del archivo
                    const fileInfo = await FileSystem.getInfoAsync(imageUri);
                    if (!fileInfo.exists) {
                        throw new Error('La imagen seleccionada no existe');
                    }

                    // Convertir a Base64 con compresión
                    const base64 = await FileSystem.readAsStringAsync(imageUri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    // Validar tamaño Base64 (1.5MB máximo)
                    if (base64.length > 2 * 1024 * 1024) { // ~1.5MB en Base64
                        throw new Error('La imagen es demasiado grande (máximo 1.5MB)');
                    }

                    imageBase64 = `data:image/jpeg;base64,${base64}`;
                } catch (imageError) {
                    console.error('Error procesando imagen:', imageError);
                    throw new Error(`Error en la imagen: ${imageError.message}`);
                }
            }

            // Construir objeto de datos
            const eventData = {
                titulo: titulo.trim(),
                subtitulo: subtitulo.trim(),
                fecha: date.toISOString(),
                fechaDisplay: displayDate,
                ubicacion: ubicacion.trim(),
                descripcion: descripcion.trim(),
                categoria: categoria.trim(),
                image: imageBase64,
                userId: user.uid
            };

            // Validación adicional de datos
            if (!eventData.titulo || eventData.titulo.length < 5) {
                throw new Error('El título debe tener al menos 5 caracteres');
            }

            if (eventData.descripcion.length < 20) {
                throw new Error('La descripción debe tener al menos 20 caracteres');
            }

            // Llamar al servicio
            const response = await ServiceCreateEvent(user.uid, eventData);

            // Manejar respuesta del servicio
            if (!response) {
                throw new Error('No se recibió respuesta del servidor');
            }

            if (response.success) {
                if (isMounted) {
                    setModalSuccess(true);
                    // Resetear formulario después de 2 segundos
                    setTimeout(() => {
                        if (isMounted) {
                            setTitulo('');
                            setSubtitulo('');
                            setUbicacion('');
                            setDescripcion('');
                            setCategoria('');
                            setImageUri(null);
                        }
                    }, 2000);
                }
            } else {
                throw new Error(response.error || 'Error desconocido al crear el evento');
            }

        } catch (error) {
            console.error('Error completo:', error);
            if (isMounted) {
                showError(
                    error.message.startsWith('Error en la imagen')
                        ? error.message
                        : `Error al crear evento: ${error.message}`
                );
            }
        } finally {
            if (isMounted) {
                setIsLoading(false);
            }
        }

        // Cleanup para evitar actualizaciones de estado desmontado
        return () => { isMounted = false };
    };

    return (
        <View style={styles.backgroundContainer}>
            <ImageBackground source={require('../../assets/img/Fondo.jpg')} style={styles.bg} imageStyle={{ opacity: 0.8 }}>
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(250, 176, 169, 0.7)']}
                    style={styles.gradientOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0.8, 1]}
                >

                    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back} disabled={isLoading}>
                                <Ionicons name='arrow-back' size={28} color='#fff' />
                            </TouchableOpacity>
                            <Text style={styles.title}>Configuración y actividad</Text>
                        </View>
                        <Text style={styles.sectionTitle}>Crear eventos</Text>
                        <TouchableOpacity style={styles.imgBox} onPress={pickImage} disabled={isLoading}>
                            {imageUri ? (
                                <>
                                    <Image source={{ uri: imageUri }} style={styles.img} />
                                    <View style={styles.overlay}>
                                        <Ionicons name='camera' size={24} color='#fff' />
                                        <Text style={styles.overlayText}>Cambiar imagen</Text>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Ionicons name='camera-outline' size={60} color='#333' />
                                    {/*<Text style={styles.addImageText}>Agregar imagen</Text>*/}
                                </>
                            )}
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode='datetime'
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                            locale='es-ES'
                            minimumDate={new Date()}
                        />

                        <TouchableOpacity style={styles.input} onPress={showDatePicker} disabled={isLoading}>
                            <Text style={{ color: displayDate ? '#000' : '#999' }}>{displayDate || 'Seleccionar fecha y hora*'}</Text>
                        </TouchableOpacity>

                        <TextInput placeholder='Título*' style={styles.input} value={titulo} onChangeText={setTitulo} editable={!isLoading} />
                        <TextInput placeholder='Subtítulo' style={styles.input} value={subtitulo} onChangeText={setSubtitulo} editable={!isLoading} />
                        <TextInput placeholder='Ubicación*' style={styles.input} value={ubicacion} onChangeText={setUbicacion} editable={!isLoading} />
                        <TextInput placeholder='Descripción*' multiline style={[styles.input, { height: 100, textAlignVertical: 'top' }]} value={descripcion} onChangeText={setDescripcion} editable={!isLoading} />

                        <Text style={styles.sub}>Categoría*</Text>
                        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)} disabled={isLoading}>
                            <Text style={{ color: categoria ? '#000' : '#999' }}>{categoria || 'Seleccionar categoría'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.btn, isLoading && { opacity: 0.6 }]} onPress={handleCreate} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color='#fff' />
                            ) : (
                                <Text style={styles.btnText}>Crear evento</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>

                    {/* Modal de categorías */}
                    <Modal
                        animationType="slide"
                        transparent={true}
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
                                    {categoriasDisponibles.map((cat, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.modalItem}
                                            onPress={() => {
                                                setCategoria(cat);
                                                setModalVisible(false);
                                            }}
                                        >
                                            <Text style={styles.modalItemText}>{cat}</Text>
                                        </TouchableOpacity>
                                    ))}
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={styles.modalCancelar}
                                    >
                                        <Text style={styles.modalCancelarText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    {/* Modal de éxito */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalSuccess}
                        onRequestClose={() => {
                            setModalSuccess(false);
                            navigation.goBack();
                        }}
                    >
                        <View style={styles.modalOverlaySuccess}>
                            <View style={styles.modalContentSuccess}>
                                <Ionicons name="checkmark-circle" size={60} color="#4CAF50" style={styles.successIcon} />
                                <Text style={styles.modalTitleSuccess}>¡Evento creado!</Text>
                                <Text style={styles.modalSubtitleSuccess}>Tu evento fue registrado exitosamente.</Text>
                                <TouchableOpacity
                                    style={styles.modalButtonSuccess}
                                    onPress={() => {
                                        setModalSuccess(false);
                                        navigation.goBack();
                                    }}
                                >
                                    <Text style={styles.modalButtonTextSuccess}>Listo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Modal de error */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={showAlertModal}
                        onRequestClose={() => setShowAlertModal(false)}
                    >
                        <View style={styles.modalOverlaySuccess}>
                            <View style={styles.modalContentSuccess}>
                                <Ionicons name="alert-circle" size={60} color="#D32F2F" style={styles.successIcon} />
                                <Text style={styles.modalTitleSuccess}>¡Error!</Text>
                                <Text style={styles.modalSubtitleSuccess}>{alertMessage}</Text>
                                <TouchableOpacity
                                    style={styles.modalButtonSuccess}
                                    onPress={() => setShowAlertModal(false)}
                                >
                                    <Text style={styles.modalButtonTextSuccess}>Cerrar</Text>
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
    bg: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    gradientOverlay: {
        flex: 1,
    },
    container: {
        padding: 30,
        paddingBottom: 60
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25
    },
    back: {
        width: 40,
        height: 40,
        top: 10,
        borderRadius: 20,
        backgroundColor: '#D32F2F',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        color: '#D32F2F',
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        top:10,
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        color: '#000',
        marginLeft: 10
    },
    imgBox: {
        backgroundColor: '#ffffffcc',
        height: 150,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    overlay: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayText: {
        color: '#fff',
        marginTop: 5,
        fontFamily: 'PlayfairDisplay_500Medium',
        fontSize: 14,
    },
    addImageText: {
        marginTop: 8,
        color: '#333',
        fontFamily: 'PlayfairDisplay_400Regular',
    },
    input: {
        backgroundColor: '#ffffffcc',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 15,
        color: '#000',
        fontFamily: 'PlayfairDisplay_400Regular'
    },
    sub: {
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_700Bold',
        marginBottom: 10,
        color: '#000'
    },
    btn: {
        backgroundColor: '#D32F2F',
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'PlayfairDisplay_700Bold'
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    modalWrapper: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
        paddingBottom: 20,
    },
    modalHandle: {
        width: 50,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: 10,
    },
    modalContent: {
        paddingHorizontal: 20,
    },
    modalItem: {
        paddingVertical: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    modalItemText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'PlayfairDisplay_500Medium',
    },
    modalCancelar: {
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    modalCancelarText: {
        color: '#D32F2F',
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 16,
    },
    modalOverlaySuccess: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    modalContentSuccess: {
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 350,
    },
    successIcon: {
        marginBottom: 15,
    },
    modalTitleSuccess: {
        fontSize: 22,
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 10,
    },
    modalSubtitleSuccess: {
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtonSuccess: {
        backgroundColor: '#D32F2F',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    modalButtonTextSuccess: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_700Bold',
    },
});

export default CreateEvent;