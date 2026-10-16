import { Link } from 'react-router-dom';
import { Leaf, ExternalLink, FileText, Download } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">Clean City</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              A smart waste management system designed to make cities cleaner, promote proper garbage segregation, and connect citizens with municipal sanitation teams.
            </p>
            <p className="text-xs text-gray-500 italic">
              "Report Waste. Restore Your City."
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/', label: 'Home Page' },
                { to: '/report', label: 'Report Garbage' },
                { to: '/map', label: 'Live Waste Map' },
                { to: '/guide', label: 'Waste Segregation Guide' },
                { to: '/documents', label: 'Project Documents & Reports' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              City Management
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/dashboard', label: 'Citizen Dashboard' },
                { to: '/staff', label: 'Staff Task Board' },
                { to: '/admin', label: 'Municipal Admin Center' },
                { to: '/about', label: 'About & Faculty Guide' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Academic Details
            </h4>
            <div className="text-xs text-gray-400 space-y-2">
              <p>
                <strong className="text-gray-200">Faculty Guide:</strong><br />
                Er. VISHVENDRA SINGH
              </p>
              <p>
                <strong className="text-gray-200">Project Lead:</strong><br />
                Deepanshu Manghnani (B.Tech AI & DS)
              </p>
              <p>
                <strong className="text-gray-200">University:</strong><br />
                Vivekananda Global University, Jaipur
              </p>
              <div className="pt-2">
                <Link
                  to="/documents"
                  className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Download PPT, Report & Paper
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © Clean City · Transdisciplinary College Project (TDP) · VGU Jaipur
          </p>
          <p>
            Project Guide: <span className="text-gray-300 font-semibold">Er. VISHVENDRA SINGH</span> · Student: <span className="text-primary-400 font-semibold">Deepanshu Manghnani</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
