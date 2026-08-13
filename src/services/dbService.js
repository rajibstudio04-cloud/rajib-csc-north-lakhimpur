// Persistent Database Service using IndexedDB and LocalStorage fallback
// Stores citizen applications, dynamic form fields, and uploaded document blobs

const DB_NAME = 'RajibCSC_Database';
const DB_VERSION = 1;
const STORE_NAME = 'applications';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => {
      console.warn('IndexedDB open error, falling back to LocalStorage:', event.target.error);
      resolve(null);
    };
  });
}

// Fallback LocalStorage operations
function getLocalStorageApps() {
  try {
    const data = localStorage.getItem('rajib_csc_apps_v2');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function setLocalStorageApps(apps) {
  try {
    localStorage.setItem('rajib_csc_apps_v2', JSON.stringify(apps));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const dbService = {
  // Save new citizen application
  async saveApplication(appData) {
    const db = await openDB();
    if (db) {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(appData);
        req.onsuccess = () => {
          // Also sync with LocalStorage
          const currentLS = getLocalStorageApps();
          const updated = [appData, ...currentLS.filter(a => a.id !== appData.id)];
          setLocalStorageApps(updated);
          resolve(appData);
        };
        req.onerror = () => {
          // Fallback to LocalStorage
          const currentLS = getLocalStorageApps();
          const updated = [appData, ...currentLS.filter(a => a.id !== appData.id)];
          setLocalStorageApps(updated);
          resolve(appData);
        };
      });
    } else {
      const currentLS = getLocalStorageApps();
      const updated = [appData, ...currentLS.filter(a => a.id !== appData.id)];
      setLocalStorageApps(updated);
      return appData;
    }
  },

  // Get all applications
  async getAllApplications(initialFallback = []) {
    const db = await openDB();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          let results = req.result || [];
          if (results.length === 0) {
            const ls = getLocalStorageApps();
            results = ls.length > 0 ? ls : initialFallback;
          }
          resolve(results);
        };
        req.onerror = () => {
          const ls = getLocalStorageApps();
          resolve(ls.length > 0 ? ls : initialFallback);
        };
      });
    } else {
      const ls = getLocalStorageApps();
      return ls.length > 0 ? ls : initialFallback;
    }
  },

  // Update status of an application
  async updateStatus(appId, newStatus, remarks = '', issuedDocUrl = null) {
    const allApps = await this.getAllApplications();
    const target = allApps.find(a => a.id === appId);
    if (target) {
      target.status = newStatus;
      if (remarks) target.remarks = remarks;
      if (issuedDocUrl !== null) target.issuedDocUrl = issuedDocUrl;
      target.updatedAt = new Date().toISOString();
      await this.saveApplication(target);
      return target;
    }
    return null;
  },

  // Delete application
  async deleteApplication(appId) {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(appId);
    }
    const currentLS = getLocalStorageApps();
    const filtered = currentLS.filter(a => a.id !== appId);
    setLocalStorageApps(filtered);
  }
};
