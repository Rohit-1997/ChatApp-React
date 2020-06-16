import firebase from 'firebase';
import 'firebase/firestore';


export default function UpdateMessageRead(docKey, value) {
    // Check in value to update the the seen in primary or others
    if (value === 'primary') {
        firebase
        .firestore()
        .collection('Chats')
        .doc(docKey)
        .update({
            receiverHasRead: true
        })
    }
    else {
        firebase
        .firestore()
        .collection('Chats')
        .doc(docKey)
        .update({
            receiverHasReadOthers: true
        })
    }
}