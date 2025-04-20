import { StatusBar } from "expo-status-bar";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";

const Main = ({ navigation }) => {
    return (
        <ImageBackground source={require('../../assets/img/Fondo.jpg')}
            style={styles.fondo}
            resizeMode="cover"
            imageStyle={{ opacity: 0.65 }}
        >
            <StatusBar style="light" />
            <View style={styles.container}>
                <Text style={styles.texto}>PARCHANDO</Text>
                <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.textoboton}>Ingresar</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.enlaceCrearCuenta}>
                <Text style={styles.textoNegro}>¿No tienes cuenta?</Text>
                <Text style={styles.textoRojo}>Crear cuenta</Text>
            </TouchableOpacity>

        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between", // Distribuye: arriba - centro - abajo
        alignItems: "center",
        paddingVertical: 60, // espacio arriba y abajo
        backgroundColor: "transparent",
    },
    texto: {
        fontSize: 48,
        //fontWeight: "bold",
        fontFamily: 'PlayfairDisplay_800ExtraBold',
        color: "#000000",
        textAlign: "center",
        marginTop: "30%",
    },
    boton: {
        backgroundColor: "#D32F2F", // rojo fuerte
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 30, // redondeado
        width: "80%",
        alignItems: "center",
    },
    textoboton: {
        fontSize: 25,
        //fontWeight: "bold",
        fontFamily: 'PlayfairDisplay_700Bold',
        color: "#FFFFFF",
        textAlign: "center",
    },
    fondo: {
        flex: 1,
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    enlaceCrearCuenta: {
        alignItems: "center",
        marginBottom: 25,
    },
    textoNegro: {
        fontSize: 16,
        color: "#000000",
        fontFamily: 'PlayfairDisplay_700Bold',
    },
    textoRojo: {
        fontSize: 16,
        color: "#D32F2F",
        fontFamily: 'PlayfairDisplay_700Bold',
        textDecorationLine: "underline",
    },

});

export default Main;