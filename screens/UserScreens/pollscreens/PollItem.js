import React, { useState, useEffect } from "react";
import { 
    View,
    Text,
    StyleSheet,Dimensions
} from "react-native";
import firebase from 'firebase';
import 'firebase/firestore';
import { ListItem,Button } from "react-native-elements";
// import { TouchableOpacity } from "react-native-gesture-handler";
// import PieChart from 'react-native-pie-chart';
import {PieChart} from "react-native-chart-kit";

export default function PollItem(props) {
    const [result,setResult] = useState(null)
    const [Choice,setChoice] = useState({})
    const parameters = props.route.params
    const [selected,setSelect] = useState(-1)
    const [bool,setBool] = useState(true)
    const user = firebase.auth().currentUser
    const [data,setData] = useState([])
    const color = ['#F44336','#2196F3','#FFEB3B', '#4CAF50', '#FF9800']
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
      };
    useEffect(() =>{
        let tempchoice = {}
        for (let i = 0; i < parameters.Choices.length; i++) {
            tempchoice[i + 1] = false
        }
        setChoice(tempchoice)
        if(parameters.Bool_exp){
            firebase
            .firestore()
            .collection('Polls')
            .doc(parameters.PollDocKey)
            .get()
            .then((object) =>{
                setResult(object.data().givenChoices)
            })
        }
    },[])
    useEffect(()=>{
        console.log("inside useeffect",result)
        if (result){
            let d = []
            console.log(Object.keys(result),'printing')
            Object.keys(result).map((key,ind)=>{
                console.log(key,'poiuytrewsdfghj')
                d.push({
                    name:key,
                    count:result[key],
                    color: color[ind],
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15
                })
                console.log(d,'printing the data array')
            })
            setData(d)
        }
        
    },[result])
    // console.log('printing Users in PollItem', user)
    function handleSubmit(){
        const temp = parameters.Choices[selected-1]
        // console.log('printing doc','poll:'+parameters.Name)
        let string = 'givenChoices.' + temp
        console.log('the selected choice ',parameters.Choices[selected-1])
        firebase.
        firestore()
        .collection('Polls')
        .doc(props.route.params.PollDocKey)
        .update({
            [`givenChoices.${temp}`]:firebase.firestore.FieldValue.increment(1),
            [`submittedUsers`]: firebase.firestore.FieldValue.arrayUnion(user.email)
        })
    
        props.navigation.navigate('Poll List')

    }
    function handleChoice(event,index){
        if(selected < 0){
            let tempchoice = Choice
            tempchoice[index+1] = true
            setChoice(tempchoice)
            setSelect(index+1)
        }else{
            let tempchoice = Choice
            tempchoice[selected] = false
            tempchoice[index+1] = true
            setChoice(tempchoice)
            setSelect(index+1)
            
        }
        setBool(false)
    }
    // const choices = parameters.Choices.map((item,ind) =>
    // <View key = {ind}>
    //     <Text>
    //         {item}
    //     </Text>
    // </View>

    // )
    console.log('printing the results',result,data)
    return(
        <View  style = {{flex : 1,backgroundColor:'#fff'}}>
            {!parameters.Bool_exp ?(
                <View  style = {{paddingTop : 20,paddingLeft:10,paddingRight:10}}>
                    <Text style = {{fontSize:25,fontWeight:'bold',color:'#9477cb',paddingBottom:10 }}>
                        Question
                    </Text>
                <View>
                    {/* {console.log('please print ', choices)} */}
                    
                    <Text style = {{fontSize : 22,fontWeight:'200',paddingBottom:10}}>
                    {parameters.question}
                        
                    </Text>
                </View>
                 <View>
                    <Text style = {{fontSize : 17,fontWeight:'bold',color:'#9477cb',paddingBottom:10}}>Choices : </Text>
                     {
                      parameters.Choices.map((item,ind) =>
                      <View key = {ind} style = {{padding:4}}>
                      <View  style = {{padding:5,borderWidth:0.4,borderColor:'lightgrey'}} >
                         <ListItem

                          title = {item}
                          titleStyle = {{fontSize : 17,fontWeight:'200'}}
                          pad = {10}
                          checkBox = {{ checkedIcon:'dot-circle-o',
                          uncheckedIcon:'circle-o',checked :Choice[ind+1], onPress :(e)=>handleChoice(e,ind)}}
                          onPress={(e)=>handleChoice(e,ind)}
                         />
                      </View>
                     </View>
                  
                      )   
                     }
                 </View>
                <View  style = {{alignItems : 'center',justifyContent :'center', paddingTop : 10}}>
                    <Button title ='Submit' style = {{width :200,margin:10}} disabled = {bool} onPress = {handleSubmit}/>
                </View>
                </View>
            ):(<View  style = {{paddingTop : 20,paddingLeft:10,paddingRight:10}}>
                <View >
                        <Text style = {{fontSize:25,fontWeight:'bold',color:'#9477cb',paddingBottom:10 }}>
                            Question
                        </Text>
                </View>
                <View>
                    {/* {console.log('please print ', choices)} */}
                    
                    <Text style = {{fontSize : 22,fontWeight:'200',paddingBottom:10}}>
                    {parameters.question}
                        
                    </Text>
                </View>
                <View>
                    <Text>
                        Poll Results:
                    </Text>
                </View>
                <View>
                    {/* {result ? (Object.keys(result).map((key,ind)=>{
                        return <Text  key = {ind}> {key} :{result[key]}</Text>
                        })

                        ):(<View></View>)} */}
                    {console.log('testing in render',data)}                        
                    <PieChart
                        data={data}
                        width={Dimensions.get('window').width}
                        height={220}
                        chartConfig={chartConfig}
                        accessor="count"
                        backgroundColor="transparent"
                        paddingLeft=""
                        absolute
                        
                        />
                </View>
                </View>)

            }
        {/* <>{choices}</> */}
        </View>
    // <View style={styles.container}>
    //     <Text>PollItem</Text>
    // </View>
    )

    }
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});