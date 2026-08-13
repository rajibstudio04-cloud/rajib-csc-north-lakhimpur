// Firebase Firestore & Firebase Storage API Service
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadString, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './firebaseConfig';
import { dbService } from './dbService';

const COLLECTION_NAME = 'applications';

export const firebaseService = {
  // 1. Upload Document file to Firebase Storage
  async uploadDocumentToStorage(fileObj, appId, docId) {
    if (!fileObj || !fileObj.url) return null;

    if (isFirebaseConfigured && storage) {
      try {
        const fileRef = ref(storage, `applications/${appId}/${docId}_${Date.now()}`);
        if (fileObj.url.startsWith('data:')) {
          await uploadString(fileRef, fileObj.url, 'data_url');
          const downloadUrl = await getDownloadURL(fileRef);
          return downloadUrl;
        }
      } catch (error) {
        console.warn('[Firebase Storage] Upload fallback:', error);
      }
    }
    return fileObj.url;
  },

  // 2. Save Citizen Application (POST request to Firestore Database API)
  async saveApplicationToFirestore(appData) {
    if (appData.documents && appData.documents.length > 0) {
      const processedDocs = await Promise.all(
        appData.documents.map(async (d) => {
          if (d.url && d.url.startsWith('data:')) {
            const storageUrl = await this.uploadDocumentToStorage(d, appData.id, d.docId || 'doc');
            return { ...d, url: storageUrl };
          }
          return d;
        })
      );
      appData.documents = processedDocs;
    }

    await dbService.saveApplication(appData);

    if (isFirebaseConfigured && db) {
      try {
        const appRef = doc(db, COLLECTION_NAME, appData.id);
        await setDoc(appRef, {
          ...appData,
          createdAt: new Date().toISOString()
        });
        console.log(`[Firestore API] POST Application saved successfully with ID: ${appData.id}`);
      } catch (error) {
        console.warn('[Firestore API Error] Local fallback used:', error);
      }
    }
    return appData;
  },

  // 3. Real-Time GET Listener for Admin Dashboard (GET request via Firestore onSnapshot)
  subscribeToFirestoreApplications(onUpdateCallback, initialFallback = []) {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const apps = [];
          snapshot.forEach((docSnap) => {
            apps.push({ id: docSnap.id, ...docSnap.data() });
          });
          if (apps.length > 0) {
            onUpdateCallback(apps);
          } else {
            dbService.getAllApplications(initialFallback).then(onUpdateCallback);
          }
        }, (error) => {
          console.warn('[Firestore Snapshot Listener Error]:', error);
          dbService.getAllApplications(initialFallback).then(onUpdateCallback);
        });
        return unsubscribe;
      } catch (e) {
        console.warn('[Firestore Sub Error]:', e);
      }
    }

    dbService.getAllApplications(initialFallback).then(onUpdateCallback);
    return () => {};
  },

  // 4. Update Application Status (PATCH/PUT request to Firestore API)
  async updateApplicationStatusInFirestore(appId, newStatus, remarks = '', issuedDocUrl = null) {
    await dbService.updateStatus(appId, newStatus, remarks, issuedDocUrl);

    if (isFirebaseConfigured && db) {
      try {
        const appRef = doc(db, COLLECTION_NAME, appId);
        const updatePayload = {
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
        if (remarks) updatePayload.remarks = remarks;
        if (issuedDocUrl !== null) updatePayload.issuedDocUrl = issuedDocUrl;

        await updateDoc(appRef, updatePayload);
        console.log(`[Firestore API] PATCH Application status updated for ${appId} -> ${newStatus}`);
      } catch (error) {
        console.warn('[Firestore Update Error]:', error);
      }
    }
  }
};
