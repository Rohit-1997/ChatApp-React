import React, {useState, useEffect}  from "react";
import { 
    View,
    TextInput,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,Dimensions,
    SafeAreaView,
    // SafeAreaProvider
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {Input, Icon,Button} from 'react-native-elements'
import {  Platform,TouchableOpacity } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import {BackdropProvider,TimePicker,DatePicker} from 'react-native-propel-kit'
import firebase from 'firebase';
// import * as firebase from 'firebase';
import 'firebase/firestore';
// import { Cell, Section, TableView } from 'react-native-tableview-simple';
// import { ceil } from "react-native-reanimated";
// import DatePicker from 'react-native-date-picker'

export default function  PollCreation (props){

    
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    // const [arr,setArr] = useState([])
    const [ques,setQues] = useState('')
    const [opt,setOpt] = useState([])
    const [defopt,setDef] = useState(['',''])
    const [bool,setBool] = useState(true)
    const [PollName,setName] = useState('')
    useEffect( () =>{
        console.log('Am I called?',/\S/.test(ques))
        if(/\S/.test(ques) && /\S/.test(PollName)){
            console.log('going if1')
            if(/\S/.test(defopt[0]) && /\S/.test(defopt[1])){
                console.log('going if2')
                let count = 0
                for (let i = 0; i < opt.length; i++) {
                    if(/\S/.test(opt[i])){
                        count++
                    }
                }
            console.log(opt.length,'@@@',count)
                if (count === opt.length){
                    console.log('going if3',opt.length,'@@@',count)
                    setBool(false)
                }else{
                    setBool(true)
                }
            }else{
                console.log('else block')
                setBool(true)
            }
        } else {
            setBool(true)
        }
    },[ques,opt,defopt,PollName])

    function BuildDocKey(){
        let timestamp = new Date()
        console.log('Buliding docKEY in acticites',props.route.params.GroupDocKey + '#' +PollName+':'+timestamp.getTime())
        return props.route.params.GroupDocKey + '#' +PollName+':'+timestamp.getTime()
    }
    const create = () =>{
        // console.log('Printing props111',props)
        // console.log('printing the states var ',date.toLocaleDateString(),'time',time.toLocaleTimeString())
        // console.log(date.toLocaleString(),time.toLocaleString(),'asdfghjkl')
        const d = date.toLocaleDateString().split('/')
        const t = time.toLocaleTimeString().split(':')
        // console.log('printing date and time for andriod', d,t)
        if(t[2].split(' ')[1] === 'PM'){
            const temp = parseInt(t[0])
            if (temp != 12) {
                t[0] = 12 + temp
            }
        } else if (t[2].split(' ')[1] === 'AM' && t[0] == '12'){
            t[0] = 0
        }

        console.log('the parameters passed',parseInt(date.getFullYear()),parseInt(d[0])-1,parseInt(d[1]),t[0],parseInt(t[1]))
        const expirydate = new Date(parseInt(date.getFullYear()),parseInt(d[0]-1),parseInt(d[1]),t[0],parseInt(t[1]))
        console.log('printing the expiry date',expirydate.toLocaleString())
        const options = defopt.concat(opt)
        const givenChoices = {}
        options.forEach(element => {
            givenChoices[element] = 0
        });
        console.log(expirydate.toLocaleString(),options)
        firebase
            .firestore()
            .collection('Polls')
            .doc(BuildDocKey())
            .set({
                Name : PollName,
                Question : ques,
                Options : options,
                expiry_date : expirydate.toLocaleString(),
                givenChoices : givenChoices,
                submittedUsers : []
                
            })
        props.navigation.navigate('POLL')
    }
    const remove = (e,val,ind) =>{
        // check()
        // console.log(ind,val,'hello')
        
        // temp.splice()
        if (val !=''){
            // console.log("i'm here")
            setOpt(opt.filter(e => e!= val))

        }else{
            // console.log("i'm here2")
            let temp = [...opt]
            temp.splice(ind,1)
            // console.log(ind,'here2',temp)
            setOpt(temp)
        }
       
        
        // setArr(arr.filter(e =>  e!= ele))
    }
   const add = (text,ind) => {
    //    check()
       console.log(text,ind)
       let temp = [...opt]
        temp[ind] = text
        setOpt(temp)
        
   }
   const defadd = (text,ind) => {
    // console.log('function call')
    // check()
    console.log(text,ind)
    let temp = [...defopt]
     temp[ind] = text
     setDef(temp)
     
}
  
   const fun = opt.map((cv,n) => 
    <View key = {n} style = {{flex : 1,
        flexDirection : 'row',width:'90%'}}
         >
   <Input 
    placeholder={'Choice ' + String(n+3)}
    multiline = {true}
    onChangeText = {(t) => add(t,n)}
    value = {cv}

    />
    <TouchableOpacity
    onPress = {(e) => remove(e,cv,n)}>
      <Icon 

     name = 'close'
     type='evilicon'
     size = {40}
    //  style = {{bordderBottomEndRadius : 10erBottomWidth : 1,borderBottomColor :'#96999C',bor}}
     onPress = {(e) => remove(e,cv,n)}
    
    />
    </TouchableOpacity>

    </View>)
    //  console.log('the array is',fun)
    console.log(opt,"Here ARRAY",defopt)
    console.log(/\S/.test(ques))
    const func = () => {
        // setArr(prevarr => [...prevarr,prevarr.length+3])
        // check()
        setOpt(prevopt =>[...prevopt,''])
    }   
    // console.log(fun,'here1')
    // console.log(ques ,'here1')

    // const minimumDate = new Date()
    // const maximumDate = new Date(minimumDate.getTime() + 60 * 60 * 24 * 1000);
    // const [date, setDate] = useState(new Date())
    console.log('printing initial-date',date.toLocaleString())
    return (
    

    
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Dimensions.get('window').height/6 + 50}>
        <ScrollView>
        <Input 
            label = 'Poll Name'
            placeholder='Name of the POLL'
            onChangeText={setName}
            labelStyle = {{color:'#000',fontWeight:'normal',fontSize:17}}

           
        />
        <Input 
            label = 'Question'
            placeholder='Write down your Poll'
            onChangeText={setQues}
            labelStyle = {{color:'#000',fontWeight:'normal',fontSize:17}}

           
        />
        
        <BackdropProvider>
        <Text style = {{ paddingLeft : 10,fontWeight :'normal',color : 'black',fontSize:17,paddingBottom:10}}>Deadline</Text>
        <View style = {styles.picker1}>
       
            <Icon
            name='calendar'
            type='evilicon'
            size = {40}
            style = {{paddingRight : 20,paddingBottom :20}}
            />
            <DatePicker title="Pick a date" value={date} onChange={setDate}
            initialValue =  {date} />
            
            
        </View>
        <View style = {styles.picker}>
            <Icon
            name='clock'
            type='evilicon'
            size = {40}
            style = {{paddingRight : 20,paddingBottom :20}}
            />
            <TimePicker placeholder="Pick a time" value={time} onChange={setTime} initialValue = {time}/>
        </View>
            
        </BackdropProvider>
        
           
        <Input 
            label = 'Choices'
            placeholder='Choice 1'
            onChangeText = {(t) => defadd(t,0)}
            labelStyle = {{color:'#000',fontWeight:'normal',fontSize:17,paddingTop:25}}
            
        />
         <Input 
            placeholder='Choice 2'
            onChangeText = {(t) => defadd(t,1)}
            
        />
        <>{fun}</>
       
        <View style = {styles.picker1}>
            <Icon
            name = 'plus'
            type='evilicon'
            size = {40}
            onPress = {func}
            />
            <Button
             title = 'ADD Choice'
             type = 'clear'
             onPress = {func}
            />
            
        </View>
        <View  style = {{alignItems : 'center',justifyContent :'center', paddingTop : 10}}>
            <Button title ='Create' buttonStyle = {{backgroundColor:'#9477cb',borderRadius:10}} style = {{width :200,margin:10,}} disabled = {bool} onPress = {(props) => create(props)}/>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
   
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingTop : 250
        
    },
    picker1 :{
        flex : 1,
        flexDirection : 'row',
        borderColor : '#96999C',
        alignItems :'center',
        borderBottomWidth : 1,
        borderBottomEndRadius :10,
        borderBottomStartRadius:10,
        paddingTop :0
        

    },
    picker :{
        flex : 1,
        flexDirection : 'row',
        borderColor : '#96999C',
        borderBottomWidth : 1,
        borderBottomEndRadius :10,
        borderBottomStartRadius:10,
        paddingTop : 20,
        paddingBottom :5,
        alignItems : 'center'

    },
    TI :{width : Dimensions.get('window').width -40,
    borderBottomWidth : 1,
    borderBottomColor :'#96999C',
    fontSize : 18,
    paddingLeft :10,
    
    // borderBottomEndRadius :10,
    borderBottomStartRadius:15,}
});
















// };
    // const onChange1 = () => {
    //     setShow(false);
    //     // console.log(show)
    // };
    // const showMode = currentMode => {
    //     setShow(true);

    // };

    // const showDatepicker = () => {
    //     showMode('date');
    //     console.log(date.toLocaleString())
    // };

    // const showTimepicker = () => {
    //     showMode('time');
    //     // console.log(date)
    // };

    {/* <View>
                <Button onPress={showMode} title="Show date picker!" />
            </View>
            {show && (
            <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={60}
            value={date}
            mode= 'date'
            minimumDate = {minimumDate}
            maximumDate = {maximumDate}
            is24Hour={true}
            display="default"
            onChange={onChange}
            />
            {/* <View>
                <Button onPress={showTimepicker} title="Show time picker!" />
            </View> */}
        // )} */}

        {/* <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={40}> */}
        {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? 40 : 0}
        style={{ flex: 1 }}> */}
            // const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
// const [date, setDate] = useState(new Date());
    // const [mode, setMode] = useState('date');
    // const [show, setShow] = useState(false); 