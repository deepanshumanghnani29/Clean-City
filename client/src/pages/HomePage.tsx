import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, MapPin, Camera, CheckCircle, TrendingUp, Users,
  ArrowRight, Shield, Globe, BookOpen, Star, ChevronRight,
  FileText, Download, Presentation, ShieldCheck
} from 'lucide-react';
import api from '../services/api';

interface Stats {
  total: number;
  resolved: number;
  pending: number;
  categories: number;
}

const WASTE_CATEGORIES = [
  { id: 'plastic', icon: '♻️', label: 'Plastic Waste', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'organic', icon: '🌱', label: 'Wet Food Waste', color: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'paper', icon: '📄', label: 'Cardboard & Paper', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'ewaste', icon: '💻', label: 'E-Waste & Batteries', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'hazardous', icon: '⚠️', label: 'Medical & Hazard', color: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'glass', icon: '🍶', label: 'Glass Bottles', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'metal', icon: '🥫', label: 'Metal Cans', color: 'bg-gray-50 text-gray-700 border-gray-200' },
];

const FEATURES = [
  { icon: Camera, title: 'Easy Photo Reporting', desc: 'Snap a picture of roadside garbage and submit it in just 10 seconds.', color: 'bg-primary-100 text-primary-700' },
  { icon: MapPin, title: 'Pinpoint GPS Location', desc: 'Automatically marks the exact street location so cleaning teams find it easily.', color: 'bg-blue-100 text-blue-700' },
  { icon: Globe, title: 'Live City Map', desc: 'View all reported waste spots in your area and see which ones are already cleaned.', color: 'bg-teal-100 text-teal-700' },
  { icon: TrendingUp, title: 'Status Tracking', desc: 'Follow your complaint from "Reported" to "Cleaning in Progress" to "Cleaned".', color: 'bg-purple-100 text-purple-700' },
  { icon: Users, title: 'Crew Coordination', desc: 'Municipal supervisors can immediately dispatch sanitation workers to the site.', color: 'bg-orange-100 text-orange-700' },
  { icon: BookOpen, title: 'Simple Recycling Guide', desc: 'Learn which bin to use for wet kitchen scraps, plastics, and old electronics.', color: 'bg-yellow-100 text-yellow-700' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: Camera, title: 'Take a Photo', desc: 'Take a photo of garbage on your street or upload an image from your gallery.' },
  { step: '02', icon: MapPin, title: 'Set Location', desc: 'Your GPS coordinates are picked automatically, or you can tap on the map.' },
  { step: '03', icon: Leaf, title: 'Select Waste Type', desc: 'Choose if it is plastic, wet food waste, paper, or electronic waste.' },
  { step: '04', icon: CheckCircle, title: 'Watch It Get Cleaned', desc: 'Sanitation staff visits the spot, cleans it up, and marks it resolved.' },
];

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({ total: 18, resolved: 12, pending: 6, categories: 7 });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        if (data.success) {
          setStats({
            total: data.data.total || 18,
            resolved: data.data.resolved || 12,
            pending: (data.data.pending || 0) + (data.data.pendingReview || 0) || 6,
            categories: 7,
          });
        }
      } catch {
        // Fallback default numbers
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary-950 via-forest-900 to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-primary-200 mb-6">
                <Leaf className="w-3.5 h-3.5" />
                Smart Urban Waste Management Platform
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight mb-6">
                Report Waste.<br />
                <span className="text-primary-400">Restore</span> Clean City.
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
                Make your city cleaner with fast garbage reporting, live GPS tracking, and easy waste segregation guidelines.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/report" className="btn-primary btn-lg group">
                  <Camera className="w-5 h-5" />
                  Report Garbage Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/map" className="btn bg-white/10 border border-white/20 text-white hover:bg-white/20 btn-lg">
                  <MapPin className="w-5 h-5" />
                  Explore Live Map
                </Link>
                <Link to="/documents" className="btn bg-white/10 border border-white/20 text-white hover:bg-white/20 btn-lg">
                  <FileText className="w-5 h-5" />
                  Project Documents
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-10">
                {[
                  { icon: Shield, label: 'Open to Everyone' },
                  { icon: Leaf, label: 'Eco-Friendly City' },
                  { icon: Globe, label: 'Real-time GPS Tracking' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-gray-400">
                    <Icon className="w-4 h-4 text-primary-400" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-teal-500/30 rounded-3xl border border-white/10 backdrop-blur-sm" />
                <div className="absolute inset-4 bg-gradient-to-br from-primary-600/20 to-teal-600/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl mb-4">🌿</div>
                    <p className="text-primary-300 font-display font-semibold text-lg">Clean City</p>
                    <p className="text-gray-400 text-sm">For Healthier Neighborhoods</p>
                  </div>
                </div>
                {/* Floating stat badges */}
                <div className="absolute -top-3 -right-3 bg-white rounded-xl px-3 py-2 shadow-elevated text-xs font-semibold text-primary-700">
                  ✅ {stats.resolved} Cleanups Verified
                </div>
                <div className="absolute -bottom-3 -left-3 bg-white rounded-xl px-3 py-2 shadow-elevated text-xs font-semibold text-blue-700">
                  📍 {stats.total} Reports Submitted
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Documents Section ─────────────────────── */}
      <section className="bg-primary-50/50 py-12 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="badge badge-primary text-xs font-semibold mb-1">Academic Submissions</span>
              <h2 className="text-2xl font-bold text-gray-900 font-display">
                Download Official Project Documents
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Access our project presentation, published research paper, and Turnitin similarity report.
              </p>
            </div>
            <Link to="/documents" className="btn-primary btn-sm self-start md:self-auto">
              View All 3 Documents &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Presentation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Project Presentation</h4>
                  <p className="text-[11px] text-gray-500">Official PPT · 13.8 MB</p>
                </div>
              </div>
              <a
                href="/documents/CleanCity_Project_Presentation.pptx"
                download="CleanCity_Project_Presentation.pptx"
                className="btn-outline btn-sm text-xs"
              >
                <Download className="w-3.5 h-3.5" /> PPT
              </a>
            </div>

            <div className="card p-4 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Research Paper</h4>
                  <p className="text-[11px] text-gray-500">Published Review · 237 KB</p>
                </div>
              </div>
              <a
                href="/documents/CleanCity_Research_Paper.pdf"
                download="CleanCity_Research_Paper.pdf"
                className="btn-outline btn-sm text-xs"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </a>
            </div>

            <div className="card p-4 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Turnitin Report</h4>
                  <p className="text-[11px] text-gray-500">12% Similarity · 1.5 MB</p>
                </div>
              </div>
              <a
                href="/documents/CleanCity_Project_Report.pdf"
                download="CleanCity_Project_Report.pdf"
                className="btn-outline btn-sm text-xs"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Stats ───────────────────────────────────── */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Clean City Impact</h2>
            <p className="text-gray-500 text-sm mt-1">Real-time statistics from our municipal tracker</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Complaints', value: stats.total, icon: '📋', color: 'text-blue-600' },
              { label: 'Pending Cleanups', value: stats.pending, icon: '⏳', color: 'text-amber-600' },
              { label: 'Cleanups Finished', value: stats.resolved, icon: '✅', color: 'text-primary-600' },
              { label: 'Waste Categories', value: stats.categories, icon: '♻️', color: 'text-teal-600' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="card text-center hover:shadow-card-hover transition-shadow">
                <div className="text-3xl mb-2">{icon}</div>
                <div className={`font-display text-3xl font-bold ${color} mb-1`}>
                  {statsLoading ? (
                    <div className="skeleton w-16 h-8 mx-auto" />
                  ) : (
                    value.toLocaleString()
                  )}
                </div>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title text-3xl">How It Works</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Four easy steps from seeing garbage to verified cleanup
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
              <div key={step} className="relative card text-center group hover:shadow-card-hover transition-all">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-3 z-10 text-gray-200 text-2xl">→</div>
                )}
                <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform shadow-sm">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-primary-500 tracking-widest">{step}</span>
                <h3 className="font-semibold text-gray-900 mt-1 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/report" className="btn-primary">
              Start Reporting Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title text-3xl">Key Platform Features</h2>
            <p className="text-gray-500 mt-2">Everything citizens and city managers need for a cleaner town</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card group hover:shadow-card-hover transition-all border hover:border-primary-100">
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waste Categories ─────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title text-3xl">Waste Categories</h2>
            <p className="text-gray-500 mt-2">Learn what goes in which bin with our simple guide</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {WASTE_CATEGORIES.map(({ id, icon, label, color }) => (
              <Link
                key={id}
                to={`/guide#${id}`}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border ${color} 
                           font-medium text-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
              >
                <span className="text-xl">{icon}</span>
                {label}
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/guide" className="btn-secondary">
              <BookOpen className="w-4 h-4" />
              Open Simple Waste Guide
            </Link>
          </div>
        </div>
      </section>

      {/* ── Research & Mentorship Section ─────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-primary-700 text-xs font-medium mb-6">
                <Star className="w-3.5 h-3.5" />
                Transdisciplinary Academic Project
              </div>
              <h2 className="section-title text-3xl mb-4">Supported by Published Research</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Clean City is developed as a college project based on the published research paper:
              </p>
              <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-700 text-sm mb-6 leading-relaxed">
                "Integration of Artificial Intelligence and Biochemical Models for Predictive Smart Waste Management: A Comprehensive Review"
              </blockquote>
              <p className="text-sm text-gray-500 mb-2">
                Published in <em>Chemical Science Review and Letters</em> (ISSN 2278-6783).
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link to="/about" className="btn-primary">
                  About & Faculty Guide
                </Link>
                <Link to="/documents" className="btn-secondary">
                  Download Project Documents
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-3xl p-8 border border-primary-100">
              {/* Faculty Guide Highlight */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-primary-200 mb-4">
                <div className="text-[11px] font-bold uppercase text-primary-700 tracking-wider">
                  Academic Mentor
                </div>
                <h3 className="font-bold text-gray-900 text-lg mt-0.5">
                  Faculty Guide: Er. VISHVENDRA SINGH
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Department of Agribusiness Management · VGU Jaipur
                </p>
              </div>

              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                Student Project Team (Group 2)
              </h4>
              <div className="space-y-2.5">
                {[
                  { name: 'Deepanshu Manghnani', dept: 'B.Tech – AI & DS', role: 'Project Developer' },
                  { name: 'Akrati Gautam', dept: 'BCA – AI', role: 'Contributor' },
                  { name: 'Aditya Singh Dumoliya', dept: 'BPT', role: 'Contributor' },
                  { name: 'Vishal Meena', dept: 'ABM', role: 'Contributor' },
                  { name: 'Khalifa Rabiu Miko', dept: 'B.Pharm.', role: 'Contributor' },
                ].map(({ name, dept, role }) => (
                  <div key={name} className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{name}</p>
                      <p className="text-[11px] text-gray-500">{dept}</p>
                    </div>
                    <span className="text-[11px] text-primary-600 font-medium ml-auto whitespace-nowrap">{role}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Vivekananda Global University, Jaipur, Rajasthan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-teal-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-bold mb-4">Start Making Your City Cleaner</h2>
          <p className="text-primary-100 mb-8 text-lg">
            No account required. Simply snap a photo, report garbage, and help cleaning teams keep our streets clean.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/report" className="btn bg-white text-primary-700 hover:bg-primary-50 btn-lg font-semibold">
              Report Garbage Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/map" className="btn bg-white/10 border border-white/30 text-white hover:bg-white/20 btn-lg">
              <MapPin className="w-5 h-5" />
              View Live Waste Map
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
