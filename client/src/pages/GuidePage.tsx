import { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  Recycle,
  AlertTriangle,
  Leaf,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    id: 'organic',
    title: 'Wet / Organic Waste (Green Bin)',
    color: 'emerald',
    icon: Leaf,
    badge: 'Green Bin · Biodegradable',
    summary: 'Waste that comes from plants or food. It rots and turns into natural soil fertilizer.',
    howItWorks: 'Bacteria and small microbes naturally break this waste down in 2 to 6 weeks. When kept separate from plastic, it makes clean compost for farms and gardens.',
    examples: [
      'Fruit peels and vegetable scraps',
      'Leftover food, rice, and cooked meals',
      'Tea leaves, coffee grounds, and eggshells',
      'Dry leaves, cut grass, and small garden twigs',
      'Used paper napkins with food stains'
    ],
    dos: [
      'Put this waste in the green dustbin.',
      'Keep it free from plastic bags or wrappers.',
      'Use it at home for making flower pot compost if you can.'
    ],
    donts: [
      'Never mix polythene bags or plastics into wet waste.',
      'Do not throw plastic spoons or milk pouches in this bin.'
    ]
  },
  {
    id: 'plastic',
    title: 'Dry Plastic Waste (Blue Bin)',
    color: 'blue',
    icon: Recycle,
    badge: 'Blue Bin · Recyclable',
    summary: 'Bottles, containers, and packaging made from plastic that can be remelted and recycled.',
    howItWorks: 'Clean plastics are collected, shredded into small flakes, washed, and melted into fresh plastic items. Burning plastic is dangerous because it releases harmful smoke.',
    examples: [
      'Drinking water and soft drink bottles',
      'Shampoo, soap, and detergent bottles',
      'Clean takeaway food containers',
      'Clean plastic bags and bubble wrap',
      'Plastic bottle caps and buckets'
    ],
    dos: [
      'Rinse out leftover liquid before throwing.',
      'Crush bottles flat so they take up less space in the bin.',
      'Deposit in the blue recycling dustbin.'
    ],
    donts: [
      'Do not throw dirty plastic covered in oily gravy without a quick rinse.',
      'Never burn plastic outdoors—it harms lungs and air quality.'
    ]
  },
  {
    id: 'paper',
    title: 'Paper & Cardboard (Blue Bin)',
    color: 'amber',
    icon: Layers,
    badge: 'Blue Bin · Recyclable',
    summary: 'Dry cardboard and paper products. Each piece of paper can be recycled 5 to 7 times.',
    howItWorks: 'Recycling plants mix old paper with water to make fresh paper pulp. New boxes, books, and cartons are made from it, saving trees from being cut down.',
    examples: [
      'Cardboard delivery boxes from online shopping',
      'Newspapers, magazines, and old school notebooks',
      'Office printouts and drawing sheets',
      'Brown paper shopping bags',
      'Egg cardboard trays'
    ],
    dos: [
      'Flatten all cardboard boxes before placing them in the bin.',
      'Keep paper dry and away from leaking drinks.',
      'Tear off plastic tape if easy to remove.'
    ],
    donts: [
      'Do not recycle greasy pizza boxes soaked in oil or cheese.',
      'Do not recycle dirty tissues or used toilet paper.'
    ]
  },
  {
    id: 'e_waste',
    title: 'Electronic Waste / E-Waste',
    color: 'purple',
    icon: Sparkles,
    badge: 'Special E-Waste Collection',
    summary: 'Broken or old electrical gadgets, wires, and batteries that should never go into normal garbage.',
    howItWorks: 'Electronics have valuable metals like copper and gold, but also dangerous materials like lead. Certified recyclers extract these metals safely in special labs.',
    examples: [
      'Old smartphones, keypads, and chargers',
      'Laptop cords, earphones, and power banks',
      'Remote control batteries and button cells',
      'Old computer parts and circuit boards',
      'Broken electric toys and clocks'
    ],
    dos: [
      'Keep e-waste stored safely in a small cardboard box at home.',
      'Drop them off at authorized e-waste collection drives or bins.',
      'Put small tape over battery ends to prevent accidental sparks.'
    ],
    donts: [
      'Never toss batteries or phones into the daily municipal trash.',
      'Never break open batteries or burn electrical wires.'
    ]
  },
  {
    id: 'hazardous',
    title: 'Hazardous & Medical Waste',
    color: 'red',
    icon: AlertTriangle,
    badge: 'Yellow/Red Bin · Special Handling',
    summary: 'Waste that can spread germs, cause infections, or harm sanitation workers.',
    howItWorks: 'Because of dangerous chemicals or germs, this waste cannot be recycled. It is taken by specialized medical waste trucks and sterilized or incinerated at high heat.',
    examples: [
      'Expired cough syrups, tablets, and medicines',
      'Used bandages, cotton swabs, and syringes',
      'Sanitary pads and baby diapers (wrap in paper)',
      'Insect spray cans, paint boxes, and cleaning acids',
      'Broken glass thermometers and tube lights'
    ],
    dos: [
      'Wrap sanitary waste neatly in old newspaper and mark with a red dot.',
      'Keep expired medicines separate from normal household waste.',
      'Hand over to designated biomedical waste collectors.'
    ],
    donts: [
      'Never flush medicines or chemicals down the sink or toilet.',
      'Never throw bare needles or broken glass loose into a garbage bag.'
    ]
  }
];

export default function GuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('organic');
  const [searchQuery, setSearchQuery] = useState('');

  const currentCat = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

  const filteredCategories = CATEGORIES.filter(cat => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = cat.title.toLowerCase().includes(q);
    const matchSummary = cat.summary.toLowerCase().includes(q);
    const matchExamples = cat.examples.some(e => e.toLowerCase().includes(q));
    return matchTitle || matchSummary || matchExamples;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="badge badge-primary inline-flex items-center gap-1.5 mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          Easy Student Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">
          Waste Segregation Made Simple
        </h1>
        <p className="text-gray-600 mt-2 text-base">
          Quick and easy rules on what to throw in which bin, how it helps our environment, and simple habits for a cleaner neighborhood.
        </p>

        {/* Quick Search */}
        <div className="relative mt-6 max-w-md mx-auto">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type any item (e.g. apple peel, shampoo bottle, battery)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input pl-9 text-sm w-full shadow-sm"
          />
        </div>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {filteredCategories.map(cat => {
          const Icon = cat.icon;
          const active = cat.id === selectedCategory;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                active
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.title.split('(')[0]}
            </button>
          );
        })}
      </div>

      {/* Selected Category Details */}
      <div className="card p-6 sm:p-8 mb-10 border border-gray-100 shadow-elevated">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <currentCat.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-display">
                {currentCat.title}
              </h2>
              <span className="badge badge-primary text-xs font-semibold mt-1">
                {currentCat.badge}
              </span>
            </div>
          </div>
          <Link
            to="/report"
            className="btn-primary btn-sm flex items-center gap-1.5 self-start md:self-auto"
          >
            Report Trash Near You <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Short & Clear Explanation */}
        <div className="my-6 p-4 rounded-xl bg-primary-50/70 border border-primary-100 flex items-start gap-3">
          <div className="p-2 bg-primary-600 text-white rounded-lg shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary-900 uppercase tracking-wider">
              What Happens To This Waste?
            </h4>
            <p className="text-xs text-primary-800 mt-1 leading-relaxed">
              {currentCat.howItWorks}
            </p>
          </div>
        </div>

        {/* 3 Columns: Examples, Dos, Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Everyday items */}
          <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-600" />
              Common Items At Home
            </h4>
            <ul className="space-y-2 text-xs text-gray-700">
              {currentCat.examples.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dos */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <h4 className="text-sm font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Good Habits (DOs)
            </h4>
            <ul className="space-y-2 text-xs text-emerald-800">
              {currentCat.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
            <h4 className="text-sm font-semibold text-rose-900 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600" />
              Things to Avoid (DON'Ts)
            </h4>
            <ul className="space-y-2 text-xs text-rose-800">
              {currentCat.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
