export const INITIAL_APPLICATIONS = [
  {
    id: 'CSC-LKP-2026-89412',
    serviceId: 'prc-cert',
    serviceTitle: 'Permanent Resident Certificate (PRC)',
    applicantName: 'Bipul Hazarika',
    fatherName: 'Prabin Hazarika',
    phone: '9854012345',
    email: 'bipul.hazarika@gmail.com',
    aadhaar: '5412-8921-9012',
    address: 'Vill- Khelmati Ward 8, PO- Lakhimpur',
    panchayat: 'Lakhimpur Town Municipality',
    district: 'Lakhimpur',
    pinCode: '787001',
    purpose: 'Higher Studies',
    residenceYears: '22',
    status: 'Completed', // Submitted, Verified, Processing, Completed, Action
    submittedAt: '2026-08-10 10:15 AM',
    govtFee: 30,
    cscFee: 50,
    totalFee: 80,
    documents: [
      { name: 'Passport_Photo_Bipul.jpg', type: 'image/jpeg', size: '240 KB', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { name: 'Aadhaar_Card_FrontBack.pdf', type: 'application/pdf', size: '1.2 MB', url: '#' },
      { name: 'Jamabandi_Land_Receipt_2025.pdf', type: 'application/pdf', size: '850 KB', url: '#' }
    ],
    remarks: 'PRC Certificate approved by Lakhimpur Circle Officer. Issued Ref: PRC/LKP/2026/0942.',
    issuedDocUrl: 'PRC_Official_Certificate_Bipul_Hazarika.pdf'
  },
  {
    id: 'CSC-LKP-2026-90143',
    serviceId: 'pan-card',
    serviceTitle: 'New PAN Card (Form 49A)',
    applicantName: 'Rina Gogoi',
    fatherName: 'Late Dharmeswar Gogoi',
    phone: '9435098765',
    email: 'rina.gogoi.lkp@outlook.com',
    aadhaar: '8910-2341-7654',
    address: 'Vill- Saboti, PO- Saboti',
    panchayat: 'Saboti Gaon Panchayat',
    district: 'Lakhimpur',
    pinCode: '787051',
    panType: 'New PAN Card (Physical + e-PAN)',
    fatherOrMother: 'Father Name',
    status: 'Processing',
    submittedAt: '2026-08-11 02:40 PM',
    govtFee: 107,
    cscFee: 50,
    totalFee: 157,
    documents: [
      { name: 'Rina_Photo_Specimen.png', type: 'image/png', size: '310 KB', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
      { name: 'Aadhaar_Card_Rina.pdf', type: 'application/pdf', size: '940 KB', url: '#' }
    ],
    remarks: 'Document verified at Rajib CSC. Forwarded to NSDL NSDL-UTI portal.',
    issuedDocUrl: null
  },
  {
    id: 'CSC-LKP-2026-91204',
    serviceId: 'income-cert',
    serviceTitle: 'Income Certificate (Assam)',
    applicantName: 'Dhruba Saikia',
    fatherName: 'Bhaben Saikia',
    phone: '9706123987',
    email: 'dhruba.saikia@yahoo.com',
    aadhaar: '6743-1289-4567',
    address: 'Vill- North Lakhimpur Town, Ward No 4',
    panchayat: 'Lakhimpur Municipality',
    district: 'Lakhimpur',
    pinCode: '787001',
    annualIncome: '96000',
    occupation: 'Agriculture & Small Shop',
    status: 'Pending',
    submittedAt: '2026-08-12 09:10 AM',
    govtFee: 20,
    cscFee: 40,
    totalFee: 60,
    documents: [
      { name: 'Dhruba_Photo.jpg', type: 'image/jpeg', size: '180 KB', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      { name: 'Bank_Passbook_6Months.pdf', type: 'application/pdf', size: '1.4 MB', url: '#' }
    ],
    remarks: 'New application awaiting operator verification at Rajib CSC Lakhimpur.',
    issuedDocUrl: null
  }
];

export const INITIAL_UTILITY_TRANSACTIONS = [
  {
    txnId: 'TXN-APDCL-88412',
    consumerNo: '10200049123',
    consumerName: 'Rajesh Das',
    board: 'APDCL (Assam Power Distribution Ltd)',
    amount: 1450,
    dueDate: '2026-08-18',
    status: 'Paid',
    paidAt: '2026-08-11 11:20 AM',
    method: 'UPI / PhonePe'
  },
  {
    txnId: 'TXN-APDCL-88499',
    consumerNo: '10200088912',
    consumerName: 'Mohesh Dutta',
    board: 'APDCL (Assam Power Distribution Ltd)',
    amount: 890,
    dueDate: '2026-08-20',
    status: 'Paid',
    paidAt: '2026-08-12 08:45 AM',
    method: 'CSC Wallet'
  }
];
