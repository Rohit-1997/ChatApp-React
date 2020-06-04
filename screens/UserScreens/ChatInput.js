import * as React from 'react';
import {View, Text, TextInput, ScrollView, Dimensions} from 'react-native';
import {Icon} from 'native-base';


export default function ChatInput(props) {
    const [chatText, setChatText] = React.useState('');

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
        <View style={{ flexDirection: 'row',  backgroundColor: '#fff', borderRadius: 10, width: Dimensions.get('window').width}}>
            <View style={{ backgroundColor: '#fafafa', borderRadius: 15, padding: 5}}>
                <TextInput
                    onChangeText={setChatText}
                    value={chatText}
                    multiline={true}
                    onFocus={inputTextOnFocus}
                    placeholder='Type a message....'
                    placeholderTextColor='#000'
                    style={{ width: Dimensions.get('window').width-70, fontSize: 14,}}
                    numberOfLines={2}
                />
            </View>
        <Icon name="md-send" style={{ paddingLeft: 10, fontSize: 40, alignSelf: 'center'}} onPress={handleSend}/>
        </View>
    )
}