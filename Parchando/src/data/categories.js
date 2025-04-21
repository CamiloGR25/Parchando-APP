import { MaterialIcons, FontAwesome5, Ionicons, Feather, MaterialCommunityIcons, Entypo, } from '@expo/vector-icons';

const iconColor = '#000';
const iconSize = 35;

export const categories = [
    {
        id: 'bares',
        title: 'Bares',
        icon: (color = iconColor, size = iconSize) => (
            <FontAwesome5 name="beer" size={size} color={color} />
        ),
    },
    {
        id: 'karaoke',
        title: 'Karaoke',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialIcons name="mic" size={size} color={color} />
        ),
    },
    {
        id: 'discotecas',
        title: 'Discotecas',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialIcons name="nightlife" size={size} color={color} />
        ),
    },
    {
        id: 'artes',
        title: 'Arte',
        icon: (color = iconColor, size = iconSize) => (
            <Ionicons name="color-palette" size={size} color={color} />
        ),
    },
    {
        id: 'gastronomia',
        title: 'Gastronomía',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialIcons name="restaurant-menu" size={size} color={color} />
        ),
    },
    {
        id: 'cine',
        title: 'Cine',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialIcons name="movie" size={size} color={color} />
        ),
    },
    {
        id: 'conciertos',
        title: 'Conciertos',
        icon: (color = iconColor, size = iconSize) => (
            <Feather name="music" size={size} color={color} />
        ),
    },
    {
        id: 'deportes',
        title: 'Deportes',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialCommunityIcons name="soccer" size={size} color={color} />
        ),
    },
    {
        id: 'charlas',
        title: 'Charlas y Talleres',
        icon: (color = iconColor, size = iconSize) => (
            <Ionicons name="chatbox-ellipses" size={size} color={color} />
        ),
    },
    {
        id: 'ferias',
        title: 'Ferias y Expos',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialCommunityIcons name="storefront" size={size} color={color} />
        ),
    },
    {
        id: 'familia',
        title: 'Planes en Familia',
        icon: (color = iconColor, size = iconSize) => (
            <Ionicons name="people" size={size} color={color} />
        ),
    },
    {
        id: 'naturaleza',
        title: 'Naturaleza y Aire Libre',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialCommunityIcons name="tree" size={size} color={color} />
        ),
    },
    {
        id: 'moda',
        title: 'Moda y Diseño',
        icon: (color = iconColor, size = iconSize) => (
            <FontAwesome5 name="tshirt" size={size} color={color} />
        ),
    },
    {
        id: 'emprendimiento',
        title: 'Emprendimiento',
        icon: (color = iconColor, size = iconSize) => (
            <Feather name="briefcase" size={size} color={color} />
        ),
    },
    {
        id: 'teatro',
        title: 'Teatro',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialCommunityIcons name="theater" size={size} color={color} />
        ),
    },
    {
        id: 'museos',
        title: 'Museos y Exposiciones',
        icon: (color = iconColor, size = iconSize) => (
            <FontAwesome5 name="landmark" size={size} color={color} />
        ),
    },
    {
        id: 'festivales',
        title: 'Festivales',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialIcons name="celebration" size={size} color={color} />
        ),
    },
    {
        id: 'juegos',
        title: 'Juegos y Concursos',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialCommunityIcons name="gamepad" size={size} color={color} />
        ),
    },
    {
        id: 'mascotas',
        title: 'Mascotas',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialCommunityIcons name="dog" size={size} color={color} />
        ),
    },
    {
        id: 'otro',
        title: 'Otro',
        icon: (color = iconColor, size = iconSize) => (
            <MaterialCommunityIcons name="help-circle-outline" size={size} color={color} />
        ),
    }

];
