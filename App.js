import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import firebase from 'firebase';
import {firebaseConfig} from './config';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
// import Dashboard from './screens/Dashboard';
// // import Loading from './screens/Loading';
// import ChatList from './screens/ChatList';
// import ChatView from './screens/ChatView';
// import WebLogin from './screens/WebLogin';
// import { AppLoading } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import UserDashboard from './screens/UserDashboard';
 
const Stack = createStackNavigator();
firebase.initializeApp(firebaseConfig);


// export default function App() {
//   return (
//     <NavigationContainer>
//     <Stack.Navigator>
//       {console.log(Platform.OS)}
//       {Platform.OS === 'web' ? (<Stack.Screen name='WebLogin' component={WebLogin}/>): (<Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>)}
//       <Stack.Screen name='Dashboard' component={Dashboard} />
//       <Stack.Screen name='Loading' component={Loading} options={{headerShown: false}}/>
//       <Stack.Screen name='ChatView' component={ChatView}/>
//     </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
        <Stack.Screen name='userDashboard' component={UserDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24
  },
});
