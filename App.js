import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import firebase from 'firebase';
import {firebaseConfig} from './config';
import { createStackNavigator } from '@react-navigation/stack';
import {DrawerActions} from '@react-navigation/material-top-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Login from './screens/Login';
import UserDashboard from './screens/UserDashboard';
// import Dashboard from './screens/Dashboard';
// // import Loading from './screens/Loading';
// import ChatList from './screens/ChatList';
// import ChatView from './screens/ChatView';
// import WebLogin from './screens/WebLogin';
// import { AppLoading } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import UserHome from './screens/UserScreens/UserHome';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
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
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
        <Stack.Screen name='UserDashboard' component={UserDashboard} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
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
