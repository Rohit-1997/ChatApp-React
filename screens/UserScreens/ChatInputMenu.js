/*
    This file is for building the pop up menu in the text input
    The menu has an option to pick images, files
*/
import * as React from 'react';
import { Text, View } from 'react-native';
import { MenuContext, Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { Icon } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useNavigationState } from '@react-navigation/native';

export default function ChatInputMenu(props) {
    const navigation = useNavigation();

    // The function to handle the images select
    async function handleImageSelect() {
        // Asking the permission from the user
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        console.log("The status of the permission is: ", status);
        if (status !== 'granted') return;
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        })
        console.log("The result of the image picked: ", result);

        // if the user selects nothing
        if (result.cancelled) return;

        // Navigating the users to the image share screen
        navigation.navigate("Images Share", {
            "image": result,
            "senderName": props.senderName.split(" ")[0],
            "parent": props.parent,
            "docKey": props.docKey
        });
     }

    
    return (
            <View>
                <Menu>
                    <MenuTrigger>
                        <Icon name="md-attach"/>
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => handleImageSelect()} text="Images" />
                        <MenuOption onSelect={() => alert(`Files`)} text="Files" />
                        <MenuOption onSelect={() => alert(`Camera`)} text="Camera" />
                    </MenuOptions>
                </Menu>
            </View>
    )
}