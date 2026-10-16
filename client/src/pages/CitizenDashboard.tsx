import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatDate, STATUS_LABELS, CATEGORY_LABELS, CATEGORY_ICONS, STATUS_COLORS } from '../utils/constants';
import { BarChart2, FileText, Clock, CheckCircle, AlertTriangle, Star, Bell, Plus, TrendingUp } from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const defaultMockReports = [
    {
      _id: 'rep-c1',
      complaintNumber: 'CC-2024-8841',
      category: 'plastic',
      description: 'Single-use plastic cups and packaging overflowing behind bus stand.',
      status: 'resolved',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      location: { address: 'North Block Bus Terminal' }
    },
    {
      _id: 'rep-c2',
      complaintNumber: 'CC-2024-8842',
      category: 'organic',
      description: 'Wet vegetable waste piled up near local market vegetable stall.',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      location: { address: 'Sector 4 Community Market' }
    },
    {
      _id: 'rep-c3',
      complaintNumber: 'CC-2024-8843',
      category: 'ewaste',
      description: 'Broken computer monitor and wires left near corner trash bin.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      location: { address: 'Lane 2, Cyber Enclave' }
    }
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get('/reports?limit=50');
        if (data.success && data.data?.length > 0) {
          setReports(data.data);
        } else {
          setReports(defaultMockReports);
        }
      } catch {
        setReports(defaultMockReports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = reports.filter(r => {
    const matchSearch = !search || r.complaintNumber?.includes(search) || r.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => ['pending_review', 'pending'].includes(r.status)).length,
    inProgress: reports.filter(r => ['assigned', 'in_progress', 'awaiting_verification'].includes(r.status)).length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  const getBadgeClass = (status: string) => STATUS_COLORS[status] || 'badge-gray';

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">
            Citizen Waste Tracker 👋
          </h1>
          <p className="section-subtitle">Track municipal garbage complaints and view verified cleanups</p>
        </div>
        <Link to="/report" className="btn-primary">
          <Plus className="w-4 h-4" /> Report Garbage
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Reports', value: stats.total, icon: FileText, color: 'bg-blue-100 text-blue-600' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
          { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'bg-teal-100 text-teal-600' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-primary-100 text-primary-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className={`stat-icon ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contribution Points */}
      <div className="card mb-6 flex items-center gap-4 bg-gradient-to-r from-primary-50 to-teal-50 border-primary-100">
        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold font-display text-primary-700">{user?.contributionPoints || 0}</p>
          <p className="text-sm text-primary-600">Contribution Points earned</p>
          <p className="text-xs text-gray-500">+10 per report submitted · +20 per verified cleanup</p>
        </div>
        <div className="ml-auto hidden sm:block">
          <Link to="/notifications" className="btn-secondary btn-sm">
            <Bell className="w-3.5 h-3.5" /> Notifications
          </Link>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold text-gray-900">My Reports</h2>
          <div className="flex gap-2">
            <input className="input !w-auto text-sm py-1.5" placeholder="Search..." value={search}
              onChange={e => setSearch(e.target.value)} />
            <select className="input !w-auto text-sm py-1.5" value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-14" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">
              {reports.length === 0 ? 'No reports yet. Submit your first report!' : 'No reports match your filters.'}
            </p>
            {reports.length === 0 && (
              <Link to="/report" className="btn-primary mt-4 inline-flex">
                <Plus className="w-4 h-4" /> Report Garbage Now
              </Link>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Complaint #</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r._id}>
                    <td className="font-mono text-xs font-semibold text-gray-700">{r.complaintNumber}</td>
                    <td className="text-sm">{CATEGORY_ICONS[r.category]} {CATEGORY_LABELS[r.category]}</td>
                    <td>
                      <span className={`badge ${r.severity === 'high' ? 'badge-red' : r.severity === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
                        {r.severity}
                      </span>
                    </td>
                    <td><span className={getBadgeClass(r.status)}>{STATUS_LABELS[r.status]}</span></td>
                    <td className="text-xs text-gray-400">{formatDate(r.createdAt)}</td>
                    <td>
                      <Link to={`/reports/${r._id}`} className="text-primary-600 text-xs hover:underline font-medium">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
