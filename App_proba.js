import { useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, Button, FlatList, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const [adatTomb,setAdatTomb]=useState([])
  const [szoveg,setSzoveg]=useState("")
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [datum,setDatum]=useState("")

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = () => {
    setShow(true);
    setMode("date");
  };




  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('feladatok', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('feladatok');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      // error reading value
    }
  };

  useEffect(()=>{
    /*
      let szemely={
        "id":0,
        "nev":"Ani",
        "email":"nahajia@gmail.com"
      }
      storeData(szemely)
    */
   /*
    let tomb=[
      {
        "id":0,
        "feladat":"verseny Debrecen",
        "datum":"2024.11.8",
        "kesz":0
      },
      {
        "id":1,
        "feladat":"fogászat",
        "datum":"2024.11.12",
        "kesz":0
      },      
    ]
      storeData(tomb)
*/

      getData().then(adat=>{
        alert(JSON.stringify(adat))
        setAdatTomb(adat)
      })
  },[])

  const felvitel=()=>{
      let uj=[...adatTomb]
      uj.push({
        "id":uj.length,
        "feladat":szoveg,
        "datum":"2024.11.20",
        "kesz":0
      })
      setAdatTomb(uj)
      storeData(uj)
      alert("Sikeres felvitel!")
  }

  const torles=()=>{
    let uj=[]
    setAdatTomb(uj)
    storeData(uj)
    alert("Sikeres törlés!")
  }

  const valtoztat=(event,datum)=>{
    setShow(false)
    setDatum(datum.getFullYear()+"."+(datum.getMonth()+1)+"."+datum.getDate())
  }

  return (
    <View style={styles.container}>
      <Text>Hello!</Text>
      <TextInput
          style={styles.input}
          onChangeText={setSzoveg}
          value={szoveg}
        />
      <Button title='Dátum kiválasztása' onPress={showMode}/>
    <Text>{datum}</Text>
      <Button title='Új feladat felvitele' onPress={felvitel}/>
      <Button title='Minden törlése' onPress={torles}/>

      <FlatList
            data={adatTomb}
            renderItem={({item,index}) => 
              <View>
              <View style={styles.keret}>
                <Text>{item.feladat}</Text>
                <Text>{item.datum}</Text>
              </View>  
              </View>            
              }
              keyExtractor={(item, index) => index}
          />




      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={(event,datum)=>valtoztat(event,datum)}
        />
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop:60
  },
  keret:{
    margin:5,
    borderWidth:2,
    borderColor:"grey",
    padding:20
  },
  input: {
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
