import * as React from 'react';
import {View, Text, TextInput, ScrollView, Dimensions, Platform, KeyboardAvoidingView} from 'react-native';
import {Icon} from 'native-base';
import ChatInputMenu from './ChatInputMenu';




export default function ChatInput(props) {
    const [chatText, setChatText] = React.useState('');
    const keyboardVerticalOffset = Platform.OS === 'ios' ? Dimensions.get('window').height/6 + 50 : (0);

    
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
        <KeyboardAvoidingView 
            keyboardVerticalOffset = { keyboardVerticalOffset }
            style={{ flexDirection: 'row',  backgroundColor: '#fff', borderRadius: 10, width: Dimensions.get('window').width}}>
            <View style={{ backgroundColor: '#fafafa', borderRadius: 15, padding: 4, flexDirection: 'row'}}>
                <TextInput
                    onChangeText={setChatText}
                    value={chatText}
                    multiline={true}
                    onFocus={inputTextOnFocus}
                    placeholder='Type a message....'
                    placeholderTextColor='#000'
                    style={{ width: Dimensions.get('window').width-80, fontSize: 14,}}
                    numberOfLines={2}
                />
                <View style={{ paddingRight: 15 }}>
                <ChatInputMenu senderName={props.senderName}  parent={props.parent} docKey={props.docKey}/>
                </View>
            </View>
        <Icon name="md-send" style={{ paddingLeft: 9, fontSize: 40, alignSelf: 'center'}} onPress={handleSend}/>
        </KeyboardAvoidingView>
    )
}