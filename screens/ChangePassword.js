import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Pressable
} from 'react-native';
import React, { useState } from 'react';
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { db, app, auth } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { State } from 'react-native-gesture-handler';


export default function ChangePassword() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  

  const [value,setValue] = useState({
    icon: "eye-slash",
    showPassword: false
  })


  const handleInput = (event) => {
    const icon = event.target.icon
    const showPassword = event.target.showPassword
    setValue((preValue) => ({
      icon: preValue.icon === "eye" ? "eye-slash" : "eye",
      showPassword: !preValue.showPassword
    }))
}

  


  //change user password
  const handleChange = (e) => {
    if (newPassword !== confirmPassword) { //validation function can be made
      console.log("password must be match")
    } else {
      //getting credential from current user and password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      )
      //reauthenticate current user
      reauthenticateWithCredential(user, credential).then(() => {
        //if successfull then allow change password
        updatePassword(user, newPassword).then(() => {
          console.log("success");
          console.log("user will be log out and asked to log in again");
          auth.signOut().then(() => navigation.navigate("Login"))
        }).catch((error) => {
          console.log(error)
        });
      }).catch((error) => {
        console.log(error)
      });
    }
  }


  return (
<View className="flex mt-2 items-center justify-center">

<View className="flex items-center justify-center mt-5 w-4/5 h-4/5 bg-[#d3d3d3] rounded-lg">      
<Text style={styles.maintitle}>Change Password</Text>

      <View>
        <Text>Current Password</Text>
        <TextInput
          className="border-2 border-stone-500 w-48 h-10 my-3 rounded-3xl bg-white"
          secureTextEntry = {true}
          defaultValue={currentPassword}
          onChangeText={(text) => setCurrentPassword(text)}
        />
      </View>

      <View>
        <Text>New Password</Text>
        <TextInput
          className="border-2 border-stone-500 w-48 h-10 my-3 rounded-3xl bg-white"
          secureTextEntry = {true}
          defaultValue={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        /> 
      </View>

      <View>
        <Text>Confirm Password</Text>
        <TextInput
          className="border-2 border-stone-500 w-48 h-10 my-3 rounded-3xl bg-white"
          secureTextEntry = {true}
          defaultValue={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
      
      </View>

      <View style={styles.button}>
        {currentPassword == "" || newPassword == "" || confirmPassword == "" ? (
          <Button 
            title ="Change Password"
            onPress={handleChange}
            disabled
          />
        ) : (
          <Button
            title ="Change Password"
            onPress={handleChange}
          />
        )}
      </View>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
    borderRadius: 2,
    elevation: 3,
    backgroundColor: "#4682b4",
    marginTop: 20,
  },

});