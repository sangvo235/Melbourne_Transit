import { TextInput, Button, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from "react-native";

import { auth } from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

import { useNavigation } from "@react-navigation/native";
//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";


// USERNAME : test@gmail.com -> First Demo
// PASSWORD: 123456ABC

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const subscribe = auth.currentUser;
  const navigation = useNavigation();

  // if(subscribe){
  //   console.log(subscribe);
  // }else{
  //   console.log("No User");
  // }


  const handleLogin = () => {
    // Alert.alert(email);
    // Alert.alert(password);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Loggin with: ", user.email);
        Alert.alert("Successfully Logged in.");
        navigation.navigate("Home")
      }).catch(e => {
        const errorCode = e.code;
        const errorMessage = e.message;
        console.log(errorCode);
        console.log(errorMessage);
        Alert.alert("INVALID USERNAME OR PASSWORD!");
      })
  }

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log("SIGN OUT");
      Alert.alert("LOGOUT SUCCESSFUL")
    }).catch((e) => {
      console.log(e.message);
    })
  }

  return (

    <View className="flex mt-2 items-center justify-center">

      <Image
        className="flex w-2/3 h-24"
        source={require('../assets/loginLogo.png')}
      >
      </Image>

      <View className="flex items-center justify-center border-1 mt-5 w-4/5 h-3/6 bg-[#d3d3d3] rounded-lg">
        <TextInput
          className="w-64 h-10 my-3 rounded-2xl bg-white"
          placeholder="email"
          placeholderTextColor="#4682b4"
          textAlign="center"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          className="w-64 h-10 my-3 rounded-2xl bg-white"
          value={password}
          placeholder="password"
          placeholderTextColor="#4682b4"
          textAlign="center"
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />

        <TouchableOpacity
          className="text-white items-center justify-center 
        w-28 h-8 text-center flex-row rounded-lg bg-[#4682b4] my-3"
          onPress={handleLogin}
        >
          <Text className="text-white">Login</Text>
        </TouchableOpacity>
      </View>

      <View className="flex mt-14">
        <Text className="text-[#4682b4]">Need Help?  <Text className="italic underline text-[#4682b4]">Contact Admin</Text> </Text>
      </View>

      {/* FOR LOGOUT TESTING */}
      {/* <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
        </TouchableOpacity> */}
    </View>
  );
}

