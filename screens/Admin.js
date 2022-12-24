import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TextInput, Button, Pressable} from 'react-native'

export default function Admin({navigation}) {
    
    // const navigation = useNavigation();

    function handleNavigateCreateBus(){

        console.log(navigation)

        navigation.navigate("Admin Create Bus")
    }

    function handleNavigateSearchBus(){
        navigation.navigate("Admin Search Bus")
    }

    return (
        <View style={styles.container}>
            <Text>Admin page</Text>
            
            <Pressable
            onPress={handleNavigateCreateBus}>
                <Text>Create Bus</Text>
            </Pressable>

            <Pressable
            onPress={handleNavigateSearchBus}>
                <Text>Search Bus to Edit</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        marginVertical: 10,
    }
});