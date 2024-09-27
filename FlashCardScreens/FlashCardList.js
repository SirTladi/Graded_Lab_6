import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function FlashCardList({ navigation }) {
  const [flashcards, setFlashcards] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(
        collection(db, 'flashcards'),
        where('userId', '==', user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const flashcardsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFlashcards(flashcardsData);
      });

      return () => unsubscribe();
    }
  }, []);

  const markAsComplete = async (id) => {
    try {
      const cardDoc = doc(db, 'flashcards', id);
      await updateDoc(cardDoc, { status: 'completed' });
    } catch (error) {
      console.error('Error updating flashcard status: ', error);
    }
  };

  const renderFlashcard = ({ item }) => (
    <View style={[styles.card, { backgroundColor: item.color || '#fff' }]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.tasks}>{item.tasks}</Text>
      <Text style={styles.dueDate}>Due: {item.dueDate}</Text>
      {item.status === 'incomplete' && (
        <TouchableOpacity onPress={() => markAsComplete(item.id)} style={styles.completeButton}>
          <Text style={styles.buttonText}>Mark Complete</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('EditFlashcard', { id: item.id })} style={styles.editButton}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredFlashcards = flashcards.filter(card => card.status === (showCompleted ? 'completed' : 'incomplete'));

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.profileButtonText}>Profile</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.showButton} onPress={() => setShowCompleted(false)}>
            <Text style={styles.buttonText}>Show Incomplete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.showButton} onPress={() => setShowCompleted(true)}>
            <Text style={styles.buttonText}>Show Completed</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddFlashcard')}>
          <Text style={styles.buttonText}>Add Flashcard</Text>
        </TouchableOpacity>
      </View>

      {filteredFlashcards.length === 0 ? (
        <Text style={styles.emptyMessage}>
          {showCompleted ? "There are no completed flashcards." : "There are no incomplete flashcards."}
        </Text>
      ) : (
        <FlatList
          data={filteredFlashcards}
          renderItem={renderFlashcard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0f7fa',
  },
  card: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  tasks: {
    marginTop: 5,
    fontSize: 16,
    color: '#555',
  },
  dueDate: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
  },
  completeButton: {
    marginTop: 10,
    backgroundColor: '#6FCF6D',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#2F80ED',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  buttonContainer: {
    marginTop: 60,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  showButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#F2C94C',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButton: {
    marginTop: 15,
    backgroundColor: '#56CCF2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  profileButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
