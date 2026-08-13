import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../components/AdminDashboard';
import { useApp } from '../context/AppContext';

export function AdminPage() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const isAdminAuthed = localStorage.getItem('rajib_csc_admin_auth') === 'true';

  useEffect(() => {
    if (!isAdminAuthed) {
      navigate('/admin-login');
    }
  }, [isAdminAuthed, navigate]);

  if (!isAdminAuthed) return null;

  const handleAdminLogout = () => {
    localStorage.removeItem('rajib_csc_admin_auth');
    showToast('VLE Operator Admin logged out successfully.', 'info');
    navigate('/admin-login');
  };

  return (
    <div className="space-y-6">
      <AdminDashboard onLogout={handleAdminLogout} />
    </div>
  );
}
