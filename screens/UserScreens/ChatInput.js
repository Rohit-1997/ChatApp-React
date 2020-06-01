import * as React from 'react';
import {View, Text, TextInput, ScrollView, Dimensions} from 'react-native';
import {Icon} from 'native-base';


export default function ChatInput(props) {
    const [chatText, setChatText] = React.useState('');

    function messageValid(text) {
        return (text && text.replace(/\s/g, '').length);
    }


    function handleSend() {
        if (messageValid(chatText)) {
            props.onSubmit(chatText);
            setChatText('');
        }
    }

    return (
        <View style={{ flexDirection: 'row',  backgroundColor: '#fff', borderRadius: 5, width: Dimensions.get('window').width}}>
            <View style={{ backgroundColor: '#e1e1e1', borderRadius: 15, padding: 5}}>
                <TextInput
                    onChangeText={setChatText}
                    value={chatText}
                    multiline={true}
                    placeholder='Type a message....'
                    placeholderTextColor='#000'
                    style={{ width: 300, fontSize: 18,}}
                    numberOfLines={2}
                />
            </View>
        {console.log(chatText)}
        <Icon name="md-send" style={{ paddingLeft: 10, fontSize: 40, alignSelf: 'center'}} onPress={handleSend}/>
        </View>
    )
}