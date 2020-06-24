import React from "react";
import { ListItem } from 'react-native-elements';
import { StyleSheet, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Options(props) {

  return (
    <ScrollView style={styles.stage}>
      <TouchableOpacity onPress={() => props.navigation.navigate('PollCreation')}>
        <ListItem
          title='Create Poll'
          titleStyle={{ color: "#007AFF" }}
          bottomDivider
          chevron
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <ListItem
          title='Take a Poll'
          titleStyle={{ color: "#007AFF" }}
          bottomDivider
          chevron
        />
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  butt: {
    padding: 20,
  },
  stage: {
    backgroundColor: '#EFEFF4',
    paddingBottom: 20,
    paddingTop: 0,
  }
});
