
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig'; 

import SignInScreen from './SignScreens/SignIn';
import SignUpScreen from './SignScreens/SignUp';
import FlashCardList from './FlashCardScreens/FlashCardList';
import AddFlashCard from './FlashCardScreens/AddFlashCard';
import EditFlashCard from './FlashCardScreens/EditFlashCard';
import ProfileScreen from './SignScreens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Flashcards" : "SignIn"}>
        {!user ? (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Flashcards" component={FlashCardList} />
            <Stack.Screen name="AddFlashcard" component={AddFlashCard} />
            <Stack.Screen name="EditFlashcard" component={EditFlashCard} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
