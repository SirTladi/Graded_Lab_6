import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddFlashCard({ navigation }) {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState('');
  const [color, setColor] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const addFlashcard = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'flashcards'), {
          title,
          tasks,
          color,
          dueDate: formatDate(dueDate),
          status: 'incomplete',
          userId: user.uid,
        });
        Alert.alert('Flashcard added successfully');
        navigation.navigate('Flashcards');
      } else {
        Alert.alert('User not logged in');
      }
    } catch (error) {
      Alert.alert('Error adding flashcard', error.message);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Flashcard</Text>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Tasks:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter tasks"
        value={tasks}
        onChangeText={setTasks}
        multiline
      />
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
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
        <Text>{formatDate(dueDate)}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={addFlashcard}>
        <Text style={styles.buttonText}>Add Flashcard</Text>
      </TouchableOpacity>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
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
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorPreview: {
    height: 50,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
