import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { DonorDashboard } from './pages/DonorDashboard';
import { RecipientDashboard } from './pages/RecipientDashboard';
import { AdminPanel } from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/recipient" element={<RecipientDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

