import React from 'react';
import { useAccount } from 'wagmi';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { DonorDashboard } from '@/pages/DonorDashboard';
import { RecipientDashboard } from '@/pages/RecipientDashboard';
import { AdminPanel } from '@/pages/AdminPanel';
import { AdminRoute } from '@/admin/adminRoute';
import { isAdmin } from '@/admin/isAdmin';
import ApprovedRecipients from '@/pages/ApprovedRecipients';

function App() {
  const { address } = useAccount();
  const showAdminOnly = address && isAdmin(address);

  return (
    <Router>
      <Layout>
        <Routes>
          {showAdminOnly ? (
            // 🔒 Admins: Only allow access to /admin
            <>
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />
              {/* Optional: Redirect any other path to /admin */}
              <Route path="*" element={<Navigate to="/admin" />} />
            </>
          ) : (
            // 👥 Normal users: Access public routes
            <>
              <Route path="/" element={<Home />} />
              <Route path="/donor" element={<DonorDashboard />} />
              <Route path="/recipient" element={<RecipientDashboard />} />
              {/* Prevent normal users from accessing /admin */}
              <Route path="/admin" element={<Navigate to="/" />} />
              <Route path="/recipientsList" element={<ApprovedRecipients />} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

