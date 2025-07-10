import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ArticlesManager from './admin/ArticlesManager';
import ArticleEditor from './admin/ArticleEditor';
import EventManager from './admin/EventManager';
import OrganizerManager from './admin/OrganizerManager';
import CreateUser from './admin/CreateUser';
import HomepageManager from './admin/HomepageManager';
import ReviewsManager from './admin/ReviewsManager';
import LiveEventManager from './admin/LiveEventManager';

// Client Components
import Homepage from './client/Homepage';
import LoadingSpinner from './ui/LoadingSpinner';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;
  
  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <Router>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<Homepage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/homepage" element={
          <ProtectedRoute>
            <HomepageManager />
          </ProtectedRoute>
        } />
        <Route path="/admin/articles" element={
          <ProtectedRoute>
            <ArticlesManager />
          </ProtectedRoute>
        } />
        <Route path="/admin/articles/new" element={
          <ProtectedRoute>
            <ArticleEditor />
          </ProtectedRoute>
        } />
        <Route path="/admin/articles/:id" element={
          <ProtectedRoute>
            <ArticleEditor />
          </ProtectedRoute>
        } />
        <Route path="/admin/articles/:id/edit" element={
          <ProtectedRoute>
            <ArticleEditor />
          </ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute>
            <EventManager />
          </ProtectedRoute>
        } />
        <Route path="/admin/organizers" element={
          <ProtectedRoute>
            <OrganizerManager />
          </ProtectedRoute>
        } />
        <Route path="/admin/users/create" element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute>
            <ReviewsManager />
          </ProtectedRoute>
        } />
        <Route path="/admin/live-events" element={
          <ProtectedRoute>
            <LiveEventManager />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter; 