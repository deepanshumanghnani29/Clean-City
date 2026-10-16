const express = require('express');
const router = express.Router();
const EcoTip = require('../models/EcoTip');

// GET /api/eco-tips
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;

    const tips = await EcoTip.find(filter).sort({ createdAt: -1 });
    const daily = tips[new Date().getDate() % tips.length] || tips[0];

    res.json({ success: true, data: tips, daily });
  } catch (err) {
    next(err);
  }
});

// GET /api/waste-guide — Static educational content
router.get('/waste-guide', (req, res) => {
  const guide = [
    {
      id: 'organic',
      title: 'Wet & Organic Waste',
      icon: '🌱',
      color: '#16a34a',
      examples: ['Fruit & vegetable peels', 'Leftover cooked food', 'Tea bags & coffee grounds', 'Garden trimmings'],
      whereToBin: 'Green bin / compost bin',
      storeTips: 'Use a covered container. Collect daily to avoid odor and pests.',
      commonMistakes: ['Mixing with dry recyclables', 'Including non-compostable packaging', 'Leaving uncovered'],
      disposal: 'Home compost pile, municipal organic waste bin, or community composting program.',
      environmentalTip: 'Composting reduces methane emissions from landfills significantly.',
    },
    {
      id: 'plastic',
      title: 'Plastic Waste',
      icon: '♻️',
      color: '#0d9488',
      examples: ['Water bottles (PET)', 'Plastic bags', 'Containers & packaging', 'Straws & cutlery'],
      whereToBin: 'Blue / dry recyclables bin',
      storeTips: 'Rinse and crush bottles. Remove caps. Keep dry.',
      commonMistakes: ['Throwing greasy plastic in recycling', 'Mixing multi-layer packaging', 'Not rinsing'],
      disposal: 'Clean plastics in recycling bin. Film plastics at designated drop-off points.',
      environmentalTip: 'Refuse single-use plastics wherever possible.',
    },
    {
      id: 'paper',
      title: 'Paper & Cardboard',
      icon: '📄',
      color: '#ca8a04',
      examples: ['Newspapers & magazines', 'Cardboard boxes', 'Office paper', 'Paper bags'],
      whereToBin: 'Blue / dry recyclables bin',
      storeTips: 'Keep dry and flat. Flatten boxes. Remove tape where possible.',
      commonMistakes: ['Recycling food-soiled pizza boxes', 'Including thermal receipt paper', 'Wet paper'],
      disposal: 'Dry paper and cardboard in recycling. Soiled paper in organic waste.',
      environmentalTip: 'Recycling one tonne of paper saves approximately 17 trees.',
    },
    {
      id: 'glass',
      title: 'Glass Waste',
      icon: '🍶',
      color: '#7c3aed',
      examples: ['Glass bottles (food & beverage)', 'Glass jars', 'Broken glass (handle with care)'],
      whereToBin: 'Glass recycling bin or designated drop-off',
      storeTips: 'Rinse glass containers. Wrap broken glass safely in newspaper before disposal.',
      commonMistakes: ['Including window glass or mirrors (different composition)', 'Mixing with ceramics', 'Not rinsing'],
      disposal: 'Glass recycling bin. Handle broken glass with extreme care to avoid injury.',
      environmentalTip: 'Glass is 100% recyclable and can be recycled endlessly without quality loss.',
    },
    {
      id: 'metal',
      title: 'Metal Waste',
      icon: '🥫',
      color: '#9f1239',
      examples: ['Aluminum cans', 'Steel food tins', 'Foil trays', 'Metal lids'],
      whereToBin: 'Blue / dry recyclables bin',
      storeTips: 'Rinse cans. Crush to save space. Keep dry.',
      commonMistakes: ['Leaving food residue', 'Including mixed-material packaging', 'Not separating from other waste'],
      disposal: 'Clean metal cans and tins in recycling. Scrap metal at authorized dealers.',
      environmentalTip: 'Recycling aluminum uses 95% less energy than producing it from raw materials.',
    },
    {
      id: 'ewaste',
      title: 'Electronic Waste (E-Waste)',
      icon: '💻',
      color: '#1d4ed8',
      examples: ['Mobile phones', 'Chargers & cables', 'Laptops & tablets', 'Batteries', 'LED bulbs'],
      whereToBin: 'Authorized e-waste collection center ONLY',
      storeTips: 'Store in a dry place. Do not mix with regular bins. Delete personal data before disposal.',
      commonMistakes: ['Throwing in regular bins', 'Burning electronics (toxic fumes)', 'Discarding batteries with mixed waste'],
      disposal: 'Take to authorized e-waste collection centers or manufacturer take-back programs.',
      environmentalTip: 'E-waste contains valuable recoverable materials and toxic substances requiring controlled handling.',
    },
    {
      id: 'hazardous',
      title: 'Hazardous Waste',
      icon: '⚠️',
      color: '#b45309',
      examples: ['Paint & solvents', 'Pesticides & chemicals', 'Certain batteries (lithium, lead-acid)', 'Medical/sanitary waste'],
      whereToBin: 'Authorized hazardous waste facility ONLY',
      storeTips: 'Keep in original labeled containers. Store away from children and heat sources.',
      commonMistakes: ['Pouring chemicals down drains', 'Burning hazardous waste', 'Mixing unknown chemicals'],
      disposal: 'Contact your local municipal authority for safe collection and disposal programs. Never improvise.',
      environmentalTip: 'Improper hazardous waste disposal contaminates soil and groundwater for years.',
    },
  ];

  res.json({ success: true, data: guide });
});

module.exports = router;
