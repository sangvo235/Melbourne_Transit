import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import React, {useState} from 'react'
import { doc, setDoc, getDoc, collection, query, where, getDocs  } from "firebase/firestore"; 
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

export default function AdminSearchBus() {
  const navigation = useNavigation();

    const [busId, setBusId] = useState("");
    

    function handleBusIdInput(value){
      setBusId(value)
    }

    async function handleSearchBus(){
      
      const docRef = doc(db, "Bus", busId);
      
      const docSnap = await getDoc(docRef)
  
      if(!docSnap.exists()){
          alert("Error. Bus " + busId + " not found.")
      } else {

        alert("Bus found.")
        navigation.navigate("Admin Edit Bus", {busId: docRef.id})
        // StackNavigator.navigate("Admin Edit Bus", {params: {busId: doc.id}})
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
      </View>
        <Text></Text>
      <Pressable onPress={handleSearchBus} style={styles.button}>
        <Text style={styles.buttonText}>Search and Edit</Text>
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
      width: 150,
        padding: 10,
        backgroundColor: "white",
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