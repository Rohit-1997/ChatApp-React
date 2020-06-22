import * as React from 'react';
import {  Image, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DisplayImage(props) {
    const [imageURI, setImageUri] = React.useState(null);
    const navigation = useNavigation();

    React.useEffect(() => {
        setImageUri(props.imageuri);
        return () => {
            setImageUri(null);
        }
    }, [props.imageuri])


    // The function to handle the image press
    function handleImagePress() {
        navigation.navigate("Image Download", {
            "imageuri": imageURI
        })
    }


    return (
        <TouchableOpacity onPress={handleImagePress}>
            {(imageURI)? (<Image source={{ uri: imageURI }} style={styles.imageStyle}/>) : 
            (<React.Fragment></React.Fragment>)}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    imageStyle: {
        width: Dimensions.get('window').width-100,
        height: 200,
        borderRadius: 15
    }
})