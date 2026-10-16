import { useState } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Presentation,
  ShieldCheck,
  Award,
  Calendar,
  Layers,
  Eye,
  X
} from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  type: 'pdf' | 'pptx';
  category: string;
  badge: string;
  badgeColor: string;
  fileName: string;
  filePath: string;
  fileSize: string;
  description: string;
  highlights: string[];
  submissionInfo: string;
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: 'presentation',
    title: 'Project Presentation (PPT)',
    type: 'pptx',
    category: 'Transdisciplinary Project Presentation',
    badge: 'Presentation Slides',
    badgeColor: 'badge-purple',
    fileName: 'CleanCity_Project_Presentation.pptx',
    filePath: '/documents/CleanCity_Project_Presentation.pptx',
    fileSize: '13.8 MB',
    description:
      'Official presentation slides for the Transdisciplinary Project (TDP) at Vivekananda Global University (VGU), Jaipur. Covers problems with traditional garbage handling, smart sensors, automated sorting, and civic benefits.',
    highlights: [
      'Submitted by: Deepanshu Manghnani (B.Tech AI), Akrati Gautam (BCA), Aditya Singh Dumoliya (BPT), Vishal Meena (ABM), Khalifa Rabiu Miko (B.Pharma)',
      'Submitted to: Er. VISHVENDRA SINGH (Faculty Guide)',
      'Institution: Vivekananda Global University, Jaipur',
      'Topics: Smart waste bins, IoT integration, waste-to-energy pathways, and community engagement'
    ],
    submissionInfo: 'VGU Jaipur · TDP Group 2'
  },
  {
    id: 'research-paper',
    title: 'Published Research Paper',
    type: 'pdf',
    category: 'Peer-Reviewed Journal Publication',
    badge: 'Published Paper',
    badgeColor: 'badge-green',
    fileName: 'CleanCity_Research_Paper.pdf',
    filePath: '/documents/CleanCity_Research_Paper.pdf',
    fileSize: '237 KB',
    description:
      'Published research review paper in Chemical Science Review and Letters: “Integration of Artificial Intelligence and Biochemical Models for Predictive Smart Waste Management: A Comprehensive Review”.',
    highlights: [
      'Journal: Chemical Science Review and Letters (ISSN 2278-6783)',
      'DOI: 10.37273/chesci.cs205507253',
      'Volume & Issue: 2024, 13 (51), 112-119',
      'Corresponding Author: Er. Vishvendra Singh (vishvendra.singh@vgu.ac.in)',
      'Student Author: Deepanshu Manghnani & team'
    ],
    submissionInfo: 'Chem Sci Rev Lett 2024 · ISSN 2278-6783'
  },
  {
    id: 'turnitin-report',
    title: 'Project Report & Turnitin Verification',
    type: 'pdf',
    category: 'Academic Report & Similarity Audit',
    badge: 'Turnitin Verified (12% Similarity)',
    badgeColor: 'badge-blue',
    fileName: 'CleanCity_Project_Report.pdf',
    filePath: '/documents/CleanCity_Project_Report.pdf',
    fileSize: '1.5 MB',
    description:
      'Full 19-page academic project report with official Turnitin Similarity Report ID (oid:3618:58964593), demonstrating a low 12% overall similarity index and detailed scientific methodology.',
    highlights: [
      'Report Length: 19 Pages · 5,817 Words',
      'Similarity Index: 12% Overall Similarity (Verified by Turnitin)',
      'Methodology: Convolutional Neural Network (CNN) architecture, waste-to-energy conversion, and disposal hierarchy',
      'Author / Guide: Vishvendra tdp Tdp & Deepanshu Manghnani'
    ],
    submissionInfo: 'Similarity Report ID: oid:3618:58964593'
  }
];

export default function DocumentsPage() {
  const [activePreviewPdf, setActivePreviewPdf] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="badge badge-primary inline-flex items-center gap-1.5 mb-3">
          <Award className="w-3.5 h-3.5" />
          Academic & Research Repository
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">
          Project Documents
        </h1>
        <p className="text-gray-600 mt-2 text-base">
          Access and download our official project presentation, verified Turnitin report, and published research paper for Clean City.
        </p>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {DOCUMENTS.map(doc => (
          <div
            key={doc.id}
            className="card p-6 flex flex-col justify-between hover:shadow-card-hover transition-all duration-200 border border-gray-100"
          >
            <div>
              {/* Top Row */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`badge ${doc.badgeColor}`}>{doc.badge}</span>
                <span className="text-xs text-gray-400 font-mono">{doc.fileSize}</span>
              </div>

              {/* Title & Type Icon */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  {doc.type === 'pptx' ? (
                    <Presentation className="w-5 h-5 text-purple-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{doc.category}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {doc.description}
              </p>

              {/* Highlights List */}
              <div className="bg-gray-50/80 rounded-xl p-3 mb-5 border border-gray-100">
                <h4 className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Document Details
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {doc.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
              {doc.type === 'pdf' ? (
                <>
                  <button
                    onClick={() => setActivePreviewPdf(doc.filePath)}
                    className="btn-secondary btn-sm flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview PDF
                  </button>
                  <a
                    href={doc.filePath}
                    download={doc.fileName}
                    className="btn-primary btn-sm flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </>
              ) : (
                <a
                  href={doc.filePath}
                  download={doc.fileName}
                  className="btn-primary btn-sm w-full flex items-center justify-center gap-1.5 text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PPT Presentation ({doc.fileSize})
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Faculty & Academic Context Card */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="badge bg-white/20 text-white text-xs mb-2">
              Academic Supervision
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display">
              Faculty Guide: Er. VISHVENDRA SINGH
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              Department of Agribusiness Management · Vivekananda Global University, Jaipur
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Project Lead: Deepanshu Manghnani (B.Tech AI & Data Science)
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://doi.org/10.37273/chesci.cs205507253"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white text-gray-900 hover:bg-gray-100 btn-sm flex items-center gap-1.5 font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Journal DOI Link
            </a>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {activePreviewPdf && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" />
                Document Preview
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={activePreviewPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline btn-sm text-xs flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Open in New Tab
                </a>
                <button
                  onClick={() => setActivePreviewPdf(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-100">
              <iframe
                src={`${activePreviewPdf}#toolbar=1`}
                title="Document Viewer"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
