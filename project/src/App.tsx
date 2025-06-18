import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import FoodDonation from './components/Modules/FoodDonation';
import EducationAid from './components/Modules/EducationAid';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder components for other modules
const NGOSupport = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Suraksha Setu - NGO Support</h1>
    <p className="text-gray-600">This module is under development</p>
  </div>
);

const WasteDonation = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">PunarAsha - Recyclable Waste Donation</h1>
    <p className="text-gray-600">This module is under development</p>
  </div>
);

const EmergencyRescue = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Raksha Jyothi - Emergency Rescue</h1>
    <p className="text-gray-600">This module is under development</p>
  </div>
);

const Shelter = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Jyothi Nilayam - Shelter Management</h1>
    <p className="text-gray-600">This module is under development</p>
  </div>
);

const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/food-donation"
        element={
          <ProtectedRoute>
            <Layout>
              <FoodDonation />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/education-aid"
        element={
          <ProtectedRoute>
            <Layout>
              <EducationAid />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/ngo-support"
        element={
          <ProtectedRoute>
            <Layout>
              <NGOSupport />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/waste-donation"
        element={
          <ProtectedRoute>
            <Layout>
              <WasteDonation />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/emergency-rescue"
        element={
          <ProtectedRoute>
            <Layout>
              <EmergencyRescue />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/shelter"
        element={
          <ProtectedRoute>
            <Layout>
              <Shelter />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;