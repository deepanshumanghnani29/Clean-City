import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';
import { formatDateTime, STATUS_LABELS, CATEGORY_LABELS, CATEGORY_ICONS, getImageUrl } from '../utils/constants';
import { ArrowLeft, MapPin, Clock, CheckCircle, AlertTriangle, Bot, Image } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const STATUS_ICONS: Record<string, any> = {
  pending_review: Clock,
  pending: Clock,
  assigned: AlertTriangle,
  in_progress: AlertTriangle,
  awaiting_verification: Clock,
  resolved: CheckCircle,
  rejected: AlertTriangle,
};

export default function ReportDetailPage() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rRes, hRes] = await Promise.all([
          api.get(`/reports/${id}`),
          api.get(`/reports/${id}/history`),
        ]);
        setReport(rRes.data.data);
        setEvidence(rRes.data.evidence || []);
        setHistory(hRes.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Could not load report.');
      } finally { setLoading(false); }
    };
    fetchAll();
  }, [id]);

  if (loading) return (
    <div className="page-container flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !report) return (
    <div className="page-container">
      <div className="alert-error"><AlertTriangle className="w-4 h-4" />{error || 'Report not found.'}</div>
      <Link to="/dashboard" className="btn-secondary mt-4 inline-flex"><ArrowLeft className="w-4 h-4" />Back</Link>
    </div>
  );

  return (
    <div className="page-container max-w-5xl animate-fade-in">
      <Link to="/dashboard" className="btn-outline btn-sm mb-6 inline-flex">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </Link>

      {report.isDemo && (
        <div className="demo-banner rounded-xl mb-4">🧪 DEMO DATA — This is a sample report for demonstration purposes</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header */}
          <div className="card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1 font-mono">{report.complaintNumber}</p>
                <h1 className="font-display text-xl font-bold text-gray-900 mb-2">
                  {CATEGORY_ICONS[report.category]} {CATEGORY_LABELS[report.category]} Waste Report
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">{report.description}</p>
              </div>
              <div className="text-center flex-shrink-0">
                <span className={`badge text-sm px-3 py-1 ${report.severity === 'high' ? 'badge-red' : report.severity === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
                  {report.severity}
                </span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Image className="w-4 h-4 text-primary-600" />
              Report Image
            </h2>
            <img src={getImageUrl(report.imageUrl)} alt="Garbage report"
              className="w-full rounded-xl object-cover max-h-72" />
          </div>

          {/* AI Result */}
          <div className={`card border-2 ${report.aiProcessingStatus === 'completed' ? 'border-primary-200 bg-primary-50/30' : 'border-gray-100'}`}>
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary-600" />
              AI Classification Result
            </h2>

            {report.aiProcessingStatus === 'completed' && report.aiPredictedCategory ? (
              <div>
                {report.aiProvider === 'Demo Mode' && (
                  <div className="alert-warning mb-3 text-xs">
                    🧪 SIMULATED DEMO RESULT — Not a real AI prediction. For demonstration only.
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{CATEGORY_ICONS[report.aiPredictedCategory]}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{CATEGORY_LABELS[report.aiPredictedCategory]}</p>
                    <p className="text-sm text-gray-500">
                      Confidence: <span className="font-medium text-primary-600">
                        {report.aiConfidence ? (report.aiConfidence * 100).toFixed(0) + '%' : '—'}
                      </span>
                      {report.aiConfidence < 0.7 && <span className="text-yellow-600 ml-2">⚠️ Needs manual review</span>}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Provider: {report.aiProvider}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 capitalize">
                {report.aiProcessingStatus === 'processing' ? '⏳ AI is analyzing your image...'
                  : report.aiProcessingStatus === 'failed' ? '❌ AI classification failed'
                  : '⏳ Pending classification'}
              </p>
            )}
          </div>

          {/* Location Map */}
          {report.latitude && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-600" /> Location
              </h2>
              {report.address && <p className="text-sm text-gray-600 mb-3">{report.address}</p>}
              <div className="map-container h-48">
                <MapContainer center={[report.latitude, report.longitude]} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© OpenStreetMap' />
                  <Marker position={[report.latitude, report.longitude]} />
                </MapContainer>
              </div>
              <p className="text-xs text-gray-400 mt-2">📍 {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}</p>
            </div>
          )}

          {/* Cleanup Evidence */}
          {evidence.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-3">Cleanup Evidence</h2>
              <div className="grid grid-cols-2 gap-3">
                {evidence.map((e: any) => (
                  <div key={e._id} className="rounded-xl overflow-hidden border border-gray-100">
                    <img src={getImageUrl(e.imageUrl)} alt="Cleanup evidence" className="w-full h-32 object-cover" />
                    <div className="p-2 text-xs text-gray-500">
                      By {e.staffId?.name || 'Staff'} · {formatDateTime(e.uploadedAt)}
                      {e.verificationStatus === 'approved' && (
                        <span className="ml-2 text-primary-600 font-medium">✅ Verified</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Current Status</h2>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${report.status === 'resolved' ? 'bg-primary-100 text-primary-600' : 'bg-yellow-100 text-yellow-600'}`}>
                {report.status === 'resolved'
                  ? <CheckCircle className="w-5 h-5" />
                  : <Clock className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{STATUS_LABELS[report.status]}</p>
                {report.assignedStaffId && (
                  <p className="text-xs text-gray-500">Assigned: {report.assignedStaffId.name}</p>
                )}
              </div>
            </div>
            {report.resolvedAt && (
              <p className="text-xs text-gray-400 mt-2">Resolved: {formatDateTime(report.resolvedAt)}</p>
            )}
            {report.rejectionReason && (
              <div className="alert-error mt-3 text-xs">Rejected: {report.rejectionReason}</div>
            )}
          </div>

          {/* Details */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Report Details</h2>
            <dl className="space-y-2 text-sm">
              {[
                { label: 'Submitted', value: formatDateTime(report.createdAt) },
                { label: 'Reporter', value: report.reporterId?.name || '—' },
                { label: 'Category', value: `${CATEGORY_ICONS[report.category]} ${CATEGORY_LABELS[report.category]}` },
                { label: 'Severity', value: report.severity },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2">
                  <dt className="text-gray-400">{label}</dt>
                  <dd className="font-medium text-gray-700 text-right capitalize">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Status Timeline</h2>
            <div className="space-y-3">
              {history.map((h: any, i: number) => {
                const Icon = STATUS_ICONS[h.newStatus] || Clock;
                return (
                  <div key={h._id} className="flex gap-3 items-start">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                      ${h.newStatus === 'resolved' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{STATUS_LABELS[h.newStatus]}</p>
                      {h.note && <p className="text-xs text-gray-500">{h.note}</p>}
                      <p className="text-xs text-gray-400">{formatDateTime(h.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
