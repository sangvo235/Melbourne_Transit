import { View, Text, StyleSheet, TextInput, Button, Pressable} from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db, app ,auth} from '../firebase';

export default function UserProfile() {
    const navigation = useNavigation();


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");


    onAuthStateChanged(auth, (user) => {
        if (user != null) {
            const id = user.uid;
            const email = user.email;
                setEmail(email);
            } else {
                console.log("none")
            }
        });

        async function getUser(){
            const docRef = doc(db, "users", email);

            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                setName(docSnap.data().name)
                setNumber(docSnap.data().phone)
                console.log("Document data:", docSnap.data());

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }        
        }

        getUser();


    return (
        <View className="flex mt-2 items-center justify-center">

        <View className="flex items-center justify-center mt-5 w-4/5 h-4/5 bg-[#d3d3d3] rounded-lg">

            <Text style={styles.maintitle}>User Profile</Text>
            <Text style={styles.text}>Name: {name} </Text>
            <Text style={styles.text}>Email: {email}</Text>
            <Text style={styles.text}>Phone Number: {number}</Text>
            <Text></Text>
            <Text></Text> 
                <Pressable 
                style={styles.button} 
                onPress={()=> navigation.navigate("Change Password")}
                >
                <Text style={styles.presstext}>Change Password</Text>
                </Pressable>
            </View> 
        </View>
    )
}

const styles = StyleSheet.create({
    maintitle: {
        fontSize: 30,
        paddingBottom: 24,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#4682b4',
      },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: "#4682b4",
      },
    text: {
        fontSize: 16,
        paddingVertical: 12,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
      },
    presstext: {
        fontSize: 16,
        paddingVertical: 12,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
});