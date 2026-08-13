import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentUploader } from './DocumentUploader';
import { PhoneOtpModal } from './PhoneOtpModal';
import { PhonePePaymentModal } from './PhonePePaymentModal';
import { SubmissionSuccessModal } from './SubmissionSuccessModal';
import { webhookService } from '../services/webhookService';
import { whatsappApiService } from '../services/whatsappApiService';
import { ShieldCheck, CheckCircle, ArrowLeft, Upload, FileText } from 'lucide-react';

export const OfficialIncomeForm = ({ onCancel }) => {
  const { lang, t, selectedService, setSelectedService, addApplication, currentUser, loginUser } = useApp();

  // Language choice inside e-District form (Default Assamese/English)
  const [certLanguage, setCertLanguage] = useState('Assamese');
  
  // Modals state
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [showPhonePeModal, setShowPhonePeModal] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // e-District Form Data State matching exact screenshot fields
  const [formData, setFormData] = useState({
    // Language & User ID
    certLanguage: 'Assamese',
    userCscId: 'AS251636330018',

    // Applicant Details
    applicantSalutation: 'Mr',
    applicantName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    aadhaar: '',
    panNumber: '',
    email: currentUser?.email || '',
    relationship: 'Father',
    relativeSalutation: 'Mr',
    relativeName: '',
    incomeSource: 'Agriculture / Farming',
    occupation: '',
    totalAnnualIncome: '',

    // Permanent Address Details
    addressLine1: currentUser?.address || '',
    addressLine2: '',
    state: 'ASSAM',
    district: 'Lakhimpur',
    subdivision: 'Lakhimpur',
    circleOffice: 'Lakhimpur',
    mouza: 'Khelmati Mouza',
    villageTown: 'North Lakhimpur',
    policeStation: 'North Lakhimpur PS',
    postOffice: 'Khelmati PO',
    pinCode: '787001',

    // Uploaded Document Files
    uploadedDocs: {}
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleDocumentUploaded = (docId, docMetaData) => {
    setFormData((prev) => ({
      ...prev,
      uploadedDocs: {
        ...prev.uploadedDocs,
        [docId]: docMetaData
      }
    }));
    if (validationErrors[docId]) {
      setValidationErrors((prev) => ({ ...prev, [docId]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.applicantName.trim()) errors.applicantName = 'Applicant Name is required (আবেদনকাৰীৰ নাম ধাৰ্য কৰক)';
    if (!formData.phone || formData.phone.length < 10) errors.phone = 'Valid 10-digit mobile number required (মবাইল নম্বৰ বাধ্যতামূলক)';
    if (!formData.relativeName.trim()) errors.relativeName = 'Relative Name is required (সম্পৰ্কীয়ৰ নাম ধাৰ্য কৰক)';
    if (!formData.totalAnnualIncome) errors.totalAnnualIncome = 'Total Annual Income is required (মুঠ বার্ষিক উপাৰ্জন ধাৰ্য কৰক)';
    if (!formData.addressLine1.trim()) errors.addressLine1 = 'Address Line 1 is required (ঠিকনাৰ প্ৰথম শাৰী ধাৰ্য কৰক)';
    if (!formData.pinCode || formData.pinCode.length < 6) errors.pinCode = 'Valid 6-digit PIN code required (পিন নম্বৰ ধাৰ্য কৰক)';

    // Mandatory Document Validations
    const requiredDocs = [
      'addressProofFront',
      'addressProofBack',
      'identityProofFront',
      'identityProofBack',
      'applicantSignature',
      'gaonPradhanCert',
      'landReceipt',
      'userForm'
    ];
    requiredDocs.forEach((docId) => {
      const legacyId = docId.replace('Front', '').replace('Back', '');
      if (!formData.uploadedDocs?.[docId] && !formData.uploadedDocs?.[legacyId]) {
        errors[docId] = 'Mandatory document upload required (নথি জমা দিয়া বাধ্যতামূলক)';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInitiateSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    const savedPhone = localStorage.getItem('rajib_csc_citizen_phone');
    if (!currentUser && !savedPhone) {
      setShowPhoneOtpModal(true);
    } else {
      setShowPhonePeModal(true);
    }
  };

  const handlePhoneVerified = (userProfile) => {
    setShowPhoneOtpModal(false);
    loginUser(userProfile.phone, formData.applicantName);
    setShowPhonePeModal(true);
  };

  const handlePhonePePaymentSuccess = async (paymentData) => {
    setShowPhonePeModal(false);
    setIsSubmitting(true);

    const docsArray = Object.keys(formData.uploadedDocs || {}).map((key) => ({
      docId: key,
      ...formData.uploadedDocs[key]
    }));

    const totalFee = 60; // Govt Rs 20 + CSC Rs 40

    const finalPayload = {
      serviceId: 'income-cert',
      serviceTitle: 'Income Certificate (আয়ৰ প্ৰমাণপত্ৰ)',
      applicantName: `${formData.applicantSalutation} ${formData.applicantName}`,
      phone: formData.phone,
      fatherName: `${formData.relativeSalutation} ${formData.relativeName} (${formData.relationship})`,
      email: formData.email,
      aadhaar: formData.aadhaar || '5412-XXXX-9012',
      address: `${formData.addressLine1}, ${formData.addressLine2}`,
      panchayat: `${formData.villageTown}, Circle: ${formData.circleOffice}`,
      district: formData.district,
      pinCode: formData.pinCode,
      govtFee: 20,
      cscFee: 40,
      totalFee: totalFee,
      documents: docsArray,
      paymentMethod: paymentData.paymentMethod || 'Live PhonePe PG',
      paymentId: paymentData.paymentId,
      utrNumber: paymentData.utrNumber,

      // Specific e-District Form Data
      certLanguage: formData.certLanguage,
      userCscId: formData.userCscId,
      panNumber: formData.panNumber,
      relationship: formData.relationship,
      incomeSource: formData.incomeSource,
      occupation: formData.occupation,
      totalAnnualIncome: formData.totalAnnualIncome,
      subdivision: formData.subdivision,
      circleOffice: formData.circleOffice,
      mouza: formData.mouza,
      villageTown: formData.villageTown,
      policeStation: formData.policeStation,
      postOffice: formData.postOffice
    };

    try {
      const newApp = await addApplication(finalPayload);
      webhookService.sendWebhookNotification('application_submitted', newApp);
      whatsappApiService.sendAutomatedWhatsAppAlert(newApp);
      setSubmittedApp(newApp);
    } catch (e) {
      console.error('Error submitting Income Certificate application:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden font-sans animate-in fade-in">
      
      {/* Top Header matching official Assam e-District Form */}
      <div className="bg-white border-b-2 border-slate-300 p-6 text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
          APPLICATION FOR INCOME CERTIFICATE
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide font-serif">
          ( আয়ৰ প্ৰমাণ পত্ৰৰ বাবে আবেদন )
        </h2>

        <div className="pt-2 text-center text-xs space-y-0.5 font-medium text-slate-700">
          <p className="text-red-600 font-bold">(* Marked Fields are mandatory)</p>
          <p className="text-red-600 font-bold">(* চিহ্নিত তথ্যবোৰ বাধ্যতামূলক)</p>
        </div>

        {/* Certificate Language Choice & PFC/CSC/USER ID Bar */}
        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          
          {/* Language Radio Group */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="font-extrabold text-slate-800">
              Language of the Certificate <br />
              <span className="text-red-600">( প্ৰমাণ পত্ৰৰ ভাষা )*</span>
            </span>

            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-300">
              {['English', 'Assamese', 'Bengali', 'Bodo'].map((langOpt) => (
                <label key={langOpt} className="inline-flex items-center gap-1.5 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="certLanguage"
                    value={langOpt}
                    checked={formData.certLanguage === langOpt}
                    onChange={(e) => handleInputChange('certLanguage', e.target.value)}
                    className="accent-csc-navy cursor-pointer"
                  />
                  <span>{langOpt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preset PFC/CSC/USER ID Box */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">PFC/CSC/USER ID :</span>
            <input
              type="text"
              readOnly
              value={formData.userCscId}
              className="bg-slate-200 text-slate-900 font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-400 text-xs text-center shadow-inner"
            />
          </div>

        </div>
      </div>

      <form onSubmit={handleInitiateSubmit} className="p-4 sm:p-6 space-y-6">
        
        {/* DUAL COLUMN SECTION MATCHING SCREENSHOT 1 & 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* LEFT COLUMN: Applicant Details (আবেদনকাৰীৰ বিৱৰণ) */}
          <div className="bg-[#cdcdcd] p-5 sm:p-6 rounded-2xl border border-slate-400 space-y-4 shadow-sm text-xs">
            
            {/* Box Header Pill */}
            <div className="inline-block bg-[#86a2be] text-white font-extrabold px-4 py-1.5 rounded-full text-xs shadow">
              Applicant Details (আবেদনকাৰীৰ বিৱৰণ)
            </div>

            {/* 1. Applicant's Name */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Applicant's Name <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(আবেদনকাৰীৰ নাম)</span>
              </label>
              <div className="sm:col-span-8 flex gap-2">
                <select
                  value={formData.applicantSalutation}
                  onChange={(e) => handleInputChange('applicantSalutation', e.target.value)}
                  className="bg-white border border-slate-400 px-2 py-2 rounded font-bold text-slate-800 outline-none"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Dr">Dr</option>
                </select>
                <input
                  type="text"
                  required
                  value={formData.applicantName}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  placeholder="ENTER YOUR NAME"
                  className="flex-1 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 uppercase font-semibold outline-none"
                />
              </div>
              {validationErrors.applicantName && (
                <p className="sm:col-span-12 text-red-600 font-bold text-[11px]">{validationErrors.applicantName}</p>
              )}
            </div>

            {/* 2. Mobile No. */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <div className="sm:col-span-4">
                <label className="font-bold text-slate-900">
                  Mobile No. <span className="text-red-600">*</span>
                  <span className="block text-[11px] font-semibold text-slate-800">(মবাইল নম্বৰ )</span>
                </label>
                <span className="text-[10px] text-teal-800 block leading-tight font-medium">
                  ( Please note all status SMS would be sent in this number )
                </span>
              </div>
              <div className="sm:col-span-8 flex items-center gap-2">
                <span className="bg-white border border-slate-400 px-2 py-2 rounded font-bold text-slate-800">+91</span>
                <input
                  type="tel"
                  maxLength="10"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                  placeholder="ENTER YOUR 10 DIGIT MOBILE NO."
                  className="flex-1 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 font-mono font-bold outline-none"
                />
              </div>
              {validationErrors.phone && (
                <p className="sm:col-span-12 text-red-600 font-bold text-[11px]">{validationErrors.phone}</p>
              )}
            </div>

            {/* 3. Aadhar Number */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Aadhar Number
                <span className="block text-[11px] font-semibold text-slate-800">(আধাৰ নম্বৰ)</span>
              </label>
              <input
                type="text"
                maxLength="12"
                value={formData.aadhaar}
                onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                placeholder="ENTER YOUR AADHAAR NUMBER"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 font-mono outline-none"
              />
            </div>

            {/* 4. PAN Number */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                PAN Number
                <span className="block text-[11px] font-semibold text-slate-800">(পান নম্বৰ)</span>
              </label>
              <input
                type="text"
                maxLength="10"
                value={formData.panNumber}
                onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                placeholder="ENTER YOUR PAN NUMBER"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 font-mono uppercase outline-none"
              />
            </div>

            {/* 5. Email Id */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <div className="sm:col-span-4">
                <label className="font-bold text-slate-900">
                  Email Id
                  <span className="block text-[11px] font-semibold text-slate-800">(ইমেইল)</span>
                </label>
                <span className="text-[10px] text-teal-800 block leading-tight font-medium">
                  ( Please note all status and certificate would be sent in this email )
                </span>
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="ENTER YOUR EMAIL ID"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 outline-none"
              />
            </div>

            {/* 6. Relationship */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Relationship <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(সম্পৰ্ক)</span>
              </label>
              <select
                value={formData.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value)}
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 font-medium outline-none"
              >
                <option value="Father">Father (পিতৃ)</option>
                <option value="Mother">Mother (মাতৃ)</option>
                <option value="Husband">Husband (স্বামী)</option>
                <option value="Guardian">Guardian (অভিভাৱক)</option>
              </select>
            </div>

            {/* 7. Relative's Name */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Relative's Name <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(সম্পৰ্কীয়ৰ নাম)</span>
              </label>
              <div className="sm:col-span-8 flex gap-2">
                <select
                  value={formData.relativeSalutation}
                  onChange={(e) => handleInputChange('relativeSalutation', e.target.value)}
                  className="bg-white border border-slate-400 px-2 py-2 rounded font-bold text-slate-800 outline-none"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Late">Late</option>
                </select>
                <input
                  type="text"
                  required
                  value={formData.relativeName}
                  onChange={(e) => handleInputChange('relativeName', e.target.value)}
                  placeholder="ENTER RELATIVE NAME"
                  className="flex-1 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 uppercase font-semibold outline-none"
                />
              </div>
              {validationErrors.relativeName && (
                <p className="sm:col-span-12 text-red-600 font-bold text-[11px]">{validationErrors.relativeName}</p>
              )}
            </div>

            {/* 8. Income Source */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Income Source <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(উপাৰ্জনৰ উৎস)</span>
              </label>
              <select
                value={formData.incomeSource}
                onChange={(e) => handleInputChange('incomeSource', e.target.value)}
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 font-medium outline-none"
              >
                <option value="Agriculture / Farming">Agriculture / Farming (কৃষি)</option>
                <option value="Government Service">Government Service (চৰকাৰী চাকৰি)</option>
                <option value="Private Employment">Private Employment (বেচৰকাৰী চাকৰি)</option>
                <option value="Business / Trade">Business / Trade (ব্যৱসায়)</option>
                <option value="Professional / Pension">Professional / Pension (অন্যান্য/পেঞ্চন)</option>
              </select>
            </div>

            {/* 9. Occupation */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Occupation <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(বৃত্তি)</span>
              </label>
              <input
                type="text"
                required
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                placeholder="ENTER YOUR OCCUPATION"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 uppercase font-semibold outline-none"
              />
            </div>

            {/* 10. Total Annual Income */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Total Annual Income <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(মুঠ বার্ষিক উপাৰ্জন)</span>
              </label>
              <input
                type="number"
                required
                value={formData.totalAnnualIncome}
                onChange={(e) => handleInputChange('totalAnnualIncome', e.target.value)}
                placeholder="ENTER YOUR TOTAL ANNUAL INCOME (₹)"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 font-mono font-bold text-sm outline-none"
              />
              {validationErrors.totalAnnualIncome && (
                <p className="sm:col-span-12 text-red-600 font-bold text-[11px]">{validationErrors.totalAnnualIncome}</p>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Permanent Address (স্থায়ী ঠিকনা) */}
          <div className="bg-[#cdcdcd] p-5 sm:p-6 rounded-2xl border border-slate-400 space-y-4 shadow-sm text-xs">
            
            {/* Box Header Pill */}
            <div className="inline-block bg-[#86a2be] text-white font-extrabold px-4 py-1.5 rounded-full text-xs shadow">
              Permanent Address (স্থায়ী ঠিকনা)
            </div>

            {/* 1. Address Line1 */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Address Line1 <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(ঠিকনাৰ প্ৰথম শাৰী)</span>
              </label>
              <input
                type="text"
                required
                value={formData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                placeholder="ENTER ADDRESS LINE 1"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 outline-none"
              />
              {validationErrors.addressLine1 && (
                <p className="sm:col-span-12 text-red-600 font-bold text-[11px]">{validationErrors.addressLine1}</p>
              )}
            </div>

            {/* 2. AddressLine2 */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                AddressLine2
                <span className="block text-[11px] font-semibold text-slate-800">(ঠিকনাৰ দ্বিতীয় শাৰী)</span>
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                placeholder="ENTER ADDRESS LINE 2"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 outline-none"
              />
            </div>

            {/* 3. State */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                State <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(ৰাজ্য)</span>
              </label>
              <input
                type="text"
                readOnly
                value="ASSAM"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-900 font-bold outline-none"
              />
            </div>

            {/* 4. District */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                District <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(জিলা)</span>
              </label>
              <select
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 font-bold outline-none"
              >
                <option value="Lakhimpur">Lakhimpur (লক্ষীমপুৰ)</option>
                <option value="Dhemaji">Dhemaji (ধেমাাজী)</option>
                <option value="Jorhat">Jorhat (যোৰহাট)</option>
                <option value="Kamrup Metro">Kamrup Metro (কামৰূপ মহানগৰ)</option>
                <option value="Sonitpur">Sonitpur (শোণিতপুৰ)</option>
              </select>
            </div>

            {/* 5. Subdivision */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Subdivision <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(মহকুমা)</span>
              </label>
              <select
                value={formData.subdivision}
                onChange={(e) => handleInputChange('subdivision', e.target.value)}
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 font-semibold outline-none"
              >
                <option value="Lakhimpur">Lakhimpur (লক্ষীমপুৰ)</option>
                <option value="Dhakuakhana">Dhakuakhana (ঢকুৱাখনা)</option>
              </select>
            </div>

            {/* 6. Circle Office */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Circle Office <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(ৰাজহ চক্ৰ)</span>
              </label>
              <select
                value={formData.circleOffice}
                onChange={(e) => handleInputChange('circleOffice', e.target.value)}
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 font-semibold outline-none"
              >
                <option value="Lakhimpur">Lakhimpur Circle (লক্ষীমপুৰ চক্ৰ)</option>
                <option value="Kadam">Kadam Circle (কদম চক্ৰ)</option>
                <option value="Subansiri">Subansiri Circle (সুবনশিৰি চক্ৰ)</option>
                <option value="Naoboicha">Naoboicha Circle (নাওবৈচা চক্ৰ)</option>
                <option value="Dhakuakhana">Dhakuakhana Circle (ঢকুৱাখনা চক্ৰ)</option>
                <option value="Narayanpur">Narayanpur Circle (নাৰায়ণপুৰ চক্ৰ)</option>
              </select>
            </div>

            {/* 7. Mouza */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Mouza <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(মৌজা)</span>
              </label>
              <input
                type="text"
                value={formData.mouza}
                onChange={(e) => handleInputChange('mouza', e.target.value)}
                placeholder="ENTER MOUZA NAME"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 uppercase font-semibold outline-none"
              />
            </div>

            {/* 8. Village/Town */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Village/Town <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(গাঁও/নগৰ)</span>
              </label>
              <input
                type="text"
                value={formData.villageTown}
                onChange={(e) => handleInputChange('villageTown', e.target.value)}
                placeholder="ENTER VILLAGE / TOWN NAME"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 uppercase font-semibold outline-none"
              />
            </div>

            {/* 9. Police Station */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Police Station <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(থানা)</span>
              </label>
              <input
                type="text"
                value={formData.policeStation}
                onChange={(e) => handleInputChange('policeStation', e.target.value)}
                placeholder="ENTER POLICE STATION NAME"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 uppercase font-semibold outline-none"
              />
            </div>

            {/* 10. Post Office */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Post Office <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(ডাকঘৰ)</span>
              </label>
              <input
                type="text"
                value={formData.postOffice}
                onChange={(e) => handleInputChange('postOffice', e.target.value)}
                placeholder="ENTER POST OFFICE NAME"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 uppercase font-semibold outline-none"
              />
            </div>

            {/* 11. Pin Code */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label className="sm:col-span-4 font-bold text-slate-900">
                Pin Code <span className="text-red-600">*</span>
                <span className="block text-[11px] font-semibold text-slate-800">(পিন নং)</span>
              </label>
              <input
                type="text"
                maxLength="6"
                required
                value={formData.pinCode}
                onChange={(e) => handleInputChange('pinCode', e.target.value.replace(/\D/g, ''))}
                placeholder="ENTER YOUR PIN CODE"
                className="sm:col-span-8 bg-white border border-slate-400 px-3 py-2 rounded text-slate-800 font-mono font-bold outline-none"
              />
              {validationErrors.pinCode && (
                <p className="sm:col-span-12 text-red-600 font-bold text-[11px]">{validationErrors.pinCode}</p>
              )}
            </div>

          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* ATTACHMENT SECTION MATCHING SCREENSHOT 3 & 4 */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-[#cdcdcd] p-5 sm:p-6 rounded-2xl border border-slate-400 space-y-5 shadow-sm text-xs">
          
          {/* Header Pill */}
          <div className="inline-block bg-[#86a2be] text-white font-extrabold px-4 py-1.5 rounded-full text-xs shadow">
            Attachment Section (সংলগ্ন নথি)
          </div>

          <div className="space-y-4">
            
            {/* Attachment Card 1: Address Proof (Front & Back Side-by-Side) */}
            <div className="bg-white p-5 rounded-xl border border-slate-300 space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>1. Address Proof (ঠিকনাৰ প্ৰমান পত্ৰ)</span>
                  <span className="text-red-600 font-bold">*</span>
                </h4>
                <p className="text-[11px] text-teal-800 font-medium">
                  ( Upload both Front Side & Back Side. Only .jpg, .jpeg, .png, pdf allowed, Max 2MB )
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Front Side (सन्মুখৰ ভাগ) <span className="text-red-600">*</span>
                  </label>
                  <DocumentUploader
                    docId="addressProofFront"
                    label="Address Proof Front (ঠিকনাৰ প্ৰমান পত্ৰ সন্মুখ)"
                    required={true}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['addressProofFront'] || formData.uploadedDocs['addressProof']}
                  />
                  {validationErrors.addressProofFront && (
                    <p className="text-red-600 font-bold text-[11px]">{validationErrors.addressProofFront}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Back Side (পিছফালৰ ভাগ) <span className="text-red-600">*</span>
                  </label>
                  <DocumentUploader
                    docId="addressProofBack"
                    label="Address Proof Back (ঠিকনাৰ প্ৰমান পত্ৰ পিছফাল)"
                    required={true}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['addressProofBack']}
                  />
                  {validationErrors.addressProofBack && (
                    <p className="text-red-600 font-bold text-[11px]">{validationErrors.addressProofBack}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Attachment Card 2: Identity Proof (Front & Back Side-by-Side) */}
            <div className="bg-white p-5 rounded-xl border border-slate-300 space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>2. Identity Proof (পৰিচয় পত্ৰ)</span>
                  <span className="text-red-600 font-bold">*</span>
                </h4>
                <p className="text-[11px] text-teal-800 font-medium">
                  ( Upload both Front Side & Back Side. Only .jpg, .jpeg, .png, pdf allowed, Max 2MB )
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Front Side (सन्মুখৰ ভাগ) <span className="text-red-600">*</span>
                  </label>
                  <DocumentUploader
                    docId="identityProofFront"
                    label="Identity Proof Front (পৰিচয় পত্ৰ সন্মুখ)"
                    required={true}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['identityProofFront'] || formData.uploadedDocs['identityProof']}
                  />
                  {validationErrors.identityProofFront && (
                    <p className="text-red-600 font-bold text-[11px]">{validationErrors.identityProofFront}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Back Side (পিছফালৰ ভাগ) <span className="text-red-600">*</span>
                  </label>
                  <DocumentUploader
                    docId="identityProofBack"
                    label="Identity Proof Back (পৰিচয় পত্ৰ পিছফাল)"
                    required={true}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['identityProofBack']}
                  />
                  {validationErrors.identityProofBack && (
                    <p className="text-red-600 font-bold text-[11px]">{validationErrors.identityProofBack}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Attachment Row 3: Applicant Signature */}
            <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    3. Applicant Signature / Specimen <span className="text-red-600">*</span>
                  </h4>
                  <span className="font-bold text-slate-800 text-xs">(আবেদনকাৰীৰ স্বাক্ষৰ / টিপ ছাব)</span>
                  <p className="text-[11px] text-teal-800 font-medium">
                    ( Only .jpg, .jpeg, .png files are allowed with max size of 2MB )
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-72">
                  <DocumentUploader
                    docId="applicantSignature"
                    label="Applicant Signature (স্বাক্ষৰ / টিপ ছাব)"
                    required={true}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['applicantSignature']}
                  />
                </div>
              </div>
              {validationErrors.applicantSignature && (
                <p className="text-red-600 font-bold text-[11px]">{validationErrors.applicantSignature}</p>
              )}
            </div>

            {/* Attachment Row 4: Gaon Pradhan Certificate */}
            <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    4. Gaon Pradhan / Gaonburah Certificate <span className="text-red-600">*</span>
                  </h4>
                  <span className="font-bold text-slate-800 text-xs">(গাঁও প্ৰধান / গাওঁবুঢ়াৰ প্ৰমাণ পত্ৰ)</span>
                  <p className="text-[11px] text-teal-800 font-medium">
                    ( Only .jpg, .jpeg, .png, pdf files are allowed with max size of 2MB )
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-72">
                  <DocumentUploader
                    docId="gaonPradhanCert"
                    label="Gaon Pradhan Cert (গাঁও প্ৰধানৰ প্ৰমাণ পত্ৰ)"
                    required={true}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['gaonPradhanCert']}
                  />
                </div>
              </div>
              {validationErrors.gaonPradhanCert && (
                <p className="text-red-600 font-bold text-[11px]">{validationErrors.gaonPradhanCert}</p>
              )}
            </div>

            {/* Attachment Row 5: Land Revenue Receipt */}
            <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    5. Land Revenue Receipt <span className="text-red-600">*</span>
                  </h4>
                  <span className="font-bold text-slate-800 text-xs">(ৰাজহ মাচুল আদায়ৰ ৰছিদ)</span>
                  <p className="text-[11px] text-teal-800 font-medium">
                    ( Only .jpg, .jpeg, .png, pdf files are allowed with max size of 2MB )
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-72">
                  <DocumentUploader
                    docId="landReceipt"
                    label="Land Revenue Receipt (ৰাজহ ৰছিদ)"
                    required={true}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['landReceipt']}
                  />
                </div>
              </div>
              {validationErrors.landReceipt && (
                <p className="text-red-600 font-bold text-[11px]">{validationErrors.landReceipt}</p>
              )}
            </div>

            {/* Attachment Row 6: Salary Slip */}
            <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    6. Salary Slip
                  </h4>
                  <span className="font-bold text-slate-800 text-xs">(দৰমহাৰ পত্ৰ)</span>
                  <p className="text-[11px] text-teal-800 font-medium">
                    ( Only .jpg, .jpeg, .png, pdf files are allowed with max size of 2MB )
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-72">
                  <DocumentUploader
                    docId="salarySlip"
                    label="Salary Slip (দৰমহাৰ পত্ৰ)"
                    required={false}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['salarySlip']}
                  />
                </div>
              </div>
            </div>

            {/* Attachment Row 7: Any other document */}
            <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    7. Any other document
                  </h4>
                  <span className="font-bold text-slate-800 text-xs">(অন্য নথি)</span>
                  <p className="text-[11px] text-teal-800 font-medium">
                    ( Only .jpg, .jpeg, .png, pdf files are allowed with max size of 2MB )
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-72">
                  <DocumentUploader
                    docId="otherDoc"
                    label="Any other document (অন্য নথি)"
                    required={false}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['otherDoc']}
                  />
                </div>
              </div>
            </div>

            {/* Attachment Row 8: Upload Scanned Copy of Application Form */}
            <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    8. Upload Scanned Copy of the Application Form. <span className="text-red-600">*</span>
                  </h4>
                  <span className="font-bold text-slate-800 text-xs">(ইউজাৰ ফৰ্মখন সংলগ্ন কৰা)</span>
                  <p className="text-[11px] text-teal-800 font-medium">
                    ( Only .jpg, .jpeg, .png, pdf files are allowed with max size of 2MB )
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-72">
                  <DocumentUploader
                    docId="userForm"
                    label="Scanned Copy of Form (ইউজাৰ ফৰ্ম)"
                    required={true}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['userForm']}
                  />
                </div>
              </div>
              {validationErrors.userForm && (
                <p className="text-red-600 font-bold text-[11px]">{validationErrors.userForm}</p>
              )}
            </div>

          </div>g, .png, pdf files are allowed with max size of 2MB )
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-72">
                  <DocumentUploader
                    docId="otherDoc"
                    label="Any other document (অন্য নথি)"
                    required={false}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['otherDoc']}
                  />
                </div>
              </div>
            </div>

            {/* Attachment Row 10: Upload Scanned Copy of Application Form */}
            <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    10. Upload Scanned Copy of the Application Form. <span className="text-red-600">*</span>
                  </h4>
                  <span className="font-bold text-slate-800 text-xs">(ইউজাৰ ফৰ্মখন সংলগ্ন কৰা)</span>
                  <p className="text-[11px] text-teal-800 font-medium">
                    ( Only .jpg, .jpeg, .png, pdf files are allowed with max size of 2MB )
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-72">
                  <DocumentUploader
                    docId="userForm"
                    label="Scanned Copy of Form (ইউজাৰ ফৰ্ম)"
                    required={true}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs['userForm']}
                  />
                </div>
              </div>
              {validationErrors.userForm && (
                <p className="text-red-600 font-bold text-[11px]">{validationErrors.userForm}</p>
              )}
            </div>

          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="bg-gradient-to-r from-csc-navy via-slate-900 to-csc-lightBlue text-white p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl border border-cyan-400/40">
          <div>
            <span className="text-xs font-bold text-cyan-300 uppercase block">Total Fees Payable</span>
            <span className="text-3xl font-black text-amber-300 font-mono">₹60.00</span>
            <p className="text-[11px] text-slate-300">Govt Fee ₹20 + CSC Portal Fee ₹40</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel || (() => setSelectedService(null))}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-xl text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <ShieldCheck className="w-5 h-5 text-slate-950" />
              <span>{isSubmitting ? 'Submitting Form...' : 'Submit Application & Pay ₹60'}</span>
            </button>
          </div>
        </div>

      </form>

      {/* Render Phone Verification & Payment Modals */}
      {showPhoneOtpModal && (
        <PhoneOtpModal
          isOpen={showPhoneOtpModal}
          onClose={() => setShowPhoneOtpModal(false)}
          onVerified={handlePhoneVerified}
          defaultPhone={formData.phone}
        />
      )}

      {showPhonePeModal && (
        <PhonePePaymentModal
          amount={60}
          title="Income Certificate Application Fee"
          description="Government Service Fee (₹20) + CSC Processing Fee (₹40)"
          onSuccess={handlePhonePePaymentSuccess}
          onClose={() => setShowPhonePeModal(false)}
        />
      )}

      {submittedApp && (
        <SubmissionSuccessModal
          application={submittedApp}
          onClose={() => {
            setSubmittedApp(null);
            setSelectedService(null);
          }}
        />
      )}

    </div>
  );
};
