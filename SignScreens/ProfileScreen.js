import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { signOutUser, deleteAccount } from '../auth'; 
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const ProfileScreen = ({ navigation }) => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  const [userDetails, setUserDetails] = useState({ firstName: 'N/A', lastName: 'N/A' });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleSignOut = async () => {
    await signOutUser();
    navigation.navigate('SignIn');
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      Alert.alert('Account deleted');
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Error deleting account', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email: {user?.email}</Text>
      <Text style={styles.label}>First Name: {userDetails.firstName}</Text>
      <Text style={styles.label}>Last Name: {userDetails.lastName}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default ProfileScreen;
