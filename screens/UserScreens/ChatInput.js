import * as React from 'react';
import { View, TextInput, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { Icon } from 'native-base';
import { Keyboard } from 'react-native';
import ChatInputMenu from './ChatInputMenu';


export default function ChatInput(props) {
    const [chatText, setChatText] = React.useState('');
    const [kh, setkh] = React.useState(0)
    const inputheight = 0


    React.useEffect(() => {
        let keyboardDidShowListener
        let keyboardDidHideListener
        function keyboardListener() {
            if (Platform.OS === "ios") {
                keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
                keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
            }
        }
        keyboardListener()
        return () => {
            if (Platform.OS === "ios") {
                keyboardDidShowListener.remove();
                keyboardDidHideListener.remove()
            }
        }
    }, [])

    function _keyboardDidShow(e) {
        setkh(e.endCoordinates.height);
        props.keyboardToggle(e.endCoordinates.height)
    }

    function _keyboardDidHide(e) {
        setkh(0);
        props.keyboardToggle(0)
    }

    function messageValid(text) {
        return (text && text.replace(/\s/g, '').length);
    }

    // This function is to handle the message send action
    function handleSend() {
        if (messageValid(chatText)) {
            props.onSubmit(chatText);
            setChatText('');
        }
    }

    // The function to handle the input onfoucs method
    function inputTextOnFocus() {
        props.userClickedInput();
    }

    return (
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, width: Dimensions.get('window').width }}>
            <View style={{ backgroundColor: '#fafafa', borderRadius: 15, padding: 4, flexDirection: 'row' }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{ flexDirection: 'row' }}
                    keyboardVerticalOffset={300} enabled>
                    <TextInput
                        onChangeText={setChatText}
                        value={chatText}
                        multiline={true}
                        onFocus={inputTextOnFocus}
                        placeholder='Type a message....'
                        placeholderTextColor='#000'
                        style={{ width: Dimensions.get('window').width - 70, fontSize: 14, marginBottom: kh + inputheight }}
                        numberOfLines={2}
                    />
                    <View style={{ paddingRight: 10, alignItems: 'center' }}>
                        <ChatInputMenu senderName={props.senderName} parent={props.parent} docKey={props.docKey} />
                    </View>
                </KeyboardAvoidingView>
            </View>
            <Icon name="md-send" style={{ padding: 0, fontSize: 40, alignSelf: 'center', marginBottom: kh + inputheight }} onPress={handleSend} />
        </View>
    )
}