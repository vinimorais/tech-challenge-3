import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button, View, Text } from 'react-native';
import { auth } from './firebaseConfig'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import TransactionScreen from './screens/TransactionScreen'; 
import EditTransactionScreen from './screens/EditTransactionScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <NavigationContainer>
      {user ? (
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Transações" component={TransactionScreen} />
          <Stack.Screen name="Edição de Transações" component={EditTransactionScreen} />
          <Drawer.Screen name="Sair">
            {() => (
              <View>
                <Button title="Sair" onPress={handleLogout} />
              </View>
            )}
          </Drawer.Screen>
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
