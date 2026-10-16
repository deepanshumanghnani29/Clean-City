# Clean City — Smart Waste Management Platform

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![React 19](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

**Clean City** is an interactive, civic-tech web platform designed to streamline municipal waste reporting, teach citizens proper waste segregation, and coordinate sanitation cleanup operations with live GPS tracking.

This project is part of a **Transdisciplinary Project (TDP)** developed at **Vivekananda Global University (VGU), Jaipur**.

---

## 👨‍🏫 Mentorship & Project Team

- **Faculty Guide:** Er. VISHVENDRA SINGH  
  *Department of Agribusiness Management · Vivekananda Global University, Jaipur*  
  *Email:* `vishvendra.singh@vgu.ac.in`
- **Project Lead & Developer:** Deepanshu Manghnani *(B.Tech – Artificial Intelligence & Data Science)*
- **Student Contributors (TDP Group 2):**
  - Akrati Gautam *(BCA – AI)*
  - Aditya Singh Dumoliya *(BPT)*
  - Vishal Meena *(ABM)*
  - Khalifa Rabiu Miko *(B.Pharm)*

---

## 📑 Research Paper Foundation

Clean City is inspired by the peer-reviewed review paper:
> **“Integration of Artificial Intelligence and Biochemical Models for Predictive Smart Waste Management: A Comprehensive Review”**  
> *Chemical Science Review and Letters*, 2024, Vol. 13, Issue 51, pp. 112–119.  
> **ISSN:** 2278-6783 · **DOI:** [10.37273/chesci.cs205507253](https://doi.org/10.37273/chesci.cs205507253)

---

## 📁 Included Project Documents

The repository includes the official documents submitted for academic evaluation (available under `client/public/documents/` and accessible via the website's **Project Documents** page):

1. **Project Presentation (PPT):** `CleanCity_Project_Presentation.pptx` (13.8 MB) — Official slides presented to the university panel.
2. **Published Research Paper:** `CleanCity_Research_Paper.pdf` (237 KB) — Full journal review publication.
3. **Turnitin Project Report:** `CleanCity_Project_Report.pdf` (1.5 MB) — Verified report with 12% similarity index (Report ID: `oid:3618:58964593`).

---

## 🌟 Key Features

- **Open Access (No Login Required):** All features—reporting, map view, guide, and dashboards—are accessible immediately to everyone.
- **Fast Citizen Reporting:** Upload a photo of street trash with automatic GPS location detection or interactive map pinning.
- **Live Interactive Waste Map:** Real-time spatial tracking of garbage reports with status markers (Pending, In Progress, Resolved).
- **Simple Waste Segregation Guide:** Everyday, student-friendly guidelines on what belongs in Green, Blue, and Red/Yellow bins with a real-time item search.
- **Municipal Command & Staff Dashboards:** Dedicated operational views for crew dispatch and municipal oversight.
- **Project Documents Hub:** In-browser PDF preview and direct downloads for evaluation materials.

---

## 💻 Tech Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS, TypeScript, React-Leaflet, Lucide Icons, React Router DOM
- **Backend:** Node.js, Express, Helmet, CORS, Morgan, Express-Rate-Limit
- **Deployment:** Vercel (Frontend SPA)

---

## 🚀 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/deepanshumanghnani29/Clean-City.git
cd Clean-City
```

### 2. Run Frontend
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Backend API (Optional)
```bash
cd ../server
npm install
npm run dev
```
The server will start on [http://localhost:5000](http://localhost:5000).

---

## ☁️ Deploying to Vercel

1. Push this repository to your GitHub account (`Clean-City`).
2. Log in to [Vercel](https://vercel.com) and click **"Add New" > "Project"**.
3. Import the `Clean-City` repository.
4. Set the configuration:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (or `client`)
   - **Build Command:** `cd client && npm install && npm run build` (if root) or `npm run build` (if root directory is set to `client`)
   - **Output Directory:** `client/dist` (or `dist` if root directory is set to `client`)
5. Click **Deploy**. Vercel will build and launch your live site with full client-side routing support via `vercel.json`!
