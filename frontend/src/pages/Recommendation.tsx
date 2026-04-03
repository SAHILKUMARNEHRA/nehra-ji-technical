import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, Cpu, Battery, Camera, Sparkles, Layers, Monitor, HardDrive, ShoppingCart, Trash2, Globe } from 'lucide-react';
import { fallbackPhoneImage, releasedCatalogPhones, type CatalogPhone } from '../data/phoneCatalog';
import { getProcessorByText } from '../data/processors';

type UsageType = 'performance' | 'gaming' | 'camera' | 'battery' | 'multitasking';

interface RankedRecommendation {
  phone: CatalogPhone;
  score: number;
  reason: string;
  confidence: number;
  budgetGap: number;
}

interface WebSmartphone {
  title: string;
  brand: string;
}

const parseFirstNumber = (value: string): number => {
  const match = value.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const parseCameraMP = (value: string): number => {
  const matches = value.match(/\d+/g);
  if (!matches) return 0;
  return Math.max(...matches.map(Number));
};

const parseStorageGB = (value: string): number => {
  const lower = value.toLowerCase();
  const number = parseFirstNumber(lower);
  if (lower.includes('tb')) return number * 1024;
  return number;
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const getSmartScore = (phone: CatalogPhone, usage: UsageType, budget: number, preferenceText: string): { score: number; reason: string } => {
  const battery = parseFirstNumber(phone.battery);
  const ram = parseFirstNumber(phone.ram);
  const storage = parseStorageGB(phone.storage);
  const display = parseFirstNumber(phone.display);
  const camera = parseCameraMP(phone.camera);
  const processor = getProcessorByText(phone.processor);

  const antutu = processor?.antutuScore || 1000000;
  const gaming = processor?.gamingScore || 74;
  const multitasking = processor?.multitaskingScore || 74;

  const budgetValueBonus = Math.max(0, budget - phone.price) / 2800;
  const overBudgetPenalty = phone.price > budget ? (phone.price - budget) / 1500 : 0;
  const targetPrice = budget * 0.88;
  const priceDistanceRatio = budget > 0 ? Math.abs(phone.price - targetPrice) / budget : 0;
  const priceFitBonus = Math.max(0, 7 - priceDistanceRatio * 10);

  const lowerPref = preferenceText.toLowerCase();
  let intentBoost = 0;
  if (lowerPref.includes('camera')) intentBoost += camera / 30;
  if (lowerPref.includes('battery')) intentBoost += battery / 900;
  if (lowerPref.includes('gaming') || lowerPref.includes('game')) intentBoost += gaming / 14;
  if (lowerPref.includes('storage')) intentBoost += storage / 180;
  if (lowerPref.includes('ram')) intentBoost += ram / 2;

  if (usage === 'gaming') {
    const score = gaming * 1.7 + antutu / 78000 + ram * 2.2 + display * 0.5 + storage / 100 + budgetValueBonus + priceFitBonus + intentBoost - overBudgetPenalty;
    return { score, reason: `Gaming profile is strong with ${processor?.name || phone.processor} and ${phone.ram} RAM.` };
  }
  if (usage === 'camera') {
    const score = camera * 2.2 + display * 1.2 + antutu / 120000 + ram * 1.3 + budgetValueBonus + priceFitBonus + intentBoost - overBudgetPenalty;
    return { score, reason: `Camera-focused pick with up to ${camera}MP class sensor and high-quality display.` };
  }
  if (usage === 'battery') {
    const score = battery / 65 + ram * 1.4 + storage / 140 + antutu / 140000 + budgetValueBonus + priceFitBonus + intentBoost - overBudgetPenalty;
    return { score, reason: `Battery-first option with ${phone.battery} and balanced day-long usage profile.` };
  }
  if (usage === 'multitasking') {
    const score = multitasking * 1.8 + ram * 2.8 + storage / 70 + antutu / 90000 + budgetValueBonus + priceFitBonus + intentBoost - overBudgetPenalty;
    return { score, reason: `Multitasking optimized with ${phone.ram} RAM, ${phone.storage}, and stable chipset performance.` };
  }
  const score = antutu / 82000 + ram * 2.2 + storage / 95 + display * 0.5 + budgetValueBonus + priceFitBonus + intentBoost - overBudgetPenalty;
  return { score, reason: `Balanced all-rounder performance across daily tasks, apps, and future-proofing.` };
};

const Recommendation: React.FC = () => {
  const [budget, setBudget] = useState<number>(50000);
  const [usage, setUsage] = useState<UsageType>('performance');
  const [preferenceText, setPreferenceText] = useState('');
  const [results, setResults] = useState<RankedRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [webSignals, setWebSignals] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>(() => {
    const raw = localStorage.getItem('savedPhones');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('savedPhones', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    const fetchWebSignals = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products/category/smartphones?limit=100');
        if (!response.ok) return;
        const data = await response.json();
        const products: WebSmartphone[] = Array.isArray(data?.products) ? data.products : [];
        const keys = products.map((item) => normalize(`${item.brand} ${item.title}`));
        setWebSignals(keys);
      } catch {
        setWebSignals([]);
      }
    };

    fetchWebSignals();
  }, []);

  const minBudget = useMemo(() => Math.min(...releasedCatalogPhones.map((p) => p.price)), []);

  const savedPhones = useMemo(
    () => savedIds
      .map((id) => releasedCatalogPhones.find((phone) => phone.id === id))
      .filter(Boolean) as CatalogPhone[],
    [savedIds]
  );

  const toggleSavePhone = (phoneId: number) => {
    setSavedIds((current) => (current.includes(phoneId) ? current.filter((id) => id !== phoneId) : [...current, phoneId]));
  };

  const handleRecommend = () => {
    setLoading(true);

    setTimeout(() => {
      const sourcePhones =
        releasedCatalogPhones;

      const withinBudget = sourcePhones.filter((phone) => phone.price <= budget);
      const nearBudget = withinBudget.filter((phone) => phone.price >= budget * 0.55);
      const pool =
        nearBudget.length >= 8
          ? nearBudget
          : withinBudget.length >= 8
            ? withinBudget
            : sourcePhones;

      const ranked = pool
        .map((phone) => {
          const { score, reason } = getSmartScore(phone, usage, budget, preferenceText);
          const webHit = webSignals.some((key) => {
            const name = normalize(phone.name);
            return name.includes(key) || key.includes(name);
          });
          const adjustedScore = score + (webHit ? 2.4 : 0);
          const budgetGap = Math.max(0, budget - phone.price);
          const confidence = Math.max(55, Math.min(98, Math.round((adjustedScore / 15) + (phone.price <= budget ? 18 : 6))));
          return {
            phone,
            score: adjustedScore,
            reason: webHit ? `${reason} This model also aligns with live web trend signals.` : reason,
            confidence,
            budgetGap,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      setResults(ranked);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight">AI Phone Finder</h1>
        <p className="text-gray-500 text-lg font-medium">AI ranking powered by live web trend signals + full local technical specs.</p>
      </div>

      <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 mb-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-2">Max Budget (INR)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-xl"><IndianRupee size={24} /></span>
              <input
                type="number"
                min={minBudget}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value || minBudget))}
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-black text-2xl text-gray-900 shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-2">Primary Usage</label>
            <select
              value={usage}
              onChange={(e) => setUsage(e.target.value as UsageType)}
              className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-xl text-gray-900 shadow-inner"
            >
              <option value="performance">Performance</option>
              <option value="gaming">Gaming</option>
              <option value="multitasking">Multitasking</option>
              <option value="camera">Photography & Video</option>
              <option value="battery">All-day Battery</option>
            </select>
          </div>
        </div>

        <div className="relative z-10 mb-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-2">Extra Preference (Optional)</label>
            <input
              type="text"
              value={preferenceText}
              onChange={(e) => setPreferenceText(e.target.value)}
              placeholder="Example: gaming + camera + 256GB"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Live web smartphone signals are automatically used to improve ranking relevance.</p>
        </div>

        <button
          onClick={handleRecommend}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-black text-2xl flex items-center justify-center gap-4 transition-all transform hover:scale-[1.02] shadow-2xl shadow-blue-200 disabled:opacity-50"
        >
          {loading ? 'Analyzing with AI engine...' : <><Sparkles size={28} /> Get Best Matches</>}
        </button>
      </div>

      {savedPhones.length > 0 && (
        <div className="mb-14 bg-white rounded-[32px] border border-gray-100 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-blue-700 p-2 rounded-xl"><ShoppingCart size={18} /></div>
            <h2 className="text-2xl font-black text-gray-900">Saved Phones Cart</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPhones.map((phone) => (
              <div key={`saved-${phone.id}`} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={phone.image}
                    alt={phone.name}
                    className="w-16 h-16 object-cover rounded-xl bg-white"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = fallbackPhoneImage;
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-blue-600 font-black">{phone.brand}</p>
                    <p className="font-bold text-gray-900 line-clamp-2">{phone.name}</p>
                    <p className="text-sm font-black text-gray-900">₹{phone.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {phone.status === 'Web Listing' ? (
                    <span className="flex-1 bg-gray-200 text-gray-500 text-center py-2 rounded-xl font-bold text-sm">Web Model</span>
                  ) : (
                    <Link to={`/phones/${phone.id}`} className="flex-1 bg-gray-900 text-white text-center py-2 rounded-xl font-bold text-sm hover:bg-black">View</Link>
                  )}
                  <button onClick={() => toggleSavePhone(phone.id)} className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-10 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-100"><Sparkles size={24} /></div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">AI Recommendations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {results.map((item, index) => (
              <div key={item.phone.id} className={`bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group relative ${index === 0 ? 'ring-4 ring-blue-500 ring-offset-4' : ''}`}>
                {index === 0 && <div className="absolute top-4 left-4 z-20 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Best Match</div>}
                <Link to={item.phone.status === 'Web Listing' ? '#' : `/phones/${item.phone.id}`}>
                  <div className="h-56 bg-gray-50 overflow-hidden">
                    <img
                      src={item.phone.image}
                      alt={item.phone.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackPhoneImage;
                      }}
                    />
                  </div>
                </Link>
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">{item.phone.brand}</p>
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">{item.phone.name}</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200">
                      <Globe size={11} />
                      AI + Web
                    </span>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      Confidence {item.confidence}%
                    </span>
                    {item.phone.price <= budget && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                        Best At ₹{budget.toLocaleString()} Budget
                      </span>
                    )}
                    {item.budgetGap > 0 && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Saves ₹{item.budgetGap.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl p-3 mb-4">{item.reason}</p>

                  <div className="mb-4 bg-blue-50/50 inline-flex items-center px-4 py-2 rounded-2xl text-blue-600 font-black border border-blue-50">
                    <IndianRupee size={16} />
                    <span className="text-lg">{item.phone.price.toLocaleString()}</span>
                  </div>

                  <div className="space-y-2 text-sm font-medium text-gray-500 mb-5">
                    <div className="flex items-center gap-3"><Cpu size={16} className="text-blue-400" /> <span className="line-clamp-1">{item.phone.processor}</span></div>
                    <div className="flex items-center gap-3"><Layers size={16} className="text-purple-400" /> {item.phone.ram} RAM</div>
                    <div className="flex items-center gap-3"><HardDrive size={16} className="text-orange-400" /> {item.phone.storage} Storage</div>
                    <div className="flex items-center gap-3"><Battery size={16} className="text-green-400" /> {item.phone.battery}</div>
                    <div className="flex items-center gap-3"><Monitor size={16} className="text-cyan-400" /> <span className="line-clamp-1">{item.phone.display}</span></div>
                    <div className="flex items-center gap-3"><Camera size={16} className="text-red-400" /> <span className="line-clamp-1">{item.phone.camera}</span></div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/phones/${item.phone.id}`} className="flex-1 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold text-center">Full Specs</Link>
                    <button
                      onClick={() => toggleSavePhone(item.phone.id)}
                      className={`px-4 py-3 rounded-xl font-bold ${savedIds.includes(item.phone.id) ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-blue-50 border border-blue-100 text-blue-700'}`}
                    >
                      {savedIds.includes(item.phone.id) ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendation;
