import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';

export default function EditFlashCard({ route, navigation }) {
  const { id } = route.params;
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState('');
  const [color, setColor] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'flashcards', id), (doc) => {
      const data = doc.data();
      if (data) {
        setTitle(data.title);
        setTasks(data.tasks);
        setColor(data.color);
        setDueDate(data.dueDate);
      }
    });
    return () => unsubscribe();
  }, [id]);

  const updateFlashcard = async () => {
    try {
      const cardDoc = doc(db, 'flashcards', id);
      await updateDoc(cardDoc, { title, tasks, color, dueDate });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating flashcard: ', error);
      Alert.alert('Error updating flashcard', error.message);
    }
  };

  const deleteFlashcard = async () => {
    try {
      const cardDoc = doc(db, 'flashcards', id);
      await deleteDoc(cardDoc);
      Alert.alert('Flashcard deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting flashcard: ', error);
      Alert.alert('Error deleting flashcard', error.message);
    }
  };

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Flashcard</Text>
      <Text style={styles.label}>Title:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" />
      <Text style={styles.label}>Tasks:</Text>
      <TextInput style={styles.input} value={tasks} onChangeText={setTasks} multiline placeholder="Enter tasks" />
      <Text style={styles.label}>Color:</Text>
      <View style={styles.colorOptions}>
        {colors.map((colorOption, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.colorButton, { backgroundColor: colorOption }]}
            onPress={() => setColor(colorOption)}
          />
        ))}
      </View>
      <View style={[styles.colorPreview, { backgroundColor: color || '#fff' }]} />
      <Text style={styles.label}>Due Date:</Text>
      <TextInput style={styles.input} value={dueDate} onChangeText={setDueDate} placeholder="Enter due date" />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={updateFlashcard}>
          <Text style={styles.buttonText}>Update Flashcard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={deleteFlashcard}>
          <Text style={styles.buttonText}>Delete Flashcard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  colorPreview: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
