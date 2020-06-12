import firebase from 'firebase';
import 'firebase/firestore';


export default function UpdateMessageRead(docKey) {
    firebase
        .firestore()
        .collection('Chats')
        .doc(docKey)
        .update({
            receiverHasRead: true,
            // receiverHasReadOthers: true
        })
}