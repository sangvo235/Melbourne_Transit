import React, { useState } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from "./screens/Login";
import Home from "./screens/Home";
import BusDetail from "./screens/BusDetail";
import BusUpdateForm from "./screens/BusUpdateForm";
import ModalExample from "./screens/ModalExample";
import ArrivalTimeUpdate from "./screens/ArrivalUpdate";
import BusDelayed from "./screens/BusDelayed";
import UserProfile from "./screens/UserProfile";
import ChangePassword from "./screens/ChangePassword";
import Logout from "./screens/Logout";
import Admin from "./screens/Admin"
import AdminSearchBus from "./screens/AdminSearchBus";
import AdminCreateBus from "./screens/AdminCreateBus";
import AdminEditBus from "./screens/AdminEditBus";
import { db, auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore";

//Login user drawer
const LoginDrawer = createDrawerNavigator();
const LoginDrawerNavigator = () => {
  return (
     <LoginDrawer.Navigator useLegacyImplementation>
      <LoginDrawer.Screen name="Login" component={Login}/>
      <LoginDrawer.Screen name="Home" component={Home} options={{ drawerItemStyle: { display: 'none' } }}/>
      <LoginDrawer.Screen name="Bus Details" component={BusDetail} options={{ drawerItemStyle: { display: 'none' } }}/>
      <LoginDrawer.Screen name="Bus Update Form" component={BusUpdateForm} options={{ drawerItemStyle: { display: 'none' } }}/>
      <LoginDrawer.Screen name="Arrival Update" component={ArrivalTimeUpdate} options={{ drawerItemStyle: { display: 'none' } }}/>
      <LoginDrawer.Screen name="Bus Delayed" component={BusDelayed} options={{ drawerItemStyle: { display: 'none' } }}/>
      <LoginDrawer.Screen name="Modal Example" component={ModalExample} options={{ drawerItemStyle: { display: 'none' } }}/>
      <LoginDrawer.Screen name="User Profile" component={UserProfile} options={{ drawerItemStyle: { display: 'none' } }}/>
      <LoginDrawer.Screen name="Change Password" component={ChangePassword} options={{ drawerItemStyle: { display: 'none' } }} />
      <LoginDrawer.Screen name="Logout" component={Logout} options={{ drawerItemStyle: { display: 'none' } }}/>
    </LoginDrawer.Navigator>
  );
}

//Normal user drawer
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator useLegacyImplementation>
      <Drawer.Screen name="Login" component={Login} options={{ drawerItemStyle: { display: 'none' } }}/>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Bus Details" component={BusDetail} options={{ drawerItemStyle: { display: 'none' } }}/>
      <Drawer.Screen name="Bus Update Form" component={BusUpdateForm} options={{ drawerItemStyle: { display: 'none' } }}/>
      <Drawer.Screen name="Arrival Update" component={ArrivalTimeUpdate} options={{ drawerItemStyle: { display: 'none' } }}/>
      <Drawer.Screen name="Bus Delayed" component={BusDelayed} options={{ drawerItemStyle: { display: 'none' } }}/>
      <Drawer.Screen name="Modal Example" component={ModalExample} options={{ drawerItemStyle: { display: 'none' } }}/>
      <Drawer.Screen name="User Profile" component={UserProfile} />
      <Drawer.Screen name="Change Password" component={ChangePassword} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
}



//Admin drawer 
const AdminDrawer = createDrawerNavigator();
const AdminDrawerNavigator = () => {
  return (
     <AdminDrawer.Navigator useLegacyImplementation>
      <AdminDrawer.Screen name="Login" component={Login} options={{ drawerItemStyle: { display: 'none' } }}/>
      <AdminDrawer.Screen name="Home" component={Home} />
      <AdminDrawer.Screen name="Bus Details" component={BusDetail} options={{ drawerItemStyle: { display: 'none' } }} />
      <AdminDrawer.Screen name="Bus Update Form" component={BusUpdateForm}options={{ drawerItemStyle: { display: 'none' } }} />
      <AdminDrawer.Screen name="Arrival Update" component={ArrivalTimeUpdate}options={{ drawerItemStyle: { display: 'none' } }} />
      <AdminDrawer.Screen name="Bus Delayed" component={BusDelayed}options={{ drawerItemStyle: { display: 'none' } }} />
      <AdminDrawer.Screen name="Modal Example" component={ModalExample}options={{ drawerItemStyle: { display: 'none' } }} />
      <AdminDrawer.Screen name="User Profile" component={UserProfile} />
      <AdminDrawer.Screen name="Change Password" component={ChangePassword} options={{ AdminDrawerItemStyle: { display: 'none' } }} />
      <AdminDrawer.Screen name="Create Bus" component={AdminCreateBus} />
      <AdminDrawer.Screen name="Search Bus" component={AdminSearchBus} />
      <AdminDrawer.Screen name="Admin Edit Bus" component={AdminEditBus}
      options={{ drawerItemStyle: { display: 'none' } }}  />
      {/* <AdminDrawer.Screen name="Admin" component={Admin} /> */}
      <AdminDrawer.Screen name="Logout" component={Logout} />
    </AdminDrawer.Navigator>
  );

}

const MainNavigator = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState();
  const [email, setEmail] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  onAuthStateChanged(auth, (user) => { //check current user
    if (user != null) {
      const email = user.email;
      setEmail(email)
      setIsLoggedIn(true);
      getUser();
    } else {
      console.log("none")
      setIsLoggedIn(false)
    }
  });

  async function getUser() {
    const docRef = doc(db, "users", email);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setRole(docSnap.data().role)
      if (role == "admin") {
        setIsAdmin(true);
      }
      else if (role == "gs") {
        setIsAdmin(false)
      }
    } else {
      console.log("No such document!");
    }
  }

  function nav(){
    if(isLoggedIn && isAdmin){
      return <AdminDrawerNavigator />
    }else if(isLoggedIn && !isAdmin){
      return <DrawerNavigator /> 
    }else{
      return <LoginDrawerNavigator />
    }
  }

  // If the user is logged in use the Drawer Navigator 
  // If the user is logged out implement the Login Drawer Navigator (only has login page visible)
  return (
    <NavigationContainer independent={true}>
      {nav()}
    </NavigationContainer>
  )
}

export default MainNavigator;