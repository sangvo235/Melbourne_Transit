import 'react-native-gesture-handler';
import { TouchableOpacity,TextInput,Button, StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native";

// TO MAKE QUERY
import {addDoc, collection, doc, getDoc, setDoc} from 'firebase/firestore';
import { db,app } from './firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { useState } from 'react';

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from './DrawerNavigator';
import { useState } from 'react';
import MainNavigator from './DrawerNavigator';

export default function App() {

  return (
    <NavigationContainer>
     <MainNavigator />
    </NavigationContainer>
   )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
});
