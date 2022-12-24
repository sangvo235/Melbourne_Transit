import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import React, {useState} from 'react'
import SelectList from 'react-native-dropdown-select-list'
import { stringify } from '@firebase/util';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { db } from "../firebase";

export default function CreateRoute() {


    const [routeId, setRouteId] = useState("");
    const [routeName, setRouteName] = useState("");
    const [stopId, setStopId] = useState("");
    const [stopName, setStopName] = useState("");
    const [coordsX, setCoordsX] = useState();
    const [coordsY, setCoordsY] = useState();


    function handleRouteIdInput(value){
        setRouteId(value)
    }

    function handleRouteNameInput(value){
        setRouteName(value)
    }

    function handleStopIdInput(value){
        setStopId(value)
    }

    function handleStopNameInput(value){
        setStopName(value)
    }

    function handleCoordsXInput(value){
        value = parseFloat(value)
        setCoordsX(value)
    }

    function handleCoordsYInput(value){
        value = parseFloat(value)
        setCoordsY(value)
    }

    function handleSaveRoute(){
        console.log("Submit")
    }

  return (
    <View>
      <Text>Search Route</Text>

      <View>
          <Text>Route ID:</Text>
          <TextInput
          style={styles.input}
          value={routeId}
          onChangeText={handleRouteIdInput}
          />
        <Text>Route Name:</Text>
          <TextInput
          style={styles.input}
          value={routeName}
          onChangeText={handleRouteNameInput}
          />
        </View>
        <View>
        <Text>Stop ID:</Text>
          <TextInput
          style={styles.input}
          value={stopId}
          onChangeText={handleStopIdInput}
          />
        <Text>Stop Name:</Text>
          <TextInput
          style={styles.input}
          value={stopName}
          onChangeText={handleStopNameInput}
          />
          <Text>Coords X & Y:</Text>
          <TextInput
          style={styles.input}
          value={coordsX}
          onChangeText={handleCoordsXInput}
          keyboardType="numeric"
          />
          <TextInput
          style={styles.input}
          value={coordsY}
          onChangeText={handleCoordsYInput}
          keyboardType="numeric"
          />
        </View>
        


        <Pressable onPress={handleSaveRoute}>
          <Text>Save Route</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    input: {
        width: '80%',
        padding: 10,
        backgroundColor: "white",
        borderColor: "black",
        fontSize: 16,
      }
})