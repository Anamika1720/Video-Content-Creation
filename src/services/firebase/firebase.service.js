import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebase.config";
import { collection, getDocs } from "firebase/firestore";

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firestoreDB = getFirestore(app);

export const getCollection = (collectionName) => {
  return collection(firestoreDB, collectionName);
};

export const getDocsData = async (collectionName) => {
  const snapshot = await getDocs(getCollection(collectionName));
  const list = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return list;
};

export const addDocToFB = async (payload, collection) => {
  try {
    await addDoc(getCollection(collection), payload);
  } catch (err) {
    console.log("Err: ", err);
  }
};
