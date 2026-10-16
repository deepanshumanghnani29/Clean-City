import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Leaf,
  MapPin,
  BookOpen,
  Info,
  Menu,
  X,
  AlertTriangle,
  FileText,
  LayoutDashboard,
  Shield,
  Users,
  UserCheck,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardsOpen, setDashboardsOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-primary-600 font-semibold bg-primary-50/60'
      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50';

  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-gray-900 text-lg">Clean</span>
              <span className="font-display font-bold text-primary-600 text-lg"> City</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/map" className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/map')}`}>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Live Map
              </span>
            </Link>
            <Link to="/guide" className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/guide')}`}>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Waste Guide
              </span>
            </Link>
            <Link to="/documents" className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/documents')}`}>
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Project Documents
              </span>
            </Link>

            {/* Dashboards Dropdown (Accessible to everyone without login) */}
            <div className="relative">
              <button
                onClick={() => setDashboardsOpen(!dashboardsOpen)}
                onBlur={() => setTimeout(() => setDashboardsOpen(false), 200)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboards</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {dashboardsOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-gray-100 py-1.5 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 border-b border-gray-50 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    All Access Views
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setDashboardsOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                  >
                    <UserCheck className="w-4 h-4 text-primary-500" />
                    <div>
                      <div className="font-medium">Citizen Dashboard</div>
                      <div className="text-[10px] text-gray-400">Track complaints & points</div>
                    </div>
                  </Link>
                  <Link
                    to="/staff"
                    onClick={() => setDashboardsOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    <Users className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Staff Dispatch</div>
                      <div className="text-[10px] text-gray-400">Cleaning crew tasks</div>
                    </div>
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setDashboardsOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                  >
                    <Shield className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="font-medium">Municipal Admin</div>
                      <div className="text-[10px] text-gray-400">Command & KPI control</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link to="/about" className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/about')}`}>
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                About & Faculty
              </span>
            </Link>
          </div>

          {/* Right side CTA (No Login / Register) */}
          <div className="flex items-center gap-3">
            <Link to="/report" className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Garbage</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {[
              { to: '/', label: '🏠 Home' },
              { to: '/report', label: '⚠️ Report Garbage' },
              { to: '/map', label: '🗺️ Live Waste Map' },
              { to: '/guide', label: '📚 Waste Guide' },
              { to: '/documents', label: '📄 Project Documents' },
              { to: '/dashboard', label: '📊 Citizen Dashboard' },
              { to: '/staff', label: '👷 Staff Dispatch' },
              { to: '/admin', label: '🛡️ Admin Center' },
              { to: '/about', label: '🎓 About & Faculty Guide' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
