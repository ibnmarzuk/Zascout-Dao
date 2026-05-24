import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp({
  ...firebaseConfig,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY
});
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

export const syncSavedOpportunities = async (userId: string) => {
  if (!userId) return;
  try {
    const localSavedStr = localStorage.getItem('zascout_saved');
    let localSaved: any[] = [];
    if (localSavedStr) {
      localSaved = JSON.parse(localSavedStr);
    }
    
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    let firestoreSaved: any[] = [];
    if (userDoc.exists() && userDoc.data()?.savedOpportunities) {
      firestoreSaved = userDoc.data().savedOpportunities;
    }
    
    // Merge both arrays (remove duplicates based on id)
    const mergedMap = new Map();
    [...firestoreSaved, ...localSaved].forEach((item) => {
      if (item && item.id) {
        mergedMap.set(item.id, item);
      }
    });

    const mergedSaved = Array.from(mergedMap.values());
    
    // Save back to Firestore
    await setDoc(userDocRef, {
      savedOpportunities: mergedSaved
    }, { merge: true });
    
    // Save back to localStorage
    localStorage.setItem('zascout_saved', JSON.stringify(mergedSaved));
    
  } catch (error) {
    console.error('Error syncing saved opportunities:', error);
  }
};
