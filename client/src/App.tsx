import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import MapPage from './pages/MapPage';
import ReportDetailPage from './pages/ReportDetailPage';
import CitizenDashboard from './pages/CitizenDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GuidePage from './pages/GuidePage';
import AboutPage from './pages/AboutPage';
import DocumentsPage from './pages/DocumentsPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-primary-100 selection:text-primary-800">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Open Routes - No Login Needed */}
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/awareness" element={<GuidePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/credits" element={<AboutPage />} />
              <Route path="/documents" element={<DocumentsPage />} />

              {/* Citizen Reporting & Detail */}
              <Route path="/report" element={<ReportPage />} />
              <Route path="/reports/:id" element={<ReportDetailPage />} />

              {/* Unlocked Dashboards - Directly accessible without login */}
              <Route path="/dashboard" element={<CitizenDashboard />} />
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Fallback redirects */}
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/register" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
