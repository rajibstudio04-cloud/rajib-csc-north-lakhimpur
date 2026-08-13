import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentUploader } from './DocumentUploader';
import { ReceiptModal } from './ReceiptModal';
import { SubmissionSuccessModal } from './SubmissionSuccessModal';
import { PhoneOtpModal } from './PhoneOtpModal';
import { PhonePePaymentModal } from './PhonePePaymentModal';
import { webhookService } from '../services/webhookService';
import { whatsappApiService } from '../services/whatsappApiService';
import { 
  User, 
  FileText, 
  Upload, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Building2,
  AlertCircle,
  Database,
  Calendar,
  MapPin,
  HeartHandshake
} from 'lucide-react';

import { OfficialIncomeForm } from './OfficialIncomeForm';

export const MultiStepForm = () => {
  const { 
    lang, 
    t, 
    selectedService, 
    setSelectedService, 
    addApplication, 
    currentUser, 
    loginUser
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [createdReceiptApp, setCreatedReceiptApp] = useState(null);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone OTP & PhonePe Payment Modals State
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [showPhonePeModal, setShowPhonePeModal] = useState(false);

  // Form State with Demographic Data & Dynamic Fields
  const [formData, setFormData] = useState({
    applicantName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    dob: '',
    fatherName: '',
    email: currentUser?.email || '',
    aadhaar: '',
    address: currentUser?.address || '',
    panchayat: 'Lakhimpur Town Ward 8',
    district: 'Lakhimpur',
    pinCode: '787001',
    // Dynamic service specific inputs
    extraFields: {},
    // Uploaded document files { docId: { name, type, size, url } }
    uploadedDocs: {}
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Safety check: Return null if no service is selected
  if (!selectedService) {
    return null;
  }

  // Render official Assam e-District Income Certificate form for income-cert
  if (selectedService.id === 'income-cert') {
    return <OfficialIncomeForm onCancel={() => setSelectedService(null)} />;
  }

  const serviceTitle = typeof selectedService.title === 'object'
    ? selectedService.title[lang] || selectedService.title.en
    : selectedService.title;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleExtraFieldChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      extraFields: {
        ...prev.extraFields,
        [fieldId]: value
      }
    }));
    if (validationErrors[fieldId]) {
      setValidationErrors((prev) => ({ ...prev, [fieldId]: null }));
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

  const validateStep1 = () => {
    const errors = {};
    if (!formData.applicantName.trim()) errors.applicantName = 'Applicant full name is required';
    if (!formData.phone || formData.phone.length < 10) errors.phone = 'Valid 10-digit mobile number required';
    if (!formData.dob) errors.dob = 'Date of Birth (DOB) is required';
    if (!formData.address.trim()) errors.address = 'Full address is required';
    if (!formData.pinCode || formData.pinCode.length < 6) errors.pinCode = 'Valid 6-digit PIN code required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (selectedService.fields && selectedService.fields.length > 0) {
      selectedService.fields.forEach((f) => {
        const val = formData.extraFields[f.id];
        if (!val || String(val).trim() === '') {
          errors[f.id] = `${f.label} is required`;
        }
      });
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors = {};
    if (selectedService.requiredDocs) {
      selectedService.requiredDocs.forEach((doc) => {
        if (doc.required && !formData.uploadedDocs[doc.id]) {
          errors[doc.id] = `Mandatory document "${doc.name}" must be uploaded`;
        }
      });
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Trigger Checkout: Deferred Phone Auth -> PhonePe PG
  const handleInitiateCheckout = () => {
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
    
    const requiredFee = (selectedService.govtFee || 0) + (selectedService.cscFee || 0);

    // Prepare documents array for application record
    const docsArray = Object.keys(formData.uploadedDocs).map((key) => ({
      docId: key,
      ...formData.uploadedDocs[key]
    }));

    const finalPayload = {
      serviceId: selectedService.id,
      serviceTitle: serviceTitle,
      applicantName: formData.applicantName,
      phone: formData.phone,
      dob: formData.dob,
      fatherName: formData.fatherName,
      email: formData.email,
      aadhaar: formData.aadhaar || '5412-XXXX-9012',
      address: formData.address,
      panchayat: formData.panchayat,
      district: formData.district,
      pinCode: formData.pinCode,
      govtFee: selectedService.govtFee,
      cscFee: selectedService.cscFee,
      totalFee: requiredFee,
      documents: docsArray,
      paymentMethod: paymentData.paymentMethod || 'Live PhonePe PG',
      paymentId: paymentData.paymentId,
      utrNumber: paymentData.utrNumber,
      ...formData.extraFields
    };

    try {
      const newApp = await addApplication(finalPayload);
      webhookService.sendWebhookNotification('application_submitted', newApp);
      whatsappApiService.sendAutomatedWhatsAppAlert(newApp);
      setSubmittedApp(newApp);
    } catch (e) {
      console.error('Error submitting application:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalFee = (selectedService.govtFee || 0) + (selectedService.cscFee || 0);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in">
      
      {/* Wizard Header Banner */}
      <div className="bg-gradient-to-r from-csc-navy via-slate-900 to-csc-lightBlue text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider bg-cyan-950/80 px-3 py-0.5 rounded-full border border-cyan-500/40">
              {selectedService.dept}
            </span>
            <span className="text-xs text-slate-300">Est. Timeline: {selectedService.processingDays}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {serviceTitle} Application Form
          </h2>
          <p className="text-xs text-cyan-100/90 mt-1">
            Official Assam e-District Form Wizard • Rajib CSC North Lakhimpur
          </p>
        </div>

        <button
          onClick={() => setSelectedService(null)}
          className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          ← Change Service
        </button>
      </div>

      {/* Wizard Step Progress Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {[
            { step: 1, label: '1. Basic Info', icon: User },
            { step: 2, label: '2. Form Fields', icon: FileText },
            { step: 3, label: '3. Upload Docs', icon: Upload },
            { step: 4, label: '4. PhonePe Checkout', icon: ShieldCheck }
          ].map((s) => {
            const Icon = s.icon;
            const isDone = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <div key={s.step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-csc-navy text-white ring-4 ring-blue-100 shadow'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <CheckCircle className="w-4 h-4" /> : s.step}
                </div>
                <span className={`text-xs font-bold hidden md:inline ${isCurrent ? 'text-csc-navy font-extrabold' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content Body */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Universal Demographic Data */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <User className="w-5 h-5 text-csc-navy" />
              <h3 className="text-base font-extrabold text-slate-800">
                Step 1: Universal Applicant Demographic Data (Guest Access)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Applicant Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.applicantName}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  placeholder="e.g. Bipul Hazarika"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                />
                {validationErrors.applicantName && <p className="text-red-500 text-[11px] mt-1">{validationErrors.applicantName}</p>}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mobile Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                  placeholder="9854012345"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-800 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                />
                {validationErrors.phone && <p className="text-red-500 text-[11px] mt-1">{validationErrors.phone}</p>}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Date of Birth (DOB) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                />
                {validationErrors.dob && <p className="text-red-500 text-[11px] mt-1">{validationErrors.dob}</p>}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Father's / Guardian Name
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  placeholder="e.g. Late Prabin Hazarika"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">
                  Full Residential Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="2"
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="e.g. Village/Town, Road, Landmark, Ward No."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                ></textarea>
                {validationErrors.address && <p className="text-red-500 text-[11px] mt-1">{validationErrors.address}</p>}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Panchayat / Municipality Ward</label>
                <input
                  type="text"
                  value={formData.panchayat}
                  onChange={(e) => handleInputChange('panchayat', e.target.value)}
                  placeholder="Lakhimpur Town Ward 8"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="Lakhimpur"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={formData.pinCode}
                  onChange={(e) => handleInputChange('pinCode', e.target.value.replace(/\D/g, ''))}
                  placeholder="787001"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-800 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                />
                {validationErrors.pinCode && <p className="text-red-500 text-[11px] mt-1">{validationErrors.pinCode}</p>}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Aadhaar Card Number (12 Digits)</label>
                <input
                  type="text"
                  maxLength="12"
                  value={formData.aadhaar}
                  onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                  placeholder="e.g. 5412-8921-9012"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono text-slate-800 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Service-Specific Dynamic Inputs */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <FileText className="w-5 h-5 text-csc-navy" />
              <h3 className="text-base font-extrabold text-slate-800">
                Step 2: {serviceTitle} Specific Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {selectedService.fields && selectedService.fields.length > 0 ? (
                selectedService.fields.map((field) => {
                  const fieldValue = formData.extraFields[field.id] || '';
                  const hasError = validationErrors[field.id];

                  return (
                    <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                      <label className="font-bold text-slate-700 block mb-1">
                        {field.label} <span className="text-red-500">*</span>
                      </label>

                      {field.type === 'select' ? (
                        <select
                          value={fieldValue}
                          onChange={(e) => handleExtraFieldChange(field.id, e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                        >
                          <option value="">-- Select {field.label} --</option>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          rows="3"
                          value={fieldValue}
                          onChange={(e) => handleExtraFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder || ''}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                        ></textarea>
                      ) : (
                        <input
                          type={field.type || 'text'}
                          value={fieldValue}
                          onChange={(e) => handleExtraFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder || ''}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                        />
                      )}

                      {hasError && <p className="text-red-500 text-[11px] mt-1">{hasError}</p>}
                    </div>
                  );
                })
              ) : (
                <div className="sm:col-span-2 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-600">
                  No additional specific parameters required for this service. Proceed to Document Upload.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Mandatory Document Upload Zones */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Upload className="w-5 h-5 text-csc-navy" />
              <h3 className="text-base font-extrabold text-slate-800">
                Step 3: Document Upload Zones ({selectedService.requiredDocs ? selectedService.requiredDocs.length : 0} Files)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedService.requiredDocs && selectedService.requiredDocs.map((docReq) => (
                <div key={docReq.id} className="space-y-1">
                  <DocumentUploader
                    docId={docReq.id}
                    label={docReq.name}
                    required={docReq.required}
                    onUploaded={handleDocumentUploaded}
                    existingDoc={formData.uploadedDocs[docReq.id]}
                  />
                  {validationErrors[docReq.id] && (
                    <p className="text-red-500 text-[11px] font-bold px-1">{validationErrors[docReq.id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Application Summary & PhonePe Payment Checkout */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-extrabold text-slate-800">
                Step 4: Application Review & Live PhonePe Checkout
              </h3>
            </div>

            {/* Application Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block">Applicant Name:</span>
                  <strong className="text-slate-900 font-bold text-sm">{formData.applicantName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Mobile Contact:</span>
                  <strong className="font-mono text-slate-900">+91 {formData.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Date of Birth (DOB):</span>
                  <strong className="text-slate-900">{formData.dob}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Address & PIN:</span>
                  <strong className="text-slate-900">{formData.address}, {formData.pinCode}</strong>
                </div>
              </div>

              {/* Uploaded Documents Summary */}
              <div className="border-t pt-3 space-y-1">
                <span className="font-bold text-slate-700 block">Uploaded Documents ({Object.keys(formData.uploadedDocs).length}):</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.keys(formData.uploadedDocs).map((k) => (
                    <span key={k} className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-emerald-300">
                      ✓ {formData.uploadedDocs[k].name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Fee & Payment Gateway Card */}
            <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-purple-500/30 shadow-xl">
              <div>
                <span className="text-xs text-purple-300 font-bold block uppercase">Total Application Service Fee</span>
                <span className="text-3xl font-black text-amber-300 font-mono">₹{totalFee}.00</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Govt Fee ₹{selectedService.govtFee} + CSC Fee ₹{selectedService.cscFee}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-purple-300 font-bold block">Live Gateway Connection</span>
                <span className="text-sm font-mono font-black text-white">PhonePe PG Live Checkout</span>
              </div>
            </div>

            <button
              onClick={handleInitiateCheckout}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-black py-4 rounded-2xl text-base shadow-xl hover:shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <ShieldCheck className="w-5 h-5 fill-white" />
              <span>{isSubmitting ? 'Processing Submission...' : `Proceed to PhonePe Payment (₹${totalFee})`}</span>
            </button>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex justify-between items-center border-t border-slate-200 pt-6 mt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : <div></div>}

          {currentStep < 4 && (
            <button
              type="button"
              onClick={nextStep}
              className="bg-csc-navy hover:bg-csc-lightBlue text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Render Deferred Phone OTP Verification Modal */}
      {showPhoneOtpModal && (
        <PhoneOtpModal
          isOpen={showPhoneOtpModal}
          onClose={() => setShowPhoneOtpModal(false)}
          onVerified={handlePhoneVerified}
          defaultPhone={formData.phone}
        />
      )}

      {/* Render PhonePe Payment Gateway Modal */}
      {showPhonePeModal && (
        <PhonePePaymentModal
          amount={totalFee}
          title={`${serviceTitle} Fee Payment`}
          description="Government Service Application & CSC Processing Fee"
          onSuccess={handlePhonePePaymentSuccess}
          onClose={() => setShowPhonePeModal(false)}
        />
      )}

      {/* Render Submission Success Modal */}
      {submittedApp && (
        <SubmissionSuccessModal
          application={submittedApp}
          onClose={() => {
            setSubmittedApp(null);
            setSelectedService(null);
          }}
        />
      )}

      {/* Render Generated Receipt Modal */}
      {createdReceiptApp && (
        <ReceiptModal
          application={createdReceiptApp}
          onClose={() => {
            setCreatedReceiptApp(null);
            setSelectedService(null);
          }}
        />
      )}

    </div>
  );
};
