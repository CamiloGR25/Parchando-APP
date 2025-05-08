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
    Image,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../service/firebaseConfig';
import { categories } from '../data/categories';
import { ServiceCreateEvent } from '../service/ServiceEvent';

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

    // Date picker
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
                Alert.alert('Permisos', 'Permite acceso a cámara y galería');
            }
        })();
    }, []);

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

    // abre la galería
    const openGallery = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],   // ← array de strings
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error al seleccionar imagen:', error);
            Alert.alert('Error', 'No se pudo abrir la galería.');
        }
    };

    // abre la cámara
    const openCamera = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error al abrir cámara:', error);
            Alert.alert('Error', 'No se pudo abrir la cámara.');
        }
    };

    // desplegar opciones
    const pickImage = () => {
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
            Alert.alert('Error', 'Completa todos los campos');
            return false;
        }
        return true;
    };

    const handleCreate = async () => {
        if (!validate()) return;
        const user = getAuth().currentUser;
        if (!user) { Alert.alert('Error', 'Inicia sesión'); return; }
        setIsLoading(true);

        let imageUrl = '';
        try {
            if (imageUri) {
                const response = await fetch(imageUri);
                const blob = await response.blob();
                const storage = getStorage(app);
                const ref = storageRef(storage, `events/${user.uid}/${Date.now()}.jpg`);
                await uploadBytes(ref, blob);
                imageUrl = await getDownloadURL(ref);
            }

            const data = {
                titulo: titulo.trim(),
                subtitulo: subtitulo.trim(),
                fecha: date.toISOString(),
                fechaDisplay: displayDate,
                ubicacion: ubicacion.trim(),
                descripcion: descripcion.trim(),
                categoria,
                image: imageUrl,
                userId: user.uid
            };

            const res = await ServiceCreateEvent(user.uid, data);
            if (res.success) setModalSuccess(true);
            else throw new Error(res.error);
        } catch (error) {
            console.error('Error al crear evento:', error);
            Alert.alert('Error', `No se pudo crear el evento: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground source={require('../../assets/img/Fondo.jpg')} style={styles.bg} imageStyle={{ opacity: 0.6 }}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back} disabled={isLoading}>
                        <Ionicons name='arrow-back' size={28} color='#fff' />
                    </TouchableOpacity>
                    <Text style={styles.title}>Crear evento</Text>
                </View>

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
                            <Text style={styles.addImageText}>Agregar imagen</Text>
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

            {/* MODAL de categorías */}
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

            {/* MODAL de éxito */}
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
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        width: '100%',
        height: '100%'
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
        borderRadius: 20,
        backgroundColor: '#D32F2F',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 22,
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        color: '#000',
        marginLeft: 15
    },
    imgBox: {
        backgroundColor: '#ffffffcc',
        height: 200,
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