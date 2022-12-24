import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Modal } from 'react-native-web';

export default function ModalExample( props ){


  function closeModal(){

    props.handleClose();

    console.log(props)
  }

  return (
    <Modal 
      animationType="slide"
      visible={props.visible}
      onRequestClose={() => {
        closeModal()
        }}
        
      onClick={()=>{
        closeModal()
      }}>
      <Text>Modal Text</Text>
    </Modal>
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

