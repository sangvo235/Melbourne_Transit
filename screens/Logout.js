import { DrawerActions, useNavigation } from "@react-navigation/native";
import { auth } from '../firebase';
import { TextInput, Button, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Image, Alert, Pressable } from "react-native";
import React from 'react'
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerNavigator from "../DrawerNavigator";
import { set } from "react-native-reanimated";

// Alert.alert("HTTLO");
const Logout = () => {
  const navigation = useNavigation();
  function logout() {
    auth.signOut().then(() => {
      console.log("SIGN OUT");
      Alert.alert("LOGOUT SUCCESSFUL")
      navigation.navigate("Login");
    }).catch((e) => {
      console.log(e.message);
    })
  }

  return (
    <View className="flex mt-2 items-center justify-center">

      <View className="flex items-center justify-center border-1 mt-5 w-4/5 h-2/3 bg-[#d3d3d3] rounded-lg">

        <Image
          className="flex w-2/3 h-24"
          source={require('../assets/loginLogo.png')}
        >
        </Image>

        <Text style={styles.question}
          className=" h-10 my-3 rounded-3xl">Are you logging out?</Text>

        <Pressable
          style={styles.button}
          onPress={logout}
        >
          <Text style={styles.text}>Yes</Text>
        </Pressable>

        <Text></Text>

        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.text}>No</Text>
        </Pressable>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  question: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
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
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default Logout