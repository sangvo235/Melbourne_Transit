import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import React, {useEffect, useState} from 'react'
import SelectList from 'react-native-dropdown-select-list'
import { stringify } from '@firebase/util';
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore"; 
import { db } from "../firebase";
import { color } from 'react-native-reanimated';

export default function AdminCreateBus() {


    const [busId, setBusId] = React.useState("");
    const [capacity, setCapacity] = React.useState("");
    const [selectedRoute, setSelectedRoute] = React.useState("");
    const [isExpress, setIsExpress] = React.useState(false);
    const [routeData, setRouteData] = React.useState([]);
  
useEffect(()=>{

  fetchRoutesData(); 

},[])

const expressOptions = [
    {key:true, value:"Express"},
    {key:false, value:"All Stations"}
]

const fetchRoutesData = async function(){
  let tempArray = []

  const querySnapshot = await getDocs(collection(db, "Route"));
  querySnapshot.forEach((doc) => {        
    tempArray.push({key: doc.id, value: doc.id})
  })

  setRouteData(tempArray)

  console.log(routeData)
  // getRouteOptions(tempArray)
}


function handleBusIdInput(value){
    setBusId(value)
}

function handleCapacityInput(value){

    value = parseInt(value)
    setCapacity(value)
}

async function handleCreateBus(){
    const newBus = {
        id: busId,
        capacity: capacity,
        routeId: selectedRoute,
        isExpress: isExpress,
        isDeployed: false,
    }

    //Validation
    const docRef = doc(db, "Bus", busId);
      
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
        alert("Error. Bus " + busId + " already exists.")
    } else {

        await setDoc(doc(db, "Bus", busId), {
            capacity: capacity,
            routeId: selectedRoute,
            isExpress: isExpress,
            isDeployed: false,
        });
        
        alert("Created: " + stringify(newBus))
    }
}


  return (
    <View style={styles.screen}>
      <View>
          <Text style={styles.label}>Bus ID:</Text>
          <TextInput
          style={styles.input}
          value={busId}
          onChangeText={handleBusIdInput}
          />
        <Text style={styles.label}>Bus Capacity:</Text>
          <TextInput
          style={styles.numberInput}
          value={capacity}
          onChangeText={handleCapacityInput}
          keyboardType="number-pad"
          />
        </View>
        <Text style={styles.label}>Route: </Text>
        <SelectList setSelected={setSelectedRoute} data={routeData}/>
        <Text style={styles.label}>Route Type: </Text>
        <SelectList setSelected={setIsExpress} data={expressOptions}/>

        <Text></Text>
        <Pressable onPress={handleCreateBus} style={styles.button}>
          <Text style={styles.buttonText}>Create Bus</Text>
        </Pressable>


    </View>

    
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15
  },

    input: {
      width: 200,
        padding: 10,
        backgroundColor: "white",
        borderColor: "black",
        fontSize: 16,
      },

      numberInput: {
        padding: 10,
        backgroundColor: "white",
        borderColor: "black",
        fontSize: 16,
      },

      button: {
        width: "40%",
        padding: 10,
        marginTop: 20,
        alignItems: "center",
        backgroundColor: "steelblue",
        borderRadius: 10
      },
      buttonText: {
        color: "white"
      },
    
      label: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 16,
        textAlign: "center"
      },
    
      busId: {
        fontSize: 20
      }

      

})