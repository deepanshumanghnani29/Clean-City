import {
  GraduationCap,
  FileText,
  Cpu,
  Layers,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Users,
  Download,
  Presentation,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Hero Banner */}
      <div className="card p-8 sm:p-12 mb-10 bg-gradient-to-br from-primary-900 via-primary-800 to-teal-900 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm mb-4 border border-white/20">
            <GraduationCap className="w-3.5 h-3.5 text-primary-300" />
            Transdisciplinary Project (TDP) · VGU Jaipur
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight tracking-tight">
            Clean City: Smart Urban Waste Management
          </h1>
          <p className="mt-4 text-gray-200 text-base sm:text-lg leading-relaxed">
            Clean City is a student-led project that makes garbage reporting simple, classifies waste accurately, and helps municipal teams clean up our neighborhoods faster.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/documents"
              className="btn bg-white text-primary-900 hover:bg-gray-100 font-semibold text-sm flex items-center gap-1.5 shadow-md"
            >
              <FileText className="w-4 h-4 text-primary-700" />
              View Project Documents
            </Link>
            <Link to="/report" className="btn bg-primary-600 hover:bg-primary-500 text-white text-sm">
              Report Garbage Now
            </Link>
          </div>
        </div>
      </div>

      {/* Research Paper Citation Box */}
      <div className="card p-6 sm:p-8 mb-10 border-l-4 border-l-primary-500 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <h2 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Research Paper Foundation
          </h2>
          <span className="badge badge-green text-xs font-semibold">Published Paper</span>
        </div>
        <p className="text-gray-700 font-medium text-sm leading-relaxed mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          “Integration of Artificial Intelligence and Biochemical Models for Predictive Smart Waste Management: A Comprehensive Review.”
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
          <div>
            <span className="font-semibold text-gray-900 block">Published In</span>
            <span>Chemical Science Review and Letters (ISSN 2278-6783)</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 block">DOI Citation</span>
            <a
              href="https://doi.org/10.37273/chesci.cs205507253"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-primary-600 hover:underline inline-flex items-center gap-1"
            >
              10.37273/chesci.cs205507253
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div>
            <span className="font-semibold text-gray-900 block">Institution</span>
            <span>Vivekananda Global University (VGU), Jaipur</span>
          </div>
        </div>
      </div>

      {/* Quick Download Section for Project Documents */}
      <div className="card p-6 sm:p-8 mb-10 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
              <Download className="w-5 h-5 text-primary-600" />
              Download Project Documents
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Actual files submitted for the Transdisciplinary Project evaluation.
            </p>
          </div>
          <Link to="/documents" className="text-xs font-semibold text-primary-600 hover:text-primary-800">
            Open Full Documents Hub &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* PPT */}
          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Presentation className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-900">Project Presentation (PPT)</span>
              </div>
              <p className="text-xs text-purple-800 mb-3">
                Official presentation slides presented to the faculty evaluation panel.
              </p>
            </div>
            <a
              href="/documents/CleanCity_Project_Presentation.pptx"
              download="CleanCity_Project_Presentation.pptx"
              className="btn bg-purple-600 hover:bg-purple-700 text-white btn-sm text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download PPT (13.8 MB)
            </a>
          </div>

          {/* Research Paper */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">Published Research Paper</span>
              </div>
              <p className="text-xs text-emerald-800 mb-3">
                Full review article published in Chemical Science Review & Letters.
              </p>
            </div>
            <a
              href="/documents/CleanCity_Research_Paper.pdf"
              download="CleanCity_Research_Paper.pdf"
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white btn-sm text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Paper (237 KB)
            </a>
          </div>

          {/* Turnitin Report */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-900">Turnitin Project Report</span>
              </div>
              <p className="text-xs text-blue-800 mb-3">
                Official Turnitin similarity report verifying 12% similarity index.
              </p>
            </div>
            <a
              href="/documents/CleanCity_Project_Report.pdf"
              download="CleanCity_Project_Report.pdf"
              className="btn bg-blue-600 hover:bg-blue-700 text-white btn-sm text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Report (1.5 MB)
            </a>
          </div>
        </div>
      </div>

      {/* How the System Works in Simple Terms */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 font-display text-center mb-2">
          How Clean City Works (In 4 Simple Steps)
        </h2>
        <p className="text-center text-sm text-gray-500 max-w-xl mx-auto mb-8">
          Designed to be easy for every citizen and practical for every municipal worker.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-5 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-3">
              <span className="font-bold text-base">1</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">Take a Photo</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Whenever you spot an overflowing bin or roadside trash pile, snap a quick photo and upload it on Clean City with your location.
            </p>
          </div>

          <div className="card p-5 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
              <span className="font-bold text-base">2</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">Smart Classification</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              The system identifies whether the garbage is plastic, wet kitchen waste, dry paper, e-waste, or dangerous hazardous waste.
            </p>
          </div>

          <div className="card p-5 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <span className="font-bold text-base">3</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">Cleaning Crew Dispatched</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              The complaint appears right away on the staff dashboard with exact GPS directions so sanitation workers can clear it without delay.
            </p>
          </div>

          <div className="card p-5 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <span className="font-bold text-base">4</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">Verified & Resolved</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Once cleaned, proof is uploaded, the live map turns green, and the report is marked resolved for everyone to see.
            </p>
          </div>
        </div>
      </div>

      {/* Academic & Faculty Section (Requested by user) */}
      <div className="card p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl border border-gray-700 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="badge bg-primary-500/20 text-primary-300 text-xs font-semibold px-3 py-1 mb-2">
              Academic Project Mentorship & Team
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Project Mentorship & Student Contributors
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Vivekananda Global University (VGU), Jaipur · Transdisciplinary Project (TDP)
            </p>
          </div>

          {/* Faculty Guide Card */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-primary-500 text-white flex items-center justify-center shrink-0 text-xl font-bold shadow-lg">
                👨‍🏫
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider block">
                  Project Mentor & Guide
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                  Faculty Guide: Er. VISHVENDRA SINGH
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  Department of Agribusiness Management · Vivekananda Global University, Jaipur
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Email: <span className="font-mono text-primary-300">vishvendra.singh@vgu.ac.in</span>
                </p>
              </div>
            </div>
          </div>

          {/* Student Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Deepanshu */}
            <div className="p-4 rounded-xl bg-white/5 border border-primary-500/30">
              <span className="text-[10px] uppercase font-bold text-primary-400 tracking-wider">
                Project Lead & Developer
              </span>
              <h4 className="text-sm font-bold text-white mt-1">Deepanshu Manghnani</h4>
              <p className="text-gray-300 mt-0.5">B.Tech - Artificial Intelligence & Data Science</p>
              <p className="text-gray-400 text-[11px] mt-0.5">VGU Jaipur</p>
            </div>

            {/* Team Members */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Contributor
              </span>
              <h4 className="text-sm font-bold text-white mt-1">Akrati Gautam</h4>
              <p className="text-gray-300 mt-0.5">BCA - Artificial Intelligence</p>
              <p className="text-gray-400 text-[11px] mt-0.5">VGU Jaipur</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Contributor
              </span>
              <h4 className="text-sm font-bold text-white mt-1">Aditya Singh Dumoliya</h4>
              <p className="text-gray-300 mt-0.5">BPT (Physiotherapy)</p>
              <p className="text-gray-400 text-[11px] mt-0.5">VGU Jaipur</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Contributor
              </span>
              <h4 className="text-sm font-bold text-white mt-1">Vishal Meena</h4>
              <p className="text-gray-300 mt-0.5">ABM (Agribusiness Management)</p>
              <p className="text-gray-400 text-[11px] mt-0.5">VGU Jaipur</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Contributor
              </span>
              <h4 className="text-sm font-bold text-white mt-1">Khalifa Rabiu Miko</h4>
              <p className="text-gray-300 mt-0.5">B.Pharm (Pharmacy)</p>
              <p className="text-gray-400 text-[11px] mt-0.5">VGU Jaipur</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-center text-center">
              <span className="text-xs text-gray-300 font-medium">Transdisciplinary Project</span>
              <span className="text-[11px] text-primary-400 mt-1 font-semibold">TDP Group 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
