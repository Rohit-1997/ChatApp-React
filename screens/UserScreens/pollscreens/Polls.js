import React from "react";
import { Button,ListItem } from 'react-native-elements';

import { 
    View,
    Text,
    StyleSheet,
    ScrollView
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

// import { TextButton } from 'react-native-material-buttons'
// import { Cell, Section, TableView } from 'react-native-tableview-simple';

export default function Polls (props) {
    console.log('Printing props',props)

    return (
    <ScrollView style = {styles.stage}>
        <TouchableOpacity onPress = {()=>props.navigation.navigate('Poll Creation',{'GroupDocKey':props.route.params.GroupDocKey})}>
        <ListItem 
          title = 'Create Poll'
          // titleStyle  = {{color : "#007AFF"}}
          bottomDivider
          chevron
          />
        </TouchableOpacity>
        <TouchableOpacity onPress = {()=>props.navigation.navigate('Poll List',{'GroupDocKey':props.route.params.GroupDocKey})}>
        <ListItem 
          title = 'Take a Poll'
          // titleStyle  = {{color : "#007AFF"}}
          bottomDivider
          chevron
          />
        </TouchableOpacity>
        {/* <TableView>
          <Section header= 'OPTIONS'   > 
            <Cell
              title='Create Poll'
              titleTextColor="#007AFF"
              accessory="DisclosureIndicator"
              // onPress={() =>  props.navigation.navigate('PollCreation')}
            />
            <Cell
              title="Take a Poll"
              titleTextColor="#007AFF"
              accessory="DisclosureIndicator"
              // onPress={() => props.navigation.navigate('PollLists')}
            />
          </Section>
        </TableView> */}
   
    {/* <View style={styles.container}>
        <Button style = {styles.butt} type = "outline" title = 'Create Poll' onPress = {()=> props.navigation.navigate('PollCreation') }/>
        <Button style = {styles.butt} title='touch me'
        type = 'outline'/>
    </View> */}
    
    </ScrollView>
    
    )

 }

 const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    butt :{
        padding : 20,
    },
    stage: {
        backgroundColor: '#EFEFF4',
        paddingBottom: 20,
        paddingTop : 0,
        // flex: 1,
      }
});
