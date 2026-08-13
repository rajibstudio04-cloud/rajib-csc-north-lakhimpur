import React, { useState, useEffect } from 'react';
import { walletService } from '../services/walletService';
import { useApp } from '../context/AppContext';
import { 
  Wallet, 
  Search, 
  PlusCircle, 
  MinusCircle, 
  CheckCircle2, 
  Clock, 
  Receipt,
  X,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const AdminWalletManager = () => {
  const { showToast, refreshUserWallet } = useApp();
  const [users, setUsers] = useState([]);
  const [txns, setTxns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Selected User for Credit/Debit Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('credit'); // credit or debit
  const [amount, setAmount] = useState('500');
  const [remarks, setRemarks] = useState('Offline Cash received at Lakhimpur Center');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const uList = await walletService.getAllUsers();
      const tList = await walletService.getWalletTxnLogs();
      setUsers(uList || []);
      setTxns(tList || []);
    } catch (err) {
      console.warn('[AdminWalletManager Load Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Safe navigation filtering
  const filteredUsers = (users || []).filter((u) => {
    if (!u) return false;
    const name = String(u?.name || '').toLowerCase();
    const phone = String(u?.phone || '');
    const id = String(u?.id || '').toLowerCase();
    const term = String(searchTerm || '').toLowerCase();
    return name.includes(term) || phone.includes(term) || id.includes(term);
  });

  const handleExecuteTransaction = async (e) => {
    e.preventDefault();
    if (!selectedUser?.id || !amount || Number(amount) <= 0) return;

    setIsProcessing(true);
    try {
      const res = await walletService.updateWalletBalanceByAdmin(
        selectedUser.id,
        amount,
        actionType,
        remarks
      );

      setIsProcessing(false);
      if (res?.updatedUser) {
        showToast(
          `Wallet ${actionType.toUpperCase()} of ₹${amount} successful for ${selectedUser?.name || 'Citizen'}! New Balance: ₹${res.updatedUser.walletBalance ?? 0}`,
          'success'
        );
        setSelectedUser(null);
        setAmount('500');
        await loadData();
        refreshUserWallet();
      }
    } catch (err) {
      setIsProcessing(false);
      showToast('Wallet transaction failed.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Wallet Admin Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded tracking-wider inline-block mb-1">
            VLE Operator Wallet Manager
          </span>
          <h2 className="text-2xl font-black text-white">
            Registered Citizen Digital Wallet System
          </h2>
          <p className="text-xs text-slate-400">
            Search citizens and credit/debit wallet balances upon receiving offline cash or UPI payments.
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-right shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Wallet Profiles</span>
          <span className="text-2xl font-black text-amber-400 font-mono">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin inline" /> : `${(users || []).length} Citizens`}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md flex justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search citizen by Name, Phone Number, User ID..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-csc-lightBlue outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
        <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
          Showing {filteredUsers.length} active wallet records
        </span>
      </div>

      {/* Citizens Wallet Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Citizen Name</th>
                <th className="p-3">Phone Contact</th>
                <th className="p-3">Current Wallet Balance</th>
                <th className="p-3 text-right">Admin Wallet Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-csc-lightBlue mb-2" />
                    <span>Loading citizen wallet profiles...</span>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u?.id || Math.random()} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-csc-navy">{u?.id || 'N/A'}</td>
                    <td className="p-3 font-bold text-slate-900">{u?.name || 'Lakhimpur Citizen'}</td>
                    <td className="p-3 font-mono text-slate-600">+91 {u?.phone || 'N/A'}</td>
                    <td className="p-3">
                      <span className="text-sm font-black font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                        ₹{u?.walletBalance ?? 0}.00
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setActionType('credit');
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-[11px] shadow flex items-center gap-1 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Credit Cash</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setActionType('debit');
                          }}
                          className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-[11px] shadow flex items-center gap-1 cursor-pointer"
                        >
                          <MinusCircle className="w-3.5 h-3.5" />
                          <span>Debit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No registered citizen profiles matching current search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet Audit Log History Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-csc-navy" />
          <span>Wallet Cash Transaction Audit Log</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Txn Ref</th>
                <th className="p-3">Citizen</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Balance After</th>
                <th className="p-3">Description / Operator Note</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(txns || []).map((t) => (
                <tr key={t?.txnId || t?.id || Math.random()} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-700">{t?.txnId || t?.id || 'N/A'}</td>
                  <td className="p-3 font-semibold text-slate-900">{t?.userName || 'Citizen'} (+91 {t?.phone || 'N/A'})</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      t?.type === 'credit' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t?.type || 'debit'}
                    </span>
                  </td>
                  <td className="p-3 font-black font-mono text-slate-900">₹{t?.amount ?? 0}</td>
                  <td className="p-3 font-bold font-mono text-emerald-700">₹{t?.balanceAfter ?? 0}</td>
                  <td className="p-3 text-slate-600">{t?.description || 'Wallet Txn'}</td>
                  <td className="p-3 text-slate-500 font-mono">
                    {t?.timestamp ? new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit / Debit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {actionType === 'credit' ? 'Credit Cash to Citizen Wallet' : 'Debit Citizen Wallet'}
                </h3>
                <p className="text-xs text-slate-500">Citizen: {selectedUser?.name || 'Citizen'} (+91 {selectedUser?.phone || 'N/A'})</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransaction} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-slate-500">Current Wallet Balance:</span>
                <span className="font-mono font-black text-emerald-700 text-base">₹{selectedUser?.walletBalance ?? 0}.00</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Transaction Action</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold text-sm bg-white outline-none"
                >
                  <option value="credit">➕ Credit (Add Cash Received at Center)</option>
                  <option value="debit">➖ Debit (Deduct Funds)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-lg font-mono font-black focus:ring-2 focus:ring-csc-lightBlue outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Operator Notes / Payment Reference</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Received ₹500 cash at North Lakhimpur Center"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-csc-lightBlue outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`flex-1 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg transition-all ${
                    actionType === 'credit' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'
                  }`}
                >
                  {isProcessing ? 'Processing...' : `Execute ${actionType.toUpperCase()} (₹${amount})`}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="bg-slate-200 text-slate-800 font-bold px-4 py-3 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
