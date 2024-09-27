import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

export const addFlashcard = async (flashcard) => {
  try {
    const docRef = await addDoc(collection(db, 'flashcards'), flashcard);
    return docRef.id;
  } catch (error) {
    console.error("Error adding flashcard: ", error);
    throw error;
  }
};

export const updateFlashcard = async (id, updatedData) => {
  try {
    const cardDoc = doc(db, 'flashcards', id);
    await updateDoc(cardDoc, updatedData);
  } catch (error) {
    console.error("Error updating flashcard: ", error);
    throw error;
  }
};

export const deleteFlashcard = async (id) => {
  try {
    const cardDoc = doc(db, 'flashcards', id);
    await deleteDoc(cardDoc);
  } catch (error) {
    console.error("Error deleting flashcard: ", error);
    throw error;
  }
};

export const getFlashcard = (id, callback) => {
  const unsubscribe = onSnapshot(doc(db, 'flashcards', id), (doc) => {
    callback(doc.data());
  });
  return unsubscribe;
};

export const getAllFlashcards = (callback) => {
  const unsubscribe = onSnapshot(collection(db, 'flashcards'), (snapshot) => {
    const flashcards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(flashcards);
  });
  return unsubscribe;
};
