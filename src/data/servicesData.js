export const SERVICES = [
  {
    id: 'income-cert',
    title: {
      en: 'Income Certificate',
      as: 'আয়ৰ প্ৰমাণপত্ৰ',
      hi: 'आय प्रमाण पत्र'
    },
    assameseSub: 'আয়ৰ প্ৰমাণপত্ৰ',
    useCases: {
      en: 'Scholarship • Admission • Govt Scheme',
      as: 'বৃত্তি • নামভৰ্তি • চৰকাৰী আঁচনি',
      hi: 'छात्रवृत्ति • प्रवेश • सरकारी योजना'
    },
    category: 'edistrict',
    iconName: 'IndianRupee',
    dept: 'Revenue Circle Office Lakhimpur',
    deptLoc: {
      en: 'Revenue Circle Office Lakhimpur',
      as: 'ৰাজহ চক্ৰ বিষয়াৰ কাৰ্যালয়, লক্ষীমপুৰ',
      hi: 'राजस्व चक्र अधिकारी कार्यालय, लखीमपुर'
    },
    processingDays: '3–5 Days',
    processingTime: {
      en: '3–5 Days',
      as: '৩–৫ দিন',
      hi: '3–5 दिन'
    },
    govtFee: 20,
    cscFee: 40,
    popular: true,
    description: {
      en: 'Official Assam Government Income Certificate for scholarships & admissions.',
      as: 'স্কলাৰশ্বিপ আৰু চৰকাৰী আঁচনিৰ বাবে লক্ষীমপুৰ চক্ৰ বিষয়াৰ আয়ৰ প্ৰমাণপত্ৰ।',
      hi: 'छात्रवृत्ति और योजनाओं के लिए आय प्रमाण पत्र।'
    },
    requiredDocs: [
      { id: 'addressProofFront', name: '1. Address Proof - Front Side (ঠিকনাৰ প্ৰমান পত্ৰ - সন্মুখৰ ভাগ)', required: true },
      { id: 'addressProofBack', name: '2. Address Proof - Back Side (ঠিকনাৰ প্ৰমান পত্ৰ - পিছফালৰ ভাগ)', required: true },
      { id: 'identityProofFront', name: '3. Identity Proof - Front Side (পৰিচয় পত্ৰ - সন্মুখৰ ভাগ)', required: true },
      { id: 'identityProofBack', name: '4. Identity Proof - Back Side (পৰিচয় পত্ৰ - পিছফালৰ ভাগ)', required: true },
      { id: 'applicantSignature', name: '5. Applicant Signature / Specimen (আবেদনকাৰীৰ স্বাক্ষৰ / টিপ ছাব)', required: true },
      { id: 'gaonPradhanCert', name: '6. Gaon Pradhan / Gaonburah Certificate (গাঁও প্ৰধান / গাওঁবুঢ়াৰ প্ৰমাণ পত্ৰ)', required: true },
      { id: 'landReceipt', name: '7. Land Revenue Receipt (ৰাজহ মাচুল আদায়ৰ ৰছিদ)', required: true },
      { id: 'salarySlip', name: '8. Salary Slip (দৰমহাৰ পত্ৰ)', required: false },
      { id: 'otherDoc', name: '9. Any other document (অন্য নথি)', required: false },
      { id: 'userForm', name: '10. Upload Scanned Copy of Application Form (ইউজাৰ ফৰ্মখন সংলগ্ন কৰা)', required: true }
    ],
    fields: [
      { id: 'sourceOfIncome', label: 'Source of Income', type: 'select', options: ['Agriculture / Farming', 'Government Service', 'Private Employment', 'Business / Trade'] },
      { id: 'annualIncome', label: 'Total Annual Income (₹)', type: 'number', placeholder: 'e.g. 120000' }
    ]
  },
  {
    id: 'senior-citizen-cert',
    title: {
      en: 'Senior Citizen Certificate',
      as: 'জ্যেষ্ঠ নাগৰিকৰ প্ৰমাণপত্ৰ',
      hi: 'वरिष्ठ नागरिक प्रमाण पत्र'
    },
    assameseSub: 'জ্যেষ্ঠ নাগৰিকৰ প্ৰমাণপত্ৰ',
    useCases: {
      en: 'Senior Citizen Benefits • Pension • Concession',
      as: 'জ্যেষ্ঠ নাগৰিক সুবিধা • পেঞ্চন • ৰেহাই',
      hi: 'वरिष्ठ नागरिक लाभ • पेंशन • छूट'
    },
    category: 'edistrict',
    iconName: 'Award',
    dept: 'Social Welfare Assam',
    deptLoc: {
      en: 'Social Welfare & Revenue Dept Assam',
      as: 'সমাজ কল্যাণ আৰু ৰাজহ বিভাগ অসম',
      hi: 'समाज कल्याण एवं राजस्व विभाग असम'
    },
    processingDays: '5–7 Days',
    processingTime: {
      en: '5–7 Days',
      as: '৫–৭ দিন',
      hi: '5–7 दिन'
    },
    govtFee: 25,
    cscFee: 45,
    popular: true,
    description: {
      en: 'Senior Citizen ID card for railway/bus concessions & pension benefits.',
      as: 'জ্যেষ্ঠ নাগৰিকৰ চৰকাৰী পৰিচয় পত্ৰ।',
      hi: 'वरिष्ठ नागरिक प्रमाण पत्र।'
    },
    requiredDocs: [
      { id: 'ageProof', name: 'Age Proof Document (Aadhaar / Birth Cert / PAN)', required: true },
      { id: 'photo', name: 'Passport Size Photo', required: true }
    ],
    fields: [
      { id: 'ageYears', label: 'Applicant Current Age (Min 60 Years)', type: 'number', placeholder: 'e.g. 62' }
    ]
  },
  {
    id: 'prc-cert',
    title: {
      en: 'Permanent Resident Certificate (PRC)',
      as: 'স্থায়ী বাসিন্দাৰ প্ৰমাণপত্ৰ (PRC)',
      hi: 'स्थायी निवासी प्रमाण पत्र (PRC)'
    },
    assameseSub: 'স্থায়ী বাসিন্দাৰ প্ৰমাণপত্ৰ',
    useCases: {
      en: 'Higher Education • Govt Job • Admission',
      as: 'উচ্চ শিক্ষা • চৰকাৰী চাকৰি • নামভৰ্তি',
      hi: 'उच्च शिक्षा • सरकारी नौकरी • प्रवेश'
    },
    category: 'edistrict',
    iconName: 'FileCheck',
    dept: 'Revenue Circle Office Lakhimpur',
    deptLoc: {
      en: 'Revenue Circle Office Lakhimpur',
      as: 'ৰাজহ চক্ৰ বিষয়াৰ কাৰ্যালয়, লক্ষীমপুৰ',
      hi: 'राजस्व चक्र अधिकारी कार्यालय, लखीमपुर'
    },
    processingDays: '7–10 Days',
    processingTime: {
      en: '7–10 Days',
      as: '৭–১০ দিন',
      hi: '7–10 दिन'
    },
    govtFee: 30,
    cscFee: 50,
    popular: true,
    description: {
      en: 'Permanent Resident Certificate required for education & state jobs.',
      as: 'অসমত চাকৰি আৰু শিক্ষাৰ বাবে মূল স্থায়ী বাসিন্দাৰ প্ৰমাণপত্ৰ।',
      hi: 'असम में शिक्षा और नौकरियों के लिए स्थायी निवास प्रमाण पत्र।'
    },
    requiredDocs: [
      { id: 'propertyRecords', name: 'Land Patta / Jamabandi Copy', required: true },
      { id: 'votersList', name: 'Certified Copies of Voters List', required: true }
    ],
    fields: [
      { id: 'prcReason', label: 'Reason for PRC Application', type: 'select', options: ['Higher Education / Admission', 'Assam Govt Recruitment (ADRE)', 'Employment / Medical'] }
    ]
  },
  {
    id: 'ncl-cert',
    title: {
      en: 'Non-Creamy Layer Certificate (NCL)',
      as: 'নন-ক্ৰীমী লেয়াৰ প্ৰমাণপত্ৰ (NCL)',
      hi: 'नॉन-क्रीमी लेयर प्रमाण पत्र (NCL)'
    },
    assameseSub: 'নন-ক্ৰীমী লেয়াৰ প্ৰমাণপত্ৰ',
    useCases: {
      en: 'OBC/MOBC Reservation • Education • Govt Job',
      as: 'OBC/MOBC সংৰক্ষণ • শিক্ষা • চৰকাৰী চাকৰি',
      hi: 'OBC/MOBC आरक्षण • शिक्षा • सरकारी नौकरी'
    },
    category: 'edistrict',
    iconName: 'FileCheck',
    dept: 'Social Welfare & Revenue Dept Assam',
    deptLoc: {
      en: 'Social Welfare & Revenue Dept Assam',
      as: 'সমাজ কল্যাণ আৰু ৰাজহ বিভাগ অসম',
      hi: 'समाज कल्याण एवं राजस्व विभाग असम'
    },
    processingDays: '7–10 Days',
    processingTime: {
      en: '7–10 Days',
      as: '৭–১০ দিন',
      hi: '7–10 दिन'
    },
    govtFee: 30,
    cscFee: 50,
    popular: true,
    description: {
      en: 'Non-Creamy Layer (NCL) certificate for OBC/MOBC candidates in Assam.',
      as: 'OBC/MOBC প্ৰাৰ্থীসকলৰ বাবে নন-ক্ৰীমী লেয়াৰ (NCL) প্ৰমাণপত্ৰ।',
      hi: 'OBC/MOBC उम्मीदवारों के लिए नॉन-क्रीमी लेयर प्रमाण पत्र।'
    },
    requiredDocs: [
      { id: 'obcCert', name: 'OBC/MOBC Certificate Copy', required: true },
      { id: 'incomeProof', name: 'Family Income Certificate / Salary Slip', required: true },
      { id: 'landDoc', name: 'Land Patta / Jamabandi Copy', required: true }
    ],
    fields: [
      { id: 'casteCategory', label: 'Caste Category', type: 'select', options: ['OBC', 'MOBC'] },
      { id: 'annualFamilyIncome', label: 'Annual Family Income (₹)', type: 'number', placeholder: 'e.g. 150000' }
    ]
  },
  {
    id: 'nok-cert',
    title: {
      en: 'Next of Kin Certificate (NOK)',
      as: 'নিকট আত্মীয়ৰ প্ৰমাণপত্ৰ (NOK)',
      hi: 'निकट संबंधी प्रमाण पत्र (NOK)'
    },
    assameseSub: 'নিকট আত্মীয়ৰ প্ৰমাণপত্ৰ',
    useCases: {
      en: 'Bank Settlement • Legal Claim • Compensation',
      as: 'বেংক ছেটেলমেণ্ট • আইনী দাবী • ক্ষতিপূৰণ',
      hi: 'बैंक निपटान • कानूनी दावा • मुआवजा'
    },
    category: 'edistrict',
    iconName: 'Users',
    dept: 'WCM & Revenue Office Lakhimpur',
    deptLoc: {
      en: 'WCM & Revenue Office Lakhimpur',
      as: 'ডব্লিউ.চি.এম আৰু ৰাজহ কাৰ্যালয় লক্ষীমপুৰ',
      hi: 'डब्ल्यूसीएम एवं राजस्व कार्यालय लखीमपुर'
    },
    processingDays: '7–10 Days',
    processingTime: {
      en: '7–10 Days',
      as: '৭–১০ দিন',
      hi: '7–10 दिन'
    },
    govtFee: 30,
    cscFee: 50,
    popular: true,
    description: {
      en: 'Next of Kin (NOK) legal certificate for deceased person family claims & bank settlement.',
      as: 'মৃত ব্যক্তিৰ পৰিয়ালৰ বেংক ছেটেলমেণ্ট আৰু আইনী দাবীৰ বাবে নিকট আত্মীয়ৰ প্ৰমাণপত্ৰ।',
      hi: 'मृतक के परिजनों के बैंक निपटान व कानूनी दावों हेतु निकट संबंधी प्रमाण पत्र।'
    },
    requiredDocs: [
      { id: 'deathCert', name: 'Deceased Person Death Certificate', required: true },
      { id: 'applicantAadhaar', name: 'Applicant Identity Proof (Aadhaar/Voter)', required: true },
      { id: 'familyGaonburah', name: 'Gaonburah Report / Family Tree Affidavit', required: true }
    ],
    fields: [
      { id: 'deceasedName', label: 'Deceased Person Full Name', type: 'text', placeholder: 'e.g. Late Bhaben Gogoi' },
      { id: 'relationWithDeceased', label: 'Relationship with Deceased', type: 'select', options: ['Son / Daughter', 'Spouse (Wife/Husband)', 'Father / Mother', 'Brother / Sister'] }
    ]
  },
  {
    id: 'pan-card',
    title: {
      en: 'PAN Card — New / Correction',
      as: 'পান কাৰ্ড — নতুন / সংশোধন',
      hi: 'पैन कार्ड — नया / संशोधन'
    },
    assameseSub: 'নতুন PAN / PAN সংশোধন',
    useCases: {
      en: 'New PAN • Name/DOB Correction • PAN Update',
      as: 'নতুন PAN • নাম/জন্ম তাৰিখ সংশোধন • PAN আপডেইট',
      hi: 'नया पैन • नाम/जन्मतिथि संशोधन • पैन अपडेट'
    },
    category: 'identity',
    iconName: 'CreditCard',
    dept: 'NSDL / UTIITSL Portal',
    deptLoc: {
      en: 'NSDL / UTIITSL Portal',
      as: 'এন.এছ.ডি.এল / ইউ.টি.আই.টি.এছ.এল প’ৰ্টেল',
      hi: 'एनएसडीएल / यूटीआईआईटीएसएल पोर्टल'
    },
    processingDays: '2–5 Days (e-PAN)',
    processingTime: {
      en: '2–5 Days (e-PAN)',
      as: '২–৫ দিন (e-PAN)',
      hi: '2–5 दिन (e-PAN)'
    },
    govtFee: 107,
    cscFee: 50,
    popular: true,
    description: {
      en: 'Apply for fresh 10-digit PAN card or name/DOB correction.',
      as: 'নতুন ১০ জনীয়া পান কাৰ্ড আৱেদন বা সংশোধন কৰক।',
      hi: 'नया 10-अंकीय पैन कार्ड बनाएं या संशोधन करवाएं।'
    },
    requiredDocs: [
      { id: 'aadhaar', name: 'Applicant Aadhaar Card', required: true },
      { id: 'photo', name: 'Passport Photo (2 Copies)', required: true }
    ],
    fields: [
      { id: 'panType', label: 'PAN Application Type', type: 'select', options: ['New PAN Card (Physical + e-PAN)', 'Correction in Existing PAN', 'Re-print Lost PAN'] },
      { id: 'nameToPrint', label: 'Full Name on PAN Card', type: 'text', placeholder: 'e.g. BIPUL HAZARIKA' }
    ]
  },
  {
    id: 'aadhaar-booking',
    title: {
      en: 'Aadhaar',
      as: 'আধাৰ (Aadhaar)',
      hi: 'आधार (Aadhaar)'
    },
    assameseSub: 'আধাৰ সেৱা',
    useCases: {
      en: 'Mobile Linking • Address Change • Biometric',
      as: 'মোবাইল সংযোগ • ঠিকনা সলনি • বায়’মেট্ৰিক',
      hi: 'मोबाइल लिंकिंग • पता संशोधन • बायोमेट्रिक'
    },
    category: 'identity',
    iconName: 'Fingerprint',
    dept: 'UIDAI Center Lakhimpur',
    deptLoc: {
      en: 'UIDAI Center Lakhimpur',
      as: 'ইউ.আই.ডি.এ.আই কেন্দ্ৰ লক্ষীমপুৰ',
      hi: 'यूआईडीएआई केंद्र लखीमपुर'
    },
    processingDays: 'Instant Slot',
    processingTime: {
      en: 'Instant Slot',
      as: 'তৎক্ষণাৎ স্লট',
      hi: 'तुरंत स्लॉट'
    },
    govtFee: 50,
    cscFee: 30,
    popular: false,
    description: {
      en: 'Book priority slot for Mobile linking, Address change & Biometric update.',
      as: 'মোবাইল নম্বৰ সংযোগ, ঠিকনা সলনি আৰু বায়’মেট্ৰিক আপডেইটৰ বাবে স্লট বুক কৰক।',
      hi: 'मोबाइल नंबर लिंक, पता बदलने और बायोमेट्रिक अपडेट के लिए अपॉइंटमेंट बुक करें।'
    },
    requiredDocs: [
      { id: 'aadhaar', name: 'Existing Aadhaar Number / Slip Copy', required: true },
      { id: 'proofDoc', name: 'Supporting Proof Document (Bank Passbook / Voter ID)', required: true }
    ],
    fields: [
      { id: 'updateType', label: 'Aadhaar Service Needed', type: 'select', options: ['Mobile Number Linking / Change', 'Address / Name Change', 'Biometric Update (Photo/Fingerprint)', 'Child Biometric Update (5/15 Yrs)'] },
      { id: 'preferredDate', label: 'Preferred Appointment Date', type: 'date' }
    ]
  },
  {
    id: 'ayushman-card',
    title: {
      en: 'Ayushman',
      as: 'আয়ুষ্মান (Ayushman)',
      hi: 'आयुष्मान (Ayushman)'
    },
    assameseSub: 'আয়ুষ্মান কাৰ্ড',
    useCases: {
      en: '₹5 Lakh Free Treatment • PMJAY • Hospitalization',
      as: '৫ লাখ টকাৰ বিনামূলীয়া চিকিৎসা • PMJAY',
      hi: '₹5 लाख मुफ्त इलाज • पीएमजेएवाई'
    },
    category: 'edistrict',
    iconName: 'HeartPulse',
    dept: 'National Health Authority / NHA Assam',
    deptLoc: {
      en: 'National Health Authority / NHA Assam',
      as: 'ৰাষ্ট্ৰীয় স্বাস্থ্য প্ৰাধিকৰণ / NHA অসম',
      hi: 'राष्ट्रीय स्वास्थ्य प्राधिकरण / NHA असम'
    },
    processingDays: '1-2 Days',
    processingTime: {
      en: '1-2 Days',
      as: '১-২ দিন',
      hi: '1-2 दिन'
    },
    govtFee: 0,
    cscFee: 30,
    popular: false,
    description: {
      en: 'Ayushman Bharat AB-PMJAY Card generation for ₹5 Lakh free health treatment.',
      as: 'বিনামূলীয়া ৫ লাখ টকাৰ চিকিৎসা সুবিধাৰ বাবে আয়ুষ্মান কাৰ্ড আৱেদন কৰক।',
      hi: '₹5 लाख मुफ्त इलाज के लिए आयुष्मान भारत कार्ड जनरेट करें।'
    },
    requiredDocs: [
      { id: 'rationCard', name: 'Ration Card / NFSA Copy', required: true },
      { id: 'aadhaar', name: 'Applicant Aadhaar Card', required: true }
    ],
    fields: [
      { id: 'rationCardNo', label: 'Assam Ration Card / NFSA ID No', type: 'text', placeholder: 'e.g. 180500123456' },
      { id: 'memberCount', label: 'Number of Family Members in Card', type: 'number', placeholder: 'e.g. 4' }
    ]
  },
  {
    id: 'jeevan-pramaan',
    title: {
      en: 'Jeevan Pramaan',
      as: 'জীৱন প্ৰমাণ (Jeevan Pramaan)',
      hi: 'जीवन प्रमाण (Jeevan Pramaan)'
    },
    assameseSub: 'জীৱন প্ৰমাণপত্ৰ',
    useCases: {
      en: 'Digital Life Cert • Pensioners • Annual Renewal',
      as: 'ডিজিটেল জীৱন প্ৰমাণপত্ৰ • পেঞ্চনাৰ',
      hi: 'डिजिटल जीवन प्रमाण पत्र • पेंशनभोगी'
    },
    category: 'edistrict',
    iconName: 'Award',
    dept: 'Pensioners Welfare Dept Assam',
    deptLoc: {
      en: 'Pensioners Welfare Dept Assam',
      as: 'পেঞ্চনাৰ কল্যাণ বিভাগ অসম',
      hi: 'पेंशनभोगी कल्याण विभाग असम'
    },
    processingDays: 'Instant Certificate',
    processingTime: {
      en: 'Instant Certificate',
      as: 'তৎক্ষণাৎ প্ৰমাণপত্ৰ',
      hi: 'तुरंत प्रमाण पत्र'
    },
    govtFee: 0,
    cscFee: 30,
    popular: false,
    description: {
      en: 'Digital Life Certificate generation for Central & Assam State Pensioners.',
      as: 'পেনশ্বনাৰসকলৰ বাবে ডিজিটাল জীৱন প্ৰমাণপত্ৰ প্ৰদান।',
      hi: 'केंद्रीय एवं राज्य पेंशनभोगियों के लिए डिजिटल जीवन प्रमाण पत्र।'
    },
    requiredDocs: [
      { id: 'ppoNo', name: 'PPO Copy / Pension Book', required: true },
      { id: 'aadhaar', name: 'Pensioner Aadhaar Card', required: true }
    ],
    fields: [
      { id: 'ppoNumber', label: 'PPO Number', type: 'text', placeholder: 'e.g. PPO/LKP/94350' },
      { id: 'bankAccount', label: 'Pension Bank Account Number', type: 'text', placeholder: 'e.g. 30123456789' }
    ]
  },
  {
    id: 'lpg-services',
    title: {
      en: 'LPG Services',
      as: 'LPG সেৱা (LPG Services)',
      hi: 'एलपीजी सेवाएं (LPG Services)'
    },
    assameseSub: 'এল.পি.জি সেৱা',
    useCases: {
      en: 'Gas Refill Booking • New Connection • Ujjwala',
      as: 'গেছ ৰিফিল বুকিং • নতুন সংযোগ • উজ্জ্বল',
      hi: 'गैस रीफिल बुकिंग • नया कनेक्शन • उज्ज्वला'
    },
    category: 'utility',
    iconName: 'Flame',
    dept: 'IndianOil / Bharatgas / HP Gas',
    deptLoc: {
      en: 'IndianOil / Bharatgas / HP Gas',
      as: 'ইণ্ডিয়ান অইল / ভাৰতগেছ / এইচ.পি. গেছ',
      hi: 'इंडियन ऑयल / भारतगैस / एचपी गैस'
    },
    processingDays: 'Instant Refill Booking',
    processingTime: {
      en: 'Instant Refill Booking',
      as: 'তৎক্ষণাৎ ৰিফিল বুকিং',
      hi: 'तुरंत रीफिल बुकिंग'
    },
    govtFee: 0,
    cscFee: 20,
    popular: false,
    description: {
      en: 'LPG Gas Refill booking & Ujjwala Yojana new connection application.',
      as: 'গেছ ৰিফিল বুকিং আৰু উজ্জ্বল আঁচনিৰ নতুন সংযোগ।',
      hi: 'एलपीजी गैस रीफिल बुकिंग और उज्ज्वला योजना नया कनेक्शन।'
    },
    requiredDocs: [
      { id: 'consumerPassbook', name: 'LPG Gas Passbook / SV Copy', required: true }
    ],
    fields: [
      { id: 'provider', label: 'LPG Provider', type: 'select', options: ['Indane (IOCL)', 'Bharatgas (BPCL)', 'HP Gas (HPCL)'] },
      { id: 'lpgConsumerNo', label: '17-digit LPG Consumer ID / Mobile No', type: 'text', placeholder: 'e.g. 31000000123456789' }
    ]
  },
  {
    id: 'nps-scheme',
    title: {
      en: 'NPS',
      as: 'NPS পেনশ্বন (NPS)',
      hi: 'एनपीएस (NPS)'
    },
    assameseSub: 'ৰাষ্ট্ৰীয় পেঞ্চন প্ৰণালী',
    useCases: {
      en: 'PRAN Account • Tax Saving • Retirement Pension',
      as: 'PRAN একাউণ্ট • কৰ সঞ্চয় • পেঞ্চন',
      hi: 'पीआरएएन खाता • टैक्स बचत • पेंशन'
    },
    category: 'employment',
    iconName: 'ShieldCheck',
    dept: 'PFRDA / National Pension System',
    deptLoc: {
      en: 'PFRDA / National Pension System',
      as: 'পি.এফ.আৰ.ডি.এ / ৰাষ্ট্ৰীয় পেঞ্চন প্ৰণালী',
      hi: 'पीएफआरडीए / राष्ट्रीय पेंशन प्रणाली'
    },
    processingDays: '1-3 Days',
    processingTime: {
      en: '1-3 Days',
      as: '১-৩ দিন',
      hi: '1-3 दिन'
    },
    govtFee: 0,
    cscFee: 50,
    popular: false,
    description: {
      en: 'National Pension System PRAN account registration & contribution payment.',
      as: 'ৰাষ্ট্ৰীয় পেঞ্চন প্ৰণালী (NPS) নতুন একাউণ্ট ৰেজিষ্ট্ৰেশ্যন।',
      hi: 'राष्ट्रीय पेंशन प्रणाली (NPS) नया खाता पंजीकरण एवं अंशदान।'
    },
    requiredDocs: [
      { id: 'panCard', name: 'PAN Card Copy', required: true },
      { id: 'bankPassbook', name: 'Cancelled Cheque / Bank Passbook', required: true }
    ],
    fields: [
      { id: 'tierType', label: 'NPS Account Tier', type: 'select', options: ['Tier I (Tax Saving Pension)', 'Tier I + Tier II (Pension + Investment)'] }
    ]
  },
  {
    id: 'voter-id',
    title: {
      en: 'Voter ID',
      as: 'ভোটাৰ কাৰ্ড (Voter ID)',
      hi: 'वोटर कार्ड (Voter ID)'
    },
    assameseSub: 'ভোটাৰ কাৰ্ড',
    useCases: {
      en: 'New Enrollment (Form 6) • Shift/Correction (Form 8)',
      as: 'নতুন ভোটাৰ (ফৰ্ম ৬) • সংশোধন (ফৰ্ম ৮)',
      hi: 'नया वोटर (फॉर्म 6) • संशोधन (फॉर्म 8)'
    },
    category: 'identity',
    iconName: 'Vote',
    dept: 'Election Commission of India',
    deptLoc: {
      en: 'Election Commission of India',
      as: 'ভাৰতৰ নিৰ্বাচন আয়োগ',
      hi: 'भारत निर्वाचन आयोग'
    },
    processingDays: '15-20 Days',
    processingTime: {
      en: '15-20 Days',
      as: '১৫-২০ দিন',
      hi: '15-20 दिन'
    },
    govtFee: 0,
    cscFee: 40,
    popular: false,
    description: {
      en: 'Voter ID Form 6 for new registration & Form 8 for shift/correction.',
      as: 'নতুন ভোটাৰ কাৰ্ড বা নাম সংশোধনৰ ফৰ্ম ৬ আৰু ৮।',
      hi: 'नया वोटर आईडी (फॉर्म 6) या संशोधन (फॉर्म 8)।'
    },
    requiredDocs: [
      { id: 'photo', name: 'Passport Photo', required: true },
      { id: 'ageProof', name: 'Age Proof (Class 10 Admit / Birth Cert)', required: true }
    ],
    fields: [
      { id: 'formType', label: 'Voter Service', type: 'select', options: ['Form 6 (New Voter Enrollment)', 'Form 8 (Correction of Name/Address)', 'Form 8 (Shift of Residence)'] }
    ]
  },
  {
    id: 'apdcl-payment',
    title: {
      en: 'APDCL Electricity',
      as: 'বিদ্যুৎ বিল (APDCL)',
      hi: 'बिजली बिल (APDCL)'
    },
    assameseSub: 'বিদ্যুৎ বিল',
    useCases: {
      en: 'Smart Meter Recharge • Postpaid Electricity Bill',
      as: 'স্মাৰ্ট মিটাৰ ৰিচাৰ্জ • বিদ্যুৎ বিল পৰিশোধ',
      hi: 'स्मार्ट मीटर रिचार्ज • बिजली बिल भुगतान'
    },
    category: 'utility',
    iconName: 'Zap',
    dept: 'Assam Power Distribution Ltd',
    deptLoc: {
      en: 'Assam Power Distribution Ltd',
      as: 'অসম পাৱাৰ ডিষ্ট্ৰিবিউশ্যন লিমিটেড',
      hi: 'असम पावर डिस्ट्रीब्यूशन लिमिटेड'
    },
    processingDays: 'Instant Bill Refill',
    processingTime: {
      en: 'Instant Bill Refill',
      as: 'তৎক্ষণাৎ বিল ৰিচাৰ্জ',
      hi: 'तुरंत बिल रीचार्ज'
    },
    govtFee: 0,
    cscFee: 0,
    popular: false,
    description: {
      en: 'APDCL Smart Prepaid Meter recharge & Postpaid electricity bill payment.',
      as: 'স্মাৰ্ট মিটাৰ ৰিফিল আৰু পোষ্টপেইড বিদ্যুৎ বিল পৰিশোধ।',
      hi: 'स्मार्ट मीटर रिचार्ज और बिजली बिल का भुगतान।'
    },
    requiredDocs: [],
    fields: []
  },
  {
    id: 'emp-exchange',
    title: {
      en: 'Employment Exchange',
      as: 'নিয়োগ বিনিময় (Employment)',
      hi: 'रोजगार कार्यालय (Employment)'
    },
    assameseSub: 'নিয়োগ বিনিময়',
    useCases: {
      en: 'e-Registration Card • ADRE Exam Eligibility',
      as: 'নিয়োগ বিনিময় কাৰ্ড • ADRE পৰীক্ষা',
      hi: 'रोजगार कार्ड • एडीआरई परीक्षा'
    },
    category: 'employment',
    iconName: 'Briefcase',
    dept: 'Skill & Employment Dept Assam',
    deptLoc: {
      en: 'Skill & Employment Dept Assam',
      as: 'কৌশল আৰু নিয়োগ বিভাগ অসম',
      hi: 'कौशल एवं रोजगार विभाग असम'
    },
    processingDays: '1-2 Days',
    processingTime: {
      en: '1-2 Days',
      as: '১-২ দিন',
      hi: '1-2 दिन'
    },
    govtFee: 0,
    cscFee: 50,
    popular: false,
    description: {
      en: 'e-Registration card generation for Assam direct recruitment exams (ADRE).',
      as: 'অসম চৰকাৰৰ তৃতীয় আৰু চতুৰ্থ বৰ্গৰ পদৰ (ADRE) নিয়োগ বিনিময় কাৰ্ড।',
      hi: 'असम सीधी भर्ती (ADRE) हेतु रोजगार कार्यालय पंजीकरण।'
    },
    requiredDocs: [
      { id: 'education', name: 'Highest Educational Marksheet', required: true }
    ],
    fields: []
  }
];
