import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { MapPin, Filter, List, Map as MapIcon, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { STATUS_LABELS, CATEGORY_LABELS, CATEGORY_ICONS, MAP_STATUS_COLORS, formatDate } from '../utils/constants';

interface Report {
  _id: string;
  complaintNumber: string;
  category: string;
  severity: string;
  status: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
  isDemo: boolean;
}

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SEVERITY_RADIUS: Record<string, number> = { high: 14, medium: 10, low: 7 };

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [filters, setFilters] = useState({ category: '', status: '', severity: '' });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.status) params.set('status', filters.status);
        if (filters.severity) params.set('severity', filters.severity);
        const { data } = await api.get(`/reports/map?${params}`);
        if (data.success) setReports(data.data);
      } catch (err) {
        console.error('Map fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [filters]);

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary-600" />
            Live Waste Map
          </h1>
          <p className="section-subtitle">{reports.length} reports displayed · Click a marker for details</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setView('map')}
            className={`btn btn-sm ${view === 'map' ? 'btn-primary' : 'btn-outline'}`}>
            <MapIcon className="w-3.5 h-3.5" /> Map
          </button>
          <button onClick={() => setView('list')}
            className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-outline'}`}>
            <List className="w-3.5 h-3.5" /> List
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-gray-400" />
        <select className="input !w-auto text-sm py-1.5" value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
          <option value="">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{CATEGORY_ICONS[v]} {l}</option>)}
        </select>
        <select className="input !w-auto text-sm py-1.5" value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="input !w-auto text-sm py-1.5" value={filters.severity}
          onChange={e => setFilters(f => ({ ...f, severity: e.target.value }))}>
          <option value="">All Severities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      {/* Legend */}
      <div className="card mb-4">
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="font-semibold text-gray-600">Legend:</span>
          {Object.entries(MAP_STATUS_COLORS).slice(0, 5).map(([status, color]) => (
            <span key={status} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: color }} />
              {STATUS_LABELS[status]}
            </span>
          ))}
          <span className="text-gray-400">· Circle size = severity</span>
        </div>
      </div>

      {view === 'map' ? (
        <div className="map-container" style={{ height: '500px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <MapContainer center={[26.9124, 75.7873]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
              />
              {reports.map(r => (
                <CircleMarker
                  key={r._id}
                  center={[r.latitude, r.longitude]}
                  radius={SEVERITY_RADIUS[r.severity] || 10}
                  pathOptions={{
                    color: MAP_STATUS_COLORS[r.status] || '#6b7280',
                    fillColor: MAP_STATUS_COLORS[r.status] || '#6b7280',
                    fillOpacity: 0.8,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="text-xs min-w-[180px]">
                      {r.isDemo && <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded mb-2 font-semibold">DEMO DATA</div>}
                      <p className="font-bold text-gray-900 mb-1">{r.complaintNumber}</p>
                      <p className="text-gray-600 mb-1">{CATEGORY_ICONS[r.category]} {CATEGORY_LABELS[r.category]}</p>
                      <p className="text-gray-500 mb-1">{r.address || 'No address'}</p>
                      <p className="text-gray-400 mb-2">{formatDate(r.createdAt)}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium`}
                        style={{ background: MAP_STATUS_COLORS[r.status] + '20', color: MAP_STATUS_COLORS[r.status] }}>
                        {STATUS_LABELS[r.status]}
                      </span>
                      <br />
                      <Link to={`/reports/${r._id}`} className="text-primary-600 font-medium mt-2 inline-block hover:underline">
                        View Details →
                      </Link>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>
      ) : (
        <div className="card">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="skeleton h-16" />)}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No reports found with current filters</p>
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
                    <th>Location</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r._id}>
                      <td className="font-mono text-xs text-gray-600">{r.complaintNumber}</td>
                      <td>{CATEGORY_ICONS[r.category]} {CATEGORY_LABELS[r.category]}</td>
                      <td className="capitalize">{r.severity}</td>
                      <td>
                        <span className="badge" style={{
                          background: MAP_STATUS_COLORS[r.status] + '20',
                          color: MAP_STATUS_COLORS[r.status]
                        }}>
                          {STATUS_LABELS[r.status]}
                        </span>
                      </td>
                      <td className="max-w-[150px] truncate text-xs">{r.address || `${r.latitude?.toFixed(3)}, ${r.longitude?.toFixed(3)}`}</td>
                      <td className="text-xs text-gray-400">{formatDate(r.createdAt)}</td>
                      <td>
                        <Link to={`/reports/${r._id}`} className="text-primary-600 text-xs hover:underline">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Privacy note */}
      <p className="text-xs text-gray-400 text-center mt-4">
        🔒 Only report locations and status are shown on the public map. Personal details are not displayed.
      </p>
    </div>
  );
}
