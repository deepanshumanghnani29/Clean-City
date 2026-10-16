import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, STATUS_LABELS, CATEGORY_LABELS, CATEGORY_ICONS, getImageUrl } from '../utils/constants';
import { CheckCircle, Clock, Loader, Upload, MapPin, AlertTriangle, ArrowRight } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function StaffDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const defaultStaffTasks = [
    {
      _id: 'task-1',
      status: 'assigned',
      priority: 'high',
      report: {
        _id: 'rep-s1',
        complaintNumber: 'CC-2024-5101',
        category: 'plastic',
        severity: 'high',
        description: 'Accumulated plastic bottles and bags blocking pedestrian walkway.',
        location: { latitude: 26.9124, longitude: 75.7873, address: 'Central Park West Gate' },
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    },
    {
      _id: 'task-2',
      status: 'in_progress',
      priority: 'medium',
      report: {
        _id: 'rep-s2',
        complaintNumber: 'CC-2024-5102',
        category: 'organic',
        severity: 'medium',
        description: 'Overflowing wet waste bin near market entrance.',
        location: { latitude: 26.9200, longitude: 75.7900, address: 'Subhash Nagar Market' },
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      }
    }
  ];

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks/my');
      if (data.success && data.data?.length > 0) {
        setTasks(data.data);
      } else {
        setTasks(defaultStaffTasks);
      }
    } catch {
      setTasks(defaultStaffTasks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const updateStatus = async (taskId: string, status: string) => {
    setActionLoading(true);
    setMsg(null);
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      setMsg({ type: 'success', text: `Status updated to: ${STATUS_LABELS[status]}` });
      fetchTasks();
      if (selectedTask?._id === taskId) {
        setSelectedTask((t: any) => ({ ...t, status }));
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally { setActionLoading(false); }
  };

  const uploadEvidence = async (taskId: string) => {
    if (!evidenceFile) { setMsg({ type: 'error', text: 'Please select an evidence image.' }); return; }
    setActionLoading(true);
    setMsg(null);
    try {
      const form = new FormData();
      form.append('image', evidenceFile);
      form.append('notes', evidenceNotes);
      await api.post(`/tasks/${taskId}/evidence`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg({ type: 'success', text: 'Evidence submitted. Report moved to Awaiting Verification.' });
      setEvidenceFile(null);
      setEvidenceNotes('');
      fetchTasks();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Upload failed.' });
    } finally { setActionLoading(false); }
  };

  const activeTasks = tasks.filter(t => !['resolved', 'rejected'].includes(t.status));
  const completedTasks = tasks.filter(t => t.status === 'resolved');

  const getPriorityColor = (severity: string) =>
    severity === 'high' ? 'border-l-red-500' : severity === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500';

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h1 className="section-title">Staff Dashboard</h1>
        <p className="section-subtitle">Welcome, {user?.name || 'Sanitation Staff'} · Manage assigned city cleanup tasks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Tasks', value: activeTasks.length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Completed', value: completedTasks.length, color: 'bg-primary-100 text-primary-700' },
          { label: 'Total Assigned', value: tasks.length, color: 'bg-gray-100 text-gray-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <div className={`text-2xl font-bold font-display ${color.split(' ')[1]} mb-1`}>{value}</div>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeTasks.length === 0 ? (
        <div className="card text-center py-16">
          <CheckCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No active tasks assigned</p>
          <p className="text-gray-300 text-sm mt-1">Check back later or contact your admin.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Task List */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Active Tasks ({activeTasks.length})</h2>
            <div className="space-y-3">
              {activeTasks.map(task => (
                <div key={task._id}
                  onClick={() => { setSelectedTask(task); setMsg(null); }}
                  className={`card cursor-pointer border-l-4 hover:shadow-card-hover transition-all
                    ${getPriorityColor(task.severity)}
                    ${selectedTask?._id === task._id ? 'ring-2 ring-primary-400' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-gray-400 mb-0.5">{task.complaintNumber}</p>
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {CATEGORY_ICONS[task.category]} {CATEGORY_LABELS[task.category]}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{task.address || 'No address'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`badge text-xs ${task.severity === 'high' ? 'badge-red' : task.severity === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
                        {task.severity}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{STATUS_LABELS[task.status]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Detail Panel */}
          {selectedTask && (
            <div className="space-y-4 animate-fade-in">
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-3">Task Details</h2>
                <img src={getImageUrl(selectedTask.imageUrl)} alt="Garbage" className="w-full h-40 object-cover rounded-xl mb-3" />

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div><span className="text-gray-400">Complaint #</span><p className="font-mono font-semibold">{selectedTask.complaintNumber}</p></div>
                  <div><span className="text-gray-400">Status</span><p className="font-semibold">{STATUS_LABELS[selectedTask.status]}</p></div>
                  <div><span className="text-gray-400">Category</span><p>{CATEGORY_ICONS[selectedTask.category]} {CATEGORY_LABELS[selectedTask.category]}</p></div>
                  <div><span className="text-gray-400">Severity</span><p className="capitalize">{selectedTask.severity}</p></div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{selectedTask.description}</p>

                {/* Map */}
                {selectedTask.latitude && (
                  <div className="map-container h-36 mb-3">
                    <MapContainer center={[selectedTask.latitude, selectedTask.longitude]} zoom={15} style={{ height: '100%', width: '100%' }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© OSM' />
                      <Marker position={[selectedTask.latitude, selectedTask.longitude]} />
                    </MapContainer>
                  </div>
                )}

                {/* Navigation link */}
                {selectedTask.latitude && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedTask.latitude},${selectedTask.longitude}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-secondary btn-sm w-full justify-center mb-3"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Navigate to Location
                  </a>
                )}

                {/* Action Buttons */}
                {msg && (
                  <div className={msg.type === 'success' ? 'alert-success mb-3' : 'alert-error mb-3'}>
                    {msg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {msg.text}
                  </div>
                )}

                {selectedTask.status === 'assigned' && (
                  <button onClick={() => updateStatus(selectedTask._id, 'in_progress')} disabled={actionLoading}
                    className="btn-primary w-full justify-center">
                    {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : '🚀 Start Cleanup'}
                  </button>
                )}

                {selectedTask.status === 'in_progress' && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Upload Cleanup Evidence</p>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { if (e.target.files?.[0]) setEvidenceFile(e.target.files[0]); }} />
                    <button onClick={() => fileRef.current?.click()} className="btn-outline btn-sm w-full justify-center">
                      <Upload className="w-3.5 h-3.5" />
                      {evidenceFile ? evidenceFile.name : 'Select Evidence Photo'}
                    </button>
                    <textarea className="input resize-none h-16 text-xs" placeholder="Optional notes about the cleanup..."
                      value={evidenceNotes} onChange={e => setEvidenceNotes(e.target.value)} />
                    <button onClick={() => uploadEvidence(selectedTask._id)} disabled={actionLoading || !evidenceFile}
                      className="btn-primary w-full justify-center">
                      {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : '✅ Submit Evidence for Verification'}
                    </button>
                  </div>
                )}

                {selectedTask.status === 'awaiting_verification' && (
                  <div className="alert-info text-sm">
                    <Clock className="w-4 h-4" />
                    Awaiting admin verification. No further action needed.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-900 mb-3">Completed Tasks ({completedTasks.length})</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTasks.map(task => (
              <div key={task._id} className="card border-l-4 border-l-primary-400 opacity-75">
                <p className="font-mono text-xs text-gray-400">{task.complaintNumber}</p>
                <p className="font-medium text-sm mt-1">{CATEGORY_ICONS[task.category]} {CATEGORY_LABELS[task.category]}</p>
                <p className="text-xs text-gray-400 mt-1">✅ Resolved {task.resolvedAt ? formatDateTime(task.resolvedAt) : ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
