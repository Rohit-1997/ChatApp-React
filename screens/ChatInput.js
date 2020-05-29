import * as React from 'react';
import {View, Text, TextInput} from 'react-native';
import {Icon} from 'native-base';


export default function ChatInput(props) {
    const [chatText, setChatText] = React.useState('');

    function handleSend() {
        props.onSubmit(chatText);
    }

    return (
        <View style={{ flex: 1,flexDirection: 'row', position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <TextInput 
            onChangeText={setChatText}
            value={chatText}
            placeholder='Type a message'
            style={{ width: 300, borderStyle: 'solid', borderBottomWidth: 1.0, paddingLeft: 10 }}
        />
        <Icon name="md-send" style={{ paddingLeft: 20 }} onPress={handleSend}/>
        {console.log(chatText)}
    </View>
    )
}