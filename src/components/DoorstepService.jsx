import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export const DoorstepService = () => {
  const { t, showToast } = useApp();
  const [submittedBooking, setSubmittedBooking] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: 'Khelmati Ward 8',
    service: 'PRC & Income Certificate Assistance',
    preferredDate: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingId = `DOORSTEP-LKP-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedBooking({
      id: bookingId,
      ...formData
    });
    showToast(`Doorstep Agent request booked! Ref: ${bookingId}`, 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
      <div className="bg-gradient-to-r from-csc-navy to-csc-lightBlue text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-2">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full">
          <Truck className="w-3.5 h-3.5" />
          Senior Citizen & Assisted Sewa
        </span>
        <h2 className="text-2xl font-extrabold text-white">
          Request Doorstep CSC Agent Visit in Lakhimpur
        </h2>
        <p className="text-xs text-cyan-100 leading-relaxed">
          Cannot visit our center near District Library? Our authorized CSC representative will visit your home in Lakhimpur Town area for document verification & photo capture.
        </p>
      </div>

      {!submittedBooking ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Citizen Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Bhaben Gogoi"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-csc-lightBlue outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                maxLength="10"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9435012345"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-csc-lightBlue outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Home Address in Lakhimpur *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House No, Ward/Street, Landmark"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-csc-lightBlue outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Required Service</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white font-medium outline-none"
              >
                <option>PRC & Income Certificate Assistance</option>
                <option>Senior Citizen Pension / Life Cert</option>
                <option>Aadhaar Address Update & Photo</option>
                <option>PAN Card Application</option>
                <option>APDCL Electricity Connection / Bill</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Preferred Date</label>
              <input
                type="date"
                required
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Special Instructions (Optional)</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Senior citizen bedridden assistance"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-csc-navy hover:bg-csc-lightBlue text-white font-extrabold py-3 rounded-xl text-sm shadow-lg transition-all"
          >
            Submit Doorstep Visit Request
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center space-y-4 shadow-lg border border-slate-200">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Doorstep Agent Request Confirmed!</h3>
          <p className="text-xs text-slate-500 font-mono">Reference Code: {submittedBooking.id}</p>
          <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 text-left space-y-1">
            <p><strong>Citizen:</strong> {submittedBooking.name} ({submittedBooking.phone})</p>
            <p><strong>Address:</strong> {submittedBooking.address}</p>
            <p><strong>Service:</strong> {submittedBooking.service}</p>
          </div>
          <button
            onClick={() => setSubmittedBooking(null)}
            className="bg-csc-navy text-white px-6 py-2 rounded-xl text-xs font-bold shadow"
          >
            Book Another Request
          </button>
        </div>
      )}
    </div>
  );
};
