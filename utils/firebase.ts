import { initializeApp } from 'firebase/app';
import {
  addDoc,
  Firestore,
  getFirestore,
  onSnapshot,
  collection,
  getDocs,
  doc,
  query,
  setDoc,
  getDoc,
  getCountFromServer,
  updateDoc,
  documentId,
  arrayUnion,
} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyDlLdZslY2GlNxb7hdE-u9vC9yfTJOBHQ4',
  authDomain: 'gamejutsutezos.firebaseapp.com',
  projectId: 'gamejutsutezos',
  storageBucket: 'gamejutsutezos.appspot.com',
  messagingSenderId: '1037030987188',
  appId: '1:1037030987188:web:6d400c8e1a193ce74d0ee1',
  measurementId: 'G-4S96EHN1T8',
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const addData = async (
  database: Firestore,
  collectionName: string,
  data: { [fieldName: string]: any },
) => {
  try {
    const docRef = await addDoc(collection(database, collectionName), data);
    return {
      documentId: docRef.id,
      message: `document with id: "${docRef.id}" successfully added to collection "${collectionName}"`,
    };
  } catch (error) {
    throw new Error(`Error when adding document to collection "${collectionName}": ${error}`);
  }
};

export const addDataWithCustomId = async (
  database: Firestore,
  collectionName: string,
  data: { [fieldName: string]: any },
  documentId: string,
) => {
  console.log(collectionName, documentId, data);

  try {
    await setDoc(doc(database, collectionName, documentId), data);
    return {
      documentId,
      message: `Document with id: "${documentId}" successfully added to the collection "${collectionName}"`,
    };
  } catch (error) {
    throw new Error(
      `Error when adding a document with id: "${documentId}" to the collection "${collectionName}": ${error}`,
    );
  }
};

export const subcribeListeningCollection = (
  database: Firestore,
  collectionName: string,
  cb: (data: any) => void,
) => {
  const q = query(collection(database, collectionName));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const results: any[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, data: doc.data() });
    });
    console.log('results', results);
    cb(results);
  });
  return unsubscribe;
};

export const subcribeListeningByDocumentId = (
  database: Firestore,
  collectionName: string,
  cb: (data: any) => void,
  documentId: string,
) => {
  const unsubscribe = onSnapshot(doc(database, collectionName, documentId), (doc) => {
    const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server';
    console.log(source, ' data: ', doc.data());
    cb(doc.data());
  });
  return unsubscribe;
};

export const getDocumentById = async (
  database: Firestore,
  collectionName: string,
  documentId: string,
) => {
  const docRef = doc(database, collectionName, documentId);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? docSnap.data() : null;
};

export const getAllDocuments = async (database: Firestore, collectionName: string) => {
  const querySnapshot = await getDocs(collection(database, collectionName));
  const results: { [id: string]: any } = [];
  querySnapshot.forEach((doc) => {
    results.push({ [doc.id]: doc.data() });
  });
};

export const getCollectionSize = async (database: Firestore, collectionName: string) => {
  const snapshot = await getCountFromServer(collection(database, collectionName));
  return snapshot.data().count;
};

export const updateDocumentData = async (
  database: Firestore,
  collectionName: string,
  data: { [fieldName: string]: any },
  documentId: string,
) => {
  const docRef = doc(database, collectionName, documentId);
  await updateDoc(docRef, data);
};

export const updateDocumentArrayDataByField = async (
  database: Firestore,
  collectionName: string,
  data: { [fieldName: string]: any },
  documentId: string,
  fieldName: string,
) => {
  const docRef = doc(database, collectionName, documentId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, { [fieldName]: arrayUnion(data) });
    return data;
  }
  addDataWithCustomId(database, collectionName, { [fieldName]: [data] }, documentId);
};
