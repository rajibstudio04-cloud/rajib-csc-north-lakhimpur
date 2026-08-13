// Closed-Loop Digital Wallet Service (Firestore & Local DB Storage)
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebaseConfig';

const USERS_COLLECTION = 'users';
const TRANSACTIONS_COLLECTION = 'wallet_transactions';

// Local storage key for offline fallback
const LOCAL_USERS_KEY = 'rajib_csc_wallet_users_v1';
const LOCAL_TXNS_KEY = 'rajib_csc_wallet_txns_v1';

// Initial demo users
const INITIAL_DEMO_USERS = [
  {
    id: 'USR-LKP-94350',
    name: 'Diganta Borah',
    phone: '9435012345',
    email: 'diganta.borah@gmail.com',
    walletBalance: 1500,
    address: 'Khelmati Ward 8, Lakhimpur',
    createdAt: new Date().toISOString()
  },
  {
    id: 'USR-LKP-98540',
    name: 'Bhaben Gogoi',
    phone: '9854067890',
    email: 'bhaben.gogoi@yahoo.com',
    walletBalance: 350,
    address: 'Bihpuria Town, Lakhimpur',
    createdAt: new Date().toISOString()
  }
];

function getLocalUsers() {
  try {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    return data ? JSON.parse(data) : INITIAL_DEMO_USERS;
  } catch (e) {
    return INITIAL_DEMO_USERS;
  }
}

function setLocalUsers(users) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error(e);
  }
}

function getLocalTxns() {
  try {
    const data = localStorage.getItem(LOCAL_TXNS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function setLocalTxns(txns) {
  try {
    localStorage.setItem(LOCAL_TXNS_KEY, JSON.stringify(txns));
  } catch (e) {
    console.error(e);
  }
}

export const walletService = {
  // 1. Find or Register Citizen by Phone Number
  async loginOrRegisterUser(phone, name = 'Lakhimpur Citizen') {
    const cleanPhone = phone.replace(/\D/g, '');
    const userId = `USR-LKP-${cleanPhone.slice(-5) || Math.floor(10000 + Math.random() * 90000)}`;

    let existingUser = null;

    if (isFirebaseConfigured && db) {
      try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          existingUser = { id: snap.id, ...snap.data() };
        }
      } catch (e) {
        console.warn('[Firestore Wallet Login Error]:', e);
      }
    }

    if (!existingUser) {
      const localUsers = getLocalUsers();
      existingUser = localUsers.find(u => u.phone === cleanPhone);
    }

    if (!existingUser) {
      const newUser = {
        id: userId,
        name: name,
        phone: cleanPhone,
        email: `${cleanPhone}@rajibcsc.in`,
        walletBalance: 1500,
        address: 'North Lakhimpur, Assam',
        createdAt: new Date().toISOString()
      };

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, USERS_COLLECTION, userId), newUser);
        } catch (e) {
          console.warn('[Firestore User Create Error]:', e);
        }
      }

      const localUsers = getLocalUsers();
      setLocalUsers([newUser, ...localUsers.filter(u => u.id !== userId)]);
      return newUser;
    }

    return existingUser;
  },

  // 2. Real-Time Listener for User Profile & Wallet Balance
  subscribeUserWallet(userId, onUpdateCallback) {
    if (!userId) return () => {};

    if (isFirebaseConfigured && db) {
      try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        const unsubscribe = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            onUpdateCallback({ id: snap.id, ...snap.data() });
          }
        }, (err) => {
          console.warn('[Firestore Wallet Sub Error]:', err);
        });
        return unsubscribe;
      } catch (e) {
        console.warn(e);
      }
    }

    const timer = setTimeout(() => {
      const localUsers = getLocalUsers();
      const target = localUsers.find(u => u.id === userId);
      if (target) onUpdateCallback(target);
    }, 100);

    return () => clearTimeout(timer);
  },

  // 3. Deduct Wallet Balance during Checkout Validation
  async debitWalletBalance(userId, amount, description = 'Service Payment') {
    const localUsers = getLocalUsers();
    const userIndex = localUsers.findIndex(u => u.id === userId);
    let currentUser = userIndex >= 0 ? localUsers[userIndex] : null;

    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, USERS_COLLECTION, userId));
        if (snap.exists()) {
          currentUser = { id: snap.id, ...snap.data() };
        }
      } catch (e) {
        console.warn(e);
      }
    }

    if (!currentUser) {
      return { success: false, reason: 'user_not_found' };
    }

    const currentBalance = Number(currentUser.walletBalance || 0);
    const requiredAmount = Number(amount);

    if (currentBalance < requiredAmount) {
      return {
        success: false,
        reason: 'insufficient_balance',
        available: currentBalance,
        required: requiredAmount,
        shortfall: requiredAmount - currentBalance
      };
    }

    const newBalance = currentBalance - requiredAmount;
    const txnId = `WTXN-DEBIT-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const txnRecord = {
      txnId,
      userId,
      userName: currentUser.name,
      phone: currentUser.phone,
      type: 'debit',
      amount: requiredAmount,
      balanceAfter: newBalance,
      description,
      timestamp: now
    };

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, USERS_COLLECTION, userId), {
          walletBalance: newBalance,
          updatedAt: now
        });
        await setDoc(doc(db, TRANSACTIONS_COLLECTION, txnId), txnRecord);
      } catch (e) {
        console.warn('[Firestore Debit Error]:', e);
      }
    }

    if (userIndex >= 0) {
      localUsers[userIndex].walletBalance = newBalance;
      setLocalUsers(localUsers);
    }
    const localTxns = getLocalTxns();
    setLocalTxns([txnRecord, ...localTxns]);

    return {
      success: true,
      newBalance,
      txnId,
      txnRecord
    };
  },

  // 4. Admin Manual Credit/Debit Cash Operations
  async updateWalletBalanceByAdmin(userId, amount, actionType = 'credit', remarks = 'Cash received at center') {
    const numAmount = Math.abs(Number(amount));
    const localUsers = getLocalUsers();
    const userIndex = localUsers.findIndex(u => u.id === userId);
    let currentUser = userIndex >= 0 ? localUsers[userIndex] : null;

    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, USERS_COLLECTION, userId));
        if (snap.exists()) {
          currentUser = { id: snap.id, ...snap.data() };
        }
      } catch (e) {
        console.warn(e);
      }
    }

    if (!currentUser) return null;

    const currentBalance = Number(currentUser.walletBalance || 0);
    const newBalance = actionType === 'credit' 
      ? currentBalance + numAmount 
      : Math.max(0, currentBalance - numAmount);

    const txnId = `WTXN-ADM-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const txnRecord = {
      txnId,
      userId,
      userName: currentUser.name,
      phone: currentUser.phone,
      type: actionType,
      amount: numAmount,
      balanceAfter: newBalance,
      description: `VLE Admin ${actionType.toUpperCase()} - ${remarks}`,
      timestamp: now
    };

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, USERS_COLLECTION, userId), {
          walletBalance: newBalance,
          updatedAt: now
        });
        await setDoc(doc(db, TRANSACTIONS_COLLECTION, txnId), txnRecord);
      } catch (e) {
        console.warn('[Firestore Admin Wallet Update Error]:', e);
      }
    }

    if (userIndex >= 0) {
      localUsers[userIndex].walletBalance = newBalance;
      setLocalUsers(localUsers);
    }
    const localTxns = getLocalTxns();
    setLocalTxns([txnRecord, ...localTxns]);

    return {
      updatedUser: { ...currentUser, walletBalance: newBalance },
      txnRecord
    };
  },

  // 5. Get All Citizens & Wallet Audit Logs for Admin
  async getAllUsers() {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, USERS_COLLECTION));
        const users = [];
        snap.forEach(d => users.push({ id: d.id, ...d.data() }));
        if (users.length > 0) return users;
      } catch (e) {
        console.warn(e);
      }
    }
    return getLocalUsers();
  },

  async getWalletTxnLogs() {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, TRANSACTIONS_COLLECTION), orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);
        const txns = [];
        snap.forEach(d => txns.push({ id: d.id, ...d.data() }));
        if (txns.length > 0) return txns;
      } catch (e) {
        console.warn(e);
      }
    }
    return getLocalTxns();
  }
};
