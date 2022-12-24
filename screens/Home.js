import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, View, SafeAreaView, Pressabler, Image, ScrollView, RefreshControl } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import ModalExample from "./ModalExample";
import { ScreenContainer } from "react-native-screens";
import { db, app, auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";

// TO MAKE QUERY
import { collection, doc, getDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import Bus from "./components/Bus";
// import { useState } from 'react';

//Navigation


async function getUser(email) {

  const docRef = doc(db, "users", email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log(docSnap.data().stopPointer);
    // return docSnap.data().station.id;
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}

export default function Home({ route, navigation }) {
  const nav = useNavigation();
  const isMounted = useRef(false);
  // Refresh function
  const [refresh, setRefresh] = useState(false);
  const [activeBus, setActiveBus] = useState([]);
  const [station, setStation] = useState("");
  const [routes, setRoutes] = useState();
  const [refreshList, setrefreshList] = useState(false);
  const [stopPointer, setStopPointer] = useState();

  // var routeDocRef = doc(db, "Route", "Glenferrie Route"); //set the route to filter the busses along.
  // var routeDocRef2 = doc(db, "Route", "Glenferrie Express"); //set the route to filter the busses along.
  // const q = query(collection(db, "Bus"), where("isDeployed", "==", true), where("route", "in", [routeDocRef, routeDocRef2]));

  // async function getDeployedBus() {
  //   const data = await getDocs(q);
  //   setActiveBus([]);
  //   data.forEach((doc) => {
  //     setActiveBus(old => [...old, doc.id]);
  //   })

  // }

  const pullMe = () => {
    setRefresh(true)

    setTimeout(() => {
      setRefresh(false)
    }, 1000)
    cleanup()
    getBuses(routes[0] + " Route");
    getBuses(routes[0] + " Express");
  }

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        const email = user.email;
        getUser(email).then((s) => {
          setStation(s.station.id)
          var returnedRoutes = s.route.id.split(" ")
          setRoutes(returnedRoutes);
          getBuses(returnedRoutes[0] + " Route");
          getBuses(returnedRoutes[0] + " Express");
          setStopPointer(s.stopPointer);

        })
      }
    });

    // clean up
    return cleanup()



  }, []);

  function cleanup() {
    setActiveBus([]);
  }

  async function getBuses(routeId) {
    const ref = doc(db, "Route", routeId);
    if (routeId.includes("Route")) { //sets the query based on whether bus is regular or express.
      var qtest = query(
        collection(db, "Bus"),
        where("route", "==", ref),
        where("isDeployed", "==", true),
        // where("stopPointer", "<=", 4) //hard coding for now, can make dynamic later.
      );
      var qtest2 = query(
        collection(db, "Bus"),
        where("stopPointer", "<=", 5) //hard coding for now, can make dynamic later.
      );
    }
    else {
      var qtest = query(
        collection(db, "Bus"),
        where("route", "==", ref),
        where("isDeployed", "==", true),
        // where("stopPointer", "<", 4) //hard coding for now, can make dynamic later.
      );
      var qtest2 = query(
        collection(db, "Bus"),
        where("stopPointer", "<=", 2) //hard coding for now, can make dynamic later.
      );

    }
    const buses = await getDocs(qtest);
    const buses2 = await getDocs(qtest2);
    buses.forEach((d) => {
      buses2.forEach((a) => {
        if (d.id == a.id) {
          setActiveBus(old => [...old, d.id]);
        }
      })
    })



  }

  function checkStops() {
    //filter through array of route stops.
    //check if current stop id is on the list.
    //get array value of current stop id
    //get array value of our stop id
    //if array value of our stop id is less than current stop id,

  }



  useEffect(() => {
    if (isMounted.current) {
      // const interval = setInterval(() => {
      if (routes) {
        cleanup()
        getBuses(routes[0] + " Route");
        getBuses(routes[0] + " Express");
      }
    }
    else {
      isMounted.current = true;
    }
    // }, 10000);
    // return () => clearInterval(interval);
  }, [route]);

  return (
    <View style={styles.pageall}>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={() => pullMe()}
        />
      }
      >
        <ScrollView>
          <SafeAreaView style={styles.header}>
            <Text style={styles.headerfont}>{station}</Text>
          </SafeAreaView>

          {
            activeBus.map(id => (
              <Bus key={id} id={id} />
            ))
          }

        </ScrollView>

        <Text style={styles.refreshbutton}>Pull to refresh</Text>

      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  pageall: {
    backgroundColor: 'white',
    minHeight: '100%',
  },

  header: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'steelblue',
  },

  headerfont: {
    fontSize: 20,
    color: 'white'
  },

  logo: {
    width: 300,
    height: 100
  },
  bus: {
    width: 70,
    height: 70
  },
  busbox: {
    backgroundColor: 'white',
    height: 110,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
    flexDirection: "row"
  },
  icon: {
    width: 30,
    height: 30
  },

  refreshbutton: {
    flexDirection: "row",
    textAlign: "center",
    marginTop: 25,
  },

}

);
