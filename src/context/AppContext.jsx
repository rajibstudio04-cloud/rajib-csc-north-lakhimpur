import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';
import { INITIAL_APPLICATIONS, INITIAL_UTILITY_TRANSACTIONS } from '../data/sampleData';
import { firebaseService } from '../services/firebaseService';
import { walletService } from '../services/walletService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Language state (default English, saved in localStorage)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('rajib_csc_lang') || 'en';
  });

  // Active navigation tab state
  const [activeTab, setActiveTab] = useState('home');

  // Active service selected for application form wizard
  const [selectedService, setSelectedService] = useState(null);

  // Active tracking search ID
  const [activeTrackingId, setActiveTrackingId] = useState('');

  // Admin Mode Toggle
  const [isAdmin, setIsAdmin] = useState(false);

  // Applications list loaded & synchronized in real-time from Firestore database API
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);

  // Current Logged in Citizen User Session (Phone OTP Authenticated)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rajib_csc_citizen_phone');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Real-time listener for Firestore applications collection
  useEffect(() => {
    const unsubscribe = firebaseService.subscribeToFirestoreApplications((updatedApps) => {
      if (updatedApps && updatedApps.length > 0) {
        setApplications(updatedApps);
      }
    }, INITIAL_APPLICATIONS);

    return () => unsubscribe();
  }, []);

  const loginUser = (phone, name) => {
    const userProfile = {
      phone: String(phone).replace(/\D/g, ''),
      name: name || 'Citizen Customer',
      verified: true,
      verifiedAt: new Date().toISOString()
    };
    setCurrentUser(userProfile);
    try {
      localStorage.setItem('rajib_csc_citizen_phone', JSON.stringify(userProfile));
    } catch (e) {}
    return userProfile;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('rajib_csc_citizen_phone');
  };

  const refreshUserWallet = () => {};

  // Utility Transactions list
  const [utilityTxns, setUtilityTxns] = useState(() => {
    const saved = localStorage.getItem('rajib_csc_utility');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_UTILITY_TRANSACTIONS;
      }
    }
    return INITIAL_UTILITY_TRANSACTIONS;
  });

  // Toast Notification state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('rajib_csc_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('rajib_csc_utility', JSON.stringify(utilityTxns));
  }, [utilityTxns]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Translation helper function
  const t = (key) => {
    if (translations[lang] && translations[lang][key] !== undefined) {
      return translations[lang][key];
    }
    // Fallback to English
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return key;
  };

  // Add new citizen application (POST request to Firestore DB API)
  const addApplication = async (newAppData) => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const refId = `CSC-LKP-2026-${randomSuffix}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    const createdApp = {
      id: refId,
      ...newAppData,
      status: 'Submitted',
      submittedAt: formattedDate,
      remarks: 'Application submitted securely to Firebase Firestore database API.',
      issuedDocUrl: null
    };

    // Save to Firebase Firestore & Storage APIs
    await firebaseService.saveApplicationToFirestore(createdApp);

    setApplications((prev) => [createdApp, ...(prev || []).filter(a => a.id !== refId)]);
    showToast(`${t('msgSuccessSubmit')} ${refId}`, 'success');
    return createdApp;
  };

  // Admin update status (PATCH request to Firestore DB API)
  const updateApplicationStatus = async (appId, newStatus, remarks = '', issuedDocUrl = null) => {
    setApplications((prev) =>
      (prev || []).map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: newStatus,
            remarks: remarks || app.remarks,
            issuedDocUrl: issuedDocUrl !== null ? issuedDocUrl : app.issuedDocUrl
          };
        }
        return app;
      })
    );

    await firebaseService.updateApplicationStatusInFirestore(appId, newStatus, remarks, issuedDocUrl);
    showToast(`Status updated for ${appId} to "${newStatus}"`, 'success');
  };

  // Add new utility payment transaction
  const addUtilityTxn = (txnData) => {
    const txnId = `TXN-APDCL-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    const newTxn = {
      txnId,
      ...txnData,
      status: 'Paid',
      paidAt: formattedDate
    };

    setUtilityTxns((prev) => [newTxn, ...(prev || [])]);
    showToast(`Payment of ₹${txnData.amount} successful! Txn ID: ${txnId}`, 'success');
    return newTxn;
  };

  const startServiceApplication = (serviceObj) => {
    setSelectedService(serviceObj);
    setActiveTab('services');
  };

  const openTracker = (refId) => {
    setActiveTrackingId(refId);
    setActiveTab('track');
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentUser,
        loginUser,
        logoutUser,
        refreshUserWallet,
        activeTab,
        setActiveTab,
        selectedService,
        setSelectedService,
        activeTrackingId,
        setActiveTrackingId,
        isAdmin,
        setIsAdmin,
        applications,
        addApplication,
        updateApplicationStatus,
        utilityTxns,
        addUtilityTxn,
        startServiceApplication,
        openTracker,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
