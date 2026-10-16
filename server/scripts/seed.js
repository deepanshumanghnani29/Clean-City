/**
 * Seed Script — CleanCity AI Demo Data
 * Run: node scripts/seed.js
 *
 * Creates demo users (admin, staff, citizens) and sample waste reports.
 * All demo data is clearly labeled with isDemo: true.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const WasteReport = require('../models/WasteReport');
const ReportStatusHistory = require('../models/ReportStatusHistory');
const EcoTip = require('../models/EcoTip');
const Notification = require('../models/Notification');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cleancity-ai';

// ─── Demo coordinates around Jaipur, Rajasthan ───────────────────────────────
const DEMO_LOCATIONS = [
  { lat: 26.9124, lng: 75.7873, address: 'M.I. Road, Jaipur, Rajasthan (DEMO)' },
  { lat: 26.9239, lng: 75.8267, address: 'Malviya Nagar, Jaipur, Rajasthan (DEMO)' },
  { lat: 26.8467, lng: 75.8067, address: 'Sanganer, Jaipur, Rajasthan (DEMO)' },
  { lat: 26.9415, lng: 75.7515, address: 'Vaishali Nagar, Jaipur, Rajasthan (DEMO)' },
  { lat: 26.9058, lng: 75.8195, address: 'Lal Kothi, Jaipur, Rajasthan (DEMO)' },
  { lat: 26.8721, lng: 75.8011, address: 'Pratap Nagar, Jaipur, Rajasthan (DEMO)' },
  { lat: 26.9318, lng: 75.7823, address: 'Sindhi Camp, Jaipur, Rajasthan (DEMO)' },
  { lat: 26.9157, lng: 75.8028, address: 'Tonk Road, Jaipur, Rajasthan (DEMO)' },
];

const CATEGORIES = ['plastic', 'paper', 'glass', 'metal', 'organic', 'ewaste', 'mixed', 'other'];
const SEVERITIES = ['low', 'medium', 'high'];
const STATUSES = ['pending_review', 'pending', 'assigned', 'in_progress', 'awaiting_verification', 'resolved'];

const ECO_TIPS = [
  {
    title: 'Start Composting at Home',
    content: 'Set up a small compost bin for vegetable peels, fruit waste, and tea bags. Compost enriches soil and reduces landfill waste.',
    category: 'composting',
    active: true,
  },
  {
    title: 'Carry Your Own Bag',
    content: 'Bring a reusable bag when shopping. Refusing single-use plastic bags is the simplest way to reduce plastic waste immediately.',
    category: 'reduce',
    active: true,
  },
  {
    title: 'Rinse Before Recycling',
    content: 'Rinse food containers before placing them in the recycling bin. Contaminated recyclables are often sent to landfill.',
    category: 'recycle',
    active: true,
  },
  {
    title: 'E-Waste Goes to Collection Centers',
    content: 'Old phones, chargers, and batteries contain toxic materials. Always take e-waste to an authorized collection point, never to the regular bin.',
    category: 'ewaste',
    active: true,
  },
  {
    title: 'Fix Before Replacing',
    content: 'Repair appliances, clothes, and furniture before replacing them. Extending product life is more effective than recycling.',
    category: 'reuse',
    active: true,
  },
  {
    title: 'Separate at Source',
    content: 'Use separate bins for wet organic waste and dry recyclables in your kitchen. Mixing makes both streams harder to process.',
    category: 'general',
    active: true,
  },
  {
    title: 'Avoid Microplastics',
    content: 'Choose natural fiber clothing and avoid products with plastic microbeads. Microplastics are found in water supplies globally.',
    category: 'reduce',
    active: true,
  },
];

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected.\n');

  // Clear previous demo data
  console.log('🗑️  Clearing existing demo data...');
  await User.deleteMany({ email: { $regex: '@cleancity-demo.com' } });
  await WasteReport.deleteMany({ isDemo: true });
  await EcoTip.deleteMany({});
  console.log('✅ Cleared.\n');

  // ─── Create Users ────────────────────────────────────────────────────────────
  console.log('👥 Creating demo users...');
  const salt = await bcrypt.genSalt(12);

  const adminUser = new User({
    name: 'Demo Admin',
    email: 'admin@cleancity-demo.com',
    passwordHash: 'Admin@123',
    role: 'admin',
    isActive: true,
    contributionPoints: 0,
  });
  await adminUser.save();

  const staffUser1 = new User({
    name: 'Rahul Verma (Staff)',
    email: 'staff1@cleancity-demo.com',
    passwordHash: 'Staff@123',
    role: 'staff',
    isActive: true,
    contributionPoints: 0,
  });
  await staffUser1.save();

  const staffUser2 = new User({
    name: 'Priya Sharma (Staff)',
    email: 'staff2@cleancity-demo.com',
    passwordHash: 'Staff@123',
    role: 'staff',
    isActive: true,
    contributionPoints: 0,
  });
  await staffUser2.save();

  const citizen1 = new User({
    name: 'Amit Kumar (Citizen)',
    email: 'citizen1@cleancity-demo.com',
    passwordHash: 'Citizen@123',
    role: 'citizen',
    isActive: true,
    contributionPoints: 150,
  });
  await citizen1.save();

  const citizen2 = new User({
    name: 'Sunita Devi (Citizen)',
    email: 'citizen2@cleancity-demo.com',
    passwordHash: 'Citizen@123',
    role: 'citizen',
    isActive: true,
    contributionPoints: 80,
  });
  await citizen2.save();

  console.log('✅ Users created.\n');

  // ─── Create Reports ──────────────────────────────────────────────────────────
  console.log('📋 Creating demo waste reports...');

  const reportData = [
    {
      reporter: citizen1._id,
      category: 'plastic',
      severity: 'high',
      status: 'resolved',
      location: DEMO_LOCATIONS[0],
      description: 'Large pile of plastic bottles and bags near the main road. [DEMO DATA]',
      assignedStaff: staffUser1._id,
      resolvedAt: new Date(Date.now() - 2 * 24 * 3600000),
      aiCategory: 'plastic',
      aiConfidence: 0.89,
    },
    {
      reporter: citizen1._id,
      category: 'organic',
      severity: 'medium',
      status: 'in_progress',
      location: DEMO_LOCATIONS[1],
      description: 'Food waste dumped near the park entrance. [DEMO DATA]',
      assignedStaff: staffUser2._id,
      aiCategory: 'organic',
      aiConfidence: 0.77,
    },
    {
      reporter: citizen2._id,
      category: 'ewaste',
      severity: 'high',
      status: 'assigned',
      location: DEMO_LOCATIONS[2],
      description: 'Discarded electronic equipment including old TV and circuit boards. [DEMO DATA]',
      assignedStaff: staffUser1._id,
      aiCategory: 'ewaste',
      aiConfidence: 0.84,
    },
    {
      reporter: citizen2._id,
      category: 'mixed',
      severity: 'low',
      status: 'pending',
      location: DEMO_LOCATIONS[3],
      description: 'Mixed garbage scattered near the colony gate. [DEMO DATA]',
      aiCategory: 'mixed',
      aiConfidence: 0.71,
    },
    {
      reporter: citizen1._id,
      category: 'glass',
      severity: 'medium',
      status: 'awaiting_verification',
      location: DEMO_LOCATIONS[4],
      description: 'Broken glass bottles on the footpath — safety hazard. [DEMO DATA]',
      assignedStaff: staffUser2._id,
      aiCategory: 'glass',
      aiConfidence: 0.93,
    },
    {
      reporter: citizen1._id,
      category: 'paper',
      severity: 'low',
      status: 'pending_review',
      location: DEMO_LOCATIONS[5],
      description: 'Old newspapers and packaging waste. [DEMO DATA]',
      aiCategory: 'paper',
      aiConfidence: 0.86,
    },
    {
      reporter: citizen2._id,
      category: 'metal',
      severity: 'medium',
      status: 'resolved',
      location: DEMO_LOCATIONS[6],
      description: 'Scrap metal and old cans near the market. [DEMO DATA]',
      assignedStaff: staffUser1._id,
      resolvedAt: new Date(Date.now() - 5 * 24 * 3600000),
      aiCategory: 'metal',
      aiConfidence: 0.81,
    },
    {
      reporter: citizen2._id,
      category: 'plastic',
      severity: 'high',
      status: 'pending',
      location: DEMO_LOCATIONS[7],
      description: 'Construction waste mixed with plastic debris. [DEMO DATA]',
      aiCategory: 'plastic',
      aiConfidence: 0.75,
    },
  ];

  for (const rd of reportData) {
    const report = await WasteReport.create({
      reporterId: rd.reporter,
      imageUrl: `https://placehold.co/800x600/16a34a/ffffff?text=${encodeURIComponent(rd.category.toUpperCase())}+DEMO`,
      description: rd.description,
      category: rd.category,
      aiPredictedCategory: rd.aiCategory,
      aiConfidence: rd.aiConfidence,
      aiProvider: 'Demo Mode',
      aiProcessingStatus: 'completed',
      latitude: rd.location.lat,
      longitude: rd.location.lng,
      address: rd.location.address,
      severity: rd.severity,
      status: rd.status,
      assignedStaffId: rd.assignedStaff || null,
      assignedAt: rd.assignedStaff ? new Date(Date.now() - 3 * 3600000) : null,
      resolvedAt: rd.resolvedAt || null,
      isDemo: true,
    });

    // Create initial history entry
    await ReportStatusHistory.create({
      reportId: report._id,
      changedBy: rd.reporter,
      newStatus: 'pending_review',
      note: 'Report submitted. [DEMO]',
    });

    if (rd.status !== 'pending_review') {
      await ReportStatusHistory.create({
        reportId: report._id,
        changedBy: adminUser._id,
        previousStatus: 'pending_review',
        newStatus: rd.assignedStaff ? 'assigned' : 'pending',
        note: rd.assignedStaff ? `Assigned to staff. [DEMO]` : 'Under review. [DEMO]',
      });
    }
  }

  console.log(`✅ ${reportData.length} demo reports created.\n`);

  // ─── Eco Tips ────────────────────────────────────────────────────────────────
  console.log('💡 Creating eco tips...');
  await EcoTip.insertMany(ECO_TIPS);
  console.log(`✅ ${ECO_TIPS.length} eco tips created.\n`);

  // ─── Notifications ───────────────────────────────────────────────────────────
  console.log('🔔 Creating demo notifications...');
  await Notification.insertMany([
    {
      userId: citizen1._id,
      title: 'Welcome to CleanCity AI! 🌿',
      message: 'Thank you for joining. Start by reporting garbage in your area.',
      type: 'system',
    },
    {
      userId: citizen1._id,
      title: 'Report Verified ✅',
      message: 'Your plastic waste report on M.I. Road has been verified and resolved!',
      type: 'resolved',
    },
  ]);
  console.log('✅ Notifications created.\n');

  // ─── Summary ─────────────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════');
  console.log('✅  SEED COMPLETE — CleanCity AI Demo Data');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('Demo Accounts:');
  console.log('  Admin:   admin@cleancity-demo.com   / Admin@123');
  console.log('  Staff 1: staff1@cleancity-demo.com  / Staff@123');
  console.log('  Staff 2: staff2@cleancity-demo.com  / Staff@123');
  console.log('  Citizen: citizen1@cleancity-demo.com / Citizen@123');
  console.log('  Citizen: citizen2@cleancity-demo.com / Citizen@123\n');
  console.log('⚠️  All demo reports are labeled [DEMO DATA] and isDemo: true');
  console.log('   Do not mix demo data with real production data.\n');

  await mongoose.connection.close();
  console.log('🔌 Database connection closed.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
